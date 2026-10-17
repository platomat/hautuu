---
title: 'Folge 022: KI-Änderungen prüfen, PR reviewen, Features im Blick'
summary: In Cursor und GitHub siehst du, was der Agent geändert hat. Diff lesen, Review einreichen, Checks verstehen und vor dem Merge Cloudflare-Deployments einordnen.
pubDate: 2026-10-06 00:23:17+00:00
modifiedDate: 2026-10-07
status: published
tags:
- github
- cursor
- cloudflare
- ci
authors:
  - wasilij
seo:
  index_visibility: index
  follow_visibility: follow
  seo_title: 'Folge 022: KI-Änderungen prüfen und PR reviewen'
  seo_description: Agenten-Änderungen in Cursor und GitHub prüfen, Diff und Review, Content-Checks und Cloudflare-Rollback. Folge 022 für Laien vor dem Merge auf main.
---

Der Agent hat wieder Dateien angefasst. Die Frage ist nicht „Hat er was gemacht?“, sondern **passt das zu deinem Projekt**? Dafür brauchst du keine [Git](/glossar/git/)-Befehlszeile, wenn du nicht willst: [Cursor](/glossar/cursor/) und [GitHub](/glossar/github/) zeigen dir [**Diffs**](/glossar/diff/) und Listen. Diese Folge ordnet **lokal committen**, [**Pull Request**](/glossar/pull-request/) lesen, [**Code Review**](/glossar/code-review/) und **Live-Deployments** ein. Große PRs mit Preview: [Folge 016](/artikel/folge-016-artikel-pull-request/). Push-Regel: [Folge 001](/artikel/folge-001-hautuu-intro/), [Folge 006](/artikel/folge-006-git-push-pull/).

{{block id="memberaccessmedia-info-before"}}

{{member-video src="videos/hautoo--folge--022--cursor--ki-aenderungen-pruefen-pr-features.mp4" poster="/assets/hautoo-member-video-poster.webp"}}

{{block id="memberaccessmedia-info-after"}}


## Was wurde geändert? (Cursor)

In der [IDE](/glossar/ide/) links **Explorer** (Dateien), daneben „Source Control“ (Quellcode-Verwaltung). Dort siehst du geänderte Dateien, z. B. `.gitignore` mit dem genauen Zusatz. Optional: pro Datei **Timeline** (Zeitachse) für die Historie **dieser einen** Datei (welcher [Commit](/glossar/commit/) wann). Die kleine **Outline** neben dem Code ist eher für Funktionen im File, für Git-Überblick reicht meist Source Control.

Die **[Commit](/glossar/commit/)-Grafik** zeigt [Zweige](/glossar/branch/) und wo dein Stand zu **[origin](/glossar/origin/)** (Server) steht. Du kannst Zeilen lesen, was der Agent eingefügt hat, und nur die Dateien **stagen**, die in den nächsten Commit sollen. Dann „Commit“ (Commit erstellen): der Stand ist **noch lokal**. „Sync Changes“ (Änderungen synchronisieren) bzw. „[Pull](/glossar/pull/)“ (Pull) holt Remote-Änderungen, „Push“ (Push) schickt deine Commits zu [GitHub](/glossar/github/) (nur wenn du es willst).

## Pull Request mit vielen Commits

Ein zweiter Agent liefert oft einen eigenen [**Branch**](/glossar/branch/) und einen **[Pull Request](/glossar/pull-request/)** mit mehreren Commits (in der Session waren es neun Stück, weil du mehrfach nachgebessert hast). Auf GitHub im PR:

- „Files changed“ (Geänderte Dateien): welche Pfade, Zeile für Zeile [**Diff**](/glossar/diff/).
- Unter `.cursor/rules/` liegen Anweisungen **nur für Agenten**, nicht für Besucher der Website.
- Unter `docs/` steckt **Redaktions- und Entwickler-Doku** (Meta, nicht der öffentliche Seitentext).
- Unter `scripts/` hängen **deterministische Checks**, z. B. `check-content-links.py` (Links und Embeds) und `check-content-no-video-hints.py` (Artikel ohne Screencast-Meta-Hinweise). Im PR siehst du „All checks have passed“, wenn [CI](/glossar/ci/) grün ist.
- Die korrigierten **Folgen** liegen unter `src/content/articles/` (je Folge ein Ordner mit `index.md`). Die **Features-Seite** unter `/features/` liegt nicht dort, sondern in `src/content/pages/features/index.md` (Collection **pages**, siehe [Folge 004](/artikel/folge-004-collection-pages/)).

