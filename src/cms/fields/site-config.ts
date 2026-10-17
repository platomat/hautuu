import { z } from "astro/zod";
import { contentWidthSchema } from "./content-width";
import {
	backgroundImageSchema,
	backgroundOverlaySchema,
	cmsImagePathSchema,
} from "./page-background";
import { siteTypographyConfigSchema } from "./site-typography";
import {
	DEFAULT_SEPARATOR_MARK_ALIGN,
	DEFAULT_SEPARATOR_MARK_SIZE,
	MAX_SEPARATOR_MARK_SIZE,
	MIN_SEPARATOR_MARK_SIZE,
	SEPARATOR_MARK_ALIGN_KEYS,
} from "../../lib/separator";

const headerHeight = z.coerce.number().int().min(40).max(600);

const tocLevelSchema = z.enum(["h2", "h3", "h4"]);

/** Logo + nav composition (CMS Design → Header). */
export const headerLogoPositionSchema = z.enum(["left", "right", "center"]);

export type HeaderLogoPosition = z.infer<typeof headerLogoPositionSchema>;

/**
 * Header search UI (CMS Design → Header → Suche).
 * `off` = no search at all; `hidden` = no lupe, dialog stays for shortcuts; `visible` = show trigger.
 */
export const headerSearchModeSchema = z.enum(["off", "hidden", "visible"]);

export type HeaderSearchMode = z.infer<typeof headerSearchModeSchema>;

/** Sticky header + bar heights (CMS group Design). Order: layout → min heights → sticky → sticky heights. */
export const siteHeaderConfigSchema = z.object({
	/** Logo left / right, or centered with nav on a second row (#74). Search always follows the menu. */
	logoPosition: headerLogoPositionSchema.default("left"),
	/**
	 * Inner shell max-width (same steps as content).
	 * Default `wide` matches previous hard-coded header shell.
	 */
	contentWidth: contentWidthSchema.default("wide"),
	/**
	 * Menu collection slug for the main nav (like Footer Brand → Menü, #91).
	 * Empty = no main nav. CMS `omit_empty_optional_fields` drops a cleared relation,
	 * so missing must stay empty (not fall back to `main`); template JSON sets `main`.
	 */
	menu: z.string().trim().default(""),
	/** Site search in the header: off / hide trigger / show trigger. */
	search: headerSearchModeSchema.default("visible"),
	/** Resting bar height at page top; also min-height when sticky is off. */
	minHeightDesktop: headerHeight.default(64),
	minHeightTablet: headerHeight.default(64),
	minHeightMobile: headerHeight.default(56),
	/** `position: sticky` from desktop breakpoint (≥ 1024px). */
	stickyDesktop: z.boolean().default(true),
	/** Sticky on tablet (680–1023px). */
	stickyTablet: z.boolean().default(true),
	/** Sticky on mobile (< 680px). */
	stickyMobile: z.boolean().default(true),
	/** Compact bar height after sticky engages on scroll. */
	heightDesktop: headerHeight.default(64),
	heightTablet: headerHeight.default(64),
	heightMobile: headerHeight.default(56),
});

export type SiteHeaderConfig = z.infer<typeof siteHeaderConfigSchema>;

export const heroTextAlignSchema = z.enum(["left", "center", "right"]);

export type HeroTextAlign = z.infer<typeof heroTextAlignSchema>;

/** Separator between breadcrumb items (CMS Design → Hero per collection). */
export const breadcrumbSeparatorSchema = z.enum(["/", "•", "→", "-"]);

export type BreadcrumbSeparator = z.infer<typeof breadcrumbSeparatorSchema>;

/** Separator between site name and footer copyright claim (CMS General). */
export const footerCopyrightSeparatorSchema = z.enum(["•", "-", "—", "/"]);

export type FooterCopyrightSeparator = z.infer<
	typeof footerCopyrightSeparatorSchema
>;

