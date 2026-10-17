#!/usr/bin/env node
/**
 * Build MiniSearch JSON index from Markdown collections.
 * Output: public/search/de.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "src/content");
const OUT_DIR = path.join(ROOT, "public/search");

const TYPE_LABELS = {
	article: "Artikel",
	glossar: "Glossar",
	page: "Seite",
	tag: "Tag",
	category: "Kategorie",
};

/** Paths that must never appear in site search. */
function isExcludedUrl(url) {
	const path = url.replace(/\/+$/, "") || "/";
	return path === "/impressum" || path === "/datenschutz";
}

function stripMarkdown(text) {
	return String(text ?? "")
		.replace(/\{\{[^}]+\}\}/g, " ")
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`[^`]+`/g, " ")
		.replace(/!\[[^\]]*]\([^)]*\)/g, " ")
		.replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/[#>*_\-~|]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function isPublic(status, scheduleDate) {
	const s = status || "published";
	if (s === "published") return true;
	if (s === "future" && scheduleDate instanceof Date && !Number.isNaN(scheduleDate.valueOf())) {
		return scheduleDate.valueOf() <= Date.now();
	}
	return false;
}

function isNoindex(seo) {
	return seo && typeof seo === "object" && seo.index_visibility === "noindex";
}

function listIndexMarkdown(dir) {
	if (!fs.existsSync(dir)) return [];
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			const indexMd = path.join(full, "index.md");
			if (fs.existsSync(indexMd)) out.push(indexMd);
			out.push(...listIndexMarkdown(full));
		}
	}
	return out;
}

function listFlatMarkdown(dir) {
	if (!fs.existsSync(dir)) return [];
	return fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((e) => e.isFile() && e.name.endsWith(".md"))
		.map((e) => path.join(dir, e.name));
}

function pageIdFromFile(filePath) {
	const rel = path.relative(path.join(CONTENT, "pages"), filePath);
	return rel.replace(/\\/g, "/").replace(/\/index\.md$/, "");
}

function pageHref(id, parents) {
	const segments = [];
	const seen = new Set();
	let current = id;
	while (current) {
		if (seen.has(current)) break;
		seen.add(current);
		const segment = current.replace(/\/index$/, "");
		if (segment === "index" || segment === "") break;
		segments.unshift(segment);
		current = parents.get(current);
	}
	if (segments.length === 0) return "/";
	return `/${segments.join("/")}/`;
}

function collectPages() {
	const files = listIndexMarkdown(path.join(CONTENT, "pages"));
	const parents = new Map();
	const metas = [];

	for (const file of files) {
		const id = pageIdFromFile(file);
		const { data, content } = matter(fs.readFileSync(file, "utf8"));
		parents.set(id, typeof data.parent === "string" ? data.parent : undefined);
		metas.push({ id, data, content });
	}

	const documents = [];
	for (const { id, data, content } of metas) {
		if (!isPublic(data.status, data.publishDate ? new Date(data.publishDate) : undefined)) {
			continue;
		}
		if (isNoindex(data.seo)) continue;
		const url = pageHref(id, parents);
		if (isExcludedUrl(url)) continue;
		const title = typeof data.title === "string" ? data.title : id;
		const description =
			typeof data.description === "string"
				? data.description
				: typeof data.seo?.seo_description === "string"
					? data.seo.seo_description
					: "";
		documents.push({
			id: `page/${id || "index"}`,
			type: "page",
			typeLabel: TYPE_LABELS.page,
			title,
			description: stripMarkdown(description),
			body: stripMarkdown(content),
			extra: "",
			url,
		});
	}
	return documents;
}

function collectArticles(tagTitles, categoryTitles) {
	const documents = [];
	for (const file of listIndexMarkdown(path.join(CONTENT, "articles"))) {
		const { data, content } = matter(fs.readFileSync(file, "utf8"));
		if (!isPublic(data.status, data.pubDate ? new Date(data.pubDate) : undefined)) {
			continue;
		}
		if (isNoindex(data.seo)) continue;
		const rel = path.relative(path.join(CONTENT, "articles"), file);
		const slug = rel.replace(/\\/g, "/").replace(/\/index\.md$/, "");
		const tags = Array.isArray(data.tags) ? data.tags : [];
		const tagLabels = tags.map((id) => tagTitles.get(id) ?? id);
		const categories = Array.isArray(data.categories) ? data.categories : [];
		const categoryLabels = categories.map(
			(id) => categoryTitles.get(id) ?? id,
		);
		documents.push({
			id: `article/${slug}`,
			type: "article",
			typeLabel: TYPE_LABELS.article,
			title: typeof data.title === "string" ? data.title : slug,
			description: stripMarkdown(data.summary ?? data.seo?.seo_description ?? ""),
			body: stripMarkdown(content),
			extra: [...categoryLabels, ...tagLabels].join(" "),
			url: `/artikel/${slug}/`,
		});
	}
	return documents;
}

function collectGlossar() {
	const documents = [];
	for (const file of listFlatMarkdown(path.join(CONTENT, "glossar"))) {
		const { data, content } = matter(fs.readFileSync(file, "utf8"));
		if (!isPublic(data.status, data.publishDate ? new Date(data.publishDate) : undefined)) {
			continue;
		}
		if (isNoindex(data.seo)) continue;
		const slug = path.basename(file, ".md");
		documents.push({
			id: `glossar/${slug}`,
			type: "glossar",
			typeLabel: TYPE_LABELS.glossar,
			title: typeof data.title === "string" ? data.title : slug,
			description: stripMarkdown(data.definition ?? ""),
			body: stripMarkdown(content),
			extra: "",
			url: `/glossar/${slug}/`,
		});
	}
	return documents;
}

function collectTags() {
	const documents = [];
	const tagTitles = new Map();
	for (const file of listFlatMarkdown(path.join(CONTENT, "tags"))) {
		const { data, content } = matter(fs.readFileSync(file, "utf8"));
		const slug = path.basename(file, ".md");
		const title = typeof data.title === "string" ? data.title : slug;
		tagTitles.set(slug, title);
		documents.push({
			id: `tag/${slug}`,
			type: "tag",
			typeLabel: TYPE_LABELS.tag,
			title: `#${title}`,
			description: stripMarkdown(data.description ?? ""),
			body: stripMarkdown(content),
			extra: title,
			url: `/tags/${slug}/`,
		});
	}
	return { documents, tagTitles };
}

