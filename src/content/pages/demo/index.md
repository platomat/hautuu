---
title: Demo
description: Übersicht aller Markdown-Elemente und Content-Komponenten von hautuu.
status: published
publishDate: 2026-10-04
modifiedDate: 2026-10-11
parent: features
hero:
  borderBottom: false
toc:
  show: true
  title: Inhalt
  levels:
    - h2
    - h3
background:
  image: /assets/brayden-law-kTQ1m-vTOsg-unsplash.webp
  overlay: 88
  attribution: Photo by <a href="https://unsplash.com/@braydenlaw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Brayden Law</a> on <a href="https://unsplash.com/photos/people-dining-at-neon-city-restaurant-kTQ1m-vTOsg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
layout:
  contentWidth: wide
seo:
  seo_title: Demo · Markdown und Komponenten
  seo_description: Demo-Seite mit Überschriften, Text, Links, Bildern und allen CMS-Content-Komponenten von hautuu.
  index_visibility: index
  follow_visibility: follow
  noarchive: false
  noimageindex: false
  nosnippet: false
  max_snippet_enabled: true
  max_snippet: -1
  max_video_preview_enabled: true
  max_video_preview: -1
  max_image_preview_enabled: true
  max_image_preview: large
---

Diese Seite zeigt **Markdown** und die **Content-Komponenten** aus der Sveltia-Toolbar. Parent ist [Features](/features/); URL: `/features/demo/`.

## Markdown: Text und Inline