/** Optional claim after © year + site name in the footer. */
export const footerCopyrightConfigSchema = z.object({
	/**
	 * First calendar year of the project (© start).
	 * Same year as now → `© 2026`; later → `© 2010-2026`.
	 */
	startYear: z.coerce.number().int().min(1970).max(2100).default(2026),
	/**
	 * Text or soft HTML (`<a>`, `<b>`/`<strong>`, `<i>`/`<em>`, `<br>`).
	 * Empty = only © year and site name.
	 */
	claim: z.string().trim().default(""),
	/** Character between site name and claim. */
	separator: footerCopyrightSeparatorSchema.default("•"),
	/**
	 * Center mark in the copyright row (GitHub icon or site logo).
	 * When true: GitHub if `githubRepo` is set, otherwise site logo → `/`.
	 */
	showCenterLogo: z.boolean().default(true),
});

export type FooterCopyrightConfig = z.infer<typeof footerCopyrightConfigSchema>;

/** Footer brand block ids (CMS Design → Footer → Brand; list order = DnD). */
export const FOOTER_BRAND_BLOCK_IDS = ["logo", "description", "menu"] as const;

export type FooterBrandBlockId = (typeof FOOTER_BRAND_BLOCK_IDS)[number];

export const footerBrandBlockIdSchema = z.enum(FOOTER_BRAND_BLOCK_IDS);

export const footerBrandBlockSchema = z.object({
	id: footerBrandBlockIdSchema,
	/** When false, this block is skipped even if the brand section is on. */
	enabled: z.boolean().default(true),
});

export type FooterBrandBlock = z.infer<typeof footerBrandBlockSchema>;

export const DEFAULT_FOOTER_BRAND_BLOCKS: FooterBrandBlock[] = [
	{ id: "logo", enabled: true },
	{ id: "description", enabled: true },
	{ id: "menu", enabled: true },
];

function normalizeFooterBrandBlocks(raw: unknown): FooterBrandBlock[] {
	const list = Array.isArray(raw) ? raw : [];
	const seen = new Set<FooterBrandBlockId>();
	const ordered: FooterBrandBlock[] = [];
	for (const item of list) {
		const parsed = footerBrandBlockSchema.safeParse(item);
		if (!parsed.success || seen.has(parsed.data.id)) continue;
		seen.add(parsed.data.id);
		ordered.push(parsed.data);
	}
	return ordered.length > 0 ? ordered : DEFAULT_FOOTER_BRAND_BLOCKS.map((b) => ({ ...b }));
}

/** Row = left→right; stack = top→bottom (#81). */
export const footerBrandDirectionSchema = z.enum(["row", "stack"]);

export type FooterBrandDirection = z.infer<typeof footerBrandDirectionSchema>;

/**
 * Cross-axis alignment: row → vertical (top/center/bottom);
 * stack → horizontal (left/center/right).
 */
export const footerBrandAlignSchema = z.enum(["start", "center", "end"]);

export type FooterBrandAlign = z.infer<typeof footerBrandAlignSchema>;

/** How links inside the footer brand menu are laid out. */
export const footerBrandMenuLayoutSchema = z.enum(["row", "stack"]);

export type FooterBrandMenuLayout = z.infer<typeof footerBrandMenuLayoutSchema>;

const footerBrandLogoSize = z.coerce.number().int().min(24).max(160);

/** Brand strip above the copyright bar (Design → Footer → Brand). */
export const siteFooterBrandConfigSchema = z.object({
	/** Master switch for the brand strip. */
	enabled: z.boolean().default(false),
	direction: footerBrandDirectionSchema.default("row"),
	align: footerBrandAlignSchema.default("center"),
	/** Menu links side-by-side or stacked. */
	menuLayout: footerBrandMenuLayoutSchema.default("row"),
	/** Inner shell max-width (default / wide / full). */
	contentWidth: contentWidthSchema.default("wide"),
	/** Brand logo mark size in px (CSS `--footer-brand-logo-size`). */
	logoSize: footerBrandLogoSize.default(44),
	/**
	 * Menu collection slug (not `footer-legal`). Empty = no brand menu.
	 * Cleared CMS relations are omitted; template JSON sets `footer`.
	 */
	menu: z.string().trim().default(""),
	/** Ordered blocks (Sveltia list = drag-and-drop). */
	blocks: z.preprocess(
		normalizeFooterBrandBlocks,
		z.array(footerBrandBlockSchema),
	).default(DEFAULT_FOOTER_BRAND_BLOCKS),
});

