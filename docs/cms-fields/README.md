# CMS field partials (DRY)

Wiederverwendbare Feldgruppen für Sveltia und Astro.

## Inhaltsbreite & Abstand (`layout`)

| Seite | Ort |
| --- | --- |
| Sveltia | Anchor `&field_entry_layout`; globale Defaults unter Config → Design → Inhaltsbreite / Inhaltsabstand |
| Astro | `src/cms/fields/content-width.ts` (`entryLayoutSchema`), Resolve `src/lib/content-width.ts` / `src/lib/content-spacing.ts` |
| Collections | `pages`, `articles` (Taxonomien nur globaler Abstand) |

Breite: `layout.contentWidth` = `default` (42rem) · `wide` (64rem) · `full` (80rem). Leer = globaler Default; ohne Feld und mit Listing-Embed → `wide`.

Abstand (rem, 0–12): `layout.afterHero` / `layout.beforeFooter`. Leer = Design → Inhaltsabstand für die jeweilige Collection. CSS-Variablen `--page-space-after-hero` / `--page-space-before-footer` am `.page`.

## Status (`status`)

| Seite | Ort |
| --- | --- |
| Sveltia | Anchor `&field_status` (+ `&field_publish_date` für pages/glossar) |
| Astro | `src/cms/fields/status.ts` — `isEntryPublic()` |
| Collections | `pages`, `articles`, `glossar` (nicht `tags` / `menus`) |

Werte: `draft` · `published` · `future` · `trash`.

- Öffentlich: `published`, sowie `future` sobald das Datum erreicht ist (`pubDate` bei Artikeln, `publishDate` bei Seiten/Glossar).
- CMS-Default für neue Einträge: `draft`. Fehlendes Feld im Repo → beim Build wie `published` (Migration).

## Änderungsdatum (`modifiedDate`)

| Seite | Ort |
| --- | --- |
| Sveltia | Anchor `&field_modified_date` / Alias `*field_modified_date` |
| Astro (Zod) | `src/cms/fields/dates.ts` → in allen Collections |
| Collections | `pages`, `menus`, `categories`, `tags`, `articles`, `glossar` |
| Ausgabe | SEO-Meta im `<head>`: `description`, `og:title` / `og:description` / `og:url`, bei Hintergrundbild auch `og:image` (1200×630), Twitter-Card, Canonical, Sitemap-Link; bei Artikeln `reading-time` (+ Twitter Lesezeit); bei `modifiedDate` auch `article:modified_time` / `og:updated_time` |

Optional. Bei inhaltlichen Änderungen im CMS setzen.

## SEO (`seo`)

| Seite | Ort |
| --- | --- |
| Sveltia | YAML-Anchor `&field_seo` / Alias `*field_seo` in `public/admin/config.yml` |
| Astro (Zod) | `src/cms/fields/seo.ts` → in `src/content.config.ts` einbinden |

In weiteren Collections (z. B. `articles`) nur injizieren:

```yaml
fields:
  - { name: title, label: Titel, widget: string }
  - { name: body, label: Inhalt, widget: markdown }
  - *field_seo
```

Und im Astro-Schema:

```ts
import { seoSchema } from "./cms/fields/seo";

schema: z.object({
  title: z.string(),
  seo: seoSchema.optional(),
  // …
}),
```

## Eintrags-Gruppen nach `modifiedDate` (`hero` / `toc` / `background` / `layout`)

Auf **Seiten** und **Artikeln** folgen nach dem Änderungsdatum collapsible Objects (wie bei Einstellungen):

| CMS-Gruppe | Frontmatter | Felder |
| --- | --- | --- |
| **Hero überschreiben** | `hero` | `textAlign`, `showBreadcrumbs`, `borderBottom` (`none`/`line`/`logo`/`favicon`), optional `borderMarkAlign` / `borderMarkSize`; Overrides als Select (`null` / Werte). Unberührt + `omit_empty_optional_fields` = nicht in der YAML |
| **TOC überschreiben** | `toc` | `show` (Select wie Hero), `title`, `levels`; unberührt = globaler Default |
| **Seitenhintergrund einstellen** | `background` | `image`, `overlay` (ohne CMS-Default; leer → 40 im Render), `attribution` |
| **Inhaltsbreite** | `layout` | `contentWidth`, `afterHero`, `beforeFooter`; unberührt = Design → Inhaltsbreite / Inhaltsabstand |

