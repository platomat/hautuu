import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";
import type { ArticleSort } from "./articles";
import { getPublicBlock } from "./blocks";
import type { GlossarSort } from "./glossar";
import { hastCmsAssets } from "./hast-cms-assets";
import { hastExternalLinks } from "./hast-external-links";
import { hastHeadingIds } from "./hast-heading-ids";
import type { CategorySort } from "./categories";
import type { TagSort } from "./tags";
import type { MemberVideoEmbedProps } from "./member-video";
import { parseRepoDocProps, type RepoDocEmbedProps } from "./repodoc";
import {
	parseButtonGroupItems,
	parseEmbedFlag,
	resolveButtonAlign,
	resolveButtonColor,
	resolveButtonGroupAlign,
	resolveButtonGroupLayout,
	resolveButtonStyle,
	resolveButtonTarget,
	type ButtonAlign,
	type ButtonColor,
	type ButtonGroupAlign,
	type ButtonGroupItem,
	type ButtonGroupLayout,
	type ButtonStyle,
	type ButtonTarget,
} from "./button";
import {
	parseGridCardsProps,
	type GridCardsEmbedProps,
} from "./grid-cards";
import {
	DEFAULT_SEPARATOR_COLOR,
	DEFAULT_SEPARATOR_MARK,
	DEFAULT_SEPARATOR_MARK_ALIGN,
	DEFAULT_SEPARATOR_MARK_SIZE,
	MAX_SEPARATOR_MARK_SIZE,
	MIN_SEPARATOR_MARK_SIZE,
	resolveSeparatorColor,
	resolveSeparatorMark,
	resolveSeparatorMarkAlign,
	type SeparatorColor,
	type SeparatorMark,
	type SeparatorMarkAlign,
} from "./separator";
import { DEFAULT_SPACER_HEIGHT, clampSpacerHeight } from "./spacer";
import type { VideoProvider } from "./video";
import {
	isFileVideoProvider,
	isThirdPartyVideoProvider,
	normalizeVideoId,
} from "./video";
import {
	mergeContactEmailLayoutSegments,
	parseContactEmailEmbedProps,
	type ContactEmailEmbedProps,
	type ContactEmailFlowSegment,
} from "./contact-email-embed";

export type {
	ContactEmailEmbedProps,
	ContactEmailFlowSegment,
	ContactEmailLayout,
} from "./contact-email-embed";

/**
 * Fields shown on article listing cards (CMS `show="…"`).
 * `display*` names stay distinct from filter attrs (`authors=`, `tags=`, …).
 */
export type ArticleCardField =
	| "displayImage"
	| "displayTitle"
	| "displayIntro"
	| "displayCategories"
	| "displayTags"
	| "displayAuthors"
	| "displayDate"
	| "displayReadingTime";

export const ARTICLE_CARD_FIELDS = [
	"displayImage",
	"displayTitle",
	"displayIntro",
	"displayCategories",
	"displayTags",
	"displayAuthors",
	"displayDate",
	"displayReadingTime",
] as const satisfies readonly ArticleCardField[];

const ARTICLE_CARD_FIELD_SET = new Set<string>(ARTICLE_CARD_FIELDS);

export type ArticleListingFilterMatch = "all" | "any";

/**
 * How `displayImage` sits on the card (ignored when image is off).
 * Position × inset: top/bottom/left/right × cover/bleed.
 */
export type ArticleListingImageStyle =
	| "top-cover"
	| "top-bleed"
	| "bottom-cover"
	| "bottom-bleed"
	| "left-cover"
	| "left-bleed"
	| "right-cover"
	| "right-bleed";

