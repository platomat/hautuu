import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";
import {
	DEFAULT_SITE_GENERAL_CONFIG,
	siteMaintenanceConfigSchema,
	type SiteMaintenanceConfig,
} from "../cms/fields/site-config";
import { hastExternalLinks } from "./hast-external-links";
import { getSiteConfig } from "./site-config";

export type { SiteMaintenanceConfig };

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

/**
 * Production build with maintenance on: visitors only see the maintenance screen.
 * Local `astro dev` stays fully browsable.
 */
export function shouldServeMaintenancePage(): boolean {
	return isMaintenanceEnabled() && import.meta.env.PROD;
}

/** Dev reminder when maintenance is on but content is still shown. */
export function shouldShowMaintenanceDevBanner(): boolean {
	return isMaintenanceEnabled() && import.meta.env.DEV;
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