Listen-Vorschau: Collection-Option `thumbnail: background.image` (Sveltia erkennt nested Images nicht automatisch).

Sveltia-Anchors: `&field_entry_hero`, `&field_entry_toc`, `&field_entry_background`, `&field_entry_layout`. Zod: `entryHeroSchema` / `entryTocSchema` in `site-config.ts`, `entryBackgroundSchema` in `page-background.ts`, `entryLayoutSchema` in `content-width.ts`.

### Seitenhintergrund (`background`)

| Seite | Ort |
| --- | --- |
| Astro | `background.image` als String; Auflösung `src/lib/cms-image.ts` |
| UI | `PageBackground.astro` — fixed, full viewport; `srcset` 640–1920 px WebP; Overlay 0–100 % |
| Nachweis | `background.attribution` → Liste auf `/impressum/` via `BackgroundAttributions.astro` |

Pfade: Shared Library `/assets/…` oder eintragsrelativ (Variante B). Nicht Astro-`image()` im Schema.

**Bildnachweis:** Freitext, URL oder HTML von Stock-Plattformen; Sanitizing `sanitizeAttributionHtml`.

### Inhaltsverzeichnis (`toc`)

| Seite | Ort |
| --- | --- |
| Astro | Resolve `resolveTocForCollection` — fehlt `toc.show` → global `enabled` |
| UI | `TableOfContents.astro` nach dem Hero; Einträge aus `src/lib/toc.ts` |

Anker-IDs: `github-slugger`.

**Hinweis:** YAML-Anchors gelten nur **innerhalb derselben** `config.yml`. Zod und YAML bei Feldänderungen gemeinsam pflegen.

## Header-/Footer-Code (`headCode` / `footerCode`)

| Ebene | Ort |
| --- | --- |
| Global | Einstellungen → Allgemein → Site-Code (`general.siteCode.headCode` / `footerCode`) |
| Seite | Collection `pages`, Felder „Header-Code“ / „Footer-Code“ |
| Widget | `widget: code`, `output_code_only: true`, `default_language: html`, `allow_language_selection: false` |
| Astro | Global aus `getSiteCodeConfig()`; Seite als Props an `BaseLayout.astro` |
| Injection | Vor `</head>` bzw. vor `</body>` (nach Site-Footer), per `set:html`. Reihenfolge: global, dann Seite. Im Wartungsmodus aus. |

Optional. HTML-Fragmente: `<style>` und `<script>` dürfen im selben Feld stehen. Sprachauswahl ist ausgeblendet (Highlighting fest HTML). Nur für vertrauenswürdige Redaktion (kein Sanitizing).

## Markdown-Inhalt: kein H1

Seiten-, Artikel-, Glossar- und Baustein-Bodies: Die sichtbare **H1** kommt aus dem Hero (`title`). Im Editor fehlt deshalb der Toolbar-Eintrag **H1** (`field_defaults.richtext.buttons` ohne `heading-one`). Beim Speichern greift zusätzlich ein `pattern`, das Zeilen mit `# …` (nicht `##`) ablehnt. Im Raw-Modus kann man `# ` noch tippen; Save blockt dann. Hinweis: `# ` in Codeblöcken kann das Muster fälschlich treffen.

## Inhalts-Blöcke (Seiten-/Artikel-Body)

Im CMS über die Markdown-Toolbar einfügen (wie Bilder):

