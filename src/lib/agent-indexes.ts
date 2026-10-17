/**
 * Build-time inventories for `/llms.txt` (llmstxt.org) and `/agents.txt`.
 * Only published, indexable collection URLs; order is deterministic.
 */
import { getCollection } from "astro:content";
import { resolveSeo } from "../cms/fields/seo";
import {
	getArticleHref,
	getPublishedArticles,
	type ArticleEntry,
} from "./articles";
import { getAuthorHref, type AuthorEntry } from "./authors";
import { getCategoryHref, type CategoryEntry } from "./categories";
import {
	getGlossarEntries,
	getGlossarHref,
	type GlossarEntry,
} from "./glossar";
import {
	getPageHref,
	getPublicPages,
	indexPagesById,
	type PageEntry,
} from "./pages";
import { isMaintenanceEnabled } from "./maintenance";
import {
	getSiteWebsiteDescription,
	getSiteWebsiteTitle,
} from "./site-config";
import { formatTagHashtag, getTagHref, type TagEntry } from "./tags";

export type AgentIndexSection =
	| "Seiten"
	| "Artikel"
	| "Glossar"
	| "Kategorien"
	| "Tags"
	| "Autoren";

export type AgentIndexLink = {
	section: AgentIndexSection;
	title: string;
	/** Site-absolute path with trailing slash (except never empty: `/`). */
	path: string;
	/** Optional one-line note (description / summary). */
	note?: string;
};

const SECTION_ORDER: AgentIndexSection[] = [
	"Seiten",
	"Artikel",
	"Glossar",
	"Kategorien",
	"Tags",
	"Autoren",
];

/** True when SEO allows indexing (default index). */
export function isSeoIndexable(seo: unknown): boolean {
	return resolveSeo(seo).index_visibility === "index";
}

/** Strip simple HTML tags and collapse whitespace for plain-text notes. */
export function plainTextFromCms(raw: string | undefined): string {
	if (!raw?.trim()) return "";
	return raw
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&lt;/gi, "<")
		.replace(/&gt;/gi, ">")
		.replace(/&quot;/gi, '"')
		.replace(/\s+/g, " ")
		.trim();
}

function truncateNote(text: string, max = 160): string {
	if (text.length <= max) return text;
	const cut = text.slice(0, max - 1);
	const at = cut.lastIndexOf(" ");
	return `${(at > 40 ? cut.slice(0, at) : cut).trimEnd()}…`;
}

function escapeMdLinkText(text: string): string {
	return text.replace(/([\\[\]()])/g, "\\$1");
}

function comparePath(a: AgentIndexLink, b: AgentIndexLink): number {
	return a.path.localeCompare(b.path, "en");
}

function pageNote(page: PageEntry): string | undefined {
	const note =
		plainTextFromCms(page.data.seo?.seo_description) ||
		plainTextFromCms(page.data.description);
	return note ? truncateNote(note) : undefined;
}

function articleNote(article: ArticleEntry): string | undefined {
	const note =
		plainTextFromCms(article.data.seo?.seo_description) ||
		plainTextFromCms(article.data.summary);
	return note ? truncateNote(note) : undefined;
}

function glossarNote(entry: GlossarEntry): string | undefined {
	const note =
		plainTextFromCms(entry.data.seo?.seo_description) ||
		plainTextFromCms(entry.data.definition);
	return note ? truncateNote(note) : undefined;
}

/** Collect public + indexable URLs from content collections (deterministic). */
export async function collectAgentIndexLinks(): Promise<AgentIndexLink[]> {
	const links: AgentIndexLink[] = [];

	const pages = await getPublicPages();
	const pagesById = indexPagesById(pages);
	for (const page of pages) {
		if (!isSeoIndexable(page.data.seo)) continue;
		links.push({
			section: "Seiten",
			title: page.data.title,
			path: getPageHref(page, pagesById),
			note: pageNote(page),
		});
	}

	const articles = await getPublishedArticles({ sort: "oldest" });
	for (const article of articles) {
		if (!isSeoIndexable(article.data.seo)) continue;
		links.push({
			section: "Artikel",
			title: article.data.title,
			path: getArticleHref(article),
			note: articleNote(article),
		});
	}

	const glossar = await getGlossarEntries({ sort: "title-asc" });
	for (const entry of glossar) {
		if (!isSeoIndexable(entry.data.seo)) continue;
		links.push({
			section: "Glossar",
			title: entry.data.title,
			path: getGlossarHref(entry),
			note: glossarNote(entry),
		});
	}

	const categories = await getCollection("categories");
	for (const category of categories as CategoryEntry[]) {
		const note = plainTextFromCms(category.data.description);
		links.push({
			section: "Kategorien",
			title: category.data.title,
			path: getCategoryHref(category),
			note: note ? truncateNote(note) : undefined,
		});
	}

	const tags = await getCollection("tags");
	for (const tag of tags as TagEntry[]) {
		const note = plainTextFromCms(tag.data.description);
		links.push({
			section: "Tags",
			title: formatTagHashtag(tag),
			path: getTagHref(tag),
			note: note ? truncateNote(note) : undefined,
		});
	}

	const authors = await getCollection("authors");
	for (const author of authors as AuthorEntry[]) {
		if (!isSeoIndexable(author.data.seo)) continue;
		const note =
			plainTextFromCms(author.data.seo?.seo_description) ||
			plainTextFromCms(author.data.description) ||
			plainTextFromCms(author.data.bio);
		links.push({
			section: "Autoren",
			title: author.data.title,
			path: getAuthorHref(author),
			note: note ? truncateNote(note) : undefined,
		});
	}

	return links.sort((a, b) => {
		const bySection =
			SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section);
		if (bySection !== 0) return bySection;
		return comparePath(a, b);
	});
}