Du musst nicht alle 21+ Artikel komplett neu lesen: konzentrier dich auf **geänderte Dateien** und den Diff. Willst du den Ton einer Zeile ändern, nutze auf [GitHub](/glossar/github/) **„Suggest changes“** (Änderung vorschlagen) an der Zeile, sammle mehrere Vorschläge, dann „Start review“ (Review starten) und am Ende „Submit review“ (Review absenden). So landet z. B. eine präzisere Rollback-Formulierung in [Folge 012](/artikel/folge-012-cloudflare-branches/) **im Branch des PR**, bevor du [mergst](/glossar/merge/).

{{repodoc path="docs/redaktion/README.md" title="Redaktion" description="Schema, Stil, SEO und PR-Checkliste für Inhalte."}}

## Rollback in Cloudflare (nochmal klar)

In [Folge 012](/artikel/folge-012-cloudflare-branches/) ging es um Preview und [Production](/glossar/production/). In der Deployments-Liste ist **blau** markiert, was **gerade live** ist; ein [Build](/glossar/build/) **in Arbeit** kannst du noch nicht zurückdrehen. **Preview**-Deployments sind andere Zweige, du machst sie nicht per Rollback zur Live-Site.

Für **Production** gilt laut [Cloudflare Pages Rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/): Projekt → „Workers & Pages“ (Workers und Pages) → dein Pages-Projekt → „[Deployments](/glossar/deploy/)“ (Bereitstellungen) → bei einem **älteren erfolgreichen Production-Deployment** das **Dreipunkte-Menü** (⋯) → „Rollback to this deployment“ (Auf dieses Deployment zurücksetzen). Nicht in einer Detail-Ansicht suchen, wo kein Rollback-Button steht: die Aktion sitzt an der **Liste**.

## Merge, Live und Qualität

Wenn du den PR **akzeptierst** ([**Merge**](/glossar/merge/), siehe [Folge 016](/artikel/folge-016-artikel-pull-request/)), baut [Cloudflare](/glossar/cloudflare-pages/) **`main`** neu. Du musst im PR nicht selbst committen: sag dem Agenten „nimm den Stand, korrigiere Zeile X, starte Review“ oder starte einen **neuen Chat** für Quality Check („Passt das zum Konzept?“).

[Push](/glossar/push/) nicht automatisch durch den Agenten laufen lassen ([Folge 001](/artikel/folge-001-hautuu-intro/)). Lieber explizit: committen ja, pushen nur auf Anweisung.

## Feature-Stand und Site

Damit du (oder [Fork](/glossar/fork/)-Nutzer) sehen, **was die Site schon kann**: [Features auf hautoo](https://hautoo.storyofai.net/features/) und die Kurzliste im [README](https://github.com/platomat/hautoo/blob/main/README.md). Neu dazu gekommen u. a.:

- **Einstellungen** im [CMS](/glossar/cms/) (`src/content/settings/`: **Allgemein**, **Design**, **Inhalt**): Farben, Schrift, Header/Footer, Hero, Inhaltsbreite, Abstand, TOC, Autoren-Anzeige.
- **Features-Seite** und **Demo** (`/features/`, `/features/demo/`), dazu Collections **Kategorien**, **Autoren**, **Weiterleitungen**. Tour: [Folge 023](/artikel/folge-023-neue-features-demo-cms/).
- **Suche** im Header (Glossar und Inhalte finden, z. B. „Was ist [CSS](/glossar/css/)?“).
- Angepasstes **Logo** mit Pfad-Animation und Transparenz-Effekt (Tablet/Mobil mitgedacht).

Eigenes Projekt: [Template](/glossar/template/) privat ([Folge 024](/artikel/folge-024-github-template-privat/)) oder [Fork](/glossar/fork/) ([Folge 020](/artikel/folge-020-bausteine-fork/)). Demo und Einstellungen: [Folge 023](/artikel/folge-023-neue-features-demo-cms/). Bilder schlank halten: [Folge 021](/artikel/folge-021-bilder-suchen-nutzen/).

## Kurz merken

- **Source Control** + **Files changed** = deine Kontrolle vor Live.
- **Checks** im PR fangen Grobfehler ab, ersetzen kein Lesen der Diffs.
- **[Rollback](/glossar/rollback/)** nur über Production-Deployments und Dreipunkte-Menü.
- **Features-Seite** + README = Überblick ohne Code lesen.

<!-- Quelle: 2026-10-06--02-23-17--obs-screencast - hautoo - 022 - ki änderungen prüfen, pr, features.txt -->
