/**
 * Public site origin for Astro `site` (canonical, sitemap, OG, llms.txt).
 *
 * Priority (CMS wins over ENV — redaction steers the live domain):
 * 1. CMS Allgemein → Website-URL (`general.siteUrl`)
 * 2. ENV `SITE` (fallback when CMS is empty, e.g. fresh fork / CI)
 * 3. Template default
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const DEFAULT_SITE_URL = "https://hautoo.storyofai.net";

function stripTrailingSlash(url) {
	return url.replace(/\/+$/, "");
}

/**
 * @param {string} [repoRoot] Absolute path to the site repo root.
 * @returns {string}
 */
export function resolveSiteUrl(
	repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
) {
	const generalPath = path.join(repoRoot, "src/content/settings/general.json");
	try {
		const general = JSON.parse(fs.readFileSync(generalPath, "utf8"));
		const fromCms =
			typeof general?.siteUrl === "string" ? general.siteUrl.trim() : "";
		if (fromCms) return stripTrailingSlash(fromCms);
	} catch {
		// missing or invalid JSON → try ENV / default
	}

	const fromEnv = process.env.SITE?.trim();
	if (fromEnv) return stripTrailingSlash(fromEnv);

	return DEFAULT_SITE_URL;
}