Normaler Absatz mit **fett**, _kursiv_, **_beidem_** und `inline code`. Interner Link zum [Glossar](/glossar/), externer Link zu [GitHub](https://github.com/platomat/hautoo/).

> Blockzitat: so sieht ein Zitat im Fließtext aus.

### Aufzählungen

- Ungeordnet Punkt eins
- Punkt zwei mit [Link](/artikel/)
- Punkt drei

1. Geordnet erster Schritt
2. Zweiter Schritt
3. Dritter Schritt

### Codeblock

```js
const greeting = "Hallo hautuu";
console.log(greeting);
```

### Tabelle (Markdown)

| Spalte A | Spalte B |
| --- | --- |
| Zeile 1 | Wert |
| Zeile 2 | Wert |

## Überschriften H2 bis H6

### H3 Unterabschnitt

#### H4 Unterabschnitt

##### H5 Unterabschnitt

###### H6 Unterabschnitt

Text unter H6.

## Bild

![Stack-Übersicht - Bausteine im Überblick](/assets/stack-uebersicht-invert.webp)

## Buttons

{{button label="Solid Aktion" href="/features/"}}

{{button label="Outline" href="/artikel/" style="outline"}}

{{button label="Extern" href="https://github.com/platomat/hautoo/" target="_blank"}}

### Button-Gruppe

Nebeneinander, auf schmalen Viewports untereinander (`layout="stack-mobile"`):

{{button-group items="Mehr erfahren|/features/|solid|action|_self||Artikel|/artikel/|outline|action|_self||GitHub|https://github.com/platomat/hautoo/|outline|border|_blank"}}

Immer untereinander, zentriert:

{{button-group items="Primär|/features/|solid|action|_self||Sekundär|/faq/|outline|action|_self" layout="stack" align="center"}}

Mit voller Breite auf Mobile (`fullWidthMobile="true"`):

{{button-group items="Primär|/features/|solid|action|_self||Sekundär|/faq/|outline|action|_self" fullWidthMobile="true"}}

### Karten-Grid

Drei Spalten Desktop, Stretch der allein stehenden vierten Karte:

{{grid-cards stretchLast="true" cards="%5B%7B%22title%22%3A%22Astro%22%2C%22subtitle%22%3A%22Static%22%2C%22text%22%3A%22Schnelle%20Seiten%20ohne%20Server.%22%2C%22buttonLabel%22%3A%22Features%22%2C%22buttonHref%22%3A%22%2Ffeatures%2F%22%2C%22borderColor%22%3A%22border%22%2C%22borderWidth%22%3A1%2C%22borderRadius%22%3A6%2C%22bgColor%22%3A%22surface%22%2C%22alignX%22%3A%22left%22%2C%22alignY%22%3A%22top%22%2C%22imageStyle%22%3A%22top-cover%22%7D%2C%7B%22title%22%3A%22Sveltia%22%2C%22subtitle%22%3A%22CMS%22%2C%22text%22%3A%22Inhalte%20im%20Browser%20pflegen.%22%2C%22buttonLabel%22%3A%22FAQ%22%2C%22buttonHref%22%3A%22%2Ffaq%2F%22%2C%22borderColor%22%3A%22border%22%2C%22borderWidth%22%3A1%2C%22borderRadius%22%3A6%2C%22bgColor%22%3A%22surface%22%2C%22alignX%22%3A%22left%22%2C%22alignY%22%3A%22top%22%2C%22imageStyle%22%3A%22top-cover%22%7D%2C%7B%22title%22%3A%22Cloudflare%22%2C%22subtitle%22%3A%22Hosting%22%2C%22text%22%3A%22Deploy%20aus%20Git.%22%2C%22buttonLabel%22%3A%22Hosting%22%2C%22buttonHref%22%3A%22%2Ffaq%2F%22%2C%22borderColor%22%3A%22border%22%2C%22borderWidth%22%3A1%2C%22borderRadius%22%3A6%2C%22bgColor%22%3A%22surface%22%2C%22alignX%22%3A%22left%22%2C%22alignY%22%3A%22top%22%2C%22imageStyle%22%3A%22top-cover%22%7D%2C%7B%22title%22%3A%22Cursor%22%2C%22subtitle%22%3A%22KI%22%2C%22text%22%3A%22Mit%20Agenten%20am%20Repo%20arbeiten.%22%2C%22buttonLabel%22%3A%22Artikel%22%2C%22buttonHref%22%3A%22%2Fartikel%2F%22%2C%22borderColor%22%3A%22action%22%2C%22borderWidth%22%3A2%2C%22borderRadius%22%3A8%2C%22bgColor%22%3A%22action-muted%22%2C%22alignX%22%3A%22center%22%2C%22alignY%22%3A%22center%22%2C%22imageStyle%22%3A%22top-cover%22%7D%5D"}}

## Logo

{{logo variant="header" width="120" unit="px" align="left"}}

## Trennlinie und Abstand

{{separator height="1" width="100"}}

{{spacer height="24"}}

## Trennlinie mit Logo (links)

{{separator height="1" width="100" mark="logo" markAlign="left" markSize="42"}}

## Trennlinie mit Logo (mittig)

{{separator height="1" width="100" mark="logo" markSize="42"}}

## Trennlinie mit Logo (mittig, kurz & dick)

{{separator height="3" width="66" mark="logo" markSize="42"}}

## Trennlinie mit Logo (rechts)

{{separator height="1" width="100" mark="logo" markAlign="right" markSize="42"}}

## Trennlinie mit Favicon (links)

{{separator height="1" width="100" mark="favicon" markAlign="left"}}

## Trennlinie mit Favicon (mittig)

{{separator height="1" width="100" mark="favicon"}}

## Trennlinie mit Favicon (rechts)

{{separator height="1" width="100" mark="favicon" markAlign="right"}}

## Kontakt-E-Mail

{{contact-email}}

## Repo-Dokument

{{repodoc path="docs/github/README.md" title="GitHub" description="Kurzüberblick zur Doku im Repo."}}

## Baustein

{{block id="stack-uebersicht"}}

## Listings

### Artikel-Listing

{{article-listing count="2" sort="newest" layout="grid" columns="2" gap="1.25" show="displayTitle,displayIntro,displayCategories,displayTags,displayDate,displayReadingTime" authors="wasilij"}}

### Artikel-Listing mit Vorschaubild (oben, mit Rand)

{{article-listing count="3" sort="newest" layout="grid" columns="3" gap="1.25" show="displayImage,displayTitle,displayIntro,displayCategories,displayTags,displayDate,displayReadingTime" authors="testautor" imageStyle="top-cover"}}

### Artikel-Listing mit Vorschaubild (oben, randlos)

{{article-listing count="3" sort="newest" layout="grid" columns="3" gap="1.25" show="displayImage,displayTitle,displayIntro,displayCategories,displayTags,displayDate,displayReadingTime" authors="testautor" imageStyle="top-bleed"}}

### Artikel-Listing mit Vorschaubild (unten, mit Rand)

{{article-listing count="3" sort="newest" layout="grid" columns="3" gap="1.25" show="displayImage,displayTitle,displayIntro,displayCategories,displayTags,displayDate,displayReadingTime" authors="testautor" imageStyle="bottom-cover"}}

### Artikel-Listing mit Vorschaubild (unten, randlos)

{{article-listing count="3" sort="newest" layout="grid" columns="3" gap="1.25" show="displayImage,displayTitle,displayIntro,displayCategories,displayTags,displayDate,displayReadingTime" authors="testautor" imageStyle="bottom-bleed"}}

### Artikel-Listing mit Vorschaubild (links, mit Rand)

{{article-listing count="3" sort="newest" layout="grid" columns="1" gap="1.25" show="displayImage,displayTitle,displayIntro,displayCategories,displayTags,displayDate,displayReadingTime" authors="testautor" imageStyle="left-cover"}}

### Artikel-Listing mit Vorschaubild (links, randlos)

{{article-listing count="3" sort="newest" layout="grid" columns="1" gap="1.25" show="displayImage,displayTitle,displayIntro,displayCategories,displayTags,displayDate,displayReadingTime" authors="testautor" imageStyle="left-bleed"}}

### Artikel-Listing mit Vorschaubild (rechts, mit Rand)

{{article-listing count="3" sort="newest" layout="grid" columns="1" gap="1.25" show="displayImage,displayTitle,displayIntro,displayCategories,displayTags,displayDate,displayReadingTime" authors="testautor" imageStyle="right-cover"}}

### Artikel-Listing mit Vorschaubild (rechts, randlos)

{{article-listing count="3" sort="newest" layout="grid" columns="1" gap="1.25" show="displayImage,displayTitle,displayIntro,displayCategories,displayTags,displayDate,displayReadingTime" authors="testautor" imageStyle="right-bleed"}}

### Kategorie-Listing

{{category-listing count="4" sort="title-asc" layout="grid" columns="2" gap="1.25"}}

### Tag-Listing

{{tag-listing count="6" sort="title-asc" layout="grid" columns="3" gap="1"}}

### Tagwolke

{{tag-cloud}}

### Autoren-Listing

{{author-listing}}

### Glossar-Listing

{{glossar-listing count="4" sort="title-asc" layout="grid" columns="2" gap="1.25"}}

## Video

Consent-Facade (YouTube-Beispiel, Big Buck Bunny):

{{video provider="youtube" id="aqz-KE-bpKQ" title="Demo-Video"}}

### Video-Freischaltung widerrufen

Nach dem Abspielen speichert der Browser die Einwilligung lokal (`localStorage`). Mit dem Button darunter kannst du sie wieder löschen; danach erscheint die Consent-Facade erneut.

{{video-consent-reset}}
