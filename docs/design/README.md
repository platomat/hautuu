# Design & Erscheinungsbild

Wie die Website **aussehen und wirken** soll. Umsetzung in CSS/Astro folgt diesen Vorgaben.

## Logo

- **Default:** `/assets/logo-mark.svg`, wenn CMS-Logos leer
- **CMS:** Einstellungen → Allgemein → **Logos** (`header` / `headerSticky` / `footer`) aus der Mediathek; Darstellung wie in der Datei (`LogoMark.astro`, #79), keine CSS-Umfärbung oder Hover-Skalierung
- **Wortmarke:** aus CMS **Einstellungen → Allgemein → Website title** (`settings/general.json`), neben dem Mark im Header
- **Footer-Copyright:** CMS General → Footer copyright (`startYear` / `claim` / `separator` / `showCenterLogo`); Mitte bei `showCenterLogo` an und gesetztem `githubRepo` GitHub-Icon, sonst Site-Logo → Startseite; `showCenterLogo` aus = leere Mitte
- **Footer-Brand / Copyright:** CMS Content → Footer → Brand (ohne oberen Rand, Verlauf) und Copyright-Zeile (`contentWidth`, `borderWidth` full/shell); Header `contentWidth` ([#81](https://github.com/platomat/hautoo/issues/81))
- **Inhalt:** Content-Komponente `{{logo variant="header" width="120" unit="px" align="center"}}`
- **Favicon:** CMS General → **Favicons** (`default` / `dark`, #80); leer = `/assets/favicon.svg`. Optional dunkles Icon per `prefers-color-scheme`

## Prinzipien

- **Dunkel** — dunkles Farbschema als Standard (kein Hellmodus in v1)
- **Schlicht** — wenig Dekoration, keine unnötigen Karten, Schatten oder Badges
- **Übersichtlich** — klare Hierarchie, genug Weißraum (auf dunklem Grund: Luft zwischen Blöcken), eine Aufgabe pro Abschnitt

## Typografie

Redaktionell unter **Einstellungen → Design → Schrift** (`design.typography`). Defaults entsprechen dem bisherigen Ubuntu-Setup:

| Rolle | CMS-Feld | Default |
| --- | --- | --- |
| Fließtext | `bodyFont` / `bodyWeight` | Ubuntu · 300 |
| Überschriften | `headingFont` + `headings.h1`–`h6` | Ubuntu · Größe/Stärke/Transform pro Ebene |
| Basisgröße | `baseSize` | 16 px (`html` font-size) |

- Katalog (Fontsource-IDs): Ubuntu, Inter, Open Sans, Source Sans 3, Roboto, Lato, Nunito Sans, IBM Plex Sans, Merriweather, Lora, Source Serif 4
- Zeilenlänge Fließtext: ca. 60–75 Zeichen, angenehme `line-height` (z. B. 1.6)
- Content-Überschriften (`.page h2`–`h6` ohne Klasse): **mehr Abstand nach oben** als nach unten, damit Überschrift + folgender Text als Block wirken (z. B. FAQ Frage→Antwort)

### Bereitstellung (#71)

Beim Build (`scripts/sync-site-fonts.mjs`, auch `predev`):

1. **Fontsource-Katalog** (`src/cms/fields/site-fonts.json`): gewählte Schnitte von jsDelivr nach `public/fonts/<id>/`
2. **Eigene Schriften:** Ordner `src/fonts/custom/<id>/` mit Transfonter-`stylesheet.css` (+ Dateien). Der Sync liest `@font-face`, trägt die Schrift in den Katalog ein und legt **immer** `public/fonts/<id>/` inkl. `stylesheet.css` an (für optionalen `<link>` im Head-Code). Als Design-Schrift gewählt: zusätzlich in `fonts.generated.css`. Transfonter-Pfad egal.

Besucher sehen **keine** externe Schrift-Anfrage.

| Artefakt | Rolle |
| --- | --- |
| `src/fonts/custom/<id>/` | Quelle (+ optional `meta.json`) |
| `public/fonts/<id>/…` + `stylesheet.css` | Immer ausgeliefert; Head: `<link href="/fonts/<id>/stylesheet.css">` |
| `src/styles/fonts.generated.css` | `@font-face` für gewählte Design-Schriften |
| `src/cms/fields/site-fonts.generated.json` | CMS-/Zod-Katalog (Fontsource + custom) |
| Inline `:root` in `BaseLayout` | Größen/Stärken/Transform (`src/lib/site-typography.ts`) |

Kurz: Ordner anlegen → Sync → Dateien unter `/fonts/<id>/`. Site-weit über Design → Schrift, oder gezielt per Head-Code-Link. Details: `src/fonts/custom/README.md`.

Preload der benötigten Latin-WOFF2 in `BaseLayout`. Fehlt ein Fontsource-Schnitt, wählt der Sync den nächsten verfügbaren Weight.

## Links

- **Keine Unterstreichung** (`text-decoration: none`)
- Farbe = **Aktionsfarbe** (`--color-action`)
- Hover: etwas heller (`--color-action-hover`), optional leichte Opacity — weiterhin ohne Unterstreichung
- **Externe Links** im Inhalt (`target="_blank"`, nicht Header/Footer): kleiner Pfeil `↗` per `::after` (`.site-main a[target="_blank"]::after`); ausgenommen u. a. CMS-Buttons und Autor-Social-Links (`.author-social`)
- Fokus: sichtbarer Fokusring in Aktionsfarbe (Tastaturbedienbarkeit)

## Farbpalette

Grün ist die **primäre Aktionsfarbe**. Die übrigen Töne sind kühl-neutral mit leicht grünem Stich, damit alles zusammenpasst, nicht lila, nicht grell.

Redaktionell unter **Einstellungen → Design → Farbpalette** (`src/content/settings/design.json` → `colors`). Beim Build schreibt `BaseLayout` die Werte als `:root` (`src/lib/site-colors.ts`). Die Palette liegt nicht in `global.css` (sonst würde das gebündelte CSS die CMS-Werte überschreiben).

### CSS-Variablen (`:root`)

| Variable | CMS-Feld | Default | Rolle |
| --- | --- | --- | --- |
| `--color-bg` | `bg` | `#0f1412` | Seitenhintergrund |
| `--color-surface` | `surface` | `#1a211e` | Solide Flächen (Panels; Chrome ohne Glas-Alpha) |
| `--color-surface-glass` | `surfaceGlass` (mit Alpha) | `#1a211ee6` | Halbtransparent (Header/Footer, Overlays) |
| `--color-chrome` | (abgeleitet) | `var(--color-surface)` | Header/Footer/Nav; bei Glas-Alpha → `surface-glass` |
| `--color-surface-raised` | `surfaceRaised` | `#232b27` | leicht angehoben (z. B. Code, Zitat) |
| `--color-border` | `border` | `#2e3833` | Linien, Trenner |
| `--color-text` | `text` | `#e8eeea` | Haupttext |
| `--color-text-muted` | `textMuted` | `#9aa89f` | Nebentext, Meta, Captions |
| `--color-action` | `action` | `#3dcf8e` | Primär / Links / Buttons / Fokus |
| `--color-action-hover` | `actionHover` | `#56d9a0` | Hover-Zustand der Aktion |
| `--color-action-muted` | `actionMuted` | `#1a3d2e` | dezenter Aktions-Hintergrund (z. B. Chip, Hover-Fläche) |
| `--color-danger` | `danger` | `#e57373` | Fehler, destruktive Hinweise |
| `--color-submenu-bg` | `submenuBg` (Alpha möglich) | `#1a211e` | Hintergrund Nav-Untermenü (Flyout / Akkordeon) |
| `--color-submenu-text` | `submenuText` | `#e8eeea` | Textfarbe der Links im Untermenü |

Wenn Design → `surfaceGlass` Alpha < 1 hat (`body.has-chrome-glass`), nutzen Header und Footer `--color-surface-glass` plus leichtes `backdrop-filter` (auch ohne Seiten-Hintergrundbild, damit Inhalt unter dem Sticky-Header durchscheint). Seiten-BG setzt zusätzlich `body.has-page-bg` (Stacking). Das Nav-Untermenü nutzt eigene Farben (`submenuBg` / `submenuText`), damit Einträge über Glas lesbar bleiben ([#84](https://github.com/platomat/hautoo/issues/84)).

### Kurzüberblick

```text
Hintergrund     #0F1412  ████
Fläche          #1A211E  ████
Fläche Glas     rgba(26,33,30,.5)  (über BG-Bild)
Erhöht          #232B27  ████
Rahmen          #2E3833  ████
Text            #E8EEEA  ████
Text gedämpft   #9AA89F  ████
Aktion / Primär #3DCF8E  ████
Aktion Hover    #56D9A0  ████
Aktion gedämpft #1A3D2E  ████
Gefahr          #E57373  ████
```

### Beispiel `:root`

```css
:root {
  --color-bg: #0f1412;
  --color-surface: #1a211e;
  --color-surface-glass: rgba(26, 33, 30, 0.5);
  --color-chrome: var(--color-surface);
  --color-surface-raised: #232b27;
  --color-border: #2e3833;
  --color-text: #e8eeea;
  --color-text-muted: #9aa89f;
  --color-action: #3dcf8e;
  --color-action-hover: #56d9a0;
  --color-action-muted: #1a3d2e;
  --color-danger: #e57373;

  --font-sans: "Ubuntu", system-ui, sans-serif;
  --font-weight-body: 300;
  --font-weight-heading: 700;
}
```

## Layout & UI (Leitplanken)

- Maximale Inhaltsbreite begrenzt (Lesbarkeit), nicht Full-Bleed-Text über den ganzen Monitor
- Navigation und Fließtext klar getrennt; wenig gleichzeitige CTAs
- Keine Card-Optik als Default (Rahmen/Schatten nur wenn Interaktion es braucht)
- Kontrast Text/Hintergrund prüfen (WCAG möglichst AA)

## Breakpoints

| Name | Bedingung | Bedeutung |
| --- | --- | --- |
| Desktop | `≥ 1024px` | Standard-Desktop |
| Tablet | `< 1024px` | Tablet (und kleiner, bis Mobile greift) |
| Mobile | `< 680px` | Smartphone |

Breakpoint-**CSS-Variablen** in `:root` (`src/styles/global.css`): `--bp-tablet: 1024px`, `--bp-mobile: 680px`. In `@media` dieselben Pixelwerte nutzen (`max-width: 1023px` / `max-width: 679px`), weil Media Queries CSS-Variablen nicht zuverlässig auswerten.

Footer-Copyright-Zeile: ab Mobile untereinander und zentriert (Utilities `stack-on-mobile` + `center-on-mobile`).

### Sticky Header

Über CMS **Einstellungen → Design → Header** (`src/content/settings/design.json`):

| Einstellung | Default | Wirkung |
| --- | --- | --- |
| `logoPosition` | `left` | Logo links / rechts, oder `center` (Menü ab Tablet unter dem Logo) ([#74](https://github.com/platomat/hautoo/issues/74)). Suchlupe immer hinter den Menüpunkten. |
| `contentWidth` | `wide` | Innenbreite wie Inhalt: `default` / `wide` / `full` (42 / 64 / 80 rem) |
| `menu` | `main` | Menü-Slug für die Hauptnavigation (Collection Menüs), wie Footer Brand → Menü ([#91](https://github.com/platomat/hautoo/issues/91)) |
| Ruhehöhe Desktop/Tablet/Mobile | 64 / 64 / 56 | Höhe am Seitenanfang; ohne Sticky Mindesthöhe |
| Sticky pro Breakpoint | an | Sticky ein/aus (Desktop ≥1024, Tablet 680–1023, Mobile <680) |
| Sticky-Höhe | 64 / 64 / 56 | Kompakte Höhe nach Scrollen; bei `logoPosition: center` wächst die Leiste mit Inhalt (+ Padding, zwei Zeilen) |

Werte 40–600 px. Sticky gilt auch auf Seiten mit Viewport-Hintergrund.

Anker-Sprünge (TOC, `#…`): bei aktivem Sticky setzt `html` `scroll-padding-top` aus der Ruhehöhe (+ Abstand), damit Überschriften nicht unter der Leiste landen. Header-Höhen-Tokens liegen dafür auf `:root`.

### Hero (Titelbereich)

Über CMS **Einstellungen → Design → Hero**, getrennt pro Collection (Reihenfolge wie CMS-Leiste: Seiten, Artikel, Kategorien, Tags, Glossar):

| Einstellung | Default | Wirkung |
| --- | --- | --- |
| Textausrichtung | links | Brotkrumen, H1 und Beschreibung links / zentriert / rechts |
| Brotkrumen | an | Trail z. B. Start / Elternseite / aktuelle Seite |
| Brotkrumen-Trenner | `/` | `/` · `•` · `→` · `-` zwischen den Elementen (pro Collection) |
| Trennlinie unten | aus | optional `border-bottom` unter dem Hero |

Seiten und Artikel überschreiben mit dem Objekt `hero` (`textAlign`, `showBreadcrumbs`, `borderBottom` als `none`/`line`/`logo`/`favicon`, optional Mark-Position/-Größe) den Collection-Default. Komponente: `PageHero.astro` (`collection`-Prop; Klassen `.page-hero--align-*`, `.page-hero--border`, `.breadcrumbs`; untere Linie über `Separator`). Brotkrumen-Links nutzen die Linkfarbe (`--color-action`).

### UI-Icons (#31)

Kleine Stroke-Icons (`currentColor`) in `Icon.astro`; Quell-SVGs unter `public/img/icons/`.

| Icon | Einsatz |
| --- | --- |
| Haus | Erstes Brotkrumen-Element (Start), nur Symbol + `aria-label` |
| Ordner | Vor Kategorie-Links im Artikel-Hero |
| Kette | Vor „Permalink“ (Artikel, Glossar) |

Artikel: Kategorien stehen im Hero unter der Beschreibung; Tags per `tagPlacement` im Hero (rechts daneben), nach dem Inhalt oder beides (`hero` / `after` / `both`).

### Inhaltsverzeichnis (TOC)

Globale Defaults unter **Einstellungen → Inhalt → TOC** (Seiten / Artikel: an/aus, Ebenen, Titel). Einzelne Einträge überschreiben mit dem Objekt `toc` (`show`, `levels`, `title`; Feld leer = global).

### Inhaltsbreite

Drei Stufen über CMS **Design → Inhaltsbreite** (Default) und pro Seite/Artikel `layout.contentWidth`: **Standard** (42rem), **Breit** (64rem), **Vollbreit** (80rem). Ohne lokales Feld und mit Listing-Embed wird automatisch breit gewählt. Zusätzlich Defaults für **Kategorien, Tags, Autoren, Glossar** (#90).

### Inhaltsabstand (Hero / Footer)

Global unter **Design → Inhaltsabstand** pro Collection (`afterHero`, `beforeFooter` in rem). Seiten und Artikel überschreiben in der Gruppe **Inhaltsbreite**. CSS: `--page-space-after-hero` (`.page-hero` margin-bottom), `--page-space-before-footer` (`.page` padding-bottom).

### Ecken abrunden (Bilder / Videos)

Unter **Design → Ecken abrunden** zwei Werte in Pixeln (0–64, Default 0 = eckig):

| CMS-Feld | CSS | Anwendung |
| --- | --- | --- |
| `borderRadius.image` | `--radius-image` | Inhalts-Bilder (Markdown/CMS); nicht Logo, Avatar, Favicon |
| `borderRadius.video` | `--radius-video` | `.video-embed` (Consent-Video und Member-Video) |

`:root` kommt aus `src/lib/site-border-radius.ts` in `BaseLayout`.

### Mobile-Navigation (Burger)

Unter **680px** (`max-width: 679px`):

- Burger-Button rechts neben dem Brand; horizontale Nav wird zum Panel darunter
- Icon: drei Linien → animiertes Kreuz beim Öffnen (`transform` / `opacity`, ~220ms)
- Toggle-Script: `src/scripts/nav-toggle.ts` — `aria-expanded`, Escape, Klick außerhalb, Body-Scroll-Lock
- Untermenüs: Desktop als Flyout (Hover/Fokus/Chevron); Mobile als Akkordeon (`src/scripts/nav-submenu.ts`)
- `prefers-reduced-motion: reduce` schaltet die Transition aus
- Ab **680px**: kein Burger, horizontale Nav wie bisher

### Layout-Utilities (`src/styles/global.css`)

Beliebig kombinieren, statt Flex-CSS in jeder Komponente neu zu schreiben:

| Klasse | Wirkung |
| --- | --- |
| `.flex-row` / `.flex-col` | Flex-Zeile bzw. -Spalte, `gap: 1em` |
| `.flex-wrap` | Umbruch erlauben |
| `.flex-between` | `justify-content: space-between` |
| `.flex-center` | Inhalt zentrieren |
| `.flex-align-center` / `.flex-align-baseline` | Cross-Axis |
| `.flex-shrink-0` | nicht schrumpfen |
| `.gap-sm` / `.gap-md` / `.gap-lg` | Abstand überschreiben |
| `.w-full` / `.min-w-0` | Breite |
| `.ms-auto` | nach rechts schieben (`margin-inline-start: auto`) |
| `.text-center` / `.text-muted` / `.text-sm` | Text |
| `.list-plain` | Liste ohne Bullets/Margin |
| `.stack-on-tablet` | ab `< 1024px` → Spalte |
| `.stack-on-mobile` | ab `< 680px` → Spalte |
| `.center-on-tablet` / `.center-on-mobile` | auf Breakpoint zentrieren; setzt `.ms-auto` zurück |
| `.page--width-wide` / `.page--wide` / `.page--with-sidebar` | breite Inhaltsbreite (`--content-wide-max-width`, 64rem) |
| `.page--width-full` | vollbreite Spalte (`--content-full-max-width`, 80rem); CMS-Feld `layout.contentWidth` |
| `.page-layout` / `.page-layout__main` | Flex-Zeile Inhalt/Sidebar (mit `.stack-on-tablet`) |
| `.hero` / `.page-hero` | Titelblock überall (`PageHero.astro`: `h1` + optionale Beschreibung, Abstand zum Inhalt) |
| `.separator` | Dezente Trennlinie (`Separator.astro` / CMS `{{separator height width color mark …}}`; Default-Farbe `border`; mit `mark=logo\|favicon` Flex-Zeile + `.separator__rule` / `.separator__mark`) |
| `.spacer` | Vertikaler Leerraum (`Spacer.astro` / CMS `{{spacer height}}`; Default 32 px, Max. 600) |
| `.cms-button` | CMS-Button (`CmsButton.astro` / `{{button label href …}}`; solid/outline, Palette wie Trennlinie, Ausrichtung inkl. volle Breite) |
| `.cms-button-group` | Button-Gruppe (`CmsButtonGroup.astro` / `{{button-group items …}}`; Layout row / row-nowrap / stack-mobile / stack; Align left/center/right; optional `--full-mobile` unter 680px; nutzt `.cms-button__link`) |
| `.grid-cards` / `.grid-card` | Karten-Grid (`CmsGridCards.astro` / `{{grid-cards …}}`; Spalten Desktop/Tablet/Mobile; optional Stretch der letzten Karte) |
| `.article-list` | Artikelliste (Titel, Summary, Datum) |

Beispiel: `class="flex-row flex-between stack-on-mobile center-on-mobile"`

## Leistung & CSS

Die Website soll **schnell und schlank** bleiben (Page Speed mitdenken).

### Styles wiederverwenden

- Vorhandene CSS-Variablen und Klassen in `src/styles/` nutzen — nicht bei jeder Komponente CSS neu erfinden
- Häufige Muster als **gemeinsame Gruppen-/Utility-Klassen** pflegen (z. B. Inhaltsbreite, vertikaler Abstand)
- Scoped Astro-`<style>` nur für wirklich komponentenspezifisches Markup

### Critical vs. non-critical CSS

| Art | Inhalt | Regel |
| --- | --- | --- |
| **Critical** | Above-the-fold: CSS-Variablen, Basis, Typo, Header/Nav, erste Inhaltsfläche | Klein halten, früh laden |
| **Non-critical** | Seltene Komponenten, Artikel-Extras | Separat; nicht in den First-Paint-Pfad mischen |

Stand der Dateien: Critical-Basis in `src/styles/global.css` (weiter aufteilen, sobald die Site wächst). Agenten-Regeln: `.cursor/rules/leistung-und-css.mdc`.

## Bezug

- Stack und Zielgruppe: [Konzept](../konzept/README.md)
- Technische Umsetzung: [Astro](../astro/README.md)
- Deploy nur nach bewusstem Push: [Cloudflare](../cloudflare/README.md)