export type SiteFooterBrandConfig = z.infer<typeof siteFooterBrandConfigSchema>;

/**
 * Top border of the copyright row: full viewport or only the content shell.
 */
export const footerBarBorderWidthSchema = z.enum(["full", "shell"]);

export type FooterBarBorderWidth = z.infer<typeof footerBarBorderWidthSchema>;

/** Copyright row under the brand strip. */
export const siteFooterBarConfigSchema = z.object({
	/** Inner shell max-width (default / wide / full). */
	contentWidth: contentWidthSchema.default("wide"),
	/**
	 * Top border span: `full` = browser width (classic), `shell` = content width.
	 */
	borderWidth: footerBarBorderWidthSchema.default("full"),
	/**
	 * Legal menu slug for the copyright row (#96). Empty = no legal links.
	 * Cleared CMS relations are omitted; template JSON sets `footer-legal`.
	 */
	menu: z.string().trim().default(""),
});

export type SiteFooterBarConfig = z.infer<typeof siteFooterBarConfigSchema>;

export const siteFooterConfigSchema = z.object({
	brand: siteFooterBrandConfigSchema.default({}),
	bar: siteFooterBarConfigSchema.default({}),
});

export type SiteFooterConfig = z.infer<typeof siteFooterConfigSchema>;

/**
 * Bottom rule under the hero: plain line or line with logo/favicon (like Separator).
 * Legacy YAML `true` / `false` maps to `line` / `none`.
 */
export const heroBorderBottomSchema = z.enum([
	"none",
	"line",
	"logo",
	"favicon",
]);

export type HeroBorderBottom = z.infer<typeof heroBorderBottomSchema>;

function coerceHeroBorderBottom(value: unknown): unknown {
	if (value === true) return "line";
	if (value === false) return "none";
	return value;
}

const heroBorderMarkAlignSchema = z.enum(SEPARATOR_MARK_ALIGN_KEYS);

/** Hero block defaults for one collection (CMS Design → Hero → …). */
export const siteHeroConfigSchema = z.object({
	/** Alignment for breadcrumbs, title, and description. */
	textAlign: heroTextAlignSchema.default("left"),
	/** Show breadcrumb trail above the title. */
	showBreadcrumbs: z.boolean().default(true),
	/** Character between breadcrumb crumbs. */
	breadcrumbSeparator: breadcrumbSeparatorSchema.default("/"),
	/** Bottom rule: none / line / logo / favicon (legacy bool → line/none). */
	borderBottom: z.preprocess(
		coerceHeroBorderBottom,
		heroBorderBottomSchema.default("none"),
	),
	/** Mark position when borderBottom is logo or favicon. */
	borderMarkAlign: heroBorderMarkAlignSchema.default(
		DEFAULT_SEPARATOR_MARK_ALIGN,
	),
	/** Mark size in px when borderBottom is logo or favicon. */
	borderMarkSize: z.coerce
		.number()
		.int()
		.min(MIN_SEPARATOR_MARK_SIZE)
		.max(MAX_SEPARATOR_MARK_SIZE)
		.default(DEFAULT_SEPARATOR_MARK_SIZE),
});

export type SiteHeroConfig = z.infer<typeof siteHeroConfigSchema>;

/**
 * Collections with a public hero (order = CMS left rail).
 * Blocks/menus/settings have no public hero pages.
 */
export const HERO_COLLECTION_KEYS = [
	"pages",
	"articles",
	"categories",
	"tags",
	"authors",
	"glossar",
] as const;

export type HeroCollectionKey = (typeof HERO_COLLECTION_KEYS)[number];