export type ArticleListingEmbedProps = {
	count: number;
	sort: ArticleSort;
	layout: "grid" | "list";
	columns: number;
	/** Gap between items, in rem. */
	gap: number;
	/** Which card fields to render. */
	show: ArticleCardField[];
	/** Preview image layout when `displayImage` is on. */
	imageStyle: ArticleListingImageStyle;
	/** Author slugs (any of these). Empty = no author filter. */
	authors: string[];
	/** Category slugs (any of these). Empty = no category filter. */
	categories: string[];
	/** Tag slugs (any of these). Empty = no tag filter. */
	tags: string[];
	/**
	 * Between filter groups: `all` = every non-empty group must match;
	 * `any` = at least one group. Within a group, one matching slug is enough.
	 */
	match: ArticleListingFilterMatch;
	/** Link card title/image to the article single page (default true). */
	linkable: boolean;
};

export type GlossarListingEmbedProps = {
	count: number;
	sort: GlossarSort;
	layout: "grid" | "list";
	columns: number;
	gap: number;
	/** Link entry to the glossar single page (default true). */
	linkable: boolean;
};

/** Embed flag that defaults to `true` when the attr is omitted. */
export function parseEmbedFlagDefaultTrue(
	raw: string | undefined,
): boolean {
	if (raw === undefined || String(raw).trim() === "") {
		return true;
	}
	const key = String(raw).trim().toLowerCase();
	if (key === "false" || key === "0" || key === "no") {
		return false;
	}
	return true;
}

export type TagListingEmbedProps = {
	count: number;
	sort: TagSort;
	layout: "cloud" | "list" | "grid";
	columns: number;
	gap: number;
};

export type CategoryListingEmbedProps = {
	count: number;
	sort: CategorySort;
	layout: "cloud" | "list" | "grid";
	columns: number;
	gap: number;
};

export type SeparatorEmbedProps = {
	/** Thickness in px. */
	height: number;
	/** Width in percent of the content column. */
	width: number;
	/** Design-token color (default border). */
	color: SeparatorColor;
	/** Optional logo or favicon on the line (`none` = plain hr). */
	mark: SeparatorMark;
	/** Mark position: left / center / right. */
	markAlign: SeparatorMarkAlign;
	/** Mark width in px. */
	markSize: number;
};

export type SpacerEmbedProps = {
	/** Vertical gap in px. */
	height: number;
};

export type ButtonEmbedProps = {
	label: string;
	href: string;
	target: ButtonTarget;
	style: ButtonStyle;
	color: ButtonColor;
	align: ButtonAlign;
};

export type ButtonGroupEmbedProps = {
	items: ButtonGroupItem[];
	layout: ButtonGroupLayout;
	align: ButtonGroupAlign;
	/** Full-width buttons under 680px. */
	fullWidthMobile: boolean;
};

export type VideoEmbedProps = {
	provider: VideoProvider;
	/** YouTube/Vimeo id; for `file` unused when `src` is set. */
	id?: string;
	/** Self-hosted URL or object key (`provider="file"`). */
	src?: string;
	title: string;
	poster?: string;
};

export type { MemberVideoEmbedProps } from "./member-video";

export type LogoEmbedVariant = "header" | "sticky" | "footer";
export type LogoEmbedAlign = "left" | "center" | "right";
export type LogoEmbedUnit = "px" | "%";

export type LogoEmbedProps = {
	variant: LogoEmbedVariant;
	width: number;
	unit: LogoEmbedUnit;
	align: LogoEmbedAlign;
};

export type AuthorSocialEmbedProps = {
	/** Author slug; empty = use CmsContent defaultAuthorId (current profile). */
	author: string;
};

