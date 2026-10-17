# Videos auf Cloudflare R2 (nicht im Git-Repo)

Große Screencast-MP4s gehören **nicht** ins öffentliche GitHub-Repo. Ablage: **Cloudflare R2**, Auslieferung über eine öffentliche URL. Auf der Website bindet die bestehende Komponente `VideoEmbed` die Datei als HTML5-`<video>` ein (`provider="file"`).

YouTube/Vimeo bleiben parallel möglich (Facade + Consent). Selbst gehostete Dateien brauchen **keinen** Drittanbieter-Consent.

## Überblick

```text
MP4 hochladen → R2-Bucket → öffentliche URL (Custom Domain)
     ↓
Artikel/CMS: {{video provider="file" src="folge-001.mp4" }}
     ↓
Astro VideoEmbed → <video src="https://media…/videos/folge-001.mp4">
```

| Was | Wo |
| --- | --- |
| Bucket / Upload | Cloudflare Dashboard → R2 |
| Basis-URL im CMS | **Konfiguration → Inhalt → Medien → Video-Basis-URL** (`content.media.videoBaseUrl`) |
| Einbinden | Toolbar **Video**, Anbieter **Datei**, oder Hero-Felder am Artikel |
| Komponente | `src/components/VideoEmbed.astro` (gemeinsam mit YT/Vimeo) |
| Resolve | `resolveFileVideoSrc` in `src/lib/video.ts` |

## Voraussetzungen

1. Cloudflare-Account (gleiche Umgebung wie Pages für `hautoo`).
2. Gebaute MP4s lokal (z. B. aus Kdenlive), sinnvoll komprimiert.
3. Optional: Subdomain der Zone `storyofai.net` für Medien (empfohlen).

## Schritt 1: R2-Bucket

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **R2** → **Create bucket**.
2. Name z. B. `hautoo-videos` (nur intern, nicht die öffentliche URL).
3. Region nach Bedarf (oder Automatic).

Keine Secrets aus dem Bucket ins Repo schreiben. Öffentlicher Lesezugriff läuft über die unten beschriebene Domain, nicht über Account-API-Tokens im Frontend.

## Schritt 2: Öffentlicher Zugriff (Custom Domain)

Empfohlen: eigene Subdomain, z. B. `media.hautoo.storyofai.net` oder `media.storyofai.net`.

1. Im Bucket: **Settings** → **Public access** / **Custom Domains** → Domain verbinden.
2. DNS wird in der Zone angelegt (Cloudflare führt durch).
3. Optional Ordner-Präfix nur konzeptionell: Objekte als `videos/folge-001.mp4` hochladen.

Öffentliche Objekt-URL dann z. B.:

`https://media.hautoo.storyofai.net/videos/folge-001.mp4`

**CORS:** Für einfaches Abspielen von `hautoo.storyofai.net` aus reicht oft die Default-Auslieferung. Wenn der Browser Range-Requests oder striktes CORS blockiert, im Bucket CORS erlauben (Origin der Site, Methoden `GET`/`HEAD`, Header nach Bedarf).

**Nicht** die temporäre `*.r2.dev`-URL fest in Artikeln hardcoden, wenn du eine stabile Custom Domain hast. Basis-URL einmal in der Config pflegen.

## Schritt 3: Basis-URL in der Site-Config

CMS: **Konfiguration → Inhalt → Medien → Video-Basis-URL**

Wert inkl. Pfad und idealerweise Slash am Ende:

```text
https://media.hautoo.storyofai.net/videos/
```

Datei: `src/content/settings/content.json` → `media.videoBaseUrl`.

Leer lassen: Im Embed nur **volle** `https://…`-URLs verwenden.

## Schritt 4: Dateien hochladen

- Format: **MP4** (H.264 + AAC), wie von Kdenlive/ffmpeg.
- Objektname stabil und sprechend, z. B. `folge-001-intro.mp4`.
- Upload: Dashboard (R2 → Bucket → Upload) oder `wrangler r2 object put …` (CLI, Token nur lokal/CI).

Poster-Bilder (Vorschaubild) liegen klein im Repo (Mediathek / `src/assets/`). Im Video-Block per **Medienauswahl** setzen (Feld Poster), nicht als Freitext-Pfad.

## Schritt 5: Im Artikel einbinden

### A) Im Fließtext (Toolbar „Video“)

```markdown
{{video provider="file" src="folge-001-intro.mp4" title="Folge 001: Intro" poster="/assets/video-poster-001.webp"}}
```

Mit gesetzter Basis-URL wird daraus die volle Medien-URL. Alternativ volle URL:

```markdown
{{video provider="file" src="https://media.hautoo.storyofai.net/videos/folge-001-intro.mp4" title="Folge 001: Intro"}}
```

Alias `provider="r2"` wird wie `file` behandelt.

### B) Im Artikel-Inhalt

Toolbar **Video** bzw. Marker `{{video provider="file" src="…" }}` an der gewünschten Stelle im Body (z. B. ganz oben). Dieselbe `VideoEmbed`-Komponente wie bei YouTube/Vimeo-Embeds.

## Verhalten auf der Website

| Anbieter | Technik | Consent |
| --- | --- | --- |
| YouTube / Vimeo | iframe nach Klick (Facade) | ja (`localStorage`) |
| Datei (R2) | natives `<video controls>` | nein (First-Party / eigene Domain) |

`preload="metadata"`: kein voller Download vor Play. Besucher streamen von R2/CDN.

## Datenschutz

Kurz in der Datenschutzerklärung ergänzen, falls noch nicht klar: Screencasts können von **eigener Infrastruktur / Cloudflare R2** ausgeliefert werden (Verarbeitungsort, Auftragsverarbeitung Cloudflare). YouTube/Vimeo-Abschnitte bleiben für die anderen Embeds. Kein zusätzlicher Consent-Button wie bei YT nötig, solange die Dateien unter eurer Kontrolle und Domain liegen.

## Checkliste

- [ ] R2-Bucket angelegt, Custom Domain aktiv, Test-URL im Browser spielbar
- [ ] `videoBaseUrl` in Content → Medien gesetzt (oder nur absolute URLs genutzt)
- [ ] MP4 hochgeladen, Objektname notiert
- [ ] Artikel: Embed oder Hero-Felder gesetzt, lokal `npm run build` / Vorschau ok
- [ ] Datenschutz-Text bei Bedarf angepasst
- [ ] Große Dateien **nicht** unter `src/content/` oder `public/` committed

## Geschützte Variante

Videos nur mit persönlichem Code: privater Bucket + Worker. Siehe [Member-Videos](./r2-member-videos.md).

## Referenzen

- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [R2 Custom Domains](https://developers.cloudflare.com/r2/buckets/public-buckets/)
- Site-Hosting: [Cloudflare README](./README.md)
- CMS-Embeds: [CMS Fields](../cms-fields/README.md)
- Member-Videos: [r2-member-videos.md](./r2-member-videos.md)