/** Per-collection hero defaults (CMS Design → Hero). */
export const siteHeroByCollectionSchema = z.object({
	pages: siteHeroConfigSchema.default({}),
	articles: siteHeroConfigSchema.default({}),
	categories: siteHeroConfigSchema.default({}),
	tags: siteHeroConfigSchema.default({}),
	authors: siteHeroConfigSchema.default({}),
	glossar: siteHeroConfigSchema.default({}),
});

export type SiteHeroByCollectionConfig = z.infer<
	typeof siteHeroByCollectionSchema
>;

/**
 * Accept legacy flat `hero: { textAlign, … }` and expand to all collections.
 */
export function normalizeHeroByCollection(raw: unknown): unknown {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
		return raw;
	}
	const obj = raw as Record<string, unknown>;
	const looksFlat =
		("textAlign" in obj ||
			"showBreadcrumbs" in obj ||
			"breadcrumbSeparator" in obj ||
			"borderBottom" in obj) &&
		!("pages" in obj) &&
		!("articles" in obj);
	if (!looksFlat) {
		return raw;
	}
	return {
		pages: obj,
		articles: obj,
		categories: obj,
		tags: obj,
		authors: obj,
		glossar: obj,
	};
}

/**
 * Optional CMS override bool (select: null / true / false).
 * null or omit → use collection/global default at resolve time.
 */
const optionalOverrideBool = z.preprocess(
	(value) => (value === null || value === "" ? undefined : value),
	z.boolean().optional(),
);

/**
 * Per-entry hero overrides (CMS object `hero`).
 * Omit object or fields = Design → Hero for that collection.
 */
/** Optional entry override for hero bottom rule (null = use Design → Hero). */
const optionalHeroBorderBottom = z.preprocess((value) => {
	if (value === null || value === "") return undefined;
	return coerceHeroBorderBottom(value);
}, heroBorderBottomSchema.optional());

const optionalHeroBorderMarkAlign = z.preprocess((value) => {
	if (value === null || value === "") return undefined;
	return value;
}, heroBorderMarkAlignSchema.optional());

const optionalHeroBorderMarkSize = z.preprocess((value) => {
	if (value === null || value === "") return undefined;
	return value;
}, z.coerce
	.number()
	.int()
	.min(MIN_SEPARATOR_MARK_SIZE)
	.max(MAX_SEPARATOR_MARK_SIZE)
	.optional());

export const entryHeroSchema = z
	.object({
		textAlign: heroTextAlignSchema.optional(),
		showBreadcrumbs: optionalOverrideBool,
		borderBottom: optionalHeroBorderBottom,
		borderMarkAlign: optionalHeroBorderMarkAlign,
		borderMarkSize: optionalHeroBorderMarkSize,
	})
	.optional();

export type EntryHero = z.infer<typeof entryHeroSchema>;

/** Per-entry TOC overrides (CMS object `toc`). */
export const entryTocSchema = z
	.object({
		/** Omit = global Content → TOC → enabled for this collection. */
		show: optionalOverrideBool,
		levels: z.array(tocLevelSchema).optional(),
		title: z.string().optional(),
	})
	.optional();

export type EntryToc = z.infer<typeof entryTocSchema>;

/** Per-collection TOC defaults (CMS group Content). */
export const siteTocCollectionSchema = z.object({
	/** Show TOC when entry omits `toc.show`. */
	enabled: z.boolean().default(false),
	levels: z.array(tocLevelSchema).default(["h2"]),
	title: z.string().default("Inhalt"),
});

export type SiteTocCollectionConfig = z.infer<typeof siteTocCollectionSchema>;

export const siteTocConfigSchema = z.object({
	pages: siteTocCollectionSchema.default({}),
	articles: siteTocCollectionSchema.default({}),
});

export type SiteTocConfig = z.infer<typeof siteTocConfigSchema>;

/**
 * Default content column when entry omits `layout.contentWidth`
 * (and no listing auto-wide). Same collection keys as Design → Inhaltsabstand (#90).
 */
