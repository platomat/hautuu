/**
 * Build-time helpers for `@astrojs/sitemap`.
 * Scans content frontmatter (Astro collections are not available in astro.config).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const contentRoot = fileURLToPath(new URL("../content", import.meta.url));
const settingsRoot = path.join(contentRoot, "settings");

let excludedCache: Set<string> | undefined;
let maintenanceEnabledCache: boolean | undefined;

/** Read `maintenance.enabled` without Astro collections (astro.config context). */
function isMaintenanceEnabledFromFs(): boolean {
	if (maintenanceEnabledCache !== undefined) return maintenanceEnabledCache;
	const filePath = path.join(settingsRoot, "maintenance.json");
	try {
		const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as {
			enabled?: unknown;
		};
		maintenanceEnabledCache = raw.enabled === true;
	} catch {
		maintenanceEnabledCache = false;
	}
	return maintenanceEnabledCache;
}

function readFrontmatter(filePath: string): string {
	const raw = fs.readFileSync(filePath, "utf8");
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	return match?.[1] ?? "";
}

function yamlField(fm: string, key: string): string | undefined {
	const re = new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, "m");
	const match = fm.match(re);
	if (!match) return undefined;
	return match[1].replace(/^["']|["']$/g, "").trim();
}

function isNoindexFrontmatter(fm: string): boolean {
	return yamlField(fm, "index_visibility") === "noindex";
}

/** Collect nested index.md files under dir (recursive). */
function listIndexMarkdownFiles(dir: string): string[] {
	if (!fs.existsSync(dir)) return [];
	const out: string[] = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			const indexMd = path.join(full, "index.md");
			if (fs.existsSync(indexMd)) out.push(indexMd);
			out.push(...listIndexMarkdownFiles(full));
		}
	}
	return out;
}

function listFlatMarkdownFiles(dir: string): string[] {
	if (!fs.existsSync(dir)) return [];
	return fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
		.map((entry) => path.join(dir, entry.name));
}

function pageIdFromFile(filePath: string): string {
	const rel = path.relative(path.join(contentRoot, "pages"), filePath);
	return rel.replace(/\\/g, "/").replace(/\/index\.md$/, "");
}

/** Resolve `/parent/child/` style href from page id + parent map. */
function pageHref(
	id: string,
	parents: Map<string, string | undefined>,
): string {
	const segments: string[] = [];
	const seen = new Set<string>();
	let current: string | undefined = id;

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

function buildExcludedPathnames(): Set<string> {
	const excluded = new Set<string>(["/admin/", "/admin"]);

	const pageFiles = listIndexMarkdownFiles(path.join(contentRoot, "pages"));
	const parents = new Map<string, string | undefined>();
	const noindexPages: string[] = [];

	for (const file of pageFiles) {
		const id = pageIdFromFile(file);
		const fm = readFrontmatter(file);
		parents.set(id, yamlField(fm, "parent"));
		if (isNoindexFrontmatter(fm)) noindexPages.push(id);
	}

	for (const id of noindexPages) {
		excluded.add(pageHref(id, parents));
	}

	for (const file of listIndexMarkdownFiles(path.join(contentRoot, "articles"))) {
		const fm = readFrontmatter(file);
		if (!isNoindexFrontmatter(fm)) continue;
		const rel = path.relative(path.join(contentRoot, "articles"), file);
		const slug = rel.replace(/\\/g, "/").replace(/\/index\.md$/, "");
		excluded.add(`/artikel/${slug}/`);
	}

	for (const file of listFlatMarkdownFiles(path.join(contentRoot, "glossar"))) {
		const fm = readFrontmatter(file);
		if (!isNoindexFrontmatter(fm)) continue;
		const slug = path.basename(file, ".md");
		excluded.add(`/glossar/${slug}/`);
	}

	for (const file of listFlatMarkdownFiles(path.join(contentRoot, "authors"))) {
		const fm = readFrontmatter(file);
		if (!isNoindexFrontmatter(fm)) continue;
		const slug = path.basename(file, ".md");
		excluded.add(`/autoren/${slug}/`);
	}

	return excluded;
}

/**
 * Pathnames that must not appear in the sitemap:
 * `/admin/` plus every URL with `seo.index_visibility: noindex`.
 */
export function getSitemapExcludedPathnames(): Set<string> {
	if (!excludedCache) excludedCache = buildExcludedPathnames();
	return excludedCache;
}

/** `@astrojs/sitemap` `filter` callback. */
export function sitemapPageFilter(pageUrl: string): boolean {
	const pathname = new URL(pageUrl).pathname;
	const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
	if (normalized.startsWith("/admin/")) return false;
	// Wartungsmodus: Sitemap leer (keine Inhalts-URLs).
	if (isMaintenanceEnabledFromFs()) {
		return false;
	}
	const excluded = getSitemapExcludedPathnames();
	if (excluded.has(pathname) || excluded.has(normalized)) return false;
	return true;
}
