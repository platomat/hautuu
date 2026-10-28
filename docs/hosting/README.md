# Externes Hosting nach dem Build

hautuu baut mit Astro eine **statische** Website (`dist/`). Der empfohlene Weg ist [Cloudflare Pages](../cloudflare/README.md). Dieser Text beschreibt, was gilt, wenn du denselben Build **woanders** auslieferst (Apache, Nginx, Netlify, S3+CDN, klassisches Shared Hosting, …).

Kurzfassung auch in der [FAQ](../../src/content/pages/faq/index.md) („Funktioniert der Build auch auf normalem Hosting …?“).

Template-Sites (aus hautoo erzeugt): Engine-Updates mit [Template propagieren](./template-propagate.md).

## Machbarkeit

| Teil | Ohne Cloudflare Pages |
| --- | --- |
| Öffentliche Seiten, Artikel, Glossar, Suche, Sitemap, `llms.txt` / `agents.txt` | Ja, wenn der Server statische Dateien und Pretty URLs kann |
| CMS-UI unter `/admin/` (Sveltia + GitHub-PAT) | Ja, die Dateien liegen im `dist/`; Login schreibt ins GitHub-Repo |
| CMS-Login per OAuth-Worker | Nein (Cloudflare Worker); PAT bleibt die portable Variante |
| CMS-Redirects und Cache-Header aus dem Repo | Dateien landen im `dist/`, Format ist Cloudflare-spezifisch; andernorts nachbauen |

Kein Astro-SSR-Adapter nötig. Es reicht: bauen, `dist/` hochladen oder aus CI deployen.

## Build erzeugen

Lokal (siehe [Lokale Entwicklung](../entwicklung/README.md)):

```bash
npm install
npm run build
```

Ergebnis: Ordner `dist/` mit HTML, CSS, JS, Fonts, Suche-Index, Admin-UI usw.

Optional lokal prüfen:

```bash
npm run preview
```

Deploy-Varianten:

1. **Nur `dist/` hochladen** (SFTP, rsync, Panel-Datei-Manager, Object Storage + CDN)
2. **Hoster baut aus Git** (wie Pages): Build-Befehl `npm run build`, Publish-Verzeichnis `dist`

Node.js beim Hoster brauchst du nur, wenn der Hoster selbst baut. Beim reinen Upload der fertigen `dist/` reicht ein Webserver für statische Dateien.

## Domain und absolute URLs

Absolute URLs (Canonical, Sitemap, OG, `llms.txt` / `agents.txt`) werden **beim Build** gesetzt. Am Server lässt sich das nicht umbiegen.

Reihenfolge (`scripts/resolve-site-url.mjs`):

1. ENV `SITE` (optional Override in CI / Cloudflare)
2. CMS **Einstellungen → Allgemein → Website-URL** (`general.siteUrl`)
3. Template-Default `https://hautoo.storyofai.net`

Im CMS die Live-Origin eintragen (z. B. `https://platomat.com`, ohne Slash am Ende). Dann reicht `npm run build` ohne extra ENV.

Lokal oder einmalig überschreiben:

```bash
SITE=https://www.beispiel.de npm run build
```

**Cloudflare Pages (optional):** `SITE` nur noch nötig, wenn du die CMS-URL gezielt überschreiben willst (Preview-Domain o. Ä.). Für den Normalfall reicht `general.siteUrl`. Build-Befehl bleibt `npm run build`.

Medien-Basis-URLs stehen separat in `settings/content.json`.

## Was der Server können muss

### Pretty URLs

Astro liefert Ordner mit `index.html`, z. B. `/artikel/folge-001/index.html`. Der Aufruf `/artikel/folge-001/` (mit Slash) muss diese Datei finden. Das ist bei den meisten Hostern Standard (`DirectoryIndex` / `try_files`).

### 404

Im Build gibt es eine `404.html`. Der Hoster muss sie als Fehlerseite konfigurieren (Cloudflare Pages macht das automatisch). Sonst erscheint oft eine generische Server-404 statt der Site-Seite.

### HTTPS und Domain

