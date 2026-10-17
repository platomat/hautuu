import { getCollection, type CollectionEntry } from "astro:content";
import type { MenuItem, MenuLeaf } from "../cms/fields/menu";
import {
	getPageHref,
	getPublicPages,
	indexPagesById,
	isPagePublic,
	type PageEntry,
} from "./pages";

export type MenuEntry = CollectionEntry<"menus">;

export type ResolvedMenuLink = {
	label: string;
	href: string;
	external: boolean;
	/** Sanitized CSS class tokens for the `<a>` element. */
	cssClasses: string[];
};

export type ResolvedMenuItem = ResolvedMenuLink & {
	children: ResolvedMenuLink[];
};

/** Well-known menu ids (filename / collection id). */
export const MENU_MAIN = "main";

/**
 * Optional CMS menu relation: empty / `none` = no menu.
 * Do not fall back to slot defaults (cleared fields are omitted from JSON).
 */
export function resolveOptionalMenuId(
	raw: string | undefined | null,
): string | null {
	const id = (raw ?? "").trim();
	if (!id || id === "none") {
		return null;
	}
	return id;
}
export const MENU_FOOTER_LEGAL = "footer-legal";
/** Brand strip above copyright (Design → Footer → Brand → menu slug). */
export const MENU_FOOTER = "footer";

/** Split and keep only safe CSS class identifiers (WordPress-style input). */
export function parseCssClasses(value?: string): string[] {
	if (!value?.trim()) {
		return [];
	}
	return value
		.trim()
		.split(/\s+/)
		.filter((token) => /^[a-zA-Z_][\w-]*$/.test(token));
}

export async function getMenuEntry(
	id: string,
): Promise<MenuEntry | undefined> {
	const menus = await getCollection("menus");
	return menus.find((menu) => menu.id === id);
}

function resolveUrlLink(
	label: string,
	hrefRaw: string | undefined,
	cssClasses: string[],
): ResolvedMenuLink | null {
	const href = hrefRaw?.trim();
	if (!href) {
		return null;
	}
	const external = /^https?:\/\//i.test(href);
	return { label, href, external, cssClasses };
}

function resolveLeafHref(
	item: MenuLeaf,
	pagesById: Map<string, PageEntry>,
): ResolvedMenuLink | null {
	const label = item.label?.trim();
	if (!label) {
		return null;
	}

	const cssClasses = parseCssClasses(item.cssClass);
	const pageId = item.page?.trim();
	const urlHref = item.url?.trim();

	if (item.linkType === "url") {
		return resolveUrlLink(label, urlHref, cssClasses);
	}

	if (pageId) {
		const page = pagesById.get(pageId);
		if (page && isPagePublic(page)) {
			return {
				label,
				href: getPageHref(page, pagesById),
				external: false,
				cssClasses,
			};
		}
	}

	// CMS default linkType is `page`; if no usable page is set, still show a URL.
	return resolveUrlLink(label, urlHref, cssClasses);
}

/** Resolve menu items to hrefs; drop broken page links. */
export function resolveMenuItems(
	items: MenuItem[] | undefined,
	pages: PageEntry[],
): ResolvedMenuItem[] {
	const pagesById = indexPagesById(pages);
	const resolved: ResolvedMenuItem[] = [];

	for (const item of items ?? []) {
		const link = resolveLeafHref(item, pagesById);
		if (!link) {
			continue;
		}
		const children = (item.children ?? [])
			.map((child) => resolveLeafHref(child, pagesById))
			.filter((child): child is ResolvedMenuLink => child !== null);
		resolved.push({ ...link, children });
	}

	return resolved;
}

export async function getResolvedMenu(
	id: string,
	pages?: PageEntry[],
): Promise<ResolvedMenuItem[]> {
	const menu = await getMenuEntry(id);
	if (!menu) {
		return [];
	}
	const allPages = pages ?? (await getPublicPages());
	return resolveMenuItems(menu.data.items, allPages);
}
