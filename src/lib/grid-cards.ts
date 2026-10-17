import {
	DEFAULT_BUTTON_ALIGN,
	DEFAULT_BUTTON_COLOR,
	DEFAULT_BUTTON_STYLE,
	DEFAULT_BUTTON_TARGET,
	parseEmbedFlag,
	resolveButtonAlign,
	resolveButtonColor,
	resolveButtonStyle,
	resolveButtonTarget,
	type ButtonAlign,
	type ButtonColor,
	type ButtonStyle,
	type ButtonTarget,
} from "./button";
import {
	resolveSeparatorColor,
	SEPARATOR_COLOR_CSS,
	type SeparatorColor,
} from "./separator";

export type GridCardAlignX = "left" | "center" | "right";
export type GridCardAlignY = "top" | "center" | "bottom";
export type GridCardBgFit = "cover" | "contain";

/** Same tokens as article-listing `imageStyle` (kept local to avoid import cycles). */
export type GridCardImageStyle =
	| "top-cover"
	| "top-bleed"
	| "bottom-cover"
	| "bottom-bleed"
	| "left-cover"
	| "left-bleed"
	| "right-cover"
	| "right-bleed";

const IMAGE_STYLES = new Set<string>([
	"top-cover",
	"top-bleed",
	"bottom-cover",
	"bottom-bleed",
	"left-cover",
	"left-bleed",
	"right-cover",
	"right-bleed",
]);

function resolveImageStyle(raw: unknown): GridCardImageStyle {
	const key = String(raw ?? "").trim();
	return IMAGE_STYLES.has(key) ? (key as GridCardImageStyle) : "top-cover";
}

/** Same fields as `{{button …}}` / CmsButton (nested under each grid card). */
export type GridCardButton = {
	label: string;
	href: string;
	target: ButtonTarget;
	style: ButtonStyle;
	color: ButtonColor;
	align: ButtonAlign;
};

export type GridCard = {
	borderColor: SeparatorColor;
	/** Border width in px (0 = none). */
	borderWidth: number;
	/** Corner radius in px. */
	borderRadius: number;
	/** Optional fill from the design palette; empty = transparent. */
	bgColor: SeparatorColor | "";
	/** Optional background image path (`/assets/…`). */
	bgImage: string;
	bgFit: GridCardBgFit;
	alignX: GridCardAlignX;
	alignY: GridCardAlignY;
	/** Content image path. */
	image: string;
	imageStyle: GridCardImageStyle;
	title: string;
	subtitle: string;
	/** Plain text; newlines become line breaks. */
	text: string;
	button: GridCardButton;
};

export const DEFAULT_GRID_CARD_BUTTON: GridCardButton = {
	label: "",
	href: "",
	target: DEFAULT_BUTTON_TARGET,
	style: DEFAULT_BUTTON_STYLE,
	color: DEFAULT_BUTTON_COLOR,
	align: DEFAULT_BUTTON_ALIGN,
};

export type GridCardsEmbedProps = {
	/** Columns ≥1024px. */
	colsDesktop: number;
	/** Columns 680–1023px. */
	colsTablet: number;
	/** Columns &lt;680px. */
	colsMobile: number;
	/** Gap between cards, in rem. */
	gap: number;
	/** Stretch a lone last-row card across the full row. */
	stretchLast: boolean;
	cards: GridCard[];
};

export const DEFAULT_GRID_CARD: GridCard = {
	borderColor: "border",
	borderWidth: 1,
	borderRadius: 6,
	bgColor: "surface",
	bgImage: "",
	bgFit: "cover",
	alignX: "left",
	alignY: "top",
	image: "",
	imageStyle: "top-cover",
	title: "",
	subtitle: "",
	text: "",
	button: { ...DEFAULT_GRID_CARD_BUTTON },
};

/**
 * Nested `button` object, or legacy flat `buttonLabel` / `buttonHref` / `buttonTarget`.
 * Pass the whole card object (not only the button field).
 */
export function normalizeGridCardButton(
	cardObj: Record<string, unknown>,
): GridCardButton {
	const nested = cardObj.button;
	if (nested && typeof nested === "object" && !Array.isArray(nested)) {
		const b = nested as Record<string, unknown>;
		return {
			label: String(b.label ?? "").trim(),
			href: String(b.href ?? "").trim(),
			target: resolveButtonTarget(String(b.target ?? DEFAULT_BUTTON_TARGET)),
			style: resolveButtonStyle(String(b.style ?? DEFAULT_BUTTON_STYLE)),
			color: resolveButtonColor(String(b.color ?? DEFAULT_BUTTON_COLOR)),
			align: resolveButtonAlign(String(b.align ?? DEFAULT_BUTTON_ALIGN)),
		};
	}
	return {
		label: String(cardObj.buttonLabel ?? "").trim(),
		href: String(cardObj.buttonHref ?? "").trim(),
		target: resolveButtonTarget(
			String(cardObj.buttonTarget ?? DEFAULT_BUTTON_TARGET),
		),
		style: resolveButtonStyle(
			String(cardObj.buttonStyle ?? DEFAULT_BUTTON_STYLE),
		),
		color: resolveButtonColor(
			String(cardObj.buttonColor ?? DEFAULT_BUTTON_COLOR),
		),
		align: resolveButtonAlign(
			String(cardObj.buttonAlign ?? DEFAULT_BUTTON_ALIGN),
		),
	};
}