function absoluteUrl(origin: string, path: string): string {
	const base = origin.replace(/\/+$/, "");
	if (!base) return path;
	return `${base}${path}`;
}

export type AgentIndexBuildOptions = {
	/** Origin without trailing slash, e.g. `https://hautoo.storyofai.net`. */
	origin: string;
	siteName?: string;
	siteDescription?: string;
	links: AgentIndexLink[];
};

/** Markdown `/llms.txt` per https://llmstxt.org/ */
export function buildLlmsTxt(options: AgentIndexBuildOptions): string {
	const siteName = options.siteName?.trim() || getSiteWebsiteTitle();
	const summary =
		options.siteDescription?.trim() ||
		plainTextFromCms(getSiteWebsiteDescription()) ||
		`${siteName}: thematische Website.`;
	const origin = options.origin.replace(/\/+$/, "");
	const lines: string[] = [
		`# ${siteName}`,
		"",
		`> ${summary}`,
		"",
		"Übersicht der Seiten, Artikel, Glossar-Einträge, Kategorien, Tags und Autoren dieser Website.",
	];

	if (origin) {
		lines.push(
			"",
			`- Sitemap: ${origin}/sitemap-index.xml`,
			`- agents.txt: ${origin}/agents.txt`,
			`- robots.txt: ${origin}/robots.txt`,
		);
	}

	for (const section of SECTION_ORDER) {
		const items = options.links.filter((link) => link.section === section);
		if (items.length === 0) continue;
		lines.push("", `## ${section}`, "");
		for (const item of items) {
			const url = absoluteUrl(origin, item.path);
			const note = item.note ? `: ${item.note}` : "";
			lines.push(`- [${escapeMdLinkText(item.title)}](${url})${note}`);
		}
	}

	return `${lines.join("\n")}\n`;
}

/**
 * Plain-text `/agents.txt`: deterministic URL inventory for agents
 * (companion to curated `/llms.txt`; not a payment/capability catalog).
 */
export function buildAgentsTxt(options: AgentIndexBuildOptions): string {
	const siteName = options.siteName?.trim() || getSiteWebsiteTitle();
	const origin = options.origin.replace(/\/+$/, "");
	const lines: string[] = [
		"# agents.txt",
		`# Site: ${siteName}`,
		"# URL inventory: pages, articles, glossary, categories, tags, authors.",
		"# Curated markdown overview: /llms.txt",
	];
	if (origin) {
		lines.push(
			`# llms.txt: ${origin}/llms.txt`,
			`# Sitemap: ${origin}/sitemap-index.xml`,
		);
	}
	lines.push("#");

	for (const section of SECTION_ORDER) {
		const items = options.links.filter((link) => link.section === section);
		if (items.length === 0) continue;
		lines.push(`# ${section}`);
		for (const item of items) {
			lines.push(absoluteUrl(origin, item.path));
		}
		lines.push("#");
	}

	return `${lines.join("\n")}\n`;
}

/** Origin string from Astro `site` URL (empty if unset). */
export function originFromSite(site: URL | undefined): string {
	if (!site) return "";
	return site.origin;
}

/** Stub when Wartungsmodus is on (no public URL inventory). */
export function buildMaintenanceAgentIndexStubs(siteName?: string): {
	llmsTxt: string;
	agentsTxt: string;
} {
	const name = siteName?.trim() || "Website";
	return {
		llmsTxt: `# ${name}\n\n> Wartungsmodus: Inhalte sind vorübergehend nicht öffentlich.\n`,
		agentsTxt: `# agents.txt\n# Site: ${name}\n# Wartungsmodus: keine URL-Liste.\n`,
	};
}

/** Shared payload for both endpoints. */
export async function buildAgentIndexFiles(site: URL | undefined): Promise<{
	llmsTxt: string;
	agentsTxt: string;
}> {
	const siteName = getSiteWebsiteTitle();
	if (isMaintenanceEnabled()) {
		return buildMaintenanceAgentIndexStubs(siteName);
	}
	const origin = originFromSite(site);
	const links = await collectAgentIndexLinks();
	const siteDescription = plainTextFromCms(getSiteWebsiteDescription());
	const opts = { origin, siteName, siteDescription, links };
	return {
		llmsTxt: buildLlmsTxt(opts),
		agentsTxt: buildAgentsTxt(opts),
	};
}
