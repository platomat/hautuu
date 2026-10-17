# Eigene Schriften

Pro Schrift einen Ordner unter `src/fonts/custom/<id>/` (Slug, z. B. `acme-display`). Die ID darf nicht schon im Fontsource-Katalog stehen.

## Pflicht

- `stylesheet.css` (oder `fonts.css` / eine `*.css`) mit `@font-face` und **lokalen** `url(...)` zu Dateien im selben Ordner. Ausgabe von Transfonter ist ok: Der dort eingetragene Zielpfad dient nur dem Auslesen der Dateinamen; der Sync schreibt die URLs fest auf `/fonts/<id>/…`.
- Die in der CSS referenzierten Font-Dateien (am besten `.woff2`).

## Optional: `meta.json`

```json
{
  "label": "Acme Display",
  "family": "Acme Display",
  "fallback": "system-ui, sans-serif"
}
```

## Sync (allgemein)

`npm run sync:fonts` (oder `npm run dev` / `build`):

1. Schrift optional im CMS unter Design → Schrift (Site-weit)
2. Katalog `site-fonts.generated.json`
3. **Immer** Auslieferung nach `public/fonts/<id>/` inkl. generierter `stylesheet.css`
4. Wenn als Design-Schrift gewählt: zusätzlich in `src/styles/fonts.generated.css`

Danach Ordner plus generierten Katalog und die Font-Optionen in `config.yml` committen.

## Ablauf: nur für bestimmte Elemente (nicht als Site-Schrift)

Design → Schrift bleibt z. B. Ubuntu. Die Custom-Schrift nutzt du nur per CSS/Head.

1. Ordner anlegen, z. B. `src/fonts/custom/acme-display/` mit Transfonter-CSS + `.woff2` (optional `meta.json`).
2. Sync ausführen: `npm run sync:fonts` (oder `dev`/`build`).  
   Ergebnis u. a.: `/fonts/acme-display/stylesheet.css` und die Font-Dateien darunter.
3. Im CMS Head-Code setzen (Allgemein → Site-Code und/oder Seiten-`headCode`), z. B.:

```html
<link rel="stylesheet" href="/fonts/acme-display/stylesheet.css" />
<style>
  .hero-title {
    font-family: "Acme Display", system-ui, sans-serif;
  }
</style>
```

`font-family` muss zum Namen in der CSS bzw. in `meta.json` → `family` passen.

4. Speichern, deployen bzw. lokal prüfen. Der Browser lädt die WOFF2 erst, wenn die Klasse/`font-family` wirklich greift.

Ohne den `<link>` (oder ohne Eintrag in `fonts.generated.css` über Design-Auswahl) kennt die Seite die `@font-face`-Regeln nicht.
