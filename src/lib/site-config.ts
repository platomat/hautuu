import contentRaw from "../content/settings/content.json" with { type: "json" };
import designRaw from "../content/settings/design.json" with { type: "json" };
import generalRaw from "../content/settings/general.json" with { type: "json" };
import maintenanceRaw from "../content/settings/maintenance.json" with {
	type: "json",
};
import {
	DEFAULT_SITE_FOOTER_BAR_CONFIG,
	DEFAULT_SITE_FOOTER_BRAND_CONFIG,
	DEFAULT_SITE_GENERAL_CONFIG,
	DEFAULT_SITE_HEADER_CONFIG,
	DEFAULT_SITE_HERO_CONFIG,
	DEFAULT_SITE_TOC_CONFIG,
	footerCopyrightConfigSchema,
	siteConfigSchema,
	siteContentConfigSchema,
	siteDesignConfigSchema,
	siteFooterBarConfigSchema,
	siteFooterBrandConfigSchema,
	siteCodeConfigSchema,
	siteGeneralConfigSchema,
	siteMaintenanceConfigSchema,
	type BreadcrumbSeparator,
	type EntryHero,
	type EntryToc,
	type FooterCopyrightConfig,
	type HeroBorderBottom,
	type HeroCollectionKey,
	type HeroTextAlign,
	type SiteCodeConfig,
	type SiteConfig,
	type SiteFooterBarConfig,
	type SiteFooterBrandConfig,
	type SiteHeaderConfig,
	type SiteHeroConfig,
	type SiteAuthorsConfig,
	type SiteMaintenanceConfig,
	type SiteTocCollectionConfig,
	type SiteTocConfig,
	siteAuthorsConfigSchema,
} from "../cms/fields/site-config";
import type { SeparatorMarkAlign } from "./separator";

export type { HeroCollectionKey, SiteMaintenanceConfig };

/**
 * Merge CMS settings JSON files (like cdr-legal `src/content/settings/`).
 * Loaded via direct import — not an Astro content collection.
 */
export function getSiteConfig(): SiteConfig {
	const contentObj = contentRaw as Record<string, unknown>;
	const designObj = designRaw as Record<string, unknown>;
	const generalObj = generalRaw as Record<string, unknown>;
	const maintenanceObj = maintenanceRaw as Record<string, unknown>;
	const footerCopyrightRaw =
		(generalObj.footerCopyright as Record<string, unknown> | undefined) ?? {};
	// Legacy: showFooterCenter / showCenter → showCenterLogo.
	const { showCenter: legacyShowCenter, ...footerCopyrightRest } =
		footerCopyrightRaw;
	const footerCopyright = {
		...footerCopyrightRest,
		showCenterLogo:
			footerCopyrightRaw.showCenterLogo ??
			legacyShowCenter ??
			generalObj.showFooterCenter ??
			true,
	};
	// contentWidth/spacing under Design; footer under Content (legacy: design.footer).
	const { footer: legacyDesignFooter, ...designWithoutFooter } = designObj;
	return siteConfigSchema.parse({
		general: siteGeneralConfigSchema.parse({
			...generalObj,
			footerCopyright,
		}),
		design: siteDesignConfigSchema.parse({
			...designWithoutFooter,
			contentWidth:
				designObj.contentWidth ?? designObj.width ?? contentObj.width,
			spacing: designObj.spacing ?? contentObj.spacing,
		}),
		content: siteContentConfigSchema.parse({
			...contentObj,
			footer: contentObj.footer ?? legacyDesignFooter,
		}),
		maintenance: siteMaintenanceConfigSchema.parse(maintenanceObj),
	});
}

/** Brand / site name from CMS (header wordmark, title suffix, og:site_name). */
export function getSiteWebsiteTitle(): string {
	const config = getSiteConfig();
	return (
		config.general?.websiteTitle?.trim() ||
		DEFAULT_SITE_GENERAL_CONFIG.websiteTitle
	);
}

/** Optional site description / slogan from CMS General (#75). */
export function getSiteWebsiteDescription(): string {
	const config = getSiteConfig();
	return config.general?.websiteDescription?.trim() ?? "";
}

/** Global head/footer HTML from CMS Allgemein → Site-Code. */
export function getSiteCodeConfig(): SiteCodeConfig {
	const config = getSiteConfig();
	return siteCodeConfigSchema.parse(config.general?.siteCode ?? {});
}

/** Footer copyright claim + separator from CMS General. */
export function getFooterCopyrightConfig(): FooterCopyrightConfig {
	const config = getSiteConfig();
	return footerCopyrightConfigSchema.parse(
		config.general?.footerCopyright ?? {},
	);
}

export function getSiteHeaderConfig(): SiteHeaderConfig {
	const config = getSiteConfig();
	return config.design?.header ?? DEFAULT_SITE_HEADER_CONFIG;
}

