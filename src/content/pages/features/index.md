---
title: Features
description: Überblick über die umgesetzten Funktionen von hautuu auf der Website und im Repo.
status: published
publishDate: 2026-10-06
modifiedDate: 2026-10-11
toc:
  show: true
  title: Inhalt
  levels:
  - h2
  - h3
background:
  image: olga-kovalski-eAmNjd0Zbts-unsplash.cleaned.webp
  overlay: 73
  attribution: |-
    Photo by <a href="https://unsplash.com/@kovalskihelga?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Olga Kovalski</a> on <a href="https://unsplash.com/photos/an-old-brick-building-with-a-tree-in-the-foreground-eAmNjd0Zbts?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
seo:
  seo_title: Features von hautuu
  seo_description: 'Was auf hautoo.storyofai.net steht: 24 Folgen, Sveltia CMS mit Collections und Content-Komponenten, Demo-Seite, Hero, Inhaltsbreite, Sticky Header, Glossar, SEO und Cloudflare Deploy.'
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
layout:
  contentWidth: wide

---

Hier siehst du, **was im Projekt schon gebaut ist** (Stand: öffentliches [Repo](/glossar/repository/) auf `main`). Details zu Begriffen im [**Glossar**](/glossar/), Antworten in der [**FAQ**](/faq/), Schritt für Schritt in den [**Artikeln**](/artikel/). Markdown und alle Content-Komponenten zum Anschauen: [**Demo**](/features/demo/).

## Inhalte und Redaktion

- **Screencast-Folgen als Artikel** (001 bis 024): How-tos zu [GitHub](/glossar/github/), [Cursor](/glossar/cursor/), [Cloudflare](/glossar/cloudflare-pages/), [Sveltia](/glossar/sveltia/) und Redaktion, mit Teaser, Tags und Querverweisen. Agenten-Output prüfen: [Folge 022](/artikel/folge-022-ki-aenderungen-pruefen-pr/). Demo und Einstellungen: [Folge 023](/artikel/folge-023-neue-features-demo-cms/). Eigenes Repo per Template privat: [Folge 024](/artikel/folge-024-github-template-privat/).
- **Statische Seiten** (Collection `pages`): Startseite, Artikelübersicht, Tags, Autoren, Glossar, FAQ, Über mich (Autorprofil), Impressum, Datenschutz, diese Features-Seite und die [Demo](/features/demo/) (Parent: Features).
- **Redaktionsregeln** im Repo (`docs/redaktion/`) und als [Cursor](/glossar/cursor/)-Regel: Schema, Stil, SEO-Felder, [Bausteine](/glossar/baustein/), Querverlinkung, PR-Checkliste.
- **Transkript-basierte Folgen**: Speech-to-Text korrigieren, nichts erfinden, Quellkommentar im Artikel ([Folge 015](/artikel/folge-015-transkript-artikel/)).

## CMS und Collections

- **[Sveltia CMS](/glossar/sveltia/)** unter `/admin/`: Inhalte im Browser bearbeiten; Speichern landet als Dateien in [Git](/glossar/git/) ([Glossar CMS](/glossar/cms/), [Folge 013](/artikel/folge-013-sveltia-pat/)).
- **Zugang** über [Cloudflare Worker](/glossar/cloudflare-worker/) mit [OAuth](/glossar/oauth/) statt nur [PAT](/glossar/pat/) ([Folge 014](/artikel/folge-014-sveltia-worker/)).
- **Entwurfsstatus** (`draft`, `published`, `future`, `trash`) für Pages, Artikel und Glossar.

### Collections und Relationen

