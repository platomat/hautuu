import {
	matomoConfigSchema,
	type MatomoConfig,
} from "../cms/fields/site-config";
import { getSiteConfig } from "./site-config";

export type { MatomoConfig };

export function getMatomoConfig(): MatomoConfig {
	const config = getSiteConfig();
	return matomoConfigSchema.parse(config.general?.matomo ?? {});
}

export function getMatomoCode(): string {
	return getMatomoConfig().code.trim();
}

export function hasMatomoCode(): boolean {
	return getMatomoCode().length > 0;
}

/**
 * Tracking snippet for BaseLayout injection.
 * Empty in `astro dev` so local page views do not inflate Matomo stats.
 * Production builds (`import.meta.env.PROD`) inject when `matomo.code` is set.
 * Datenschutz `{{matomo-privacy}}` still uses `getMatomoCode()` / resolve helpers.
 */
export function getMatomoInjectCode(): string {
	if (!import.meta.env.PROD) return "";
	return getMatomoCode();
}

/** Normalize to origin + trailing slash, e.g. `https://matomo.example.com/`. */
export function normalizeMatomoBaseUrl(raw: string): string | undefined {
	const trimmed = raw.trim();
	if (!trimmed) return undefined;
	try {
		const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			return undefined;
		}
		return `${url.origin}/`;
	} catch {
		return undefined;
	}
}

/**
 * Derive Matomo instance base URL from the CMS tracking snippet.
 * Looks for `var u="…"`, `matomo.js` / `piwik.js`, or tracker PHP URLs.
 */
export function parseMatomoBaseUrlFromCode(code: string): string | undefined {
	const src = code.trim();
	if (!src) return undefined;

	const fromVar = src.match(
		/\b(?:var|let|const)\s+u\s*=\s*["'](https?:\/\/[^"']+)["']/i,
	);
	if (fromVar?.[1]) {
		return normalizeMatomoBaseUrl(fromVar[1]);
	}

	const fromJs = src.match(
		/(https?:\/\/[^\s"'<>]+?)\/(?:matomo|piwik)\.js(?:\?[^"'<\s]*)?/i,
	);
	if (fromJs?.[1]) {
		return normalizeMatomoBaseUrl(fromJs[1]);
	}

	const fromPhp = src.match(
		/(https?:\/\/[^\s"'<>]+?)\/(?:matomo|piwik)\.php(?:\?[^"'<\s]*)?/i,
	);
	if (fromPhp?.[1]) {
		return normalizeMatomoBaseUrl(fromPhp[1]);
	}

	return undefined;
}

export function matomoOptOutUrl(baseUrl: string): string {
	const root = baseUrl.replace(/\/+$/, "");
	return `${root}/index.php?module=CoreAdminHome&action=optOut&language=de`;
}

export function matomoHostLabel(baseUrl: string): string {
	try {
		return new URL(baseUrl).host;
	} catch {
		return baseUrl.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
	}
}

export function matomoCodeLooksCookieless(code: string): boolean {
	return /disableCookies/i.test(code);
}

export type MatomoPrivacyProps = {
	baseUrl: string;
	optOutUrl: string;
	hostLabel: string;
	cookieless: boolean;
};

/** Resolved props for Datenschutz embed; null when Matomo is not configured. */
export function resolveMatomoPrivacyProps(): MatomoPrivacyProps | null {
	const code = getMatomoCode();
	if (!code) return null;
	const baseUrl = parseMatomoBaseUrlFromCode(code);
	if (!baseUrl) return null;
	return {
		baseUrl,
		optOutUrl: matomoOptOutUrl(baseUrl),
		hostLabel: matomoHostLabel(baseUrl),
		cookieless: matomoCodeLooksCookieless(code),
	};
}