export type ContentSegment =
	| { type: "html"; html: string }
	| { type: "article-listing"; props: ArticleListingEmbedProps }
	| { type: "glossar-listing"; props: GlossarListingEmbedProps }
	| { type: "tag-listing"; props: TagListingEmbedProps }
	| { type: "category-listing"; props: CategoryListingEmbedProps }
	| { type: "tag-cloud" }
	| { type: "separator"; props: SeparatorEmbedProps }
	| { type: "spacer"; props: SpacerEmbedProps }
	| { type: "button"; props: ButtonEmbedProps }
	| { type: "button-group"; props: ButtonGroupEmbedProps }
	| { type: "grid-cards"; props: GridCardsEmbedProps }
	| { type: "contact-email"; props: ContactEmailEmbedProps }
	| ContactEmailFlowSegment
	| { type: "logo"; props: LogoEmbedProps }
	| { type: "repodoc"; props: RepoDocEmbedProps }
	| { type: "video"; props: VideoEmbedProps }
	| { type: "member-video"; props: MemberVideoEmbedProps }
	| { type: "video-consent-reset" }
	| { type: "matomo-privacy" }
	| { type: "author-listing" }
	| { type: "author-social"; props: AuthorSocialEmbedProps };

const DEFAULT_SHOW: ArticleCardField[] = [
	"displayTitle",
	"displayIntro",
	"displayCategories",
	"displayTags",
	"displayDate",
	"displayReadingTime",
];

const ARTICLE_IMAGE_STYLES = new Set<ArticleListingImageStyle>([
	"top-cover",
	"top-bleed",
	"bottom-cover",
	"bottom-bleed",
	"left-cover",
	"left-bleed",
	"right-cover",
	"right-bleed",
]);

/** Legacy short names from the first imageStyle rollout. */
const LEGACY_IMAGE_STYLE: Record<string, ArticleListingImageStyle> = {
	cover: "top-cover",
	bleed: "top-bleed",
	aside: "left-cover",
};

const DEFAULT_LISTING: ArticleListingEmbedProps = {
	count: 3,
	sort: "newest",
	layout: "grid",
	columns: 3,
	gap: 1.25,
	show: DEFAULT_SHOW,
	imageStyle: "top-cover",
	authors: [],
	categories: [],
	tags: [],
	match: "all",
	linkable: true,
};

export function parseArticleListingImageStyle(
	raw: string | undefined,
): ArticleListingImageStyle {
	const value = (raw ?? "").trim();
	if (!value) {
		return DEFAULT_LISTING.imageStyle;
	}
	if (ARTICLE_IMAGE_STYLES.has(value as ArticleListingImageStyle)) {
		return value as ArticleListingImageStyle;
	}
	return LEGACY_IMAGE_STYLE[value] ?? DEFAULT_LISTING.imageStyle;
}

/** Normalize CMS/array/`show=` tokens to canonical card fields. */
export function normalizeArticleCardShowList(
	fields: readonly string[] | undefined,
): ArticleCardField[] {
	if (!fields?.length) return [...DEFAULT_SHOW];
	const selected = new Set(
		fields
			.map((raw) => raw.trim())
			.filter((part): part is ArticleCardField =>
				ARTICLE_CARD_FIELD_SET.has(part),
			),
	);
	/** Keep canonical card order; selection is on/off only (FE layout is fixed). */
	const out = ARTICLE_CARD_FIELDS.filter((field) => selected.has(field));
	return out.length > 0 ? out : [...DEFAULT_SHOW];
}

export function parseArticleCardShow(
	raw: string | undefined,
): ArticleCardField[] {
	if (!raw?.trim()) return [...DEFAULT_SHOW];
	return normalizeArticleCardShowList(raw.split(/[,\s]+/));
}

const DEFAULT_GLOSSAR_LISTING: GlossarListingEmbedProps = {
	count: 0,
	sort: "title-asc",
	layout: "list",
	columns: 2,
	gap: 1.5,
	linkable: true,
};

const DEFAULT_TAG_LISTING: TagListingEmbedProps = {
	count: 0,
	sort: "title-asc",
	layout: "cloud",
	columns: 3,
	gap: 1.25,
};

const DEFAULT_CATEGORY_LISTING: CategoryListingEmbedProps = {
	count: 0,
	sort: "title-asc",
	layout: "grid",
	columns: 3,
	gap: 1.25,
};