- **pages:** Statische Seiten inkl. Start, Legal, Übersichten. Optional Parent-Seite; eigene URL ([#3](https://github.com/platomat/hautoo/issues/3)).
- **articles:** Screencast-Folgen und Beiträge. Relationen: 0..n **Kategorien**, **Tags**, **Autoren**; Videos nur per Content-Embed (`{{video …}}` / `{{member-video …}}`); **Titelbild** optional nur für Listings, auf der Einzelseite ausblendbar ([#98](https://github.com/platomat/hautoo/issues/98)); URL `/artikel/<slug>/` ([#4](https://github.com/platomat/hautoo/issues/4)).
- **categories:** Hierarchische Kategorien. Optional Parent; Relation von Artikeln; URL `/kategorien/<slug>/` ([#64](https://github.com/platomat/hautoo/issues/64)).
- **tags:** Schlagworte. Relation von Artikeln; optional passender Glossar-Slug; URL `/tags/<slug>/` ([#5](https://github.com/platomat/hautoo/issues/5)).
- **authors:** Autorenprofile (Name, Bio, Avatar/Gravatar; Social-/Web-URLs mit **Plattform-Icons**, optional im Hero; JSON-LD `Person` mit **`sameAs`**; Embed `{{author-social}}`; **freier Inhalt** mit Embeds statt Auto-Artikel-Listing). Relation von Artikeln; URL `/autoren/<slug>/` ([#77](https://github.com/platomat/hautoo/issues/77), [#85](https://github.com/platomat/hautoo/issues/85), [#86](https://github.com/platomat/hautoo/issues/86)).
- **glossar:** Begriffsseiten. Relationen: `relatedArticles`, `relatedTags`; URL `/glossar/<slug>/` ([#6](https://github.com/platomat/hautoo/issues/6)).
- **menus:** Navigation (`main`, `footer`, `footer-legal`, …) mit Label und Ziel ([#13](https://github.com/platomat/hautoo/issues/13), [#81](https://github.com/platomat/hautoo/issues/81)).
- **blocks:** Wiederverwendbare Bausteine ohne eigene URL; Einbinden per Content-Komponente `{{block}}`.
- **redirects:** Weiterleitungen ([#76](https://github.com/platomat/hautoo/issues/76)). Mehrere Quellen → ein Ziel (301/302); Build erzeugt `_redirects`.
- **settings:** Globale JSON-Einstellungen (**General**, **Wartungsmodus**, **Design**, **Content**); keine Relationen ([#45](https://github.com/platomat/hautoo/issues/45), [#101](https://github.com/platomat/hautoo/issues/101)).

## Content-Komponenten (Embeds)

Im Markdown über die Sveltia-Toolbar einfügbar; Speichern als `{{…}}`-Zeile; Rendering in `CmsContent.astro`. Jede Komponente allein in einer Zeile (mit Leerzeilen drumherum); Prüfung im Build (`check-content-embeds.py`). Alle auf der [Demo](/features/demo/) sichtbar.

- **Baustein** (`{{block id="…"}}`): Wiederverwendbarer Inhalt aus der Collection `blocks`, einmal pflegen und überall einbinden ([Folge 020](/artikel/folge-020-bausteine-fork/)).
- **Artikel-Listing** (`{{article-listing …}}`): Öffentliche Artikel als Grid oder Liste; Anzahl, Sortierung, Kartenfelder über `display*`-Tokens (Vorschaubild, Titel, Intro, Kategorien, Tags, Datum, Lesezeit, Autoren); Vorschaubild = Titelbild sonst Seitenhintergrund ([#95](https://github.com/platomat/hautoo/issues/95)); Bilddarstellung oben/unten/links/rechts × mit Rand/randlos (`imageStyle`); Filter nach Autoren/Kategorien/Tags (UND/ODER) getrennt von der Anzeige ([#78](https://github.com/platomat/hautoo/issues/78)); optional `linkable="false"` ohne Link zur Einzelansicht (Default an).
- **Kategorie-Listing** (`{{category-listing …}}`): Kategorien als Grid, Liste oder Wolke; optional begrenzt und sortiert.
- **Tag-Listing** (`{{tag-listing …}}`): Genutzte Tags als Wolke, Liste oder Grid; Sortierung nach Titel oder Häufigkeit.
- **Tagwolke** (`{{tag-cloud}}`): Kurzform für Tag-Listing im Layout Wolke.
- **Autoren-Listing** (`{{author-listing}}`): Alle Autoren mit Avatar und Artikelanzahl (z. B. auf `/autoren/`).
- **Autor Social-Links** (`{{author-social}}`): Social-/Web-Links mit Plattform-Icons; optional `author="slug"`, sonst Profilautor ([#86](https://github.com/platomat/hautoo/issues/86)).
- **Glossar-Listing** (`{{glossar-listing …}}`): Glossar-Einträge als Liste oder Grid; Anzahl und Sortierung wählbar; optional `linkable="false"` (Default an).
- **Button** (`{{button …}}`): Einzelner Aktionslink mit Stil (ausgefüllt/Kontur), Farbe, Ziel und Ausrichtung inkl. voller Breite.
- **Button-Gruppe** (`{{button-group …}}`): Mehrere Buttons in einer Gruppe; Layout nebeneinander (mit/ohne Umbruch), mobil untereinander oder immer gestapelt; Ausrichtung der Gruppe; optional volle Breite auf Mobile ([#83](https://github.com/platomat/hautoo/issues/83)).
- **Trennlinie** (`{{separator …}}`): Horizontale Linie mit Höhe, Breite und Design-Token-Farbe; optional Logo oder Favicon aus den Einstellungen auf der Linie (Position links/mitte/rechts, Größe in px, Default 24) ([#97](https://github.com/platomat/hautoo/issues/97)).
- **Abstandshalter** (`{{spacer …}}`): Vertikaler Leerraum in Pixeln ohne sichtbare Linie.
- **Kontakt-E-Mail** (`{{contact-email}}`): Adresse aus General → Contact email oder Build-Variable `CONTACT_EMAIL`, obfuscated im Markup.
- **Logo** (`{{logo …}}`): Site-Logo aus General → Logos (Header/Sticky/Footer) mit Breite und Ausrichtung ([#79](https://github.com/platomat/hautoo/issues/79)).
- **Video** (`{{video …}}`): YouTube/Vimeo mit Consent-Facade (Datenschutz-Link aus Privacy page); nach Freigabe füllt der Player die 16:9-Box. Alternativ selbst gehostete MP4 über R2. Ecken-Radius aus Design → Ecken abrunden → Videos (gilt auch für `{{member-video …}}`).
- **Video-Freischaltung widerrufen** (`{{video-consent-reset}}`): Button, der die gespeicherte Video-Einwilligung im Browser löscht.
- **Repo-Dokument** (`{{repodoc …}}`): Hinweisbox mit Link zu einer Datei unter `docs/` auf GitHub (`main`).

Zusätzlich in der Toolbar: **Bild** und **Codeblock** (Sveltia-Standard, kein eigenes `{{…}}`-Embed).

## Settings (Konfiguration)

Globale Defaults unter **Einstellungen** im CMS (`settings`: General, Wartungsmodus, Design, Content) ([#45](https://github.com/platomat/hautoo/issues/45)).

### Settings → General

- **Website title** und optionale **Description** / Slogan ([#75](https://github.com/platomat/hautoo/issues/75)); Description auch im Footer-Brand.
- **Footer copyright:** Claim und Trenner links; **Show center logo** für das kleine Icon in der Mitte (GitHub-Icon bei gesetztem Repo, sonst Site-Logo).
- **Contact email** für `{{contact-email}}` (sonst Build-Variable `CONTACT_EMAIL`).
- **Privacy page:** Relation zur Datenschutz-Seite (u. a. Link in der Video-Einwilligung).
- **GitHub repository** (`owner/name`) für das Footer-Mitte-Icon, wenn Center logo an ist.
- **Logos** aus der Mediathek: Header, optional Sticky, Footer ([#79](https://github.com/platomat/hautoo/issues/79)).
- **Favicons** aus der Mediathek: Standard und optional dunkel ([#80](https://github.com/platomat/hautoo/issues/80)).

### Settings → Wartungsmodus (#101)

- **Aktiv:** Production-Build blendet Inhalte aus und zeigt nur Titel, Markdown-Text, optionalen Hintergrund und Copyright-Footer. Lokal (`astro dev`) bleibt die Site sichtbar; Banner erinnert an den Modus. Sitemap ohne Einträge; `llms.txt` / `agents.txt` nur Stub; Suchindex leer.
- **Titel** (H1 + SEO), **Beschreibung** (Markdown), **Hintergrund** mit Abdunkelung wie bei Seiten.

### Settings → Design

- **Farbpalette** (CSS-Variablen, inkl. Alpha für Glas; Untermenü-Hintergrund und -Text separat) ([#70](https://github.com/platomat/hautoo/issues/70), [#84](https://github.com/platomat/hautoo/issues/84)).
- **Schrift:** Fließtext und Überschriften (Fontsource), Basisgröße, Gewicht, H1–H6 Größe/Transform ([#71](https://github.com/platomat/hautoo/issues/71)).
- **Header:** Logo-Position links / rechts / **mittig** (Menü darunter) ([#74](https://github.com/platomat/hautoo/issues/74)); Menü aus Collection Menüs wählbar (Standard `main`, [#91](https://github.com/platomat/hautoo/issues/91)); Suchlupe hinter den Menüpunkten; Inhaltsbreite der Header-Zeile (Standard/breit/vollbreit); Ruhehöhe und Sticky ein/aus sowie kompakte Sticky-Höhe pro Breakpoint ([#44](https://github.com/platomat/hautoo/issues/44)); Anker-Sprünge (TOC) mit `scroll-padding`.
- **Footer-Brand** oberhalb der Copyright-Zeile ([#81](https://github.com/platomat/hautoo/issues/81)): Logo (Größe einstellbar), Description und Menü; Bausteine einzeln und per Drag-and-Drop; Layout Nebeneinander/Untereinander; Menü-Links neben- oder untereinander; Shell-Breiten für Brand und Copyright-Zeile; Hintergrund mit Verlauf von transparent zur Chrome-Farbe (ohne oberen Rand).
- **Footer Copyright-Zeile:** Legal-Menü wählbar (Standard `footer-legal`, wie Brand → Menü) ([#96](https://github.com/platomat/hautoo/issues/96)); Shell-Breite und Border-Breite (`full` / `shell`).
- **Hero-Defaults** pro Collection: Ausrichtung, Brotkrumen, Trenner, Trennlinie unten als Linie / Logo / Favicon (wie Separator-Embed) ([#63](https://github.com/platomat/hautoo/issues/63)).
- **Inhaltsbreite** Standard / breit / vollbreit für Seiten, Artikel sowie Kategorien, Tags, Autoren und Glossar ([#59](https://github.com/platomat/hautoo/issues/59), [#90](https://github.com/platomat/hautoo/issues/90)).
- **Abstand** unter Hero und vor Footer, pro Collection ([#73](https://github.com/platomat/hautoo/issues/73)).
- **Ecken abrunden:** Radius in Pixeln getrennt für Inhalts-Bilder und Videos (inkl. Member-Video).

### Settings → Content

- **Inhaltsverzeichnis (TOC):** an/aus, Ebenen, Titel für Seiten und Artikel ([#51](https://github.com/platomat/hautoo/issues/51)).
- **Autoren:** Platzierung auf der Artikel-Einzelseite (Hero / Ende / beides / aus) und Avatar-Form ([#77](https://github.com/platomat/hautoo/issues/77)).
- **Medien:** Video-Basis-URL für selbst gehostete Dateien (z. B. Cloudflare R2).

### Lokale Overrides an Seite und Artikel

- Hero, TOC, Inhaltsbreite und Abstand überschreibbar; optional **Head-Code** und **Footer-Code** (HTML, Highlighting fest auf HTML).

## Glossar, Taxonomien und Autoren (Seiten)

- **Glossar** mit Kurzdefinition, längerer Erklärung und Querverweisen; viele Begriffe unter `/glossar/<slug>/`.
- **Erstes sinnvolles Glossar-Vorkommen** pro Seite verlinkt; Hilfsskript und Erstlink-Warnung im [Build](/glossar/build/).
- **FAQ** als eine lange Seite mit Themengruppen (H2), offen durchsuchbar (kein Accordion).
- **Kategorie-Seiten** mit Parent-Brotkrumen, Unterkategorien und Artikel-Grid.
- **Tag-Seiten** mit Artikel-Grid; Link zum Glossar, wenn der Slug passt. Am Artikel: `tagPlacement` (Hero, nach Inhalt oder beides); Kategorien immer im Hero.
- **Autoren-Seiten** (Avatar, Bio, Social-Links mit Icons / optional im Hero, freier Inhalt mit Embeds oder Auto-Artikelliste) und Übersicht `/autoren/`. Embed `{{author-social}}`; JSON-LD `Person` inkl. `sameAs`.
- **Artikel-Übersicht** `/artikel/` mit Seitenleiste (Kategorie-Tree, genutzte Tags); auf Desktop sticky, wenn die Leiste in den Viewport passt.

## SEO und Auffindbarkeit

- **SEO-Objekt** pro Page und Artikel: Tab-Titel, Meta-Description, Robots ([Folge 004](/artikel/folge-004-collection-pages/)).
- **Open Graph und Twitter Cards**: Titel, Beschreibung, Canonical, optional OG-Bild aus dem Seitenhintergrund (1200×630).
- **JSON-LD Person** auf Autor-Profilen inkl. `sameAs` aus Social-/Web-URLs ([#86](https://github.com/platomat/hautoo/issues/86)).
- **Lesezeit** in Artikel-Meta und auf Listing-Karten.
- **Sitemap** ohne Impressum, Datenschutz und `/admin`; Legal-Seiten mit **noindex**.
- **`llms.txt`** und **`agents.txt`**: automatisch und deterministisch aus veröffentlichten, indexierbaren Collection-Einträgen ([#99](https://github.com/platomat/hautoo/issues/99)); Hinweise auch in `robots.txt`.

## Design und Nutzung

- **Suche im Header** (MiniSearch): statischer Suchindex beim Build.
- **Dark Theme** mit [CSS-Variablen](/glossar/css-variable/), responsive Header mit Mobile-Menü.
- **Farbpalette**, **Schrift**, **Sticky Header**, **Hero**, **Inhaltsbreite** und **Abstand** redaktionell unter Einstellungen → Design (siehe oben).
- **Eigene Schriften:** Ordner `src/fonts/custom/<id>/` (z. B. Transfonter-CSS + WOFF2); Sync trägt sie automatisch in Design → Schrift und die lokale Auslieferung ein.
- **Brotkrumen** mit wählbarem Trenner; Start als Haus-Icon; UI-Icons für Permalink und Kategorie ([#31](https://github.com/platomat/hautoo/issues/31)).
- **Breakpoints** und gemeinsame Layout-Hilfsklassen ([docs/design](https://github.com/platomat/hautoo/blob/main/docs/design/README.md)).
- **Vollbild-Hintergrund** optional mit Overlay und **Bildnachweis** für Seiten, Artikel und Autoren-Profile ([#93](https://github.com/platomat/hautoo/issues/93), [#94](https://github.com/platomat/hautoo/issues/94)); Nachweise gesammelt im Impressum.
- **Bilder** neben dem Content (Variante B), Astro-Optimierung inkl. CMS-Pfade unter `/assets/` ([Folge 021](/artikel/folge-021-bilder-suchen-nutzen/)).
- **Externe Links** öffnen in neuem Tab mit Pfeil-Indikator (nicht Header/Footer).
- **Artikel-Navigation** (älter/neuer); Listing-Seiten oft Breite **breit**.

## Deployment und Workflow

- **Statische Site** mit [Astro](/glossar/astro/), Auslieferung über **[Cloudflare Pages](/glossar/cloudflare-pages/)** aus GitHub `main` ([Folge 011](/artikel/folge-011-cloudflare-setup/)).
- **Preview-[Branches](/glossar/branch/)** und [Rollback](/glossar/rollback/) ([Folge 012](/artikel/folge-012-cloudflare-branches/)).
- **Build-ID** für Cache-Busting; `_headers`; CMS-Redirects → `_redirects`.
- **Öffentliches Repo** `platomat/hautoo`, [Issues](/glossar/issue/) und [Pull Requests](/glossar/pull-request/) auf Deutsch.

## Dokumentation, Qualität und Agenten

- **Projekt-Doku** unter `docs/` (GitHub, Cloudflare, Sveltia, Astro, Redaktion, Sicherheit).
- **Cursor-Regeln** in `.cursor/rules/`.
- **Link-Check** im `prebuild` (`check-content-links.py`, inkl. Embed-Check).
- **Hilfsskripte** z. B. Glossar-Querverweise und SEO-Bulk-Pflege.

Neue Funktionen bitte hier und in der [README auf GitHub](https://github.com/platomat/hautoo#features) nachpflegen (siehe Redaktions-Doku).
