/** Design-token keys selectable for `{{separator color="…"}}`. */
export const SEPARATOR_COLOR_KEYS = [
	"border",
	"text",
	"text-muted",
	"action",
	"action-hover",
	"action-muted",
	"surface",
	"surface-glass",
	"surface-raised",
	"bg",
	"danger",
] as const;

export type SeparatorColor = (typeof SEPARATOR_COLOR_KEYS)[number];

export const DEFAULT_SEPARATOR_COLOR: SeparatorColor = "border";

const SEPARATOR_COLOR_SET = new Set<string>(SEPARATOR_COLOR_KEYS);

/** Map token → CSS custom property used as line background. */
export const SEPARATOR_COLOR_CSS: Record<SeparatorColor, string> = {
	border: "var(--color-border)",
	text: "var(--color-text)",
	"text-muted": "var(--color-text-muted)",
	action: "var(--color-action)",
	"action-hover": "var(--color-action-hover)",
	"action-muted": "var(--color-action-muted)",
	surface: "var(--color-surface)",
	"surface-glass": "var(--color-surface-glass)",
	"surface-raised": "var(--color-surface-raised)",
	bg: "var(--color-bg)",
	danger: "var(--color-danger)",
};

/** Hex approx. for CMS preview (matches :root tokens). */
export const SEPARATOR_COLOR_PREVIEW: Record<SeparatorColor, string> = {
	border: "#2e3833",
	text: "#e8eeea",
	"text-muted": "#9aa89f",
	action: "#3dcf8e",
	"action-hover": "#56d9a0",
	"action-muted": "#1a3d2e",
	surface: "#1a211e",
	"surface-glass": "#1a211ee6",
	"surface-raised": "#232b27",
	bg: "#0f1412",
	danger: "#e57373",
};

export function resolveSeparatorColor(
	raw: string | undefined,
): SeparatorColor {
	const key = (raw ?? "").trim();
	if (SEPARATOR_COLOR_SET.has(key)) {
		return key as SeparatorColor;
	}
	return DEFAULT_SEPARATOR_COLOR;
}

/** Optional mark on the separator line (`{{separator mark="…"}}`). */
export const SEPARATOR_MARK_KEYS = ["none", "logo", "favicon"] as const;

export type SeparatorMark = (typeof SEPARATOR_MARK_KEYS)[number];

export const DEFAULT_SEPARATOR_MARK: SeparatorMark = "none";

const SEPARATOR_MARK_SET = new Set<string>(SEPARATOR_MARK_KEYS);

export function resolveSeparatorMark(raw: string | undefined): SeparatorMark {
	const key = (raw ?? "").trim().toLowerCase();
	if (SEPARATOR_MARK_SET.has(key)) {
		return key as SeparatorMark;
	}
	return DEFAULT_SEPARATOR_MARK;
}

/** Horizontal position of the mark on the line. */
export const SEPARATOR_MARK_ALIGN_KEYS = ["left", "center", "right"] as const;

export type SeparatorMarkAlign = (typeof SEPARATOR_MARK_ALIGN_KEYS)[number];

export const DEFAULT_SEPARATOR_MARK_ALIGN: SeparatorMarkAlign = "center";

const SEPARATOR_MARK_ALIGN_SET = new Set<string>(SEPARATOR_MARK_ALIGN_KEYS);

export function resolveSeparatorMarkAlign(
	raw: string | undefined,
): SeparatorMarkAlign {
	const key = (raw ?? "").trim().toLowerCase();
	if (SEPARATOR_MARK_ALIGN_SET.has(key)) {
		return key as SeparatorMarkAlign;
	}
	return DEFAULT_SEPARATOR_MARK_ALIGN;
}

/** Default / clamp for `markSize` (px). */
export const DEFAULT_SEPARATOR_MARK_SIZE = 24;
export const MIN_SEPARATOR_MARK_SIZE = 8;
export const MAX_SEPARATOR_MARK_SIZE = 120;