function collectCategories() {
	const documents = [];
	const categoryTitles = new Map();
	for (const file of listFlatMarkdown(path.join(CONTENT, "categories"))) {
		const { data, content } = matter(fs.readFileSync(file, "utf8"));
		const slug = path.basename(file, ".md");
		const title = typeof data.title === "string" ? data.title : slug;
		categoryTitles.set(slug, title);
		documents.push({
			id: `category/${slug}`,
			type: "category",
			typeLabel: TYPE_LABELS.category,
			title,
			description: stripMarkdown(data.description ?? ""),
			body: stripMarkdown(content),
			extra: title,
			url: `/kategorien/${slug}/`,
		});
	}
	return { documents, categoryTitles };
}

function isMaintenanceEnabled() {
	try {
		const raw = JSON.parse(
			fs.readFileSync(path.join(CONTENT, "settings", "maintenance.json"), "utf8"),
		);
		return raw.enabled === true;
	} catch {
		return false;
	}
}

function main() {
	fs.mkdirSync(OUT_DIR, { recursive: true });
	const outPath = path.join(OUT_DIR, "de.json");

	// Wartungsmodus: leerer Index, damit Inhalte nicht über /search/de.json leaken.
	if (isMaintenanceEnabled()) {
		fs.writeFileSync(
			outPath,
			JSON.stringify({
				locale: "de",
				generatedAt: new Date().toISOString(),
				maintenance: true,
				documents: [],
			}),
		);
		console.log(
			"[build-search-index] maintenance on → empty public/search/de.json",
		);
		return;
	}

	const { documents: tagDocs, tagTitles } = collectTags();
	const { documents: categoryDocs, categoryTitles } = collectCategories();
	const documents = [
		...collectArticles(tagTitles, categoryTitles),
		...collectGlossar(),
		...collectPages(),
		...categoryDocs,
		...tagDocs,
	].filter((doc) => !isExcludedUrl(doc.url));

	fs.writeFileSync(
		outPath,
		JSON.stringify({
			locale: "de",
			generatedAt: new Date().toISOString(),
			documents,
		}),
	);
	console.log(`[build-search-index] de: ${documents.length} document(s) → public/search/de.json`);
}

main();