const ALIGN_X = new Set<string>(["left", "center", "right"]);
const ALIGN_Y = new Set<string>(["top", "center", "bottom"]);
const BG_FIT = new Set<string>(["cover", "contain"]);

function clampInt(
	raw: unknown,
	fallback: number,
	min: number,
	max: number,
): number {
	const n =
		typeof raw === "number"
			? raw
			: typeof raw === "string"
				? Number.parseInt(raw, 10)
				: Number.NaN;
	if (!Number.isFinite(n)) return fallback;
	return Math.min(max, Math.max(min, Math.round(n)));
}

function clampFloat(
	raw: unknown,
	fallback: number,
	min: number,
	max: number,
): number {
	const n =
		typeof raw === "number"
			? raw
			: typeof raw === "string"
				? Number.parseFloat(raw)
				: Number.NaN;
	if (!Number.isFinite(n)) return fallback;
	return Math.min(max, Math.max(min, n));
}

function resolveAlignX(raw: unknown): GridCardAlignX {
	const key = String(raw ?? "").trim();
	return ALIGN_X.has(key) ? (key as GridCardAlignX) : "left";
}

function resolveAlignY(raw: unknown): GridCardAlignY {
	const key = String(raw ?? "").trim();
	return ALIGN_Y.has(key) ? (key as GridCardAlignY) : "top";
}

function resolveBgFit(raw: unknown): GridCardBgFit {
	const key = String(raw ?? "").trim();
	return BG_FIT.has(key) ? (key as GridCardBgFit) : "cover";
}

function resolveBgColor(raw: unknown): SeparatorColor | "" {
	const key = String(raw ?? "").trim();
	if (!key || key === "none" || key === "transparent") return "";
	return resolveSeparatorColor(key);
}

/** Normalize one CMS / JSON card object. */
export function normalizeGridCard(raw: unknown): GridCard | null {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
	const obj = raw as Record<string, unknown>;
	const title = String(obj.title ?? "").trim();
	const subtitle = String(obj.subtitle ?? "").trim();
	const text = String(obj.text ?? "").trim();
	const image = String(obj.image ?? "").trim();
	const button = normalizeGridCardButton(obj);
	const bgImage = String(obj.bgImage ?? "").trim();
	// Drop empty cards (no visible content).
	if (
		!title &&
		!subtitle &&
		!text &&
		!image &&
		!button.label &&
		!bgImage
	) {
		return null;
	}
	return {
		borderColor: resolveSeparatorColor(String(obj.borderColor ?? "")),
		borderWidth: clampInt(obj.borderWidth, 1, 0, 16),
		borderRadius: clampInt(obj.borderRadius, 6, 0, 64),
		bgColor: resolveBgColor(obj.bgColor),
		bgImage,
		bgFit: resolveBgFit(obj.bgFit),
		alignX: resolveAlignX(obj.alignX),
		alignY: resolveAlignY(obj.alignY),
		image,
		imageStyle: resolveImageStyle(obj.imageStyle),
		title,
		subtitle,
		text,
		button,
	};
}

export function encodeGridCardsPayload(cards: GridCard[]): string {
	return encodeURIComponent(JSON.stringify(cards));
}

export function decodeGridCardsPayload(raw: string | undefined): GridCard[] {
	if (!raw?.trim()) return [];
	try {
		const decoded = decodeURIComponent(raw.trim());
		const parsed = JSON.parse(decoded) as unknown;
		if (!Array.isArray(parsed)) return [];
		return parsed
			.map((item) => normalizeGridCard(item))
			.filter((card): card is GridCard => card !== null)
			.slice(0, 12);
	} catch {
		return [];
	}
}

/** Parse `{{grid-cards …}}` attribute string into props. */
export function parseGridCardsProps(
	attrsRaw: string | undefined,
): GridCardsEmbedProps | null {
	const attrs: Record<string, string> = {};
	const re = /(\w+)="([^"]*)"/g;
	let match: RegExpExecArray | null;
	while ((match = re.exec(attrsRaw ?? "")) !== null) {
		attrs[match[1]] = match[2];
	}
	const cards = decodeGridCardsPayload(attrs.cards);
	if (cards.length === 0) return null;
	return {
		colsDesktop: clampInt(attrs.colsDesktop ?? attrs.cols, 3, 1, 4),
		colsTablet: clampInt(attrs.colsTablet, 2, 1, 4),
		colsMobile: clampInt(attrs.colsMobile, 1, 1, 2),
		gap: clampFloat(attrs.gap, 1.25, 0, 8),
		stretchLast: parseEmbedFlag(attrs.stretchLast),
		cards,
	};
}

/** CSS custom property for a palette token (or transparent). */
export function gridCardColorCss(color: SeparatorColor | ""): string {
	if (!color) return "transparent";
	return SEPARATOR_COLOR_CSS[color];
}

/** Whether the last card is alone in its row for a given column count. */
export function isOrphanLastCard(count: number, cols: number): boolean {
	if (count <= 0 || cols <= 1) return false;
	return count % cols === 1;
}

/** Escape text for HTML text nodes; preserve newlines as <br>. */
export function gridCardTextToHtml(text: string): string {
	const escaped = text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
	return escaped.replace(/\r\n|\r|\n/g, "<br />");
}