TLS und DNS regelt der jeweilige Hoster. An der gebauten Site ändert sich dadurch nichts, solange `site` zur öffentlichen URL passt.

## Cloudflare-Dateien im `dist/`

Beim Build landen u. a.:

| Datei | Zweck bei Cloudflare Pages | Andernorts |
| --- | --- | --- |
| `_redirects` | CMS **Weiterleitungen** | Cloudflare. Apache/Nginx ignorieren sie. |
| `_headers` | Cache-Control (`/_astro/*`, Fonts, HTML, …) | Cloudflare-Quelle (im Repo gepflegt). |
| `.htaccess` | Redirects + dieselben Cache-Header | Apache (`AllowOverride`, `mod_headers`/`mod_setenvif`). CF und Nginx ignorieren sie. |
| `nginx-redirects.conf` | Redirects + Cache-`location`s | Nur nach `include` im Nginx-`server`-Block. CF und Apache ignorieren die Datei. |

Netlify versteht ähnliche Dateiformate, aber nicht 1:1 mit Cloudflare. Nicht blind kopieren; prüfen oder selbst abbilden.

Astro trägt Redirects zusätzlich in `astro.config` ein (lokal/`preview`). Für reines File-Hosting zählt, was der **Zielserver** an Redirect-Konfiguration hat.

## CMS auf Fremdhosting

- `/admin/` und `admin/config.yml` sind Teil des statischen Builds.
- Mit **GitHub Personal Access Token (PAT)** kann Sveltia ins Repo schreiben, unabhängig vom Website-Hoster. Voraussetzung: Schreibrechte am Repo und korrekte Backend-Angaben in der Admin-Config.
- Nach dem Speichern im CMS: **Build + Deploy** muss irgendwo laufen (GitHub Action, Hoster-Hook, lokal `npm run build` und Upload). Bei Cloudflare Pages triggert der Push den Build; bei reinem `dist/`-Upload musst du den Ablauf selbst festlegen.
- OAuth über den Cloudflare-Worker ist optional und an Cloudflare gebunden. Für portables Hosting reicht PAT ([Sveltia-Zugang](../sveltia/zugang-cloudflare.md)).

## Dist-Bridge (Pull-Deploy)

Wenn Cloudflare (oder CI) baut und der **Fremdhost** das Artefakt selbst holen soll: öffentliches Hilfsrepo [hautoo-dist-brigde](https://github.com/platomat/hautoo-dist-brigde). Live-Domain in CMS (`general.siteUrl`) bzw. optional ENV `SITE`; dazu `HAUTOO_DIST_BRIDGE=1`. Build-Befehl bleibt `npm run build` (`postbuild` packt dann `dist/dist-bridge.zip`). Server: ein Clone, `./hdb.sh init` / `./hdb.sh pull beispiel.de`.

## Checkliste Fremdhosting

1. Bauen: `SITE=https://www.beispiel.de npm run build` (oder `SITE` in CI/.env)
2. Inhalt von `dist/` auf den Webroot legen (nicht den Repo-Root)
3. Pretty URLs / Directory Index prüfen (`/pfad/` öffnet `index.html`)
4. `404.html` als Fehlerseite eintragen
5. Apache: `.htaccess` mitnehmen (Redirects + Cache). Nginx: `nginx-redirects.conf` im `server`-Block per `include`
6. `/admin/` testen, wenn du online redigieren willst; Deploy-Pipeline nach CMS-Commits klären

## Was dieser Text bewusst nicht abdeckt

hautuu-eigene Extras hinter Cloudflare (geschützte Medien, spezielle Worker) gehören nicht zur normalen Website-Auslieferung und sind hier absichtlich ausgelassen. Standard-Pfad für hautuu selbst bleibt [Cloudflare Pages](../cloudflare/README.md).

## Verwandte Doku

- [Cloudflare Pages (Standard-Deploy)](../cloudflare/README.md)
- [Astro](../astro/README.md)
- [Lokale Entwicklung](../entwicklung/README.md)
- [Sveltia CMS](../sveltia/README.md)
- [Weiterleitungen (Collection)](../sveltia/collections.md)