export const siteWidthConfigSchema = z.object({
	pages: contentWidthSchema.default("default"),
	articles: contentWidthSchema.default("default"),
	categories: contentWidthSchema.default("default"),
	tags: contentWidthSchema.default("default"),
	authors: contentWidthSchema.default("default"),
	glossar: contentWidthSchema.default("default"),
});

export type SiteWidthConfig = z.infer<typeof siteWidthConfigSchema>;

export type ContentWidthCollectionKey = keyof SiteWidthConfig;

/** Vertical gap after hero / before footer (rem), matching previous CSS defaults. */
export const siteSpacingRemSchema = z.coerce.number().min(0).max(12);

export const siteSpacingCollectionSchema = z.object({
	/** Margin below `.page-hero` before TOC/body. */
	afterHero: siteSpacingRemSchema.default(2.5),
	/** Bottom padding of `.page` before the site footer. */
	beforeFooter: siteSpacingRemSchema.default(4),
});

export type SiteSpacingCollectionConfig = z.infer<
	typeof siteSpacingCollectionSchema
>;

/** Per-collection spacing (CMS Design → Abstand; same keys as Design → Hero). */
export const siteSpacingByCollectionSchema = z.object({
	pages: siteSpacingCollectionSchema.default({}),
	articles: siteSpacingCollectionSchema.default({}),
	categories: siteSpacingCollectionSchema.default({}),
	tags: siteSpacingCollectionSchema.default({}),
	authors: siteSpacingCollectionSchema.default({}),
	glossar: siteSpacingCollectionSchema.default({}),
});

/** Where authors appear on the article single view. */
export const authorArticlePlacementSchema = z.enum([
	"none",
	"hero",
	"after",
	"both",
]);

export type AuthorArticlePlacement = z.infer<
	typeof authorArticlePlacementSchema
>;

export const authorAvatarShapeSchema = z.enum(["round", "square"]);

export type AuthorAvatarShape = z.infer<typeof authorAvatarShapeSchema>;

/** CMS Content → Autoren: article byline + avatar shape. */
export const siteAuthorsConfigSchema = z.object({
	/** Hero and/or end of article (profile page always shows round avatar). */
	articlePlacement: authorArticlePlacementSchema.default("hero"),
	avatarShape: authorAvatarShapeSchema.default("round"),
});

export type SiteAuthorsConfig = z.infer<typeof siteAuthorsConfigSchema>;

export type SiteSpacingByCollectionConfig = z.infer<
	typeof siteSpacingByCollectionSchema
>;

export const DEFAULT_SITE_SPACING_COLLECTION: SiteSpacingCollectionConfig =
	siteSpacingCollectionSchema.parse({});

/**
 * Brand logos from the media library (#79).
 * Empty path → default `/assets/logo-mark.svg`.
 * Sticky/footer empty → fall back to header logo.
 */
export const siteLogosConfigSchema = z.object({
	header: cmsImagePathSchema,
	headerSticky: cmsImagePathSchema,
	footer: cmsImagePathSchema,
});

export type SiteLogosConfig = z.infer<typeof siteLogosConfigSchema>;

/**
 * Favicons from the media library (#80).
 * Empty default → `/assets/favicon.svg`.
 * Dark empty → same as default (built-in SVG already adapts via color-scheme).
 */
export const siteFaviconsConfigSchema = z.object({
	default: cmsImagePathSchema,
	dark: cmsImagePathSchema,
});

export type SiteFaviconsConfig = z.infer<typeof siteFaviconsConfigSchema>;

