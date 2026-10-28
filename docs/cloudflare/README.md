# Cloudflare — Website online bringen

Cloudflare hostet die gebaute **statische** Website (Astro → Ordner `dist/`) und liefert sie unter der Produktions-Domain aus. Denselben Build woanders ausliefern: [Externes Hosting](../hosting/README.md).

## Ziel

| Was | Wert |
| --- | --- |
| Produktions-Domain | `https://hautoo.storyofai.net` |
| Hauptdomain (Zone) | `storyofai.net` — bereits bei Cloudflare |
| Hosting | Cloudflare Pages |
| Quelle | GitHub-Repo [`platomat/hautoo`](https://github.com/platomat/hautoo/) |
| Produktions-Branch | `main` |

```text
Cursor → Commit (lokal) → Push (bewusst) → GitHub → Cloudflare Pages Build → hautoo.storyofai.net
```

## Voraussetzungen

Bevor du startest:

1. Zugang zum **Cloudflare-Account**, in dem die Zone `storyofai.net` liegt (gleiche Account-Umgebung nutzen, in der die Hauptdomain verwaltet wird).
2. Zugang zum **GitHub-Repo** `platomat/hautoo` (mindestens Lesen; für die GitHub-Anbindung oft Admin/Owner-Rechte am Repo oder an der Org).
3. Lokal prüfen, dass der Build klappt:

```bash
npm install
npm run build
```

Erwartet: Ordner `dist/` mit fertigen HTML/CSS/Assets. Scheitert der Build lokal, scheitert er auch bei Cloudflare.

> **Wichtig:** Diese Site ist **statisch**. Es wird **kein** `@astrojs/cloudflare`-Adapter benötigt. Der Adapter ist für SSR/Workers gedacht und würde das Projekt unnötig komplizieren.

---

## Schritt 1 — Cloudflare Pages mit GitHub verbinden

1. Im [Cloudflare Dashboard](https://dash.cloudflare.com/) einloggen (Account mit Zone `storyofai.net`).
2. Links: **Workers & Pages** (manchmal unter „Compute“).
3. **Create** / **Create application** → Tab **Pages**.
4. **Import an existing Git repository** (bzw. „Connect to Git“).
5. GitHub autorisieren, falls noch nicht geschehen:
   - Cloudflare die Installation der GitHub-App erlauben
   - Zugriff auf das Repo `platomat/hautoo` freigeben (nur dieses Repo oder die ganze Org — je nach Wunsch)
6. Repository **`platomat/hautoo`** auswählen → **Begin setup** / Weiter.

---

## Schritt 2 — Build-Einstellungen

Im Setup-Formular genau diese Werte setzen:

| Einstellung | Wert | Hinweis |
| --- | --- | --- |
| **Project name** | z. B. `hautoo` | Wird zur URL `hautoo.pages.dev` (oder ähnlich). Muss nicht dem Repo-Namen entsprechen, aber „hautoo“ ist klar. |
| **Production branch** | `main` | Jeder Push auf `main` = Produktions-Deploy. |
| **Framework preset** | Astro (falls angeboten) | Füllt Build-Befehl und Ausgabeordner vor; Werte unten trotzdem prüfen. |
| **Build command** | `npm run build` | Entspricht `package.json`. |
| **Build output directory** | `dist` | Astro-Standardausgabe. |
| **Root directory** | `/` (leer / Projektwurzel) | Kein Monorepo-Unterordner. |

### Node-Version (Pflicht für dieses Repo)

`package.json` verlangt **Node.js ≥ 22.12**. In den Projekt-Einstellungen unter **Settings → Environment variables** (für Production und idealerweise auch Preview) setzen:

| Variable | Wert |
| --- | --- |
| `NODE_VERSION` | `22` |

Ohne passende Node-Version kann der Cloudflare-Build fehlschlagen, obwohl lokal alles funktioniert.

### Secrets / weitere Variablen

| Variable | Pflicht? | Zweck |
| --- | --- | --- |
| `NODE_VERSION` | ja | siehe oben |
| `SITE` | optional | Fallback für die öffentliche Origin, nur wenn CMS Allgemein → Website-URL (`general.siteUrl`) leer ist. Live-Domain primär im CMS setzen. Build-Befehl bleibt `npm run build`. |
| `HAUTOO_DIST_BRIDGE` | optional | `1`: nach dem Build ZIP als `dist/dist-bridge.zip` mitdeployen (für [Dist-Bridge](../hosting/README.md#dist-bridge-pull-deploy)). Ohne Variable: kein ZIP. |
| `CONTACT_EMAIL` | optional | Kontaktadresse wenn nicht im CMS; siehe `.env.example` |

Geheimnisse nur im Dashboard setzen, **niemals** ins öffentliche Repo. Siehe [Sicherheit](../sicherheit/README.md). Andere Domain / Fork: [Externes Hosting](../hosting/README.md).

Danach: **Save and Deploy**.

---

## Schritt 3 — Ersten Build prüfen

1. Im Pages-Projekt unter **Deployments** den laufenden Build öffnen.
2. Build-Log prüfen: `npm install` → `npm run build` → Upload von `dist/`.
3. Bei Erfolg erscheint eine URL der Form:

   `https://<project-name>.pages.dev`

4. Diese URL im Browser öffnen und kurz prüfen (Startseite, Navigation, `/admin/` erreichbar).

CMS (Sveltia) unter `/admin/`: [PAT](../sveltia/zugang-cloudflare.md) oder optional [OAuth über Worker](../sveltia/zugang-worker.md).

Erst wenn `*.pages.dev` funktioniert, die Custom Domain anbinden — so trennst du Build-Probleme von DNS-Problemen.

**Bei Build-Fehler:** Log lesen (oft Node-Version, fehlende Dependency, Astro-Fehler). Lokal denselben Befehl `npm run build` nachstellen.

---

## Schritt 4 — Custom Domain `hautoo.storyofai.net`

Die Zone `storyofai.net` liegt bereits bei Cloudflare. Die Subdomain `hautoo` wird an das Pages-Projekt gehängt.

### 4a — Domain im Pages-Projekt eintragen

1. Pages-Projekt öffnen → **Custom domains**.
2. **Set up a domain** / **Add domain**.
3. Eintragen: `hautoo.storyofai.net`
4. Bestätigen / Continue.

### 4b — DNS (CNAME)

Weil `storyofai.net` **dieselbe Cloudflare-Zone** ist, legt Cloudflare den DNS-Eintrag in der Regel **automatisch** an, sobald du die Domain im Pages-Projekt bestätigst.

Erwarteter Eintrag in **DNS** der Zone `storyofai.net`:

| Typ | Name | Ziel | Proxy |
| --- | --- | --- | --- |
| `CNAME` | `hautoo` | `<project-name>.pages.dev` | Proxied (orange Wolke) |

Beispiel: Projekt heißt `hautoo` → Ziel `hautoo.pages.dev`.

**Manuell nur nötig**, wenn der Eintrag nicht automatisch erscheint:

1. Zone `storyofai.net` → **DNS** → **Records**.
2. CNAME wie in der Tabelle anlegen (Proxy an).
3. Wichtig: Die Domain muss **zuerst** im Pages-Projekt unter Custom domains verknüpft sein. Ein reiner manueller CNAME ohne diese Verknüpfung führt oft zu Fehlern (z. B. HTTP 522).

### 4c — TLS / HTTPS

Cloudflare stellt das Zertifikat für `hautoo.storyofai.net` automatisch aus. Warte, bis der Status der Custom Domain im Pages-Projekt auf **Active** steht (oft wenige Minuten, manchmal länger).

SSL/TLS-Modus der Zone: üblicherweise **Full** (oder **Full (strict)**), konsistent mit dem Rest von `storyofai.net`.

### 4d — Fertig prüfen

1. `https://hautoo.storyofai.net` öffnen — Inhalt wie auf `*.pages.dev`.
2. In `astro.config.mjs` ist `site: 'https://hautoo.storyofai.net'` gesetzt (Sitemap, absolute URLs).
3. Optional: `https://hautoo.pages.dev` später per Redirect auf die Custom Domain umleiten (Account-/Pages-Einstellung oder Redirect Rule) — nicht zwingend für den ersten Go-Live.

---

## Schritt 5 — Alltagsbetrieb (Deploy)

| Aktion | Wirkung auf die Live-Site |
| --- | --- |
| Lokal committen | keine |
| Push auf `main` | neuer Produktions-Build und Deploy |
| Push auf anderen Branch / PR | Preview-Deployment (eigene URL), nicht die Produktions-Domain |

- **Push nur bewusst** — Agenten pushen nie von allein. Siehe [Sprachen und Konventionen](../sprachen-und-konventionen.md).
- Vor dem Push: [Sicherheits-Checkliste](../sicherheit/README.md).

---

## Kurz-Checkliste Go-Live

- [ ] `npm run build` lokal erfolgreich
- [ ] Cloudflare Pages-Projekt angelegt, Repo `platomat/hautoo` verbunden
- [ ] Build: `npm run build`, Output: `dist`, Branch: `main`
- [ ] Umgebungsvariable `NODE_VERSION=22` gesetzt
- [ ] Erster Deploy unter `*.pages.dev` ok
- [ ] Custom Domain `hautoo.storyofai.net` im Pages-Projekt aktiv
- [ ] DNS: CNAME `hautoo` → `<project>.pages.dev` (proxied), Zone `storyofai.net`
- [ ] `https://hautoo.storyofai.net` lädt mit HTTPS

---

## Was wir bewusst nicht brauchen (Stand jetzt)

| Thema | Status |
| --- | --- |
| `@astrojs/cloudflare` / Workers SSR | Nein — rein statisch |
| Wrangler / `wrangler.toml` | Nein für den ersten Go-Live |
| Eigene Cloudflare-API-Tokens im Repo | Niemals |
| Apex-Domain (`storyofai.net` selbst) | Bleibt bei der Hauptdomain; hier nur Subdomain `hautoo` |

## Caching & Build-ID (#11)

| Was | Wo |
| --- | --- |
| Cache-Header | `public/_headers` → `dist/` (CF); Build spiegelt Cache-Control zusätzlich nach `.htaccess` / `nginx-redirects.conf` |
| Redirects | CMS **Weiterleitungen** → `_redirects` (CF) plus `.htaccess` / `nginx-redirects.conf` (prebuild; nicht im Git; von Pages ignoriert) |
| `/_astro/*`, `/fonts/*` | `max-age=31536000, immutable` (fingerprinted bzw. selten geändert) |
| HTML / Rest | `max-age=0, must-revalidate` |
| Build-ID | `import.meta.env.BUILD_ID` / `CF_PAGES_COMMIT_SHA` über `src/lib/build-id.ts` |
| Version-Param | Favicons u. ä. als `?v=<buildId>` in `BaseLayout`; Meta `build-id` |

Astro-Bundles unter `/_astro/` haben bereits Hash-Dateinamen — lange Cache-Dauer ist dort sicher.

Fehlende Pfade ohne eigene Datei liefert Pages oft als Startseiten-HTML (HTTP 200). Deshalb liegen feste Dateien im Repo, u. a. `public/robots.txt` und die Astro-Route `src/pages/404.astro` → `dist/404.html`.

## Screencast-Folgen (Website)

- [Folge 011: Cloudflare Pages Setup](https://hautoo.storyofai.net/artikel/folge-011-cloudflare-setup/)
- [Folge 012: Branches und Rollback](https://hautoo.storyofai.net/artikel/folge-012-cloudflare-branches/)

## Videos in R2 (nicht im Repo)

Große MP4s liegen in **Cloudflare R2**, Einbindung über `VideoEmbed` mit `provider="file"`. Anleitung: [R2-Videos](./r2-videos.md).

Geschützt mit Zugangscode (privates R2 + D1 + Worker): [Member-Videos](./r2-member-videos.md), Code unter `workers/media-access/`.

## Offizielle Referenzen

- [Astro auf Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
