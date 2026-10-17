/**
 * Sveltia editor blocks for page/article Markdown.
 * Inserted via the editor toolbar (like images); stored as {{…}} markers.
 */
(function registerHautuuEditorComponents() {
	if (typeof CMS === "undefined" || typeof CMS.registerEditorComponent !== "function") {
		console.warn("[hautuu] CMS.registerEditorComponent unavailable");
		return;
	}

	function parseAttrs(raw) {
		const out = {};
		const re = /(\w+)="([^"]*)"/g;
		let match;
		while ((match = re.exec(raw || "")) !== null) {
			out[match[1]] = match[2];
		}
		return out;
	}

	/** Canonical card-field order (FE layout is fixed; CMS is checkbox-only). */
	const ARTICLE_CARD_SHOW_ORDER = [
		"displayImage",
		"displayTitle",
		"displayIntro",
		"displayCategories",
		"displayTags",
		"displayAuthors",
		"displayDate",
		"displayReadingTime",
	];

	const ARTICLE_CARD_SHOW_DEFAULT = [
		"displayTitle",
		"displayIntro",
		"displayCategories",
		"displayTags",
		"displayDate",
		"displayReadingTime",
	];

	const ARTICLE_CARD_SHOW_SET = new Set(ARTICLE_CARD_SHOW_ORDER);

	function normalizeArticleCardShow(show) {
		const selected = new Set(
			(Array.isArray(show) ? show : String(show || "").split(/[,\s]+/))
				.map((part) => String(part).trim())
				.filter((part) => ARTICLE_CARD_SHOW_SET.has(part)),
		);
		return ARTICLE_CARD_SHOW_ORDER.filter((field) => selected.has(field));
	}

	CMS.registerEditorComponent({
		id: "article-listing",
		label: "Artikel-Listing",
		icon: "newspaper",
		fields: [
			{
				name: "count",
				label: "Anzahl",
				widget: "number",
				value_type: "int",
				default: 3,
				min: 0,
				max: 48,
				hint: "0 = alle veröffentlichten Artikel.",
			},
			{
				name: "sort",
				label: "Sortierung",
				widget: "select",
				default: "newest",
				options: [
					{ label: "Neueste zuerst", value: "newest" },
					{ label: "Älteste zuerst", value: "oldest" },
					{ label: "Titel A–Z", value: "title-asc" },
					{ label: "Titel Z–A", value: "title-desc" },
				],
			},
			{
				name: "layout",
				label: "Layout",
				widget: "select",
				default: "grid",
				options: [
					{ label: "Grid (Karten)", value: "grid" },
					{ label: "Liste", value: "list" },
				],
			},
			{
				name: "columns",
				label: "Spalten (nur Grid)",
				widget: "number",
				value_type: "int",
				default: 3,
				min: 1,
				max: 4,
				hint: "Wird bei Layout „Liste“ ignoriert.",
			},
			{
				name: "gap",
				label: "Abstand (rem)",
				widget: "number",
				value_type: "float",
				default: 1.25,
				min: 0,
				max: 8,
				step: 0.25,
				hint: "Abstand zwischen Karten bzw. Listeneinträgen.",
			},
			{
				name: "show",
				label: "Felder auf der Karte",
				widget: "select",
				multiple: true,
				/** Keep checkboxes (not tag UI): tags allow drag-reorder that FE ignores. */
				dropdown_threshold: 20,
				default: [
					"displayTitle",
					"displayIntro",
					"displayCategories",
					"displayTags",
					"displayDate",
					"displayReadingTime",
				],
				options: [
					{ label: "Vorschaubild", value: "displayImage" },
					{ label: "Titel", value: "displayTitle" },
					{ label: "Intro", value: "displayIntro" },
					{ label: "Kategorien", value: "displayCategories" },
					{ label: "Tags", value: "displayTags" },
					{ label: "Autoren", value: "displayAuthors" },
					{ label: "Datum", value: "displayDate" },
					{ label: "Lesezeit", value: "displayReadingTime" },
				],
				hint: "Nur an/aus per Checkbox (`display*`). Feste Kartenreihenfolge: Vorschaubild, Titel, Intro, Kategorien | Tags, Autoren, Datum · Lesezeit. Vorschaubild = Titelbild, sonst Seitenhintergrund.",
			},
			{
				name: "imageStyle",
				label: "Bilddarstellung",
				widget: "select",
				default: "top-cover",
				options: [
					{ label: "Oben · mit Rand", value: "top-cover" },
					{ label: "Oben · randlos", value: "top-bleed" },
					{ label: "Unten · mit Rand", value: "bottom-cover" },
					{ label: "Unten · randlos", value: "bottom-bleed" },
					{ label: "Links · mit Rand", value: "left-cover" },
					{ label: "Links · randlos", value: "left-bleed" },
					{ label: "Rechts · mit Rand", value: "right-cover" },
					{ label: "Rechts · randlos", value: "right-bleed" },
				],
				hint: "Nur wirksam, wenn „Vorschaubild“ an ist. Oben/Unten = volle Breite; Links/Rechts = Bild seitlich, Titel und Meta daneben. Randlos = Bild bis an den Kartenrand.",
			},
			{
				/**
				 * Distinct from card `show` values (`displayAuthors`, …) and from embed
				 * filter attrs written as `authors=` / `categories=` / `tags=`.
				 */
				name: "filterAuthors",
				label: "Nur Autoren",
				widget: "relation",
				collection: "authors",
				value_field: "{{slug}}",
				search_fields: ["title"],
				display_fields: ["title"],
				multiple: true,
				required: false,
				hint: "Leer = alle. Mehrere: Artikel mit mindestens einem dieser Autoren.",
			},
			{
				name: "filterCategories",
				label: "Nur Kategorien",
				widget: "relation",
				collection: "categories",
				value_field: "{{slug}}",
				search_fields: ["title"],
				display_fields: ["title"],
				multiple: true,
				required: false,
				hint: "Leer = alle. Mehrere: Artikel mit mindestens einer dieser Kategorien.",
			},
			{
				name: "filterTags",
				label: "Nur Tags",
				widget: "relation",
				collection: "tags",
				value_field: "{{slug}}",
				search_fields: ["title"],
				display_fields: ["title"],
				multiple: true,
				required: false,
				hint: "Leer = alle. Mehrere: Artikel mit mindestens einem dieser Tags.",
			},
			{
				name: "match",
				label: "Filter-Verknüpfung",
				widget: "select",
				default: "all",
				options: [
					{ label: "Alle Bedingungen (UND)", value: "all" },
					{ label: "Eine Bedingung (ODER)", value: "any" },
				],
				hint: "Nur wenn mehrere Filterarten gesetzt sind (Autoren und/oder Kategorien und/oder Tags).",
			},
			{
				name: "linkable",
				label: "Zur Artikelseite verlinken",
				widget: "boolean",
				default: true,
				hint: "Aus: Karte ohne Link zur Einzelansicht (Taxonomie-Links bleiben).",
			},
		],
		pattern: /^\{\{article-listing(?<attrs>[^}]*)\}\}\s*$/m,
		fromBlock: (match) => {
			const attrs = parseAttrs(match?.groups?.attrs || "");
			const showDefault = ARTICLE_CARD_SHOW_DEFAULT.join(",");
			const splitList = (raw) =>
				(raw || "")
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean);
			const showParsed = normalizeArticleCardShow(attrs.show || showDefault);
			const legacyImage = { cover: "top-cover", bleed: "top-bleed", aside: "left-cover" };
			const allowedImage = {
				"top-cover": 1,
				"top-bleed": 1,
				"bottom-cover": 1,
				"bottom-bleed": 1,
				"left-cover": 1,
				"left-bleed": 1,
				"right-cover": 1,
				"right-bleed": 1,
			};
			const rawImage = attrs.imageStyle || "top-cover";
			const imageStyle =
				allowedImage[rawImage]
					? rawImage
					: legacyImage[rawImage] || "top-cover";
			const linkableRaw = (attrs.linkable || "").toLowerCase();
			const linkable =
				linkableRaw !== "false" &&
				linkableRaw !== "0" &&
				linkableRaw !== "no";
			return {
				count: attrs.count !== undefined && attrs.count !== "" ? attrs.count : "3",
				sort: attrs.sort || "newest",
				layout: attrs.layout || "grid",
				columns: attrs.columns || "3",
				gap: attrs.gap || "1.25",
				show: showParsed.length > 0 ? showParsed : showDefault.split(","),
				imageStyle,
				filterAuthors: splitList(attrs.authors),
				filterCategories: splitList(attrs.categories),
				filterTags: splitList(attrs.tags),
				match: attrs.match === "any" ? "any" : "all",
				linkable,
			};
		},
		toBlock: ({
			count = 3,
			sort = "newest",
			layout = "grid",
			columns = 3,
			gap = 1.25,
			show = ARTICLE_CARD_SHOW_DEFAULT,
			imageStyle = "top-cover",
			filterAuthors = [],
			filterCategories = [],
			filterTags = [],
			match = "all",
			linkable = true,
		}) => {
			const showNormalized = normalizeArticleCardShow(show);
			const showAttr = (
				showNormalized.length > 0
					? showNormalized
					: ARTICLE_CARD_SHOW_DEFAULT
			).join(",");
			const listAttr = (value) =>
				(Array.isArray(value) ? value : String(value || "").split(","))
					.map((s) => String(s).trim())
					.filter(Boolean)
					.join(",");
			const authorsAttr = listAttr(filterAuthors);
			const categoriesAttr = listAttr(filterCategories);
			const tagsAttr = listAttr(filterTags);
			const parts = [
				`count="${count}"`,
				`sort="${sort}"`,
				`layout="${layout}"`,
				`columns="${columns}"`,
				`gap="${gap}"`,
				`show="${showAttr}"`,
			];
			if (imageStyle && imageStyle !== "top-cover") {
				parts.push(`imageStyle="${imageStyle}"`);
			}
			if (authorsAttr) parts.push(`authors="${authorsAttr}"`);
			if (categoriesAttr) parts.push(`categories="${categoriesAttr}"`);
			if (tagsAttr) parts.push(`tags="${tagsAttr}"`);
			if ((authorsAttr || categoriesAttr || tagsAttr) && match === "any") {
				parts.push(`match="any"`);
			}
			if (linkable === false || linkable === "false") {
				parts.push(`linkable="false"`);
			}
			return `{{article-listing ${parts.join(" ")}}}`;
		},
		toPreview: ({
			count = 3,
			sort = "newest",
			layout = "grid",
			columns = 3,
			gap = 1.25,
			show = ARTICLE_CARD_SHOW_DEFAULT,
			imageStyle = "top-cover",
			filterAuthors = [],
			filterCategories = [],
			filterTags = [],
			match = "all",
			linkable = true,
		}) => {
			const showNormalized = normalizeArticleCardShow(show);
			const showLabel = (
				showNormalized.length > 0
					? showNormalized
					: ARTICLE_CARD_SHOW_DEFAULT
			).join(", ");
			const listLabel = (value) =>
				(Array.isArray(value) ? value : String(value || "").split(","))
					.map((s) => String(s).trim())
					.filter(Boolean)
					.join(", ");
			const filterBits = [];
			const authorsLabel = listLabel(filterAuthors);
			const categoriesLabel = listLabel(filterCategories);
			const tagsLabel = listLabel(filterTags);
			if (authorsLabel) filterBits.push(`Autoren ${authorsLabel}`);
			if (categoriesLabel) filterBits.push(`Kategorien ${categoriesLabel}`);
			if (tagsLabel) filterBits.push(`Tags ${tagsLabel}`);
			if (filterBits.length > 1) {
				filterBits.push(match === "any" ? "ODER" : "UND");
			}
			const filterSuffix = filterBits.length
				? ` · Filter: ${filterBits.join(" · ")}`
				: "";
			const imageLabels = {
				"top-cover": "Bild oben",
				"top-bleed": "Bild oben randlos",
				"bottom-cover": "Bild unten",
				"bottom-bleed": "Bild unten randlos",
				"left-cover": "Bild links",
				"left-bleed": "Bild links randlos",
				"right-cover": "Bild rechts",
				"right-bleed": "Bild rechts randlos",
			};
			const hasImage = showNormalized.includes("displayImage");
			const imageSuffix = hasImage
				? ` · ${imageLabels[imageStyle] || imageStyle}`
				: "";
			const linkSuffix =
				linkable === false || linkable === "false" ? " · ohne Link" : "";
			return `<div style="padding:0.75rem 1rem;border:1px dashed #2e3833;border-radius:6px;color:#9aa89f;font-size:0.9rem">Artikel-Listing · ${count === 0 || count === "0" ? "alle" : count} · ${sort} · ${layout}${layout === "grid" ? ` · ${columns} Spalten` : ""} · gap ${gap}rem · ${showLabel}${imageSuffix}${filterSuffix}${linkSuffix}</div>`;
		},
	});