const DEFAULT_SEPARATOR: SeparatorEmbedProps = {
	height: 1,
	width: 100,
	color: DEFAULT_SEPARATOR_COLOR,
	mark: DEFAULT_SEPARATOR_MARK,
	markAlign: DEFAULT_SEPARATOR_MARK_ALIGN,
	markSize: DEFAULT_SEPARATOR_MARK_SIZE,
};

const DEFAULT_SPACER: SpacerEmbedProps = {
	height: DEFAULT_SPACER_HEIGHT,
};

/** Line must be only the embed (optional attrs). */
const EMBED_LINE =
	/^\{\{(?<name>article-listing|glossar-listing|tag-listing|category-listing|author-listing|author-social|tag-cloud|separator|spacer|button-group|button|grid-cards|contact-email|logo|repodoc|block|video-consent-reset|matomo-privacy|member-video|video)(?<attrs>[^}]*)\}\}\s*$/gm;

const LOGO_VARIANTS = new Set<LogoEmbedVariant>(["header", "sticky", "footer"]);
const LOGO_ALIGNS = new Set<LogoEmbedAlign>(["left", "center", "right"]);

const DEFAULT_LOGO_EMBED: LogoEmbedProps = {
	variant: "header",
	width: 120,
	unit: "px",
	align: "left",
};

export function parseLogoEmbedProps(
	attrsRaw: string | undefined,
): LogoEmbedProps {
	const attrs = parseAttrs(attrsRaw ?? "");
	const variant = LOGO_VARIANTS.has(attrs.variant as LogoEmbedVariant)
		? (attrs.variant as LogoEmbedVariant)
		: DEFAULT_LOGO_EMBED.variant;
	const align = LOGO_ALIGNS.has(attrs.align as LogoEmbedAlign)
		? (attrs.align as LogoEmbedAlign)
		: DEFAULT_LOGO_EMBED.align;
	const unit: LogoEmbedUnit = attrs.unit === "%" ? "%" : "px";
	const max = unit === "%" ? 100 : 1200;
	return {
		variant,
		width: clampInt(attrs.width, DEFAULT_LOGO_EMBED.width, 1, max),
		unit,
		align,
	};
}

const ARTICLE_SORTS = new Set<ArticleSort>([
	"newest",
	"oldest",
	"title-asc",
	"title-desc",
]);

const GLOSSAR_SORTS = new Set<GlossarSort>([
	"title-asc",
	"title-desc",
	"newest",
	"oldest",
]);

const TAG_SORTS = new Set<TagSort>(["title-asc", "title-desc", "most-used"]);

const CATEGORY_SORTS = new Set<CategorySort>([
	"title-asc",
	"title-desc",
	"most-used",
]);

let markdownProcessor: Awaited<
	ReturnType<typeof createSatteriMarkdownProcessor>
> | null = null;

async function getProcessor() {
	markdownProcessor ??= await createSatteriMarkdownProcessor({
		hastPlugins: [hastHeadingIds, hastCmsAssets, hastExternalLinks],
	});
	return markdownProcessor;
}

/**
 * CMS authors write address lines under each other. CommonMark soft-breaks
 * become spaces in HTML, so the lines sit side by side. Turn single newlines
 * into Markdown hard breaks (`  \\n`), leaving blank lines and fenced code alone.
 */
export function markdownSoftBreaksAsHard(source: string): string {
	const chunks = source.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g);
	return chunks
		.map((chunk, index) => {
			if (index % 2 === 1) {
				return chunk;
			}
			return chunk.replace(/([^\n])\n(?!\n)/g, (match, char: string, offset: number) => {
				if (char === " " && offset > 0 && chunk[offset - 1] === " ") {
					return match;
				}
				return `${char}  \n`;
			});
		})
		.join("");
}

export function hasContentEmbeds(body: string | undefined): boolean {
	if (!body) {
		return false;
	}
	EMBED_LINE.lastIndex = 0;
	return EMBED_LINE.test(body);
}

