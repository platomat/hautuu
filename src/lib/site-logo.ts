import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { ImageMetadata } from "astro";
import { resolveCmsImage } from "./cms-image";
import { getSiteConfig } from "./site-config";

export type LogoSlot = "header" | "headerSticky" | "footer";

export type ResolvedLogo =
	| { kind: "svg"; html: string }
	| { kind: "image"; meta: ImageMetadata };

/** Media-library fallback when CMS logo fields are empty. */
const DEFAULT_LOGO_FS = path.join(
	process.cwd(),
	"src",
	"assets",
	"logo-mark.svg",
);

/** CMS path for a slot (before sticky/footer fallback). */
export function getLogoCmsPath(slot: LogoSlot): string | undefined {
	const logos = getSiteConfig().general?.logos;
	if (!logos) return undefined;
	const raw =
		slot === "header"
			? logos.header
			: slot === "headerSticky"
				? logos.headerSticky
				: logos.footer;
	const trimmed = raw?.trim();
	return trimmed || undefined;
}

/** Effective CMS path: sticky/footer fall back to header. */
export function resolveLogoCmsPath(slot: LogoSlot): string | undefined {
	if (slot === "header") {
		return getLogoCmsPath("header");
	}
	return getLogoCmsPath(slot) || getLogoCmsPath("header");
}

function cmsPathToFs(cmsPath: string): string | undefined {
	const raw = cmsPath.trim();
	if (raw.startsWith("/assets/")) {
		return path.join(process.cwd(), "src", raw.slice(1));
	}
	if (raw.startsWith("src/assets/")) {
		return path.join(process.cwd(), raw);
	}
	return undefined;
}

function prepareSvgHtml(raw: string): string {
	return raw
		.replace(/<\?xml[^?]*\?>/gi, "")
		.replace(/<!--[\s\S]*?-->/g, "")
		.replace(/<script[\s\S]*?<\/script>/gi, "")
		.trim();
}

function readDefaultSvg(): ResolvedLogo {
	const html = prepareSvgHtml(readFileSync(DEFAULT_LOGO_FS, "utf8"));
	return { kind: "svg", html };
}

/**
 * Resolve a logo from an explicit CMS media path.
 * Missing/invalid path → default mark (same as empty General → Logos).
 */
export function resolveLogoFromCmsPath(cmsPath: string | undefined): ResolvedLogo {
	const trimmed = cmsPath?.trim();
	if (!trimmed) {
		return readDefaultSvg();
	}

	const lower = trimmed.toLowerCase();
	if (lower.endsWith(".svg")) {
		const fsPath = cmsPathToFs(trimmed);
		if (fsPath && existsSync(fsPath)) {
			return {
				kind: "svg",
				html: prepareSvgHtml(readFileSync(fsPath, "utf8")),
			};
		}
		console.warn(`[site-logo] SVG not found: ${trimmed}`);
		return readDefaultSvg();
	}

	const meta = resolveCmsImage(trimmed);
	if (meta) {
		return { kind: "image", meta };
	}

	console.warn(`[site-logo] image not found: ${trimmed}`);
	return readDefaultSvg();
}

/**
 * Resolve logo for header / sticky header / footer.
 * SVGs are inlined as authored; other formats use ImageMetadata.
 */
export function resolveLogo(slot: LogoSlot): ResolvedLogo {
	return resolveLogoFromCmsPath(resolveLogoCmsPath(slot));
}

/** True when sticky logo differs from the rest-state header logo. */
export function stickyLogoDiffers(): boolean {
	const sticky = getLogoCmsPath("headerSticky");
	if (!sticky) return false;
	const header = getLogoCmsPath("header");
	return sticky !== header;
}
