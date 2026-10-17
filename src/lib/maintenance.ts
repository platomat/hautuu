import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";
import {
	DEFAULT_SITE_GENERAL_CONFIG,
	siteMaintenanceConfigSchema,
	type SiteMaintenanceConfig,
} from "../cms/fields/site-config";
import { hastExternalLinks } from "./hast-external-links";
import { getSiteConfig } from "./site-config";

export type { SiteMaintenanceConfig };

/** Local preview of the public maintenance screen (dev + when mode is on). */
export const MAINTENANCE_PREVIEW_PATH = "/wartung-vorschau/";

/** CMS Maintenance settings (defaults applied). */
export function getMaintenanceConfig(): SiteMaintenanceConfig {
	return siteMaintenanceConfigSchema.parse(
		getSiteConfig().maintenance ?? {},
	);
}

/** True when Einstellungen → Wartungsmodus → aktiv. */
export function isMaintenanceEnabled(): boolean {
	return getMaintenanceConfig().enabled === true;
}

export function isMaintenancePreviewPath(pathname: string): boolean {
	const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
	return normalized === MAINTENANCE_PREVIEW_PATH;
}

/**
 * Show the maintenance screen when:
 * - mode is on and this is a production build (every URL), or
 * - mode is on and the path is the local preview URL.
 */
export function shouldServeMaintenancePage(pathname?: string): boolean {
	if (!isMaintenanceEnabled()) return false;
	if (import.meta.env.PROD) return true;
	return Boolean(pathname && isMaintenancePreviewPath(pathname));
}

/**
 * Dev reminder when maintenance is on but the normal site is still shown.
 * Hidden on the preview URL itself.
 */
export function shouldShowMaintenanceDevBanner(pathname?: string): boolean {
	if (!isMaintenanceEnabled() || !import.meta.env.DEV) return false;
	if (pathname && isMaintenancePreviewPath(pathname)) return false;
	return true;
}

/** Plain text for meta description (strip light Markdown). */
export function maintenanceMetaDescription(markdown: string): string {
	return markdown
		.replace(/!\[[^\]]*]\([^)]*\)/g, " ")
		.replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
		.replace(/[`*_#>]+/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.slice(0, 300);
}

let descriptionProcessor: Awaited<
	ReturnType<typeof createSatteriMarkdownProcessor>
> | null = null;

/** Render maintenance description Markdown to HTML (no CMS embeds). */
export async function renderMaintenanceDescription(
	markdown: string,
): Promise<string> {
	const source = markdown.trim();
	if (!source) return "";
	descriptionProcessor ??= await createSatteriMarkdownProcessor({
		hastPlugins: [hastExternalLinks],
	});
	const { code } = await descriptionProcessor.render(source);
	return code.trim();
}

/** Document title for the maintenance screen (`Title · Site`). */
export function maintenanceDocumentTitle(
	maintenanceTitle: string,
	siteName?: string,
): string {
	const brand =
		siteName?.trim() || DEFAULT_SITE_GENERAL_CONFIG.websiteTitle;
	const title = maintenanceTitle.trim() || "Wartungsarbeiten";
	return title === brand ? title : `${title} · ${brand}`;
}