CMS.registerEditorComponent({
		id: "category-listing",
		label: "Kategorie-Listing",
		icon: "folder",
		fields: [
			{
				name: "count",
				label: "Anzahl",
				widget: "number",
				value_type: "int",
				default: 0,
				min: 0,
				max: 48,
				hint: "0 = alle genutzten Kategorien.",
			},
			{
				name: "sort",
				label: "Sortierung",
				widget: "select",
				default: "title-asc",
				options: [
					{ label: "Titel A–Z", value: "title-asc" },
					{ label: "Titel Z–A", value: "title-desc" },
					{ label: "Häufigste zuerst", value: "most-used" },
				],
			},
			{
				name: "layout",
				label: "Layout",
				widget: "select",
				default: "grid",
				options: [
					{ label: "Grid (Karten)", value: "grid" },
					{ label: "Liste", value: "list" },
					{ label: "Wolke", value: "cloud" },
				],
			},
			{
				name: "columns",
				label: "Spalten (nur Grid)",
				widget: "number",
				value_type: "int",
				default: 3,
				min: 1,
				max: 4,
				hint: "Wird bei Layout „Wolke“ und „Liste“ ignoriert.",
			},
			{
				name: "gap",
				label: "Abstand (rem)",
				widget: "number",
				value_type: "float",
				default: 1.25,
				min: 0,
				max: 8,
				step: 0.25,
			},
		],
		pattern: /^\{\{category-listing(?<attrs>[^}]*)\}\}\s*$/m,
		fromBlock: (match) => {
			const attrs = parseAttrs(match?.groups?.attrs || "");
			return {
				count: attrs.count !== undefined && attrs.count !== "" ? attrs.count : "0",
				sort: attrs.sort || "title-asc",
				layout: attrs.layout || "grid",
				columns: attrs.columns || "3",
				gap: attrs.gap || "1.25",
			};
		},
		toBlock: ({
			count = 0,
			sort = "title-asc",
			layout = "grid",
			columns = 3,
			gap = 1.25,
		}) =>
			`{{category-listing count="${count}" sort="${sort}" layout="${layout}" columns="${columns}" gap="${gap}"}}`,
		toPreview: ({
			count = 0,
			sort = "title-asc",
			layout = "grid",
			columns = 3,
			gap = 1.25,
		}) =>
			`<div style="padding:0.75rem 1rem;border:1px dashed #2e3833;border-radius:6px;color:#9aa89f;font-size:0.9rem">Kategorie-Listing · ${count === 0 || count === "0" ? "alle" : count} · ${sort} · ${layout}${layout === "grid" ? ` · ${columns} Spalten` : ""} · gap ${gap}rem</div>`,
	});