/** Footer brand strip above the copyright bar (Content → Footer → Brand). */
export function getFooterBrandConfig(): SiteFooterBrandConfig {
	const config = getSiteConfig();
	return siteFooterBrandConfigSchema.parse(
		config.content?.footer?.brand ?? DEFAULT_SITE_FOOTER_BRAND_CONFIG,
	);
}

/** Copyright row shell width (Content → Footer → Bar). */
export function getFooterBarConfig(): SiteFooterBarConfig {
	const config = getSiteConfig();
	return siteFooterBarConfigSchema.parse(
		config.content?.footer?.bar ?? DEFAULT_SITE_FOOTER_BAR_CONFIG,
	);
}

/** Hero defaults for one collection (Design → Hero → Seiten/Artikel/…). */
export function getSiteHeroConfig(
	collection: HeroCollectionKey = "pages",
): SiteHeroConfig {
	const config = getSiteConfig();
	return config.design?.hero?.[collection] ?? DEFAULT_SITE_HERO_CONFIG;
}

export type ResolvedHeroSettings = {
	textAlign: HeroTextAlign;
	showBreadcrumbs: boolean;
	breadcrumbSeparator: BreadcrumbSeparator;
	borderBottom: HeroBorderBottom;
	borderMarkAlign: SeparatorMarkAlign;
	borderMarkSize: number;
};

/**
 * Merge entry `hero` object with Design → Hero for that collection.
 * Missing local values → collection defaults.
 */
export function resolveHeroSettings(
	entry: EntryHero | undefined,
	globalHero: SiteHeroConfig = DEFAULT_SITE_HERO_CONFIG,
): ResolvedHeroSettings {
	return {
		textAlign: entry?.textAlign ?? globalHero.textAlign,
		showBreadcrumbs:
			typeof entry?.showBreadcrumbs === "boolean"
				? entry.showBreadcrumbs
				: globalHero.showBreadcrumbs,
		breadcrumbSeparator: globalHero.breadcrumbSeparator,
		borderBottom: entry?.borderBottom ?? globalHero.borderBottom,
		borderMarkAlign: entry?.borderMarkAlign ?? globalHero.borderMarkAlign,
		borderMarkSize: entry?.borderMarkSize ?? globalHero.borderMarkSize,
	};
}

export function resolveHeroForEntry(
	entry: EntryHero | undefined,
	collection: HeroCollectionKey = "pages",
): ResolvedHeroSettings {
	return resolveHeroSettings(entry, getSiteHeroConfig(collection));
}

export function getSiteTocConfig(): SiteTocConfig {
	const config = getSiteConfig();
	return config.content?.toc ?? DEFAULT_SITE_TOC_CONFIG;
}

export type TocCollectionKey = "pages" | "articles";

export type EntryWithToc = {
	toc?: EntryToc;
};

export type ResolvedTocSettings = {
	show: boolean;
	levels: Array<"h2" | "h3" | "h4">;
	title: string;
};

/**
 * Merge entry `toc` object with global config.
 * Missing `toc.show` → global `enabled`; local true/false wins.
 * Empty/missing levels or title → global values for that collection.
 */
export function resolveTocSettings(
	entryToc: EntryToc | undefined,
	globalForCollection: SiteTocCollectionConfig,
): ResolvedTocSettings {
	const show =
		typeof entryToc?.show === "boolean"
			? entryToc.show
			: globalForCollection.enabled;

	const levels =
		entryToc?.levels && entryToc.levels.length > 0
			? entryToc.levels
			: globalForCollection.levels;

	const title =
		entryToc?.title?.trim() ||
		globalForCollection.title.trim() ||
		"Inhalt";

	return { show, levels, title };
}

export function resolveTocForCollection(
	collection: TocCollectionKey,
	entry: EntryWithToc,
): ResolvedTocSettings {
	const toc = getSiteTocConfig();
	const globalForCollection = toc[collection] ?? siteTocCollectionFallback();
	return resolveTocSettings(entry.toc, globalForCollection);
}

function siteTocCollectionFallback(): SiteTocCollectionConfig {
	return DEFAULT_SITE_TOC_CONFIG.pages;
}

/** Public R2/media base for `provider="file"` videos (may be empty). */
export function getVideoBaseUrl(): string {
	const config = getSiteConfig();
	return config.content?.media?.videoBaseUrl?.trim() ?? "";
}

/** Worker base URL for gated MemberVideo (may be empty until deployed). */
export function getVideoAccessWorkerUrl(): string {
	const config = getSiteConfig();
	return config.content?.media?.videoAccessWorkerUrl?.trim().replace(/\/+$/, "") ?? "";
}

/** Content → Autoren: article byline placement + avatar shape. */
export function getAuthorsDisplayConfig(): SiteAuthorsConfig {
	const config = getSiteConfig();
	return siteAuthorsConfigSchema.parse(config.content?.authors ?? {});
}
