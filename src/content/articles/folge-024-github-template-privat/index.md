---
title: 'Folge 024: GitHub-Template statt Fork, privat starten'
summary: hautoo per Use this template kopieren, Repo privat wählen, Menü und MIT-Inhalte aufräumen. Sveltia lokal mit Chromium und lokalem Repository vor dem Cloudflare-Deploy.
pubDate: 2026-10-12 00:32:57+00:00
modifiedDate: 2026-10-12
status: published
categories:
- screencasts
tags:
- github
- sveltia
- cursor
authors:
- wasilij
seo:
  index_visibility: index
  follow_visibility: follow
  seo_title: 'Folge 024: hautoo Template privat nutzen'
  seo_description: GitHub Use this template mit Private, kein öffentlicher Fork. Menü und Inhalte aufräumen, Sveltia lokal mit Chromium. Folge 024 für eigene Sites auf platomat/hautoo.
---

Magst du Struktur und Features von hautuu, willst aber **deine** Texte und **keinen** öffentlichen Quellcode auf [GitHub](/glossar/github/)? Dann reicht ein [**Fork**](/glossar/fork/) oft nicht: Der bleibt bei öffentlichem Original **öffentlich**. Besser: [**Template**](/glossar/template/) mit **Private** (privat). Was die Site kann, hast du in [Folge 023](/artikel/folge-023-neue-features-demo-cms/) gesehen; hier geht es um **dein** Repo und das Aufräumen.

{{block id="memberaccessmedia-info-before"}}

{{member-video src="videos/hautoo--folge--024--github--template.mp4" poster="/assets/hautoo-member-video-poster.webp"}}

{{block id="memberaccessmedia-info-after"}}


## Warum kein Fork?

[platomat/hautoo](https://github.com/platomat/hautoo) ist **öffentlich**, damit du lernen und die Vorlage nutzen kannst. Darum liegen dort keine privaten E-Mails oder Secrets in den Settings. Ein **Fork** deines Accounts bleibt bei GitHub **public**, wenn das Original public ist. Du kannst ihn später nicht einfach auf privat drehen. Für „nur ich sehe den Code“ nimm **Use this template** (Diese Vorlage verwenden).

## Template anlegen (privat)

1. Öffne [hautoo als Vorlage](https://github.com/platomat/hautoo/generate) oder auf der Repo-Seite **Use this template** (Diese Vorlage verwenden) → **Create a new repository** (Neues Repository erstellen).
2. **Repository name:** etwas Eindeutiges, z. B. `meine-webseite-business`, nicht nur `webseite` (du kannst mehrere Projekte haben).
3. **Description** (Beschreibung): optional.
4. **Private** wählen. **Public** würde den Quellcode für alle lesbar machen.
5. **Create repository** (Repository erstellen).

Du bekommst eine **Kopie** unter deinem Account, unabhängig vom [**Upstream**](/glossar/upstream/) (Original-Repo). Updates von dort holst du später per [Pull](/glossar/pull/) oder gezieltem [Merge](/glossar/merge/), nicht automatisch. Aber nur, wenn im Upstream auch wieder etwas geändert wurde.

{{repodoc path="docs/github/README.md" title="GitHub (hautuu)" description="Fork vs. Template, generate-Link."}}

## Menü und MIT-Inhalte entfernen

hautoo bringt unter der [MIT-Lizenz](/glossar/mit-lizenz/) mitgelieferte Lern-Inhalte: Folgen, Glossar, Features, Demo. Für deine Site brauchst du das meist nicht.

**Hauptmenü** (`main`):

1. Im CMS **Menüs** → **Hauptmenü** (oder wie dein `main`-Menü heißt).
2. Einträge löschen, die du nicht willst, z. B. Links zu **Glossar**, **Features**, **Demo**.

**Inhalte** (typisch in [Sveltia](/glossar/sveltia/)-[Collections](/glossar/collection/)):

- **Glossar**<br>Alle Einträge markieren und löschen, wenn du kein Glossar willst
- **Seiten**<br>z. B. `Features`, `Demo` (Ordner-[Slug](/glossar/slug/) im CMS)
- **Artikel**<br>Screencast-Folgen
- **Tags** / **Kategorien**<br>hautuu-Themen, danach eigene anlegen

Footer-Menüs (`footer`, `footer-legal`) genauso prüfen. Bausteine wie Kontaktanschrift kannst du behalten und anpassen ([Folge 020](/artikel/folge-020-bausteine-fork/)).

Titel, Logos und Texte stehen schon viel im CMS unter **Einstellungen** → **Allgemein** ([Folge 023](/artikel/folge-023-neue-features-demo-cms/)). **Kontakt-E-Mail** nicht ins öffentliche Repo committen: [Umgebungsvariable](/glossar/env/) `CONTACT_EMAIL` oder leer lassen ([Folge 019](/artikel/folge-019-impressum-komponenten/)).

## Lokal arbeiten und CMS testen

1. **Dein** Repo **klonen**, in [**Cursor**](/glossar/cursor/) öffnen ([Folge 001](/artikel/folge-001-hautuu-intro/)).
2. [`npm install`](/glossar/npm/) und [`npm run dev`](/glossar/npm/) ([Folge 018](/artikel/folge-018-node-npm/)).
3. **Sveltia** unter `/admin/`: Browser **Chromium** oder **Chrome** (Firefox nutzt eine andere Engine und passt oft nicht zum lokalen CMS, siehe [Folge 013](/artikel/folge-013-sveltia-pat/)).
4. Beim Login [**Lokales Repository**](/glossar/lokales-repository/) (local repository) wählen und den Projektordner angeben, wenn danach gefragt wird.

So kannst du z. B. unter **Einstellungen** → **Inhalt** → **Autoren** die **Avatar**-Form von rund auf eckig stellen, Texte ändern, **Speichern** → [Commit](/glossar/commit/) landet in [Git](/glossar/git/), nach [Push](/glossar/push/) baut [Cloudflare Pages](/glossar/cloudflare-pages/) ([Folge 011](/artikel/folge-011-cloudflare-setup/)). Bis der Worker für dein neues Repo steht, ist lokales Ändern der schnellere Weg.

## Kurz merken

- **Template** + **Private**, nicht Fork, wenn der Code privat bleiben soll.
- Menü und Collections aufräumen, dann eigene Inhalte.
- **Chromium** + **lokales Repository** für `/admin/` am Rechner.
- Hosting und Repo-Sichtbarkeit sind zwei Paar Schuhe ([Folge 020](/artikel/folge-020-bausteine-fork/)).

<!-- Quelle: 2026-10-12--02-32-57--obs-screencast - hautoo - 024 - github - template.txt -->