CMS.registerEditorComponent({
		id: "tag-listing",
		label: "Tag-Listing",
		icon: "sell",
		fields: [
			{
				name: "count",
				label: "Anzahl",
				widget: "number",
				value_type: "int",
				default: 0,
				min: 0,
				max: 48,
				hint: "0 = alle genutzten Tags.",
			},
			{
				name: "sort",
				label: "Sortierung",
				widget: "select",
				default: "title-asc",
				options: [
					{ label: "Titel A–Z", value: "title-asc" },
					{ label: "Titel Z–A", value: "title-desc" },
					{ label: "Häufigste zuerst", value: "most-used" },
				],
			},
			{
				name: "layout",
				label: "Layout",
				widget: "select",
				default: "cloud",
				options: [
					{ label: "Wolke", value: "cloud" },
					{ label: "Liste", value: "list" },
					{ label: "Grid (Karten)", value: "grid" },
				],
			},
			{
				name: "columns",
				label: "Spalten (nur Grid)",
				widget: "number",
				value_type: "int",
				default: 3,
				min: 1,
				max: 4,
				hint: "Wird bei Layout „Wolke“ und „Liste“ ignoriert.",
			},
			{
				name: "gap",
				label: "Abstand (rem)",
				widget: "number",
				value_type: "float",
				default: 1.25,
				min: 0,
				max: 8,
				step: 0.25,
			},
		],
		pattern: /^\{\{tag-listing(?<attrs>[^}]*)\}\}\s*$/m,
		fromBlock: (match) => {
			const attrs = parseAttrs(match?.groups?.attrs || "");
			return {
				count: attrs.count !== undefined && attrs.count !== "" ? attrs.count : "0",
				sort: attrs.sort || "title-asc",
				layout: attrs.layout || "cloud",
				columns: attrs.columns || "3",
				gap: attrs.gap || "1.25",
			};
		},
		toBlock: ({
			count = 0,
			sort = "title-asc",
			layout = "cloud",
			columns = 3,
			gap = 1.25,
		}) =>
			`{{tag-listing count="${count}" sort="${sort}" layout="${layout}" columns="${columns}" gap="${gap}"}}`,
		toPreview: ({
			count = 0,
			sort = "title-asc",
			layout = "cloud",
			columns = 3,
			gap = 1.25,
		}) =>
			`<div style="padding:0.75rem 1rem;border:1px dashed #2e3833;border-radius:6px;color:#9aa89f;font-size:0.9rem">Tag-Listing · ${count === 0 || count === "0" ? "alle" : count} · ${sort} · ${layout}${layout === "grid" ? ` · ${columns} Spalten` : ""} · gap ${gap}rem</div>`,
	});

CMS.registerEditorComponent({
		id: "tag-cloud",
		label: "Tagwolke",
		icon: "sell",
		fields: [],
		pattern: /^\{\{tag-cloud\}\}\s*$/m,
		toBlock: () => "{{tag-cloud}}",
		toPreview: () =>
			'<div style="padding:0.75rem 1rem;border:1px dashed #2e3833;border-radius:6px;color:#9aa89f;font-size:0.9rem">Tagwolke (Kurzform für Tag-Listing Layout Wolke)</div>',
	});

CMS.registerEditorComponent({
		id: "author-listing",
		label: "Autoren-Listing",
		icon: "group",
		fields: [],
		pattern: /^\{\{author-listing\}\}\s*$/m,
		fromBlock: () => ({}),
		toBlock: () => "{{author-listing}}",
		toPreview: () =>
			'<div style="padding:0.75rem 1rem;border:1px dashed #2e3833;border-radius:6px;color:#9aa89f;font-size:0.9rem">Autoren-Listing (alle Autoren mit Avatar und Artikelanzahl)</div>',
	});

