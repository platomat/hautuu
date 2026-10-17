import { z } from "astro/zod";

/**
 * Per-entry HTML snippets (pages / articles / …).
 * Same idea as Allgemein → Site-Code; injected after global code in BaseLayout.
 */
export const entrySiteCodeSchema = z
	.object({
		/** Raw HTML before `</head>` (after global Site-Code). */
		headCode: z.string().optional(),
		/** Raw HTML before `</body>` (after global Site-Code / SiteFooter). */
		footerCode: z.string().optional(),
	})
	.optional();

export type EntrySiteCode = z.infer<typeof entrySiteCodeSchema>;

type EntryWithSiteCode = {
	siteCode?: EntrySiteCode;
	/** Legacy flat fields (pre-grouping). */
	headCode?: string;
	footerCode?: string;
};

/** Resolve nested or legacy flat head/footer code for BaseLayout props. */
export function resolveEntrySiteCode(data: EntryWithSiteCode): {
	headCode?: string;
	footerCode?: string;
} {
	const head =
		data.siteCode?.headCode?.trim() || data.headCode?.trim() || undefined;
	const footer =
		data.siteCode?.footerCode?.trim() ||
		data.footerCode?.trim() ||
		undefined;
	return {
		headCode: head || undefined,
		footerCode: footer || undefined,
	};
}

/**
 * Astro content preprocess: nest legacy `headCode` / `footerCode` into `siteCode`.
 */
export function preprocessEntrySiteCode(data: unknown): unknown {
	if (!data || typeof data !== "object" || Array.isArray(data)) {
		return data;
	}
	const d = { ...(data as Record<string, unknown>) };
	const flatHead =
		typeof d.headCode === "string" ? d.headCode.trim() : undefined;
	const flatFooter =
		typeof d.footerCode === "string" ? d.footerCode.trim() : undefined;
	const existing =
		d.siteCode && typeof d.siteCode === "object" && !Array.isArray(d.siteCode)
			? { ...(d.siteCode as Record<string, unknown>) }
			: {};
	if (flatHead || flatFooter || Object.keys(existing).length > 0) {
		d.siteCode = {
			...existing,
			...(flatHead && !existing.headCode ? { headCode: flatHead } : {}),
			...(flatFooter && !existing.footerCode
				? { footerCode: flatFooter }
				: {}),
		};
	}
	delete d.headCode;
	delete d.footerCode;
	return d;
}
