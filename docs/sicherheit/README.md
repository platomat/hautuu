# Sicherheit & Secrets

Dieses Repository ist **öffentlich** auf GitHub. Alles, was committed wird, kann von jeder Person gelesen werden.

## Niemals committen

- API-Keys, Tokens, Passwörter
- Private SSH- oder TLS-Schlüssel
- Cloudflare API-Tokens, GitHub Personal Access Tokens
- Webhook-Secrets, OAuth Client Secrets
- `.env`-Dateien mit echten Werten
- Zugangsdaten für Vimeo, YouTube, E-Mail-Dienste usw.

## Erlaubt und sinnvoll

| Datei / Ort | Zweck |
| --- | --- |
| `.env.example` | Platzhalter ohne echte Werte, als Vorlage |
| Cloudflare Dashboard / GitHub Secrets | Echte Secrets zur Laufzeit |
| Lokale `.env` (gitignored) | Nur auf dem eigenen Rechner |
| Browser Local Storage (Sveltia PAT) | GitHub-Token nur lokal im Browser — nie committen |
| Cloudflare Worker Variables (OAuth) | `GITHUB_CLIENT_SECRET` nur als verschlüsseltes Worker-Secret |

## Domain

Die Domain `hautoo.storyofai.net` ist **kein Secret**. Sie darf in Doku und Code vorkommen.

## Kontakt-E-Mail (Impressum)

Die Adresse **nicht** fest in Markdown committen (öffentliches Repo = Scraping auf GitHub). Einbindung immer über `{{contact-email}}` (Spam-Schutz: `[at]` im Text, `mailto:` erst bei Klick/Focus).

**Priorität beim Build:** CMS **Einstellungen → Allgemein → Contact email** (`settings/general.json`), falls gesetzt; sonst Build-Variable `CONTACT_EMAIL`.

| Quelle | Wann nutzen |
| --- | --- |
| **ENV** (`CONTACT_EMAIL`) | Empfohlen für öffentliche Repos: Adresse bleibt aus Git raus (lokal `.env`, Cloudflare Pages Env) |
| **CMS** | Praktisch für Kunden-Forks; Wert landet in `settings/general.json` und ist öffentlich auf GitHub |

Zusätzlich empfohlen: im Cloudflare-Dashboard unter **Scrape Shield** → **Email Address Obfuscation** aktiv lassen — Cloudflare verschleiert E-Mail-Adressen in der ausgelieferten HTML.

## Checkliste vor jedem Push

1. Enthält der Diff Keys, Tokens oder Passwörter?
2. Wurden neue `.env*`-Dateien versehentlich gestaged?
3. Stehen sensible Dateien in `.gitignore`?

Wenn etwas Sensibles versehentlich gepusht wurde: Token **sofort rotieren** und den Vorfall dokumentieren — nur Löschen im Git reicht nicht (History bleibt sichtbar).

## Für KI-Assistenten

Cursor und andere Assistenten sollen Secrets **nicht** in Dateien schreiben, die ins Repo gelangen. Bei Bedarf immer auf Umgebungsvariablen und Plattform-Secrets verweisen.