CMS.registerEditorComponent({
		id: "author-social",
		label: "Autor Social-Links",
		icon: "share",
		fields: [
			{
				name: "author",
				label: "Autor",
				widget: "relation",
				collection: "authors",
				value_field: "{{slug}}",
				search_fields: ["title", "{{slug}}"],
				display_fields: ["title"],
				required: false,
				hint: "Leer = auf dem Autorenprofil die Socials dieses Autors. Sonst Slug wählen (z. B. auf Seiten/Artikeln).",
			},
		],
		pattern: /^\{\{author-social(?:\s+author="([^"]*)")?\}\}\s*$/m,
		fromBlock: (match) => ({
			author: match[1] || "",
		}),
		toBlock: (data) => {
			const author = String(data.author || "").trim();
			return author
				? `{{author-social author="${author}"}}`
				: "{{author-social}}";
		},
		toPreview: (data) => {
			const author = String(data.author || "").trim();
			const who = author
				? `Autor <code>${author}</code>`
				: "aktueller Autor (Profil) bzw. leer ohne Kontext";
			return `<div style="padding:0.75rem 1rem;border:1px dashed #2e3833;border-radius:6px;color:#9aa89f;font-size:0.9rem">Social-Links mit Plattform-Icons (${who})</div>`;
		},
	});

CMS.registerEditorComponent({
		id: "glossar-listing",
		label: "Glossar-Listing",
		icon: "menu_book",
		fields: [
			{
				name: "count",
				label: "Anzahl",
				widget: "number",
				value_type: "int",
				default: 0,
				min: 0,
				max: 48,
				hint: "0 = alle veröffentlichten Begriffe.",
			},
			{
				name: "sort",
				label: "Sortierung",
				widget: "select",
				default: "title-asc",
				options: [
					{ label: "Titel A–Z", value: "title-asc" },
					{ label: "Titel Z–A", value: "title-desc" },
					{ label: "Neueste zuerst", value: "newest" },
					{ label: "Älteste zuerst", value: "oldest" },
				],
			},
			{
				name: "layout",
				label: "Layout",
				widget: "select",
				default: "list",
				options: [
					{ label: "Liste", value: "list" },
					{ label: "Grid (Karten)", value: "grid" },
				],
			},
			{
				name: "columns",
				label: "Spalten (nur Grid)",
				widget: "number",
				value_type: "int",
				default: 2,
				min: 1,
				max: 4,
				hint: "Wird bei Layout „Liste“ ignoriert.",
			},
			{
				name: "gap",
				label: "Abstand (rem)",
				widget: "number",
				value_type: "float",
				default: 1.5,
				min: 0,
				max: 8,
				step: 0.25,
			},
			{
				name: "linkable",
				label: "Zur Glossar-Seite verlinken",
				widget: "boolean",
				default: true,
				hint: "Aus: Eintrag ohne Link zur Einzelansicht.",
			},
		],
		pattern: /^\{\{glossar-listing(?<attrs>[^}]*)\}\}\s*$/m,
		fromBlock: (match) => {
			const attrs = parseAttrs(match?.groups?.attrs || "");
			const linkableRaw = (attrs.linkable || "").toLowerCase();
			const linkable =
				linkableRaw !== "false" &&
				linkableRaw !== "0" &&
				linkableRaw !== "no";
			return {
				count: attrs.count !== undefined && attrs.count !== "" ? attrs.count : "0",
				sort: attrs.sort || "title-asc",
				layout: attrs.layout || "list",
				columns: attrs.columns || "2",
				gap: attrs.gap || "1.5",
				linkable,
			};
		},
		toBlock: ({
			count = 0,
			sort = "title-asc",
			layout = "list",
			columns = 2,
			gap = 1.5,
			linkable = true,
		}) => {
			const parts = [
				`count="${count}"`,
				`sort="${sort}"`,
				`layout="${layout}"`,
				`columns="${columns}"`,
				`gap="${gap}"`,
			];
			if (linkable === false || linkable === "false") {
				parts.push(`linkable="false"`);
			}
			return `{{glossar-listing ${parts.join(" ")}}}`;
		},
		toPreview: ({
			count = 0,
			sort = "title-asc",
			layout = "list",
			columns = 2,
			gap = 1.5,
			linkable = true,
		}) => {
			const linkSuffix =
				linkable === false || linkable === "false" ? " · ohne Link" : "";
			return `<div style="padding:0.75rem 1rem;border:1px dashed #2e3833;border-radius:6px;color:#9aa89f;font-size:0.9rem">Glossar-Listing · ${count === 0 || count === "0" ? "alle" : count} · ${sort} · ${layout}${layout === "grid" ? ` · ${columns} Spalten` : ""} · gap ${gap}rem${linkSuffix}</div>`;
		},
	});


	CMS.registerEditorComponent({
		id: "block",
		label: "Baustein",
		icon: "widgets",
		fields: [
			{
				name: "id",
				label: "Baustein",
				widget: "relation",
				collection: "blocks",
				value_field: "{{slug}}",
				search_fields: ["title", "{{slug}}"],
				display_fields: ["{{title}} ({{slug}})"],
				/** Always dropdown (default UI is radio/checkbox while few blocks exist). */
				dropdown_threshold: 0,
				hint: "Wiederverwendbarer Inhalt aus der Collection „Bausteine“. Dateiname = id.",
			},
		],
		pattern: /^\{\{block(?<attrs>[^}]*)\}\}\s*$/m,
		fromBlock: (match) => {
			const attrs = parseAttrs(match?.groups?.attrs || "");
			return { id: attrs.id || attrs.slug || "" };
		},
		toBlock: ({ id = "" }) => `{{block id="${id}"}}`,
		toPreview: ({ id = "" }) =>
			`<div style="padding:0.75rem 1rem;border:1px dashed #2e3833;border-radius:6px;color:#9aa89f;font-size:0.9rem">Baustein · ${id || "?"}</div>`,
	});

	CMS.registerEditorComponent({
		id: "contact-email",
		label: "Kontakt-E-Mail",
		icon: "mail",
		fields: [
			{
				name: "layout",
				label: "Darstellung",
				widget: "select",
				default: "block",
				options: [
					{
						label: "Eigenständig (eigene Zeile)",
						value: "block",
					},
					{
						label: "An Text davor anschließen",
						value: "run-after",
					},
					{
						label: "An Text danach anschließen",
						value: "run-before",
					},
					{
						label: "Zwischen Text davor und danach",
						value: "run-between",
					},
				],
				hint: "Embed bleibt im Markdown eine eigene Zeile. „Anschließen“ setzt die E-Mail im Satzfluss an den Nachbartext (Absatz davor und/oder danach).",
			},
		],
		pattern: /^\{\{contact-email(?<attrs>[^}]*)\}\}\s*$/m,
		fromBlock: (match) => {
			const attrs = parseAttrs(match?.groups?.attrs || "");
			const layout = attrs.layout || "block";
			return { layout };
		},
		toBlock: ({ layout = "block" }) => {
			if (!layout || layout === "block") {
				return "{{contact-email}}";
			}
			return `{{contact-email layout="${layout}"}}`;
		},
		toPreview: ({ layout = "block" }) => {
			const labels = {
				block: "eigenständig",
				"run-after": "schließt an Text davor an",
				"run-before": "schließt an Text danach an",
				"run-between": "zwischen zwei Textteilen",
			};
			const mode = labels[layout] || layout;
			return `<div style="padding:0.75rem 1rem;border:1px dashed #2e3833;border-radius:6px;color:#9aa89f;font-size:0.9rem">Kontakt-E-Mail · ${mode} (General → Contact email, sonst CONTACT_EMAIL)</div>`;
		},
	});

	CMS.registerEditorComponent({
		id: "logo",
		label: "Logo",
		icon: "image",
		fields: [
			{
				name: "variant",
				label: "Welches Logo",
				widget: "select",
				default: "header",
				options: [
					{ label: "Header", value: "header" },
					{ label: "Sticky Header", value: "sticky" },
					{ label: "Footer", value: "footer" },
				],
				hint: "Aus Einstellungen → General → Logos. Sticky/Footer fallen auf Header zurück, wenn leer.",
			},
			{
				name: "width",
				label: "Breite",
				widget: "number",
				value_type: "int",
				default: 120,
				min: 1,
				max: 1200,
				hint: "Zahl; Einheit darunter (px oder %).",
			},
			{
				name: "unit",
				label: "Einheit",
				widget: "select",
				default: "px",
				options: [
					{ label: "Pixel (px)", value: "px" },
					{ label: "Prozent (%)", value: "%" },
				],
			},
			{
				name: "align",
				label: "Ausrichtung",
				widget: "select",
				default: "left",
				options: [
					{ label: "Links", value: "left" },
					{ label: "Zentriert", value: "center" },
					{ label: "Rechts", value: "right" },
				],
			},
		],
		pattern: /^\{\{logo(?<attrs>[^}]*)\}\}\s*$/m,
		fromBlock: (match) => {
			const attrs = parseAttrs(match?.groups?.attrs || "");
			return {
				variant: attrs.variant || "header",
				width: attrs.width || "120",
				unit: attrs.unit === "%" ? "%" : "px",
				align: attrs.align || "left",
			};
		},
		toBlock: ({
			variant = "header",
			width = 120,
			unit = "px",
			align = "left",
		}) =>
			`{{logo variant="${variant}" width="${width}" unit="${unit}" align="${align}"}}`,
		toPreview: ({
			variant = "header",
			width = 120,
			unit = "px",
			align = "left",
		}) =>
			`<div style="padding:0.75rem 1rem;border:1px dashed #2e3833;border-radius:6px;color:#9aa89f;font-size:0.9rem">Logo · ${variant} · ${width}${unit} · ${align}</div>`,
	});

	CMS.registerEditorComponent({
		id: "repodoc",
		label: "Repo-Dokument",
		icon: "description",
		fields: [
			{
				name: "path",
				label: "Pfad im Repo",
				widget: "string",
				hint: 'z. B. docs/github/README.md (muss unter docs/ existieren).',
			},
			{
				name: "title",
				label: "Titel",
				widget: "string",
				required: false,
				hint: "Optional. Leer = erste Überschrift aus der Datei.",
			},
			{
				name: "description",
				label: "Kurzbeschreibung",
				widget: "text",
				required: false,
				hint: "Optional, ein Satz für die Box.",
			},
		],
		pattern: /^\{\{repodoc(?<attrs>[^}]*)\}\}\s*$/m,
		fromBlock: (match) => {
			const attrs = parseAttrs(match?.groups?.attrs || "");
			return {
				path: attrs.path || "",
				title: attrs.title || "",
				description: attrs.description || "",
			};
		},
		toBlock: ({ path = "", title = "", description = "" }) => {
			const parts = [`path="${path}"`];
			if (title) parts.push(`title="${title}"`);
			if (description) parts.push(`description="${description}"`);
			return `{{repodoc ${parts.join(" ")}}}`;
		},
		toPreview: ({ path = "", title = "", description = "" }) => {
			const label = title || path || "?";
			const desc = description ? ` · ${description}` : "";
			return `<div style="padding:0.75rem 1rem;border:1px solid #2e3833;border-radius:6px;color:#9aa89f;font-size:0.9rem;display:flex;gap:0.75rem;align-items:flex-start"><span style="color:#3dcf8e">ⓘ</span><span><strong style="color:#e8eeea">Vertiefung im Repo</strong><br>${label}${desc}</span></div>`;
		},
	});

	CMS.registerEditorComponent({
		id: "video-consent-reset",
		label: "Video-Freischaltung widerrufen",
		icon: "cookie",
		fields: [],
		pattern: /^\{\{video-consent-reset\}\}\s*$/m,
		fromBlock: () => ({}),
		toBlock: () => "{{video-consent-reset}}",
		toPreview: () =>
			'<div style="padding:0.75rem 1rem;border:1px dashed #2e3833;border-radius:6px;color:#9aa89f;font-size:0.9rem">Button: Video-Freischaltung widerrufen</div>',
	});

	CMS.registerEditorComponent({
		id: "video",
		label: "Video",
		icon: "videocam",
		fields: [
			{
				name: "provider",
				label: "Anbieter",
				widget: "select",
				options: [
					{ label: "YouTube", value: "youtube" },
					{ label: "Vimeo", value: "vimeo" },
					{ label: "Datei (R2 / selbst gehostet)", value: "file" },
				],
				default: "youtube",
			},
			{
				name: "id",
				label: "Video-ID, URL oder Dateiname",
				widget: "string",
				required: false,
				hint: "YouTube/Vimeo: ID oder URL. Datei: volle https-URL, oder Dateiname relativ zur Video-Basis-URL (CMS Content → Medien). Leer = Block wird beim Speichern entfernt.",
			},
			{
				name: "title",
				label: "Titel (Barrierefreiheit)",
				widget: "string",
				required: false,
				default: "Video",
			},
			{
				name: "poster",
				label: "Poster",
				widget: "image",
				required: false,
				choose_url: false,
				hint: "Optional: Vorschaubild aus der Mediathek (bei YT/Vimeo kein Drittanbieter-Thumbnail vor Consent).",
			},
		],
		// `(?!-)`: do not steal `{{video-consent-reset}}` (same idea as button vs button-group).
		pattern: /^\{\{video(?!-)(?<attrs>[^}]*)\}\}\s*$/m,
		fromBlock: (match) => {
			const attrs = parseAttrs(match?.groups?.attrs || "");
			const provider = attrs.provider === "r2" ? "file" : attrs.provider || "youtube";
			return {
				provider,
				id: attrs.src || attrs.id || attrs.url || "",
				title: attrs.title || "Video",
				poster: attrs.poster || "",
			};
		},
		toBlock: ({ provider = "youtube", id = "", title = "Video", poster = "" }) => {
			const ref = String(id || "").trim();
			if (!ref) return "";
			const parts = [`provider="${provider}"`];
			if (provider === "file") {
				parts.push(`src="${ref}"`);
			} else {
				parts.push(`id="${ref}"`);
			}
			if (title && title !== "Video") parts.push(`title="${title}"`);
			if (poster) parts.push(`poster="${poster}"`);
			return `{{video ${parts.join(" ")}}}`;
		},
		toPreview: ({ provider = "youtube", id = "", title = "Video" }) => {
			const note =
				provider === "file"
					? "HTML5-Player, Datei von R2/CDN (kein YT/Vimeo-Consent)"
					: "Facade mit Consent, kein Player vor Klick";
			return `<div style="padding:0.75rem 1rem;border:1px dashed #2e3833;border-radius:6px;color:#9aa89f;font-size:0.9rem"><strong style="color:#e8eeea">Video</strong> (${provider}) · ${title || id || "?"}<br><span style="font-size:0.8rem">${note}</span></div>`;
		},
	});

	CMS.registerEditorComponent({
		id: "member-video",
		label: "Member-Video (Code)",
		icon: "lock",
		fields: [
			{
				name: "src",
				label: "Objekt-Key / Dateiname",
				widget: "string",
				required: false,
				hint: "Key im privaten R2-Bucket (nicht die öffentliche media-URL), z. B. videos/folge-001.mp4. Freischaltung über Worker hautoo-member-media-access.",
			},
			{
				name: "title",
				label: "Titel (Barrierefreiheit)",
				widget: "string",
				required: false,
				default: "Video",
			},
			{
				name: "poster",
				label: "Poster",
				widget: "image",
				required: false,
				choose_url: false,
				hint: "Optional: Vorschaubild aus der Mediathek.",
			},
		],
		pattern: /^\{\{member-video(?<attrs>[^}]*)\}\}\s*$/m,
		fromBlock: (match) => {
			const attrs = parseAttrs(match?.groups?.attrs || "");
			return {
				src: attrs.src || attrs.id || attrs.key || "",
				title: attrs.title || "Video",
				poster: attrs.poster || "",
			};
		},
		toBlock: ({ src = "", title = "Video", poster = "" }) => {
			const key = String(src || "").trim();
			if (!key) return "";
			const parts = [`src="${key}"`];
			if (title && title !== "Video") parts.push(`title="${title}"`);
			if (poster) parts.push(`poster="${poster}"`);
			return `{{member-video ${parts.join(" ")}}}`;
		},
		toPreview: ({ src = "", title = "Video" }) =>
			`<div style="padding:0.75rem 1rem;border:1px dashed #2e3833;border-radius:6px;color:#9aa89f;font-size:0.9rem"><strong style="color:#e8eeea">Member-Video</strong> · ${title || src || "?"}<br><span style="font-size:0.8rem">Privates R2 + Zugangscode (Worker)</span></div>`,
	});


	const SEPARATOR_COLORS = {
		border: "#2e3833",
		text: "#e8eeea",
		"text-muted": "#9aa89f",
		action: "#3dcf8e",
		"action-hover": "#56d9a0",
		"action-muted": "#1a3d2e",
		surface: "#1a211e",
		"surface-raised": "#232b27",
		bg: "#0f1412",
		danger: "#e57373",
	};

	CMS.registerEditorComponent({
		id: "separator",
		label: "Trennlinie",
		icon: "horizontal_rule",
		fields: [
			{
				name: "height",
				label: "Höhe (px)",
				widget: "number",
				value_type: "int",
				default: 1,
				min: 1,
				max: 24,
			},
			{
				name: "width",
				label: "Breite (%)",
				widget: "number",
				value_type: "int",
				default: 100,
				min: 1,
				max: 100,
				hint: "Prozent der Inhaltsbreite; zentriert.",
			},
			{
				name: "color",
				label: "Farbe",
				widget: "select",
				default: "border",
				options: [
					{ label: "Rahmen (Standard)", value: "border" },
					{ label: "Text", value: "text" },
					{ label: "Text gedämpft", value: "text-muted" },
					{ label: "Aktion", value: "action" },
					{ label: "Aktion Hover", value: "action-hover" },
					{ label: "Aktion gedämpft", value: "action-muted" },
					{ label: "Fläche", value: "surface" },
					{ label: "Fläche angehoben", value: "surface-raised" },
					{ label: "Hintergrund", value: "bg" },
					{ label: "Danger", value: "danger" },
				],
				hint: "Design-Token aus der Palette. Standard = aktuelle Linienfarbe (border).",
			},
			{
				name: "mark",
				label: "Markierung",
				widget: "select",
				default: "none",
				options: [
					{ label: "Keine (nur Linie)", value: "none" },
					{ label: "Logo (General → Logos)", value: "logo" },
					{ label: "Favicon (General → Favicons)", value: "favicon" },
				],
				hint: "Optional Logo oder Favicon aus den Einstellungen auf der Linie (#97).",
			},
			{
				name: "markAlign",
				label: "Markierung: Position",
				widget: "select",
				default: "center",
				options: [
					{ label: "Links", value: "left" },
					{ label: "Mitte", value: "center" },
					{ label: "Rechts", value: "right" },
				],
				hint: "Nur wirksam bei Markierung Logo oder Favicon. Standard: Mitte.",
			},
			{
				name: "markSize",
				label: "Markierung: Größe (px)",
				widget: "number",
				value_type: "int",
				default: 24,
				min: 8,
				max: 120,
				hint: "Breite von Logo/Favicon in Pixeln. Standard 24.",
			},
		],
		pattern: /^\{\{separator(?<attrs>[^}]*)\}\}\s*$/m,
		fromBlock: (match) => {
			const attrs = parseAttrs(match?.groups?.attrs || "");
			return {
				height: attrs.height || "1",
				width: (attrs.width || "100").replace(/%$/, ""),
				color: attrs.color || "border",
				mark: attrs.mark || "none",
				markAlign: attrs.markAlign || attrs["mark-align"] || "center",
				markSize: attrs.markSize || attrs["mark-size"] || "24",
			};
		},
		toBlock: ({
			height = 1,
			width = 100,
			color = "border",
			mark = "none",
			markAlign = "center",
			markSize = 24,
		}) => {
			const parts = [`height="${height}"`, `width="${width}"`];
			if (color && color !== "border") parts.push(`color="${color}"`);
			if (mark && mark !== "none") {
				parts.push(`mark="${mark}"`);
				if (markAlign && markAlign !== "center") {
					parts.push(`markAlign="${markAlign}"`);
				}
				if (String(markSize) !== "24") {
					parts.push(`markSize="${markSize}"`);
				}
			}
			return `{{separator ${parts.join(" ")}}}`;
		},
		toPreview: ({
			height = 1,
			width = 100,
			color = "border",
			mark = "none",
			markAlign = "center",
			markSize = 24,
		}) => {
			const bg = SEPARATOR_COLORS[color] || SEPARATOR_COLORS.border;
			if (!mark || mark === "none") {
				return `<hr style="display:block;border:0;background:${bg};opacity:.65;height:${height}px;width:${width}%;margin:1.25rem auto">`;
			}
			const label = mark === "favicon" ? "Favicon" : "Logo";
			const rule = `<span style="flex:1;height:${height}px;background:${bg};opacity:.65"></span>`;
			const badge = `<span style="flex:0 0 auto;font-size:11px;opacity:.85;padding:0 4px;width:${markSize}px;text-align:center">${label}</span>`;
			const row =
				markAlign === "left"
					? `${badge}${rule}`
					: markAlign === "right"
						? `${rule}${badge}`
						: `${rule}${badge}${rule}`;
			return `<div style="display:flex;align-items:center;gap:8px;width:${width}%;margin:1.25rem auto">${row}</div>`;
		},
	});

	CMS.registerEditorComponent({
		id: "spacer",
		label: "Abstandshalter",
		icon: "height",
		fields: [
			{
				name: "height",
				label: "Höhe (px)",
				widget: "number",
				value_type: "int",
				default: 32,
				min: 1,
				max: 600,
				hint: "Vertikaler Leerraum. Standard 32 px.",
			},
		],
		pattern: /^\{\{spacer(?<attrs>[^}]*)\}\}\s*$/m,
		fromBlock: (match) => {
			const attrs = parseAttrs(match?.groups?.attrs || "");
			return {
				height: attrs.height || "32",
			};
		},
		toBlock: ({ height = 32 }) => {
			if (!height || Number(height) === 32) return "{{spacer}}";
			return `{{spacer height="${height}"}}`;
		},
		toPreview: ({ height = 32 }) => {
			const h = Math.min(600, Math.max(1, Number(height) || 32));
			return `<div style="height:${h}px;margin:0;border:1px dashed #2e3833;border-radius:4px;background:repeating-linear-gradient(135deg,transparent,transparent 6px,#2e3833 6px,#2e3833 7px);opacity:.55" title="Abstand ${h}px" aria-hidden="true"></div>`;
		},
	});

	const BUTTON_LIGHT_FILLS = new Set([
		"text",
		"text-muted",
		"action",
		"action-hover",
		"danger",
	]);

	const BUTTON_COLOR_OPTIONS = [
		{ label: "Aktion (Standard)", value: "action" },
		{ label: "Aktion Hover", value: "action-hover" },
		{ label: "Aktion gedämpft", value: "action-muted" },
		{ label: "Rahmen", value: "border" },
		{ label: "Text", value: "text" },
		{ label: "Text gedämpft", value: "text-muted" },
		{ label: "Fläche", value: "surface" },
		{ label: "Fläche angehoben", value: "surface-raised" },
		{ label: "Hintergrund", value: "bg" },
		{ label: "Danger", value: "danger" },
	];

	const BUTTON_STYLE_OPTIONS = [
		{ label: "Ausgefüllt", value: "solid" },
		{ label: "Kontur", value: "outline" },
	];

	const BUTTON_TARGET_OPTIONS = [
		{ label: "Gleicher Tab", value: "_self" },
		{ label: "Neuer Tab", value: "_blank" },
	];

	function serializeButtonGroupItems(items) {
		return (Array.isArray(items) ? items : [])
			.filter((item) => item && String(item.label || "").trim() && String(item.href || "").trim())
			.map((item) =>
				[
					String(item.label).trim(),
					String(item.href).trim(),
					item.style || "solid",
					item.color || "action",
					item.target || "_self",
				].join("|"),
			)
			.join("||");
	}

	function parseButtonGroupItemsAttr(raw) {
		if (!raw || !String(raw).trim()) return [];
		return String(raw)
			.split("||")
			.map((chunk) => {
				const parts = chunk.split("|").map((part) => part.trim());
				const label = parts[0] || "";
				const href = parts[1] || "";
				if (!label || !href) return null;
				return {
					label,
					href,
					style: parts[2] || "solid",
					color: parts[3] || "action",
					target: parts[4] || "_self",
				};
			})
			.filter(Boolean);
	}

	function buttonPreviewSpan(label, style, color) {
		const fill = SEPARATOR_COLORS[color] || SEPARATOR_COLORS.action;
		const fg = BUTTON_LIGHT_FILLS.has(color) ? "#0f1412" : "#e8eeea";
		const solid = style !== "outline";
		const btn = solid
			? `background:${fill};color:${fg};border:2px solid ${fill};`
			: `background:transparent;color:${fill};border:2px solid ${fill};`;
		return `<span style="display:inline-block;padding:0.45rem 1rem;border-radius:4px;font-weight:500;${btn}">${label}</span>`;
	}

	CMS.registerEditorComponent({
		id: "button",
		label: "Button",
		icon: "smart_button",
		fields: [
			{
				name: "label",
				label: "Beschriftung",
				widget: "string",
				default: "Mehr erfahren",
			},
			{
				name: "href",
				label: "Link (URL)",
				widget: "string",
				hint: "Intern z. B. /kontakt/ oder absolute URL.",
			},
			{
				name: "target",
				label: "Ziel",
				widget: "select",
				default: "_self",
				options: BUTTON_TARGET_OPTIONS,
			},
			{
				name: "style",
				label: "Stil",
				widget: "select",
				default: "solid",
				options: BUTTON_STYLE_OPTIONS,
			},
			{
				name: "color",
				label: "Farbe",
				widget: "select",
				default: "action",
				options: BUTTON_COLOR_OPTIONS,
				hint: "Bei Ausgefüllt: Hintergrund; bei Kontur: Rand und Text. Solid-Textfarbe wird kontrastreich gewählt.",
			},
			{
				name: "align",
				label: "Ausrichtung",
				widget: "select",
				default: "left",
				options: [
					{ label: "Links", value: "left" },
					{ label: "Zentriert", value: "center" },
					{ label: "Rechts", value: "right" },
					{ label: "Volle Breite", value: "full" },
				],
			},
		],
		/** Negative lookahead so `button-group` is not captured as `button`. */
		pattern: /^\{\{button(?!-)(?<attrs>[^}]*)\}\}\s*$/m,
		fromBlock: (match) => {
			const attrs = parseAttrs(match?.groups?.attrs || "");
			return {
				label: attrs.label || attrs.text || "Mehr erfahren",
				href: attrs.href || attrs.url || "",
				target: attrs.target || "_self",
				style: attrs.style || "solid",
				color: attrs.color || "action",
				align: attrs.align || "left",
			};
		},
		toBlock: ({
			label = "Mehr erfahren",
			href = "",
			target = "_self",
			style = "solid",
			color = "action",
			align = "left",
		}) => {
			const parts = [`label="${label}"`, `href="${href}"`];
			if (target && target !== "_self") parts.push(`target="${target}"`);
			if (style && style !== "solid") parts.push(`style="${style}"`);
			if (color && color !== "action") parts.push(`color="${color}"`);
			if (align && align !== "left") parts.push(`align="${align}"`);
			return `{{button ${parts.join(" ")}}}`;
		},
		toPreview: ({
			label = "Mehr erfahren",
			style = "solid",
			color = "action",
			align = "left",
		}) => {
			const alignCss =
				align === "center"
					? "center"
					: align === "right"
						? "right"
						: "left";
			const widthCss =
				align === "full" ? "width:100%;box-sizing:border-box;" : "";
			const span = buttonPreviewSpan(label, style, color).replace(
				'display:inline-block;',
				`display:inline-block;${widthCss}`,
			);
			return `<div style="text-align:${alignCss};margin:0.75rem 0">${span}</div>`;
		},
	});

	CMS.registerEditorComponent({
		id: "button-group",
		label: "Button-Gruppe",
		icon: "view_week",
		fields: [
			{
				name: "items",
				label: "Buttons",
				widget: "list",
				min: 1,
				max: 12,
				summary: "{{fields.label}} → {{fields.href}}",
				default: [
					{
						label: "Mehr erfahren",
						href: "/features/",
						style: "solid",
						color: "action",
						target: "_self",
					},
					{
						label: "Artikel",
						href: "/artikel/",
						style: "outline",
						color: "action",
						target: "_self",
					},
				],
				fields: [
					{
						name: "label",
						label: "Beschriftung",
						widget: "string",
					},
					{
						name: "href",
						label: "Link (URL)",
						widget: "string",
						hint: "Intern z. B. /kontakt/ oder absolute URL. Kein | in Werten.",
					},
					{
						name: "style",
						label: "Stil",
						widget: "select",
						default: "solid",
						options: BUTTON_STYLE_OPTIONS,
					},
					{
						name: "color",
						label: "Farbe",
						widget: "select",
						default: "action",
						options: BUTTON_COLOR_OPTIONS,
					},
					{
						name: "target",
						label: "Ziel",
						widget: "select",
						default: "_self",
						options: BUTTON_TARGET_OPTIONS,
					},
				],
			},
			{
				name: "layout",
				label: "Layout",
				widget: "select",
				default: "stack-mobile",
				options: [
					{
						label: "Nebeneinander (umbricht)",
						value: "row",
					},
					{
						label: "Nebeneinander (kein Umbruch)",
						value: "row-nowrap",
					},
					{
						label: "Nebeneinander, mobil untereinander",
						value: "stack-mobile",
					},
					{ label: "Immer untereinander", value: "stack" },
				],
			},
			{
				name: "align",
				label: "Ausrichtung",
				widget: "select",
				default: "left",
				options: [
					{ label: "Links", value: "left" },
					{ label: "Zentriert", value: "center" },
					{ label: "Rechts", value: "right" },
				],
			},
			{
				name: "fullWidthMobile",
				label: "Auf Mobile volle Breite",
				widget: "boolean",
				default: false,
				hint: "Unter 680px: jeder Button über die volle Inhaltsbreite (eine Zeile pro Button).",
			},
		],
		pattern: /^\{\{button-group(?<attrs>[^}]*)\}\}\s*$/m,
		fromBlock: (match) => {
			const attrs = parseAttrs(match?.groups?.attrs || "");
			const items = parseButtonGroupItemsAttr(attrs.items);
			const fullRaw = (
				attrs.fullWidthMobile ||
				attrs.fullwidthmobile ||
				""
			).toLowerCase();
			return {
				items:
					items.length > 0
						? items
						: [
								{
									label: "Mehr erfahren",
									href: "/features/",
									style: "solid",
									color: "action",
									target: "_self",
								},
							],
				layout: attrs.layout || "stack-mobile",
				align: attrs.align || "left",
				fullWidthMobile:
					fullRaw === "true" || fullRaw === "1" || fullRaw === "yes",
			};
		},
		toBlock: ({
			items = [],
			layout = "stack-mobile",
			align = "left",
			fullWidthMobile = false,
		}) => {
			const itemsAttr = serializeButtonGroupItems(items);
			const parts = [`items="${itemsAttr}"`];
			if (layout && layout !== "stack-mobile") {
				parts.push(`layout="${layout}"`);
			}
			if (align && align !== "left") parts.push(`align="${align}"`);
			if (fullWidthMobile === true || fullWidthMobile === "true") {
				parts.push(`fullWidthMobile="true"`);
			}
			return `{{button-group ${parts.join(" ")}}}`;
		},
		toPreview: ({
			items = [],
			layout = "stack-mobile",
			align = "left",
			fullWidthMobile = false,
		}) => {
			const list = Array.isArray(items) ? items : [];
			const justify =
				align === "center"
					? "center"
					: align === "right"
						? "flex-end"
						: "flex-start";
			const direction =
				layout === "stack" ? "column" : "row";
			const wrap =
				layout === "row-nowrap" || layout === "stack"
					? "nowrap"
					: "wrap";
			const spans = list
				.filter(
					(item) =>
						item &&
						String(item.label || "").trim() &&
						String(item.href || "").trim(),
				)
				.map((item) =>
					buttonPreviewSpan(
						item.label,
						item.style || "solid",
						item.color || "action",
					),
				)
				.join("");
			const body =
				spans ||
				`<span style="color:#9aa89f;font-size:0.9rem">Button-Gruppe (leer)</span>`;
			const fullOn =
				fullWidthMobile === true || fullWidthMobile === "true";
			const childWidth = fullOn ? "width:100%;box-sizing:border-box;" : "";
			const styledBody = childWidth
				? body.replaceAll(
						'display:inline-block;',
						`display:inline-block;${childWidth}`,
					)
				: body;
			const note = fullOn
				? `<div style="margin-top:0.35rem;color:#9aa89f;font-size:0.8rem">Mobile: volle Breite</div>`
				: "";
			return `<div style="display:flex;flex-direction:${fullOn ? "column" : direction};flex-wrap:${wrap};gap:0.5rem;justify-content:${justify};align-items:${fullOn ? "stretch" : justify === "flex-start" ? "flex-start" : justify === "flex-end" ? "flex-end" : "center"};margin:0.75rem 0">${styledBody}</div>${note}`;
		},
	});

	const GRID_CARD_IMAGE_STYLE_OPTIONS = [
		{ label: "Oben · mit Rand", value: "top-cover" },
		{ label: "Oben · randlos", value: "top-bleed" },
		{ label: "Unten · mit Rand", value: "bottom-cover" },
		{ label: "Unten · randlos", value: "bottom-bleed" },
		{ label: "Links · mit Rand", value: "left-cover" },
		{ label: "Links · randlos", value: "left-bleed" },
		{ label: "Rechts · mit Rand", value: "right-cover" },
		{ label: "Rechts · randlos", value: "right-bleed" },
	];

	const GRID_CARD_DEFAULT = {
		title: "Karte",
		subtitle: "",
		text: "Kurztext zur Karte.",
		image: "",
		imageStyle: "top-cover",
		buttonLabel: "Mehr erfahren",
		buttonHref: "/features/",
		buttonTarget: "_self",
		borderColor: "border",
		borderWidth: 1,
		borderRadius: 6,
		bgColor: "surface",
		bgImage: "",
		bgFit: "cover",
		alignX: "left",
		alignY: "top",
	};

	function encodeGridCardsAttr(cards) {
		const list = (Array.isArray(cards) ? cards : [])
			.map((card) => ({
				title: String(card?.title || "").trim(),
				subtitle: String(card?.subtitle || "").trim(),
				text: String(card?.text || "").trim(),
				image: String(card?.image || "").trim(),
				imageStyle: card?.imageStyle || "top-cover",
				buttonLabel: String(card?.buttonLabel || "").trim(),
				buttonHref: String(card?.buttonHref || "").trim(),
				buttonTarget: card?.buttonTarget || "_self",
				borderColor: card?.borderColor || "border",
				borderWidth:
					card?.borderWidth === "" || card?.borderWidth == null
						? 1
						: Number(card.borderWidth),
				borderRadius:
					card?.borderRadius === "" || card?.borderRadius == null
						? 6
						: Number(card.borderRadius),
				bgColor: card?.bgColor === "none" ? "" : card?.bgColor || "surface",
				bgImage: String(card?.bgImage || "").trim(),
				bgFit: card?.bgFit || "cover",
				alignX: card?.alignX || "left",
				alignY: card?.alignY || "top",
			}))
			.filter(
				(card) =>
					card.title ||
					card.subtitle ||
					card.text ||
					card.image ||
					card.buttonLabel ||
					card.bgImage,
			)
			.slice(0, 12);
		return encodeURIComponent(JSON.stringify(list));
	}

	function decodeGridCardsAttr(raw) {
		if (!raw || !String(raw).trim()) return [];
		try {
			const parsed = JSON.parse(decodeURIComponent(String(raw).trim()));
			return Array.isArray(parsed) ? parsed : [];
		} catch (_err) {
			return [];
		}
	}

	CMS.registerEditorComponent({
		id: "grid-cards",
		label: "Karten-Grid",
		icon: "grid_view",
		fields: [
			{
				name: "colsDesktop",
				label: "Spalten Desktop",
				widget: "number",
				value_type: "int",
				default: 3,
				min: 1,
				max: 4,
				hint: "Ab 1024px Breite.",
			},
			{
				name: "colsTablet",
				label: "Spalten Tablet",
				widget: "number",
				value_type: "int",
				default: 2,
				min: 1,
				max: 4,
				hint: "680–1023px.",
			},
			{
				name: "colsMobile",
				label: "Spalten Mobile",
				widget: "number",
				value_type: "int",
				default: 1,
				min: 1,
				max: 2,
				hint: "Unter 680px.",
			},
			{
				name: "gap",
				label: "Abstand (rem)",
				widget: "number",
				value_type: "float",
				default: 1.25,
				min: 0,
				max: 8,
				step: 0.25,
			},
			{
				name: "stretchLast",
				label: "Letzte Karte strecken",
				widget: "boolean",
				default: false,
				hint: "Wenn die letzte Karte allein in ihrer Zeile steht, über die volle Zeilenbreite ziehen.",
			},
			{
				name: "cards",
				label: "Karten",
				widget: "list",
				min: 1,
				max: 12,
				summary: "{{fields.title}}",
				default: [
					{ ...GRID_CARD_DEFAULT, title: "Erste Karte" },
					{ ...GRID_CARD_DEFAULT, title: "Zweite Karte" },
					{ ...GRID_CARD_DEFAULT, title: "Dritte Karte" },
					{
						...GRID_CARD_DEFAULT,
						title: "Vierte Karte",
						text: "Allein in der Zeile, wenn Stretch an ist.",
					},
				],
				fields: [
					{
						name: "title",
						label: "Titel",
						widget: "string",
						required: false,
					},
					{
						name: "subtitle",
						label: "Untertitel",
						widget: "string",
						required: false,
					},
					{
						name: "text",
						label: "Text",
						widget: "text",
						required: false,
						hint: "Kurzer Fließtext. Zeilenumbrüche bleiben erhalten.",
					},
					{
						name: "image",
						label: "Bild",
						widget: "image",
						required: false,
					},
					{
						name: "imageStyle",
						label: "Bilddarstellung",
						widget: "select",
						default: "top-cover",
						options: GRID_CARD_IMAGE_STYLE_OPTIONS,
						hint: "Wie beim Artikel-Listing: Position und Rand/randlos.",
					},
					{
						name: "buttonLabel",
						label: "Button-Beschriftung",
						widget: "string",
						required: false,
						default: "",
					},
					{
						name: "buttonHref",
						label: "Button-Link",
						widget: "string",
						required: false,
						hint: "Intern z. B. /kontakt/ oder absolute URL. Leer = kein Button.",
					},
					{
						name: "buttonTarget",
						label: "Button-Ziel",
						widget: "select",
						default: "_self",
						options: BUTTON_TARGET_OPTIONS,
					},
					{
						name: "borderColor",
						label: "Randfarbe",
						widget: "select",
						default: "border",
						options: BUTTON_COLOR_OPTIONS,
					},
					{
						name: "borderWidth",
						label: "Randdicke (px)",
						widget: "number",
						value_type: "int",
						default: 1,
						min: 0,
						max: 16,
					},
					{
						name: "borderRadius",
						label: "Eckenradius (px)",
						widget: "number",
						value_type: "int",
						default: 6,
						min: 0,
						max: 64,
					},
					{
						name: "bgColor",
						label: "Hintergrundfarbe",
						widget: "select",
						default: "surface",
						options: [
							{ label: "Keine (transparent)", value: "none" },
							...BUTTON_COLOR_OPTIONS,
						],
					},
					{
						name: "bgImage",
						label: "Hintergrundbild",
						widget: "image",
						required: false,
						hint: "Optional. Liegt unter der Kartenfarbe (abgedunkelt).",
					},
					{
						name: "bgFit",
						label: "Hintergrundbild-Anpassung",
						widget: "select",
						default: "cover",
						options: [
							{ label: "Cover (füllen)", value: "cover" },
							{ label: "Contain (einfügen)", value: "contain" },
						],
					},
					{
						name: "alignX",
						label: "Ausrichtung horizontal",
						widget: "select",
						default: "left",
						options: [
							{ label: "Links", value: "left" },
							{ label: "Zentriert", value: "center" },
							{ label: "Rechts", value: "right" },
						],
					},
					{
						name: "alignY",
						label: "Ausrichtung vertikal",
						widget: "select",
						default: "top",
						options: [
							{ label: "Oben", value: "top" },
							{ label: "Mitte", value: "center" },
							{ label: "Unten", value: "bottom" },
						],
					},
				],
			},
		],
		pattern: /^\{\{grid-cards(?<attrs>[^}]*)\}\}\s*$/m,
		fromBlock: (match) => {
			const attrs = parseAttrs(match?.groups?.attrs || "");
			const cards = decodeGridCardsAttr(attrs.cards);
			const stretchRaw = String(attrs.stretchLast || "").toLowerCase();
			return {
				colsDesktop: Number(attrs.colsDesktop || attrs.cols || 3) || 3,
				colsTablet: Number(attrs.colsTablet || 2) || 2,
				colsMobile: Number(attrs.colsMobile || 1) || 1,
				gap: Number(attrs.gap || 1.25) || 1.25,
				stretchLast:
					stretchRaw === "true" ||
					stretchRaw === "1" ||
					stretchRaw === "yes",
				cards:
					cards.length > 0
						? cards.map((card) => ({
								...GRID_CARD_DEFAULT,
								...card,
								bgColor: card.bgColor || "none",
							}))
						: [
								{ ...GRID_CARD_DEFAULT, title: "Erste Karte" },
								{ ...GRID_CARD_DEFAULT, title: "Zweite Karte" },
							],
			};
		},
		toBlock: ({
			colsDesktop = 3,
			colsTablet = 2,
			colsMobile = 1,
			gap = 1.25,
			stretchLast = false,
			cards = [],
		}) => {
			const parts = [`cards="${encodeGridCardsAttr(cards)}"`];
			if (Number(colsDesktop) !== 3) {
				parts.push(`colsDesktop="${colsDesktop}"`);
			}
			if (Number(colsTablet) !== 2) {
				parts.push(`colsTablet="${colsTablet}"`);
			}
			if (Number(colsMobile) !== 1) {
				parts.push(`colsMobile="${colsMobile}"`);
			}
			if (Number(gap) !== 1.25) {
				parts.push(`gap="${gap}"`);
			}
			if (stretchLast === true || stretchLast === "true") {
				parts.push(`stretchLast="true"`);
			}
			return `{{grid-cards ${parts.join(" ")}}}`;
		},
		toPreview: ({
			colsDesktop = 3,
			stretchLast = false,
			cards = [],
		}) => {
			const list = Array.isArray(cards) ? cards : [];
			const titles = list
				.map((card) => String(card?.title || "").trim())
				.filter(Boolean)
				.slice(0, 6);
			const label =
				titles.length > 0
					? titles.join(" · ")
					: "Karten-Grid (leer)";
			const note = stretchLast
				? " · letzte Karte strecken"
				: "";
			return `<div style="margin:0.75rem 0;padding:0.65rem 0.8rem;border:1px dashed #2e3833;border-radius:6px;background:#1a211e;color:#9aa89f;font-size:0.85rem"><strong style="color:#e8eeea">Karten-Grid</strong> (${colsDesktop} Spalten${note})<br/>${label}</div>`;
		},
	});
})();