| CMS-Block | Gespeicherter Marker | Optionen |
| --- | --- | --- |
| **Artikel-Listing** | `{{article-listing count="3" sort="newest" layout="grid" columns="3" gap="1.25" show="displayTitle,displayIntro,displayCategories,displayTags,displayAuthors,displayDate,displayReadingTime"}}` | Anzahl (`0` = alle), Sortierung, Layout (`grid` / `list`), Spalten, Abstand, Kartenfelder an/aus (`displayImage` / `displayTitle` / `displayIntro` / `displayCategories` / `displayTags` / `displayAuthors` / `displayDate` / `displayReadingTime`; Vorschaubild und Autoren opt-in). Vorschaubild = Titelbild, sonst Seitenhintergrund. **Bilddarstellung** `imageStyle`: `top-cover` (Default), `top-bleed`, `bottom-cover`, `bottom-bleed`, `left-cover`, `left-bleed`, `right-cover`, `right-bleed`. Bei left/right stehen Titel und Meta neben dem Bild. Reihenfolge fest (Bild → Titel → Intro → Taxonomien → Autoren → Datum/Lesezeit); CMS: Checkboxen, kein Verschieben. Optional Filter-Attrs: `authors`, `categories`, `tags` (kommagetrennte Slugs; innerhalb einer Art reicht ein Treffer). Im Editor: Filterfelder `filterAuthors` / `filterCategories` / `filterTags`. Mehrere Filterarten: `match="all"` (UND, Default) oder `match="any"` (ODER). **`linkable`:** Link zur Artikelseite (Default an; `linkable="false"` = nur Anzeige). Artikel-Prev/Next bleibt siteweit chronologisch. |
| **Kategorie-Listing** | `{{category-listing count="0" sort="title-asc" layout="grid" columns="3" gap="1.25"}}` | Wie Tag-Listing; Default-Layout Grid; Titel ohne Hashtag |
| **Tag-Listing** | `{{tag-listing count="0" sort="title-asc" layout="cloud" columns="3" gap="1.25"}}` | Anzahl (`0` = alle genutzten), Sortierung (`title-asc` / `title-desc` / `most-used`), Layout (`cloud` / `list` / `grid`), Spalten 1–4 (nur Grid), Abstand in rem |
| **Tagwolke** | `{{tag-cloud}}` | Kurzform für Tag-Listing mit Layout Wolke |
| **Autoren-Listing** | `{{author-listing}}` | Alle Autoren mit Avatar und Artikelanzahl (Seite `/autoren/`) |
| **Autor Social-Links** | `{{author-social}}` oder `{{author-social author="slug"}}` | Social-/Web-Links eines Autors mit Plattform-Icons. Ohne `author` auf dem Profil: angezeigter Autor (`defaultAuthorId`). Mit `author`: beliebiger Autoren-Slug. Hero-Liste unabhängig über `showSocialInHero`; Embed kann zusätzlich im Inhalt stehen. |
| **Glossar-Listing** | `{{glossar-listing count="0" sort="title-asc" layout="list" columns="2" gap="1.5"}}` | Anzahl (`0` = alle), Sortierung (`title-asc` / `title-desc` / `newest` / `oldest`), Layout (`list` / `grid`), Spalten 1–4 (nur Grid), Abstand in rem; **`linkable`** zur Glossar-Seite (Default an; `linkable="false"` = nur Anzeige) |
| **Baustein** | `{{block id="stack-uebersicht"}}` | `id` = Slug aus Collection `blocks` (Bausteine); Inhalt wird an Ort und Stelle injiziert |
| **Trennlinie** | `{{separator height="1" width="100" color="border" mark="logo" markAlign="center" markSize="24"}}` | Höhe in px (Default 1), Breite in % (Default 100), Farbe = Design-Token (`border` Standard = bisherige Linienfarbe; auch `text`, `text-muted`, `action`, `action-hover`, `action-muted`, `surface`, `surface-raised`, `bg`, `danger`). Optional `mark`: `none` (Default) / `logo` / `favicon` aus General; `markAlign` `left` / `center` (Default) / `right`; `markSize` in px (Default 24, 8–120) |
| **Abstandshalter** | `{{spacer}}` oder `{{spacer height="48"}}` | Vertikaler Leerraum in px (Default 32, Min. 1, Max. 600). Ohne sichtbare Linie. |
| **Button** | `{{button label="Mehr erfahren" href="/kontakt/" target="_self" style="solid" color="action" align="left"}}` | Pflicht: `label`, `href`. Optional: `target` (`_self` / `_blank`), `style` (`solid` / `outline`), `color` (gleiche Palette wie Trennlinie, Default `action`), `align` (`left` / `center` / `right` / `full`). Solid: Kontrast-Text automatisch |
| **Button-Gruppe** | `{{button-group items="Mehr|/kontakt/|solid|action|_self||Docs|https://…|outline|border|_blank" layout="stack-mobile" align="left" fullWidthMobile="true"}}` | Pflicht: `items` (`label\|href\|style\|color\|target`, Buttons mit `\|\|`). Optional: `layout` (`row` / `row-nowrap` / `stack-mobile` Default / `stack`), `align` (`left` / `center` / `right`), `fullWidthMobile` (`true` = unter 680px volle Breite pro Button). Kein `\|` in Werten. Einzelbutton bleibt `{{button}}` |
| **Karten-Grid** | `{{grid-cards cards="…" colsDesktop="3" colsTablet="2" colsMobile="1" gap="1.25" stretchLast="true"}}` | Pflicht: `cards` = `encodeURIComponent(JSON.stringify([…]))`. Optional: Spalten Desktop/Tablet/Mobile, `gap`, `stretchLast`. Pro Karte: `title` / `subtitle` / `text` / `image` / `imageStyle` / `button` (`label`/`href`/`target`/`style`/`color`/`align`) / `border` (`color`/`width`/`radius`) / `background` (`color`/`image`/`fit`) / `alignX`/`alignY`. Legacy-Flachfelder (`buttonLabel`, `borderColor`, `bgColor`, …) bleiben lesbar. |
| **Kontakt-E-Mail** | `{{contact-email}}` oder `{{contact-email layout="run-after"}}` | Adresse aus CMS `general.contactEmail` (falls gesetzt), sonst `CONTACT_EMAIL`; nicht im Markdown speichern. **Darstellung** (`layout`): `block` (Default, eigenständig), `run-after` (inline an vorherigen Absatz), `run-before` (inline an folgenden Absatz), `run-between` (zwischen zwei Textsegmenten). Embed-Zeile bleibt allein; Nachbartext im Markdown davor/danach mit Leerzeilen wie bei anderen Embeds. |
| **Logo** | `{{logo variant="header" width="120" unit="px" align="center"}}` | Site-Logo aus General → Logos (`header` / `sticky` / `footer`); Breite px oder %; Ausrichtung links/zentriert/rechts |
| **Repo-Dokument** | `{{repodoc path="docs/github/README.md" title="GitHub" description="Kurzer Satz"}}` | `path` = existierende Datei unter `docs/`; Link zu GitHub `main`; optional `title` / `description` |
| **Video** | `{{video provider="youtube" id="…" }}` oder `provider="file" src="datei.mp4"` | YT/Vimeo: Facade + Consent; Datenschutz-Link aus General → **Privacy page** (`privacyPage`, Anker `#eingebettete-videos`). **file**/R2: HTML5-`<video>`, Basis-URL unter Content → Medien (`videoBaseUrl`); optionales Poster per Medienauswahl; siehe [R2-Videos](../cloudflare/r2-videos.md) |
| **Video-Freischaltung widerrufen** | `{{video-consent-reset}}` | Button zum Widerruf (Datenschutz) |

Registrierung: `public/admin/editor-components.js`. Rendering: `ArticleListing.astro` / `GlossarListing.astro` / `TagListing.astro` / `CategoryListing.astro` / `AuthorListing.astro` / `AuthorSocialLinks.astro` / `Separator.astro` / `Spacer.astro` / `CmsButton.astro` / `CmsButtonGroup.astro` / `CmsGridCards.astro` / `ContactEmail.astro` / `RepoDocLink.astro` / `VideoEmbed.astro` / `MemberVideo.astro` / `VideoConsentReset.astro`; Bausteine werden in `content-embeds.ts` expandiert.

**Externe Links** im Markdown-Inhalt (Seiten, Artikel, Glossar, Embed-Markdown) öffnen in einem neuen Tab (`target="_blank"` + `rel="noopener noreferrer"`). Intern (`/…`, Anker, gleiche Domain) bleiben im selben Tab. Plugin: `src/lib/hast-external-links.ts`.