export function hasArticleListingEmbed(body: string | undefined): boolean {
	if (!body) {
		return false;
	}
	return /\{\{article-listing\b/.test(body);
}

export function hasGlossarListingEmbed(body: string | undefined): boolean {
	if (!body) {
		return false;
	}
	return /\{\{glossar-listing\b/.test(body);
}

export function hasTagListingEmbed(body: string | undefined): boolean {
	if (!body) {
		return false;
	}
	return /\{\{tag-listing\b/.test(body);
}

export function hasCategoryListingEmbed(body: string | undefined): boolean {
	if (!body) {
		return false;
	}
	return /\{\{category-listing\b/.test(body);
}

/** Wide content column for card/list embeds (direct markers only). */
export function hasWideListingEmbed(body: string | undefined): boolean {
	return (
		hasArticleListingEmbed(body) ||
		hasGlossarListingEmbed(body) ||
		hasTagListingEmbed(body) ||
		hasCategoryListingEmbed(body)
	);
}

export function hasBlockEmbed(body: string | undefined): boolean {
	if (!body) {
		return false;
	}
	return /\{\{block\b/.test(body);
}

/** True if body (incl. nested public blocks) needs the wide content column. */
export async function contentNeedsWideLayout(
	body: string | undefined,
): Promise<boolean> {
	if (hasWideListingEmbed(body)) {
		return true;
	}
	if (!hasBlockEmbed(body)) {
		return false;
	}
	const segments = await buildContentSegments(body);
	return segments.some(
		(segment) =>
			segment.type === "article-listing" ||
			segment.type === "glossar-listing" ||
			segment.type === "tag-listing" ||
			segment.type === "category-listing",
	);
}

function parseAttrs(raw: string): Record<string, string> {
	const out: Record<string, string> = {};
	const re = /(\w+)="([^"]*)"/g;
	for (const match of raw.matchAll(re)) {
		out[match[1] ?? ""] = match[2] ?? "";
	}
	return out;
}

/** Comma-separated slugs from embed attrs (`authors="a,b"`). */
export function parseSlugList(raw: string | undefined): string[] {
	if (!raw?.trim()) return [];
	const seen = new Set<string>();
	const out: string[] = [];
	for (const part of raw.split(",")) {
		const id = part.trim();
		if (!id || seen.has(id)) continue;
		seen.add(id);
		out.push(id);
	}
	return out;
}

function clampInt(
	value: string | undefined,
	fallback: number,
	min: number,
	max: number,
): number {
	const n = Number.parseInt(value ?? "", 10);
	if (!Number.isFinite(n)) {
		return fallback;
	}
	return Math.min(max, Math.max(min, n));
}

function clampRem(
	value: string | undefined,
	fallback: number,
	min: number,
	max: number,
): number {
	const n = Number.parseFloat((value ?? "").replace(/rem$/i, ""));
	if (!Number.isFinite(n)) {
		return fallback;
	}
	return Math.min(max, Math.max(min, n));
}

export function parseArticleListingProps(
	attrsRaw: string | undefined,
): ArticleListingEmbedProps {
	const attrs = parseAttrs(attrsRaw ?? "");
	const sort = ARTICLE_SORTS.has(attrs.sort as ArticleSort)
		? (attrs.sort as ArticleSort)
		: DEFAULT_LISTING.sort;
	const layout = attrs.layout === "list" ? "list" : "grid";
	const match =
		attrs.match === "any" || attrs.match === "all"
			? attrs.match
			: DEFAULT_LISTING.match;
	return {
		/** `0` = all published articles (no limit). */
		count: clampInt(attrs.count, DEFAULT_LISTING.count, 0, 48),
		sort,
		layout,
		columns: clampInt(attrs.columns, DEFAULT_LISTING.columns, 1, 4),
		gap: clampRem(attrs.gap, DEFAULT_LISTING.gap, 0, 8),
		show: parseArticleCardShow(attrs.show),
		imageStyle: parseArticleListingImageStyle(attrs.imageStyle),
		authors: parseSlugList(attrs.authors),
		categories: parseSlugList(attrs.categories),
		tags: parseSlugList(attrs.tags),
		match,
		linkable: parseEmbedFlagDefaultTrue(attrs.linkable),
	};
}

export function parseGlossarListingProps(
	attrsRaw: string | undefined,
): GlossarListingEmbedProps {
	const attrs = parseAttrs(attrsRaw ?? "");
	const sort = GLOSSAR_SORTS.has(attrs.sort as GlossarSort)
		? (attrs.sort as GlossarSort)
		: DEFAULT_GLOSSAR_LISTING.sort;
	const layout = attrs.layout === "grid" ? "grid" : "list";
	return {
		/** `0` = all public entries (no limit). */
		count: clampInt(attrs.count, DEFAULT_GLOSSAR_LISTING.count, 0, 48),
		sort,
		layout,
		columns: clampInt(attrs.columns, DEFAULT_GLOSSAR_LISTING.columns, 1, 4),
		gap: clampRem(attrs.gap, DEFAULT_GLOSSAR_LISTING.gap, 0, 8),
		linkable: parseEmbedFlagDefaultTrue(attrs.linkable),
	};
}

export function parseTagListingProps(
	attrsRaw: string | undefined,
): TagListingEmbedProps {
	const attrs = parseAttrs(attrsRaw ?? "");
	const sort = TAG_SORTS.has(attrs.sort as TagSort)
		? (attrs.sort as TagSort)
		: DEFAULT_TAG_LISTING.sort;
	const layout =
		attrs.layout === "list" || attrs.layout === "grid"
			? attrs.layout
			: "cloud";
	return {
		/** `0` = all used tags (no limit). */
		count: clampInt(attrs.count, DEFAULT_TAG_LISTING.count, 0, 48),
		sort,
		layout,
		columns: clampInt(attrs.columns, DEFAULT_TAG_LISTING.columns, 1, 4),
		gap: clampRem(attrs.gap, DEFAULT_TAG_LISTING.gap, 0, 8),
	};
}

export function parseCategoryListingProps(
	attrsRaw: string | undefined,
): CategoryListingEmbedProps {
	const attrs = parseAttrs(attrsRaw ?? "");
	const sort = CATEGORY_SORTS.has(attrs.sort as CategorySort)
		? (attrs.sort as CategorySort)
		: DEFAULT_CATEGORY_LISTING.sort;
	const layout =
		attrs.layout === "list" || attrs.layout === "cloud"
			? attrs.layout
			: "grid";
	return {
		/** `0` = all used categories (no limit). */
		count: clampInt(attrs.count, DEFAULT_CATEGORY_LISTING.count, 0, 48),
		sort,
		layout,
		columns: clampInt(attrs.columns, DEFAULT_CATEGORY_LISTING.columns, 1, 4),
		gap: clampRem(attrs.gap, DEFAULT_CATEGORY_LISTING.gap, 0, 8),
	};
}

export function parseSeparatorProps(
	attrsRaw: string | undefined,
): SeparatorEmbedProps {
	const attrs = parseAttrs(attrsRaw ?? "");
	return {
		height: clampInt(attrs.height, DEFAULT_SEPARATOR.height, 1, 24),
		width: clampInt(
			(attrs.width ?? "").replace(/%$/, ""),
			DEFAULT_SEPARATOR.width,
			1,
			100,
		),
		color: resolveSeparatorColor(attrs.color),
		mark: resolveSeparatorMark(attrs.mark),
		markAlign: resolveSeparatorMarkAlign(
			attrs.markAlign ?? attrs["mark-align"],
		),
		markSize: clampInt(
			attrs.markSize ?? attrs["mark-size"],
			DEFAULT_SEPARATOR.markSize,
			MIN_SEPARATOR_MARK_SIZE,
			MAX_SEPARATOR_MARK_SIZE,
		),
	};
}

export function parseSpacerProps(
	attrsRaw: string | undefined,
): SpacerEmbedProps {
	const attrs = parseAttrs(attrsRaw ?? "");
	return {
		height: clampSpacerHeight(attrs.height ?? DEFAULT_SPACER.height),
	};
}

export function parseButtonProps(
	attrsRaw: string | undefined,
): ButtonEmbedProps | undefined {
	const attrs = parseAttrs(attrsRaw ?? "");
	const label = (attrs.label ?? attrs.text ?? "").trim();
	const href = (attrs.href ?? attrs.url ?? "").trim();
	if (!label || !href) {
		return undefined;
	}
	return {
		label,
		href,
		target: resolveButtonTarget(attrs.target),
		style: resolveButtonStyle(attrs.style),
		color: resolveButtonColor(attrs.color),
		align: resolveButtonAlign(attrs.align),
	};
}

export function parseButtonGroupProps(
	attrsRaw: string | undefined,
): ButtonGroupEmbedProps | undefined {
	const attrs = parseAttrs(attrsRaw ?? "");
	const items = parseButtonGroupItems(attrs.items);
	if (items.length === 0) {
		return undefined;
	}
	return {
		items,
		layout: resolveButtonGroupLayout(attrs.layout),
		align: resolveButtonGroupAlign(attrs.align),
		fullWidthMobile: parseEmbedFlag(
			attrs.fullWidthMobile ?? attrs.fullwidthmobile,
		),
	};
}

export function parseVideoEmbedProps(
	attrsRaw: string | undefined,
): VideoEmbedProps | undefined {
	const attrs = parseAttrs(attrsRaw ?? "");
	const rawProvider = (attrs.provider ?? "").trim();
	const title = (attrs.title ?? "Video").trim() || "Video";
	const poster = (attrs.poster ?? "").trim() || undefined;

	if (isFileVideoProvider(rawProvider) || rawProvider === "r2") {
		const src = (attrs.src ?? attrs.id ?? attrs.url ?? "").trim();
		if (!src) {
			return undefined;
		}
		return { provider: "file", src, id: src, title, poster };
	}

	if (!isThirdPartyVideoProvider(rawProvider)) {
		return undefined;
	}
	const id = normalizeVideoId(rawProvider, attrs.id ?? attrs.url ?? "");
	if (!id) {
		return undefined;
	}
	return { provider: rawProvider, id, title, poster };
}

export function parseMemberVideoEmbedProps(
	attrsRaw: string | undefined,
): MemberVideoEmbedProps | undefined {
	const attrs = parseAttrs(attrsRaw ?? "");
	const src = (attrs.src ?? attrs.id ?? attrs.key ?? "").trim().replace(/^\/+/, "");
	if (!src) {
		return undefined;
	}
	const title = (attrs.title ?? "Video").trim() || "Video";
	const poster = (attrs.poster ?? "").trim() || undefined;
	return { src, title, poster };
}

function parseBlockId(attrsRaw: string | undefined): string {
	const attrs = parseAttrs(attrsRaw ?? "");
	return (attrs.id ?? attrs.slug ?? "").trim();
}

function parseAuthorSocialProps(attrsRaw: string | undefined): AuthorSocialEmbedProps {
	const attrs = parseAttrs(attrsRaw ?? "");
	return {
		author: (attrs.author ?? attrs.id ?? attrs.slug ?? "").trim(),
	};
}

/**
 * Split CMS Markdown on embed placeholders and render Markdown parts to HTML.
 * `{{block id="slug"}}` expands nested public block bodies (cycle-safe).
 */
export async function buildContentSegments(
	body: string | undefined,
	options?: { visitedBlocks?: Set<string> },
): Promise<ContentSegment[]> {
	const source = markdownSoftBreaksAsHard(body ?? "");
	if (!source.trim()) {
		return [];
	}

	const processor = await getProcessor();
	const segments: ContentSegment[] = [];
	const visitedBlocks = options?.visitedBlocks ?? new Set<string>();
	let cursor = 0;
	EMBED_LINE.lastIndex = 0;

	for (const match of source.matchAll(EMBED_LINE)) {
		const index = match.index ?? 0;
		const before = source.slice(cursor, index).trim();
		if (before) {
			const { code } = await processor.render(before);
			if (code.trim()) {
				segments.push({ type: "html", html: code });
			}
		}

		const name = match.groups?.name ?? "";
		const attrs = match.groups?.attrs ?? "";
		if (name === "tag-cloud") {
			segments.push({ type: "tag-cloud" });
		} else if (name === "tag-listing") {
			segments.push({
				type: "tag-listing",
				props: parseTagListingProps(attrs),
			});
		} else if (name === "category-listing") {
			segments.push({
				type: "category-listing",
				props: parseCategoryListingProps(attrs),
			});
		} else if (name === "contact-email") {
			segments.push({
				type: "contact-email",
				props: parseContactEmailEmbedProps(parseAttrs(attrs)),
			});
		} else if (name === "logo") {
			segments.push({
				type: "logo",
				props: parseLogoEmbedProps(attrs),
			});
		} else if (name === "repodoc") {
			const props = parseRepoDocProps(attrs);
			if (props) {
				segments.push({ type: "repodoc", props });
			}
		} else if (name === "video") {
			const props = parseVideoEmbedProps(attrs);
			if (props) {
				segments.push({ type: "video", props });
			}
		} else if (name === "member-video") {
			const props = parseMemberVideoEmbedProps(attrs);
			if (props) {
				segments.push({ type: "member-video", props });
			}
		} else if (name === "video-consent-reset") {
			segments.push({ type: "video-consent-reset" });
		} else if (name === "matomo-privacy") {
			segments.push({ type: "matomo-privacy" });
		} else if (name === "author-listing") {
			segments.push({ type: "author-listing" });
		} else if (name === "author-social") {
			segments.push({
				type: "author-social",
				props: parseAuthorSocialProps(attrs),
			});
		} else if (name === "separator") {
			segments.push({
				type: "separator",
				props: parseSeparatorProps(attrs),
			});
		} else if (name === "spacer") {
			segments.push({
				type: "spacer",
				props: parseSpacerProps(attrs),
			});
		} else if (name === "button-group") {
			const props = parseButtonGroupProps(attrs);
			if (props) {
				segments.push({ type: "button-group", props });
			}
		} else if (name === "button") {
			const props = parseButtonProps(attrs);
			if (props) {
				segments.push({ type: "button", props });
			}
		} else if (name === "grid-cards") {
			const props = parseGridCardsProps(attrs);
			if (props) {
				segments.push({ type: "grid-cards", props });
			}
		} else if (name === "article-listing") {
			segments.push({
				type: "article-listing",
				props: parseArticleListingProps(attrs),
			});
		} else if (name === "glossar-listing") {
			segments.push({
				type: "glossar-listing",
				props: parseGlossarListingProps(attrs),
			});
		} else if (name === "block") {
			const id = parseBlockId(attrs);
			if (id && !visitedBlocks.has(id)) {
				visitedBlocks.add(id);
				const block = await getPublicBlock(id);
				if (block?.body) {
					const nested = await buildContentSegments(block.body, {
						visitedBlocks,
					});
					segments.push(...nested);
				}
			}
		}

		cursor = index + match[0].length;
	}

	const after = source.slice(cursor).trim();
	if (after) {
		const { code } = await processor.render(after);
		if (code.trim()) {
			segments.push({ type: "html", html: code });
		}
	}

	return mergeContactEmailLayoutSegments(segments);
}