/** CMS group General (site name for chrome + document titles). */
export const siteGeneralConfigSchema = z.object({
	/** Brand / site name in header, title suffix, og:site_name. */
	websiteTitle: z.string().trim().min(1).default("hautuu"),
	/**
	 * Optional short description / slogan (#75).
	 * Stored for later UI use; not required on every page yet.
	 */
	websiteDescription: z.string().trim().default(""),
	/** Optional footer line after site name (claim + separator). */
	footerCopyright: footerCopyrightConfigSchema.default({}),
	/**
	 * Optional contact address for `{{contact-email}}`.
	 * When set, overrides env `CONTACT_EMAIL` at build time (value is public in Git).
	 */
	contactEmail: z.string().trim().default(""),
	/**
	 * Optional pages collection slug for the privacy policy (WordPress-style).
	 * Used e.g. by the video consent facade link.
	 */
	privacyPage: z.string().trim().default(""),
	/**
	 * Optional public GitHub repo (`owner/name`) for the footer center icon.
	 * Set for hautoo (`platomat/hautoo`); leave empty on forks → site logo → `/`.
	 */
	githubRepo: z.string().trim().default(""),
	/** Header / sticky / footer logos from the media library. */
	logos: siteLogosConfigSchema.default({}),
	/** Browser tab icons (default + optional dark color-scheme). */
	favicons: siteFaviconsConfigSchema.default({}),
});

export type SiteGeneralConfig = z.infer<typeof siteGeneralConfigSchema>;

/** Hex from Sveltia color widget (`#RGB` / `#RRGGBB` / `#RRGGBBAA`, any case). */
const cssHexColor = z
	.string()
	.trim()
	.regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "Invalid CSS hex color");

/** Design → Farbpalette (`design.colors`). Defaults match `global.css` :root. */
export const siteColorsConfigSchema = z.object({
	bg: cssHexColor.default("#0f1412"),
	surface: cssHexColor.default("#1a211e"),
	/** 8-digit hex with alpha preferred (Sveltia `enableAlpha`). */
	surfaceGlass: cssHexColor.default("#1a211ee6"),
	surfaceRaised: cssHexColor.default("#232b27"),
	border: cssHexColor.default("#2e3833"),
	text: cssHexColor.default("#e8eeea"),
	textMuted: cssHexColor.default("#9aa89f"),
	action: cssHexColor.default("#3dcf8e"),
	actionHover: cssHexColor.default("#56d9a0"),
	actionMuted: cssHexColor.default("#1a3d2e"),
	danger: cssHexColor.default("#e57373"),
	/**
	 * Nav flyout / accordion panel. Defaults to solid surface so entries stay
	 * readable when header chrome uses translucent glass over page backgrounds.
	 */
	submenuBg: cssHexColor.default("#1a211e"),
	/** Default link color inside the submenu panel. */
	submenuText: cssHexColor.default("#e8eeea"),
});

export type SiteColorsConfig = z.infer<typeof siteColorsConfigSchema>;

/** Migrate legacy `design.width` → `design.contentWidth`. */
function normalizeDesignContentWidth(raw: unknown): unknown {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
		return raw;
	}
	const obj = { ...(raw as Record<string, unknown>) };
	if (obj.contentWidth == null && obj.width != null) {
		obj.contentWidth = obj.width;
	}
	delete obj.width;
	return obj;
}

/**
 * Corner radius for content media (CMS Design → Ecken abrunden).
 * Applied as `--radius-image` / `--radius-video` (px).
 */
export const siteBorderRadiusConfigSchema = z.object({
	/** Markdown / CMS content images. */
	image: z.coerce.number().int().min(0).max(64).default(0),
	/** `VideoEmbed` and (hautoo) `MemberVideo` containers. */
	video: z.coerce.number().int().min(0).max(64).default(0),
});

export type SiteBorderRadiusConfig = z.infer<typeof siteBorderRadiusConfigSchema>;

/** `src/content/settings/design.json` */
export const siteDesignConfigSchema = z.preprocess(
	normalizeDesignContentWidth,
	z.object({
		colors: siteColorsConfigSchema.default({}),
		typography: siteTypographyConfigSchema.default({}),
		header: siteHeaderConfigSchema.default({}),
		hero: z.preprocess(
			normalizeHeroByCollection,
			siteHeroByCollectionSchema.default({}),
		),
		/** Default content column width (pages/articles). */
		contentWidth: siteWidthConfigSchema.default({}),
		/** Vertical gaps after hero / before footer per collection. */
		spacing: siteSpacingByCollectionSchema.default({}),
		/** Border radius for content images and video embeds. */
		borderRadius: siteBorderRadiusConfigSchema.default({}),
	}),
);

export type SiteDesignConfig = z.infer<typeof siteDesignConfigSchema>;

export const DEFAULT_SITE_COLORS: SiteColorsConfig =
	siteColorsConfigSchema.parse({});

export {
	DEFAULT_SITE_TYPOGRAPHY,
	type SiteTypographyConfig,
} from "./site-typography";

/** Self-hosted video base (Cloudflare R2 custom domain), CMS Content → Medien. */
export const siteMediaConfigSchema = z.object({
	/**
	 * Public base URL for `provider="file"` videos (trailing slash optional).
	 * Example: `https://media.hautoo.storyofai.net/videos/`
	 */
	videoBaseUrl: z.string().trim().default(""),
	/**
	 * Cloudflare Worker base URL for gated MemberVideo (no trailing slash).
	 * Example: `https://hautoo-member-media-access.<account>.workers.dev`
	 */
	videoAccessWorkerUrl: z.string().trim().default(""),
});

export type SiteMediaConfig = z.infer<typeof siteMediaConfigSchema>;

/** `src/content/settings/content.json` */
export const siteContentConfigSchema = z.object({
	toc: siteTocConfigSchema.default({}),
	media: siteMediaConfigSchema.default({}),
	authors: siteAuthorsConfigSchema.default({}),
	/** Brand strip above copyright (#81); CMS Content → Footer. */
	footer: siteFooterConfigSchema.default({}),
});

export type SiteContentFileConfig = z.infer<typeof siteContentConfigSchema>;

/**
 * `src/content/settings/maintenance.json` (#101).
 * When enabled: production builds show only the maintenance screen;
 * `astro dev` keeps the full site and shows a reminder banner.
 */
export const siteMaintenanceConfigSchema = z.object({
	enabled: z.boolean().default(false),
	/** H1 and SEO / document title. */
	title: z.string().trim().min(1).default("Wartungsarbeiten"),
	/** Short body as Markdown. */
	description: z.string().default(""),
	background: z
		.object({
			image: backgroundImageSchema,
			overlay: backgroundOverlaySchema.optional(),
		})
		.optional(),
});

export type SiteMaintenanceConfig = z.infer<typeof siteMaintenanceConfigSchema>;

/** Merged site settings (general + design + content + maintenance JSON files). */
export const siteConfigSchema = z.object({
	general: siteGeneralConfigSchema.default({}),
	design: siteDesignConfigSchema.default({}),
	content: siteContentConfigSchema.default({}),
	maintenance: siteMaintenanceConfigSchema.default({}),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;

export const DEFAULT_SITE_GENERAL_CONFIG: SiteGeneralConfig =
	siteGeneralConfigSchema.parse({});

export const DEFAULT_SITE_HEADER_CONFIG: SiteHeaderConfig =
	siteHeaderConfigSchema.parse({});

export const DEFAULT_SITE_FOOTER_BRAND_CONFIG: SiteFooterBrandConfig =
	siteFooterBrandConfigSchema.parse({});

export const DEFAULT_SITE_FOOTER_BAR_CONFIG: SiteFooterBarConfig =
	siteFooterBarConfigSchema.parse({});

export const DEFAULT_SITE_HERO_CONFIG: SiteHeroConfig =
	siteHeroConfigSchema.parse({});

export const DEFAULT_SITE_TOC_CONFIG: SiteTocConfig =
	siteTocConfigSchema.parse({});

export const DEFAULT_SITE_WIDTH_CONFIG: SiteWidthConfig =
	siteWidthConfigSchema.parse({});

export const DEFAULT_SITE_SPACING_CONFIG: SiteSpacingByCollectionConfig =
	siteSpacingByCollectionSchema.parse({});
