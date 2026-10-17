---
title: FAQ
description: Häufige Fragen zu hautuu, Git, Cursor, Cloudflare und dem CMS.
status: published
publishDate: 2026-10-08
modifiedDate: 2026-10-16
toc:
  show: true
  title: Inhalt
  levels:
  - h2
background:
  image: /assets/sebastien-goldberg-9R_bNdo4-2I-unsplash.webp
  overlay: 88
  attribution: |-
    Photo by <a href="https://unsplash.com/@sebastiengoldberg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sébastien Goldberg</a> on <a href="https://unsplash.com/photos/a-sea-turtle-swimming-in-the-ocean-9R_bNdo4-2I?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
seo:
  seo_title: FAQ zu hautuu, Git, Cursor und Cloudflare
  seo_description: Antworten auf häufige Fragen zu hautuu, Git, Cursor, Astro, Cloudflare und dem CMS. Kurz, verlinkt und per Strg+F durchsuchbar auf einer Seite.
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

Antworten kurz und mit Links zu den [Folgen](/artikel/) und zum [Glossar](/glossar/). Alles steht offen auf der Seite, damit du mit der Browsersuche (Strg+F) jede Formulierung findest.

## Einstieg

### Was ist hautuu überhaupt?

Ein öffentliches Lernprojekt: [**Astro**](/glossar/astro/) baut statische Seiten, [**GitHub**](/glossar/github/) speichert den Stand, [**Cursor**](/glossar/cursor/) hilft beim Bearbeiten, [**Cloudflare Pages**](/glossar/cloudflare-pages/) liefert sie aus. [Folge 001](/artikel/folge-001-hautuu-intro/).

### Kann ich das für meine eigene Website nachbauen?

Ja, das ist die Idee. Du brauchst Accounts, etwas Geduld und die Folgen Schritt für Schritt. hautuu zeigt einen Weg, kein fertiger Shop-Baukasten. [Folge 001](/artikel/folge-001-hautuu-intro/), [Über mich](/autoren/wasilij/).

### Wie starte ich mein eigenes Projekt von hautuu?

Zwei Wege auf [GitHub](/glossar/github/): **[Template](/glossar/template/)** (Vorlage, auch **privates** Repo) über [hautoo als Vorlage](https://github.com/platomat/hautoo/generate), oder **[Fork](/glossar/fork/)** (bleibt bei öffentlichem Original **öffentlich**). Danach **dein** Repo klonen, in Cursor Inhalte ersetzen, eigenes Hosting anbinden. Updates vom Original nur per [Pull](/glossar/pull/) oder Merge, wenn bei hautoo wieder etwas geändert wurde. Schritt für Schritt privat: [Folge 024](/artikel/folge-024-github-template-privat/), Überblick: [Folge 020](/artikel/folge-020-bausteine-fork/).

### Brauche ich Programmierkenntnisse?

Nein im klassischen Sinn. Du beschreibst Ziele in normaler Sprache, der Agent ändert Dateien. [Terminal](/glossar/terminal/)-Befehle kannst du oft kopieren. Trotzdem hilft Neugier, wenn etwas hakt. [Folge 008](/artikel/folge-008-cursor-modi/), [Folge 001](/artikel/folge-001-hautuu-intro/).

### Was ist der Unterschied zu WordPress?

hautuu ist **statisch**: keine [Datenbank](/glossar/datenbank/) auf dem Server, Inhalte liegen als Dateien in [Git](/glossar/git/). [**Astro**](/glossar/astro/) erzeugt HTML beim [**Build**](/glossar/build/). [Folge 002](/artikel/folge-002-github-issues/).

### Was heißt „statische Website“?

Fertige HTML-Seiten werden ausgeliefert, nicht bei jedem Klick neu aus einer Datenbank zusammengebaut. Das ist dein [**Frontend**](/glossar/frontend/). Schnell und schlicht, dafür kein klassisches Plugin-Ökosystem. [Glossar Astro](/glossar/astro/), [Folge 002](/artikel/folge-002-github-issues/).

### Was ist der Unterschied zwischen Frontend und Backend?

**[Frontend](/glossar/frontend/)** sehen Besucher (gebautes HTML/[CSS](/glossar/css/)). Das [**Backend**](/glossar/backend/) ist bei hautuu vor allem Speicher (GitHub), Redaktion (`/admin/`) und optional der [**Worker**](/glossar/cloudflare-worker/) für [OAuth](/glossar/oauth/), keine [WordPress](/glossar/wordpress/)-Datenbank. [Folge 002](/artikel/folge-002-github-issues/), [Folge 014](/artikel/folge-014-sveltia-worker/).

### Hat meine Seite überhaupt ein Backend?

Kein klassisches Server-[Backend](/glossar/backend/) mit Datenbank. Inhalte liegen in [Git](/glossar/git/), die Live-Site ist statisch. Kleine Backend-Bausteine gibt es fürs CMS-Login. [Folge 011](/artikel/folge-011-cloudflare-setup/), [Folge 013](/artikel/folge-013-sveltia-pat/).

### Wo fange ich sinnvoll an?

[Repo](/glossar/repository/) anlegen, lokal klonen, [Cursor](/glossar/cursor/) öffnen, grobe Richtung verstehen. Danach Issues, Design, Cloudflare, CMS. [Folge 001](/artikel/folge-001-hautuu-intro/), [Folge 002](/artikel/folge-002-github-issues/).

### Wo liegt die „Wahrheit“, und wo arbeite ich?

Zentral auf **[GitHub](/glossar/github/)**. Lokal ist deine Werkstatt. Nach [**Push**](/glossar/push/) baut [Cloudflare](/glossar/cloudflare-pages/) die Live-Site. [Folge 001](/artikel/folge-001-hautuu-intro/), [Folge 006](/artikel/folge-006-git-push-pull/).

### Muss ich am Anfang alles verstehen?

Nein. Erst ein Bild im Kopf, Details in den Folgen und im [Glossar](/glossar/). [Folge 001](/artikel/folge-001-hautuu-intro/).

---

## Voraussetzungen und Kosten

### Was kostet das alles?

Viele Bausteine haben **kostenlose Einstiegstarife** (öffentliches GitHub-Repo, [Cloudflare Pages](/glossar/cloudflare-pages/) für statische Sites, [Astro](/glossar/astro/) als Open Source). **Cursor** ist kostenpflichtig je nach Plan und Nutzung. Aktuelle Preise immer auf cursor.com, github.com und cloudflare.com prüfen. [Folge 009](/artikel/folge-009-cursor-abo/).

### Muss ich einen eigenen Server mieten?

Nein. Cloudflare **hostet** die gebaute Site; du pflegst Code und Inhalte in Git. [Folge 011](/artikel/folge-011-cloudflare-setup/).

### Welchen Rechner und welches Betriebssystem brauche ich?

In den Folgen: **Linux** oder **Mac** (ähnliche Pfade für [Terminal](/glossar/terminal/) und [SSH](/glossar/ssh/)). Windows geht mit angepassten Tools, im Projekt liegt der Fokus auf Linux/Mac. [Folge 017](/artikel/folge-017-github-ssh/), [Folge 018](/artikel/folge-018-node-npm/).

### Brauche ich eine virtuelle Maschine?

Optional. Manche nutzen eine [VM](/glossar/vm/) für Experimente oder [Cloud Agents](/glossar/cloud-agent/); du kannst aber auch direkt auf deinem Rechner starten. [Folge 009](/artikel/folge-009-cursor-abo/), [Folge 015](/artikel/folge-015-transkript-artikel/).

### Welche Accounts muss ich anlegen?

Mindestens **GitHub** und **[Cursor](/glossar/cursor/)**; für Live-Hosting **Cloudflare** und Verknüpfung mit dem Repo. [Folge 001](/artikel/folge-001-hautuu-intro/), [Folge 011](/artikel/folge-011-cloudflare-setup/).

### Wie viel Zeit soll ich einplanen?

Das Projekt wächst in vielen Sessions. Plane lieber mehrere Abende ein als „fertig in einer Stunde“. Die Folgen sind der rote Faden.

### Reicht mein Internet?

Ja, für Git, [Build](/glossar/build/)s in der Cloud und Downloads wie `npm install`. Große Medien lokal sparen Bandbreite. [Folge 018](/artikel/folge-018-node-npm/).

### Brauche ich Chrome für das CMS?

Für [Sveltia](/glossar/sveltia/) online wird **Chrome/Chromium** empfohlen; Firefox klappt fürs [Backend](/glossar/backend/) oft nicht. Lokal: Chromium (oder Chrome), [Lokales Repository](/glossar/lokales-repository/) und [`npm run dev`](/glossar/npm/); bis der [Worker](/glossar/cloudflare-worker/) für dein neues Repo steht, ist lokales Ändern oft der schnellere Weg. [Folge 013](/artikel/folge-013-sveltia-pat/), [Folge 024](/artikel/folge-024-github-template-privat/).

### Was ist Lokales Repository beim CMS-Login?

Du wählst den **Projektordner** auf dem Rechner statt nur GitHub online. So bearbeitest du Inhalte unter `/admin/` lokal, bevor der Worker für ein neues Repo läuft. [Glossar Lokales Repository](/glossar/lokales-repository/), [Folge 024](/artikel/folge-024-github-template-privat/).

### Ist hautuu nur eine Demo oder „echt“ live?

Echte Site unter der Projekt-Domain, öffentliches Repo, echte [Deployments](/glossar/deploy/). Du kannst mitlesen und denselben Stack lernen. [Über mich](/autoren/wasilij/).

### Muss ich KI extra bezahlen neben Cursor?

Cursor-Abos enthalten Kontingente; stärkere Modelle und **[Cloud Agents](/glossar/cloud-agent/)** verbrauchen mehr. On-Demand-Nachkauf ist möglich, kann teuer werden. [Folge 009](/artikel/folge-009-cursor-abo/).

---

## Terminal und Rechner

### Was ist ein Terminal und brauche ich das?

Ein Textfenster für Befehle (auch **Konsole** oder **Kommandozeile**). In [Cursor](/glossar/cursor/) ist oft eins eingebaut. Für hautuu reicht meist: Befehle aus den Folgen kopieren oder der Agent tippt sie. [Glossar Terminal](/glossar/terminal/), [Folge 001](/artikel/folge-001-hautuu-intro/), [Folge 008](/artikel/folge-008-cursor-modi/).

### Was ist eine CLI?

Programme wie [Git](/glossar/git/), [npm](/glossar/npm/) oder `ssh-keygen`, die du per Text im [Terminal](/glossar/terminal/) bedienst. [Glossar CLI](/glossar/cli/), [Folge 006](/artikel/folge-006-git-push-pull/), [Folge 018](/artikel/folge-018-node-npm/).

### Wie öffne ich ein Terminal?

In Cursor: Terminal-Leiste. Am System: je nach OS ein Programm wie „Terminal“ (Mac/Linux). [Folge 001](/artikel/folge-001-hautuu-intro/).

### Was bedeutet `cd`?

**Change directory**: in einen Ordner wechseln. Viele Befehle aus den Folgen setzen voraus, dass du im Projektordner bist. [Folge 017](/artikel/folge-017-github-ssh/).

### Warum beendet Strg+C meinen Server?

Im [Terminal](/glossar/terminal/) ist **Strg+C** Stopp, nicht Kopieren. `npm run dev` damit beenden. [Folge 003](/artikel/folge-003-erstes-design/).

### Was sind versteckte Dateien?

Namen mit Punkt am Anfang (z. B. `.git`, `.env`). Im Dateimanager oft per Strg+H sichtbar. [Folge 001](/artikel/folge-001-hautuu-intro/), [Folge 017](/artikel/folge-017-github-ssh/).

### Was ist das Home-Verzeichnis (`~`)?

Dein persönlicher Ordner unter Linux/Mac. `~/.ssh` liegt dort für [SSH-Keys](/glossar/ssh-key/). [Folge 017](/artikel/folge-017-github-ssh/).

### Der Ordnername auf der Festplatte ist egal?

Ja, für Git zählt der Inhalt mit `.git`, nicht der Display-Name des Ordners. [Folge 006](/artikel/folge-006-git-push-pull/).

### Muss mein Rechner laufen, wenn der Cloud Agent arbeitet?

Nein. Der [**Cloud Agent**](/glossar/cloud-agent/) läuft in der Cloud; du liest das Ergebnis später auf GitHub. [Folge 015](/artikel/folge-015-transkript-artikel/).

---

## GitHub und Git

### Was ist der Unterschied zwischen Git und GitHub?

[**Git**](/glossar/git/) ist die Versionsverwaltung auf deinem Rechner. [**GitHub**](/glossar/github/) ist der Dienst, wo das Repo liegt und [Issues](/glossar/issue/)/[PRs](/glossar/pull-request/) laufen. [Folge 001](/artikel/folge-001-hautuu-intro/).

### Was ist ein Repository?

Der Projektordner unter Versionskontrolle. [Glossar Repository](/glossar/repository/), [Folge 001](/artikel/folge-001-hautuu-intro/).

### Was machen Commit, Push und Pull?

[**Commit**](/glossar/commit/) speichert lokal, [**Push**](/glossar/push/) schickt zu GitHub, [**Pull**](/glossar/pull/) holt Änderungen zu dir. [Folge 006](/artikel/folge-006-git-push-pull/).

### Warum geht Push manchmal nicht?

GitHub ist oft neuer als dein Ordner. Erst [**pullen**](/glossar/pull/), Konflikte lösen, dann pushen. [Folge 006](/artikel/folge-006-git-push-pull/).

### Was sind Issues?

[**Tickets**](/glossar/issue/) für Bugs, Ideen und Aufgaben. Im Chat: „Bitte [Issue](/glossar/issue/) #5 umsetzen“. [Folge 002](/artikel/folge-002-github-issues/).

### Was ist ein Pull Request?

Vorschlag, einen [**Branch**](/glossar/branch/) in [`main`](/glossar/main/) (oder anders) zu [merge](/glossar/merge/)n, mit Checks. [Glossar Pull Request](/glossar/pull-request/), [Folge 016](/artikel/folge-016-artikel-pull-request/).

### Wie prüfe ich KI-Änderungen vor dem Merge?

In [Cursor](/glossar/cursor/) „Source Control“ (Quellcode-Verwaltung) für lokale Diffs; im PR auf GitHub „Files changed“ (Geänderte Dateien). Kommentare und „Suggest changes“ (Änderung vorschlagen), dann „Submit review“ (Review absenden). [Glossar Diff](/glossar/diff/), [Glossar Code Review](/glossar/code-review/), [Folge 022](/artikel/folge-022-ki-aenderungen-pruefen-pr/).

### Was ist `main`?

Der Hauptzweig, den Cloudflare als [Production](/glossar/production/) baut. [Glossar Main](/glossar/main/), [Folge 012](/artikel/folge-012-cloudflare-branches/).

### Merge oder Rebase?

[**Merge**](/glossar/merge/) zeigt die Verzweigung; [**Rebase**](/glossar/rebase/) linearisiert. Einstieg: [Merge](/glossar/merge/) reicht. [Folge 007](/artikel/folge-007-merge-rebase/).

### Wie hole ich das Projekt auf den Rechner?

[`git clone`](/glossar/clone/). Private Repos: [**SSH-Key**](/glossar/ssh-key/). [Folge 017](/artikel/folge-017-github-ssh/).

### Ist mein Code öffentlich?

Bei hautuu ja: **öffentliches** [Repo](/glossar/repository/), jeder kann den Quellcode lesen. Schreiben nur mit Berechtigung. Startest du dein eigenes Projekt per [**Template**](/glossar/template/), kannst du das Repo **privat** machen. Das ist etwas anderes als ob deine **Website** im Internet erreichbar ist (Hosting/Domain). [Folge 001](/artikel/folge-001-hautuu-intro/), [Folge 020](/artikel/folge-020-bausteine-fork/).

### Was ist ein Fork?

Deine Kopie eines fremden Repos unter deinem Account. Nicht verwechseln mit `git clone` allein. Fork eines öffentlichen Repos bleibt öffentlich; für privat nutze das [**Template**](/glossar/template/). [Glossar Fork](/glossar/fork/), [Folge 002](/artikel/folge-002-github-issues/), [Folge 020](/artikel/folge-020-bausteine-fork/).

### Was ist der Unterschied zwischen privatem Repo und öffentlicher Website?

**Repo privat/öffentlich** auf GitHub: Wer den **Code** lesen darf. **Website online**: Ob Besucher deine Seiten unter einer Domain sehen. Beides steuerst du getrennt. [Glossar Repository](/glossar/repository/), [Folge 020](/artikel/folge-020-bausteine-fork/).

### Was ist Upstream?

Das **Original-Repo**, aus dem deine Kopie stammt (z. B. [platomat/hautoo](https://github.com/platomat/hautoo) nach **Use this template**). Updates kommen **nicht automatisch**; du holst sie per [Pull](/glossar/pull/) oder [Merge](/glossar/merge/). [Glossar Upstream](/glossar/upstream/), [Folge 024](/artikel/folge-024-github-template-privat/), [Folge 020](/artikel/folge-020-bausteine-fork/).

### Was ist `origin`?

Der Standardname für dein Remote auf GitHub. [Glossar Origin](/glossar/origin/), [Folge 001](/artikel/folge-001-hautuu-intro/).

---

## Cursor und KI

### Was ist der Unterschied zwischen Ask, Agent und Plan?

**[Ask](/glossar/cursor-modi/)** fragt nur, „Agent“ (Agent) schreibt und nutzt das Terminal, „[Plan](/glossar/cursor-modi/)“ (Plan) plant erst. [Glossar Ask, Agent und Plan](/glossar/cursor-modi/), [Folge 008](/artikel/folge-008-cursor-modi/).

### Was ist ein Prompt?

Deine Anweisung an die KI: was sie tun oder erklären soll. Klarer Prompt, weniger Korrekturrunden. [Glossar Prompt](/glossar/prompt/), [Folge 005](/artikel/folge-005-astro-toolbar/), [Folge 008](/artikel/folge-008-cursor-modi/).

### Warum zwei Chats?

Ein Chat sucht Probleme, einer fixt. Klarere Rollen. [Folge 010](/artikel/folge-010-cursor-chats/).

### Was sind Cloud Agents?

Agenten in der Cloud, Ergebnis oft ein [**Pull Request**](/glossar/pull-request/). [Glossar Cloud Agent](/glossar/cloud-agent/), [Folge 015](/artikel/folge-015-transkript-artikel/).

### Soll der Agent einfach pushen?

Bei hautuu: **nur auf dein Wort**, sonst ungewolltes Live-[Deploy](/glossar/deploy/). [Folge 003](/artikel/folge-003-erstes-design/), [Folge 002](/artikel/folge-002-github-issues/).

### Kann die KI Fehler machen?

Ja. [PRs](/glossar/pull-request/), Preview und `npm run build` prüfen; du liest den Diff. [Folge 016](/artikel/folge-016-artikel-pull-request/), [Folge 010](/artikel/folge-010-cursor-chats/).

### Wie merke ich, dass die KI Mist gebaut hat?

Rote CI-Checks, [Build](/glossar/build/)-Fehler, kaputtes Layout in `npm run dev` oder Preview. Issue mit konkretem Symptom öffnen. [Folge 016](/artikel/folge-016-artikel-pull-request/).

### Was sind Tokens und Kontingente?

Recheneinheiten für Modelle; große Kontexte und Cloud Agents kosten mehr. [Folge 009](/artikel/folge-009-cursor-abo/).

### Wann Plan-Modus statt direkt Agent?

Bei größeren Features (z. B. Burger-Menü): Plan lesen, korrigieren, dann bauen. [Folge 008](/artikel/folge-008-cursor-modi/).

### Landen Chats im Repo?

Nur wenn du sie [committest](/glossar/commit/). Exporte nach `docs/sessions/` und `.gitignore` nutzen. [Folge 008](/artikel/folge-008-cursor-modi/).

### Was ist eine IDE und warum Cursor?

Eine [IDE](/glossar/ide/) bündelt Dateien, Editor, Terminal und Fehlermeldungen. [Cursor](/glossar/cursor/) ist eine [IDE](/glossar/ide/) auf Basis von VS Code mit KI-Agenten für hautuu. [Folge 001](/artikel/folge-001-hautuu-intro/), [Folge 008](/artikel/folge-008-cursor-modi/).

### Was ist der IDE-Modus?

Dateibaum, Terminal, Agent: so arbeitest du am Projekt, nicht nur im Chat-Fenster. [Glossar IDE](/glossar/ide/), [Folge 008](/artikel/folge-008-cursor-modi/).

### Issues statt endlos im Chat erklären?

Ja. Issue beschreibt die Aufgabe dauerhaft auf GitHub. [Folge 002](/artikel/folge-002-github-issues/).

---

## Cloudflare

### Was macht Cloudflare Pages hier?

Baut nach Git-[Push](/glossar/push/) (`npm run build`, Output `dist`) und hostet die Site. [Folge 011](/artikel/folge-011-cloudflare-setup/).

### Brauche ich FTP für hautuu?

Nein. Du brauchst keinen [FTP](/glossar/ftp/)-Zugang zum Hochladen von Dateien. Du [committest](/glossar/commit/) und pushst zu GitHub; [Cloudflare Pages](/glossar/cloudflare-pages/) holt den Stand und baut. Details im Glossar-Eintrag „[FTP](/glossar/ftp/)“, Kontext [Folge 012](/artikel/folge-012-cloudflare-branches/).

### Funktioniert der Build auch auf normalem Hosting ohne Cloudflare Pages?

Ja, für die **Website selbst** weitgehend: [Astro](/glossar/astro/) baut rein statisches HTML, CSS und JS (`dist/`). Das kannst du lokal oder bei [Cloudflare](/glossar/cloudflare-pages/) bauen und auf Apache, Nginx, Netlify, S3 mit CDN usw. legen. [Folge 011](/artikel/folge-011-cloudflare-setup/).

Einschränkungen:

- **`_redirects` / `_headers`:** Cloudflare-Format. Parallel in `dist/`: `.htaccess` und `nginx-redirects.conf` mit denselben Redirects und Cache-Headern (Apache bzw. Nginx-`include`). Cloudflare ignoriert beide.
- **Pretty URLs:** Ordner wie `/artikel/folge-001/` brauchen `index.html`-Auflösung (üblich, muss der Server können).
- **404:** `404.html` nur, wenn der Hoster sie als Fehlerseite kennt.
- **CMS-[OAuth](/glossar/oauth/)-[Worker](/glossar/cloudflare-worker/):** läuft **nicht** im `dist/` (Cloudflare). Online redigieren geht weiter per GitHub-PAT; Deploy nach CMS-Commit musst du ohne Pages selbst anbinden.
- **Domain beim Build:** absolute URLs (Sitemap, `llms.txt`, …) kommen aus `SITE` bzw. Default in `astro.config`; z. B. `SITE=https://www.beispiel.de npm run build`.

Kurz: Statische Seiten und Artikel: ja. Cloudflare-only-Extras: separat bzw. ersetzen. Vertiefung: [Externes Hosting](https://github.com/platomat/hautoo/blob/main/docs/hosting/README.md) im Repo.

### Was ist eine Preview-URL?

Temporäre Adresse für einen [Branch](/glossar/branch/), bevor du mergst. [Glossar Preview-URL](/glossar/preview-url/), [Folge 012](/artikel/folge-012-cloudflare-branches/).

### Kann ich eine alte Version zurückholen?

[**Rollback**](/glossar/rollback/) auf ein früheres **[Production](/glossar/production/)**-Deployment: in „Deployments“ das Dreipunkte-Menü (⋯) → „[Rollback](/glossar/rollback/) to this deployment“. Nicht für laufende Builds oder [Preview-Deployments](/glossar/preview-url/). [Folge 012](/artikel/folge-012-cloudflare-branches/), [Folge 022](/artikel/folge-022-ki-aenderungen-pruefen-pr/).

### Was ist der Worker?

[**Edge-Programm**](/glossar/cloudflare-worker/) z. B. für [CMS](/glossar/cms/)-Login, nicht die Website selbst. [Folge 014](/artikel/folge-014-sveltia-worker/).

### Push heißt automatisch neu bauen?

Ja, wenn Pages mit dem Repo verbunden ist. [Folge 011](/artikel/folge-011-cloudflare-setup/).

### Wie bekomme ich eine eigene Domain?

Unter „Custom domains“ (Eigene Domains) in Pages, oft CNAME/TLS über Cloudflare. [Folge 011](/artikel/folge-011-cloudflare-setup/).

### Was ist die `pages.dev`-URL?

Die von Cloudflare vergebene Adresse zum Testen, auch für Previews. [Folge 011](/artikel/folge-011-cloudflare-setup/), [Folge 012](/artikel/folge-012-cloudflare-branches/).

### Wie lange dauert ein Deploy?

Oft wenige Minuten; manchmal hängt der Hook kurz. Unter Deployments in Cloudflare den Status sehen. [Folge 014](/artikel/folge-014-sveltia-worker/).

### Warum sehe ich meine Änderung nicht online?

Nicht gepusht, falscher [Branch](/glossar/branch/), Build noch läuft oder fehlgeschlagen, oder du schaust Preview statt Production. [Folge 006](/artikel/folge-006-git-push-pull/), [Folge 011](/artikel/folge-011-cloudflare-setup/).

### Woran erkenne ich, welcher Commit live ist?

Die ersten Zeichen der [Commit](/glossar/commit/)-ID (Hash) in Cloudflare Pages mit GitHub abgleichen; meist reichen etwa sieben Zeichen. Stimmen sie, ist derselbe Stand live. [Folge 011](/artikel/folge-011-cloudflare-setup/).

---

## Sveltia CMS

### Was ist Sveltia und wo ist `/admin`?

[**Git-basiertes CMS**](/glossar/sveltia/) im Browser. Lokal: `npm run dev` und `/admin/`. [Folge 013](/artikel/folge-013-sveltia-pat/).

### Wie logge ich mich online ein?

Mit [**PAT**](/glossar/pat/) oder später GitHub-Login über [**Worker**](/glossar/cloudflare-worker/). [Folge 013](/artikel/folge-013-sveltia-pat/), [Folge 014](/artikel/folge-014-sveltia-worker/).

### Was sind Collections?

Inhaltstypen wie pages, articles, menus, blocks (Bausteine). [Glossar Collection](/glossar/collection/), [Folge 004](/artikel/folge-004-collection-pages/).

### Was ist ein Baustein und wie nutze ich ihn?

Wiederverwendbarer Inhalt ohne eigene URL in der [Collection](/glossar/collection/) **blocks**. Einbinden mit `{{block id="slug"}}` oder Toolbar **Baustein** in [Sveltia](/glossar/sveltia/). [Glossar Baustein](/glossar/baustein/), [Folge 020](/artikel/folge-020-bausteine-fork/).

### Was ist Frontmatter?

Metadaten oben in der Datei; darunter [**Markdown**](/glossar/markdown/). [Glossar Frontmatter](/glossar/frontmatter/), [Folge 004](/artikel/folge-004-collection-pages/).

### Speichern heißt sofort live?

Nur wenn auf **[main](/glossar/main/)** gepusst und Production baut. Sonst Branch/Preview. [Folge 012](/artikel/folge-012-cloudflare-branches/).

### Was ist der lokale Modus?

Ordner auf der Platte öffnen, ohne Passwort, weil die Dateien schon da sind. [Folge 013](/artikel/folge-013-sveltia-pat/).

### Was sind Menüs im CMS?

Eigene **menus**-[Collection](/glossar/collection/), nicht nur pro Seite. [Folge 014](/artikel/folge-014-sveltia-worker/), [Folge 004](/artikel/folge-004-collection-pages/).

### Kann ich SEO-Felder pflegen?

Ja, z. B. Tab-Titel und Meta Description im [CMS](/glossar/cms/). [Folge 013](/artikel/folge-013-sveltia-pat/), [Folge 004](/artikel/folge-004-collection-pages/).

### Wo landen Bilder?

In der Medienbibliothek unter `src/assets` (geteilte Motive) oder **neben dem Artikel** (Variante B). [Folge 021](/artikel/folge-021-bilder-suchen-nutzen/), [Folge 013](/artikel/folge-013-sveltia-pat/).

### Woher bekomme ich kostenlose Bilder?

Stock-Seiten wie Pixabay, Unsplash, Pexels oder Freepik, jeweils mit **eigener Lizenz** und oft kostenpflichtigen Sponsored-Treffern. Immer die Lizenz der Plattform lesen. [Folge 021](/artikel/folge-021-bilder-suchen-nutzen/).

### Was ist WebP?

Ein Bildformat fürs Web, oft kleiner als JPEG. [Astro](/glossar/astro/) erzeugt beim Build WebP für Hintergründe. Vor dem Upload trotzdem verkleinern. [Glossar WebP](/glossar/webp/), [Folge 021](/artikel/folge-021-bilder-suchen-nutzen/).

### Brauche ich Alt-Text?

Ja, wenn das Bild **Inhalt** transportiert. Reine Deko-Hintergründe können leer bleiben (`alt=""`). [Glossar Alt-Text](/glossar/alt-text/), [Folge 021](/artikel/folge-021-bilder-suchen-nutzen/).

### Was passiert beim Speichern technisch?

Datei ändert sich, dann Commit zu GitHub, dann Cloudflare-Build. [Folge 013](/artikel/folge-013-sveltia-pat/).

---

## Node und npm

### Brauche ich Node.js?

Ja für `npm install`, `npm run dev` und `npm run build` lokal. Empfohlen: Version 22. [Folge 018](/artikel/folge-018-node-npm/).

### Was macht `npm install`?

Lädt die Pakete (Abhängigkeiten) aus `package.json` nach `node_modules`. [Glossar npm](/glossar/npm/), [Folge 018](/artikel/folge-018-node-npm/).

### Muss ich jedes Mal npm install ausführen?

Nein. Für die lokale Vorschau reicht in der Regel **`npm run dev`**, sobald `node_modules` einmal da ist. **`npm install`** nur bei Klon, geändertem `package.json` / `package-lock.json`, fehlendem `node_modules`, Node-Wechsel oder Fehlern wie „Cannot find module“. Nicht bei normalen Textänderungen oder wenn du den Dev-Server nur neu startest. Checkliste: [Folge 018](/artikel/folge-018-node-npm/). Cloudflare führt beim Build im Prinzip dasselbe wie `npm install` aus ([Folge 002](/artikel/folge-002-github-issues/)). Der Cursor-Agent weist dich bei Dependency-Änderungen meist darauf hin oder führt den Befehl selbst aus.

### Was ist der Unterschied zwischen `npm run dev` und `npm run build`?

**dev** = Entwicklungsvorschau lokal, **build** = fertige Site für Production. [Folge 005](/artikel/folge-005-astro-toolbar/), [Folge 018](/artikel/folge-018-node-npm/).

### Was ist nvm?

[**Node Version Manager**](/glossar/nvm/) für mehrere [Node](/glossar/nodejs/)-Versionen. [Folge 018](/artikel/folge-018-node-npm/).

### Was ist `localhost`?

Dein Rechner lokal; der Dev-Server zeigt oft Port 4321. [Folge 018](/artikel/folge-018-node-npm/), [Folge 013](/artikel/folge-013-sveltia-pat/).

### Committe ich `node_modules`?

Nein. Nur `package.json` / Lockfile im Repo; installieren kann jeder mit `npm install`. [Folge 018](/artikel/folge-018-node-npm/).

### Was ist `package.json`?

Liste der [npm](/glossar/npm/)-Abhängigkeiten und Skripte wie `dev` und `build`. [Folge 018](/artikel/folge-018-node-npm/).

### Baut Cloudflare auch mit npm?

Ja, derselbe Build-Befehl wie lokal. [Folge 011](/artikel/folge-011-cloudflare-setup/), [Folge 002](/artikel/folge-002-github-issues/).

---

## Inhalte pflegen

### Wie schreibe ich einen Artikel ohne Code?

Im [**CMS**](/glossar/cms/) unter `/admin/` oder [Markdown](/glossar/markdown/) in Cursor. [Folge 013](/artikel/folge-013-sveltia-pat/).

### Wie binde ich ein Video ein?

Toolbar **Video** bzw. `{{video …}}` im Inhalt (Position frei wählbar). **YouTube/Vimeo:** erst [Consent](/glossar/consent/)-Facade, Klick lädt den Player. **Eigene MP4:** `provider="file"` und [Cloudflare R2](/glossar/cloudflare-r2/) mit **Video-Basis-URL**. Geschützt: `{{member-video …}}`. [Folge 023](/artikel/folge-023-neue-features-demo-cms/), [Folge 001](/artikel/folge-001-hautuu-intro/).

### Was sind Tags?

Stichworte zu Artikeln, keine tiefe Kategorie-Hierarchie. [Folge 004](/artikel/folge-004-collection-pages/).

### Was ist das Artikel-Listing?

[**Komponente**](/glossar/komponente/) im Seiteninhalt (`{{article-listing …}}`): Anzahl, Sortierung, Kartenfelder, optional **Filter** nach Autor, Kategorie oder Tag. **UND:** alle gewählten Filter müssen passen. **ODER:** ein Filter reicht. Relative Pfade (`/kategorien/news/`) funktionieren lokal und live. [Folge 023](/artikel/folge-023-neue-features-demo-cms/), [Folge 019](/artikel/folge-019-impressum-komponenten/).

### Was ist die Trennlinien-Komponente?

**Trennlinie** im CMS mit Höhe und Breite. [Folge 019](/artikel/folge-019-impressum-komponenten/).

### Was ist der Abstandshalter?

Vertikaler Leerraum im Inhalt (`{{spacer}}`, optional `height` in px, Standard 32). Toolbar **Abstandshalter**. Ohne sichtbare Linie, anders als die **Trennlinie**.

### Wie pflege ich das Glossar?

Eigene Collection `glossar`, Übersicht unter `/glossar/`. [Glossar](/glossar/), [Folge 004](/artikel/folge-004-collection-pages/).

### Kann ich Glossarbegriffe nachschlagen, ohne den Artikel zu verlassen?

In **Firefox** (Desktop, Link Previews ab Version 142): Rechtsklick auf den Glossar-Link → **Link-Vorschau** (englische Oberfläche: „Preview Link“), oder Link lange gedrückt halten. Die Vorschau öffnet sich in Firefox, der Artikel bleibt im Hintergrund. Lokal mit `localhost` funktioniert das oft nicht; auf der Live-Site schon. [Folge 020](/artikel/folge-020-bausteine-fork/), [Mozilla-Hilfe](https://support.mozilla.org/kb/use-link-previews-firefox).

### Kann ich Artikel aus Videos erzeugen lassen?

Fertige Videos transkribieren lassen, Texte an den [**Cloud Agent**](/glossar/cloud-agent/) in Cursor, Ergebnis als Pull Request prüfen. [Folge 015](/artikel/folge-015-transkript-artikel/).

### Was prüfen die Content-Skripte im Build?

`check-content-links.py` (Links, Glossar-Erstlinks, Embeds) und `check-content-no-video-hints.py` (keine Video-/Screencast-Meta-Hinweise in Artikeln). Laufen mit `npm run prebuild`. [Folge 022](/artikel/folge-022-ki-aenderungen-pruefen-pr/), `docs/redaktion/README.md`.

### Wo sehe ich alle Site-Features?

Seite [/features/](/features/), zum Vorschauen die [Demo](/features/demo/) und Kurzliste im [README](https://github.com/platomat/hautoo/blob/main/README.md). [Folge 023](/artikel/folge-023-neue-features-demo-cms/), [Folge 022](/artikel/folge-022-ki-aenderungen-pruefen-pr/).

### Wie leite ich alte URLs auf eine neue Seite um?

Collection **Weiterleitungen** im CMS: Quellpfade vom Root (`/ueber-uns/`), ein Ziel (`/autoren/wasilij/`), Status **301**. Build erzeugt `_redirects` für [Cloudflare Pages](/glossar/cloudflare-pages/). [Glossar Weiterleitung](/glossar/weiterleitung/), [Folge 023](/artikel/folge-023-neue-features-demo-cms/).

### Was ist Gravatar beim Autor-Avatar?

Optional **Gravatar (E-Mail oder URL)** in der Collection **Autoren**; lokales Feld **Avatar** hat Vorrang. Zentraler Dienst unter gravatar.com, Datenschutz beachten. [Glossar Gravatar](/glossar/gravatar/), [Folge 023](/artikel/folge-023-neue-features-demo-cms/).

### Was räume ich nach dem Template-Start auf?

Menü **Hauptmenü** aufräumen (z. B. **Glossar**, **Features**, **Demo** entfernen), [MIT-Lizenz](/glossar/mit-lizenz/)-Vorlagen-Seiten und -Artikel löschen, eigene Kategorien und Tags anlegen. [Folge 024](/artikel/folge-024-github-template-privat/).

### Wie passe ich Design und Abstände an?

Im CMS unter **Einstellungen** → **Design** (Farben, Header, Footer, [Hero](/glossar/hero/), Inhaltsbreite, Abstände in [rem](/glossar/rem/)) oder Issues an den Agenten. [Folge 023](/artikel/folge-023-neue-features-demo-cms/), [Folge 003](/artikel/folge-003-erstes-design/), [Folge 005](/artikel/folge-005-astro-toolbar/).

### Was ist der Hero?

Der sichtbare **Seitenkopf** mit Titel, optional Brotkrumen, Tags oder Autoren. Global unter **Einstellungen** → **Design** → **Hero**; pro Seite **Hero überschreiben**. [Glossar Hero](/glossar/hero/), [Folge 023](/artikel/folge-023-neue-features-demo-cms/).

### Was ist ein Favicon?

Das **kleine Tab-Icon** im Browser. Unter **Einstellungen** → **Allgemein** → **Favicons**, optional hell und dunkel. [Glossar Favicon](/glossar/favicon/), [Folge 023](/artikel/folge-023-neue-features-demo-cms/).

### Was bedeutet sticky beim Header?

Der **Header bleibt beim Scrollen oben** (sticky), oft mit schmalerer **Sticky Header**-Zeile. Ein/Aus pro Geräteklasse unter **Design** → **Header**. [Glossar Sticky Header](/glossar/sticky-header/), [Folge 023](/artikel/folge-023-neue-features-demo-cms/).

### Was ist das Inhaltsverzeichnis (TOC)?

Sprungliste der **Überschriften** im Artikel oder auf der Seite. **Einstellungen** → **Inhalt**; pro Eintrag **TOC überschreiben**. [Glossar Inhaltsverzeichnis](/glossar/inhaltsverzeichnis/), [Folge 023](/artikel/folge-023-neue-features-demo-cms/).

### Warum muss ich YouTube-Videos erst freischalten?

Datenschutz: ohne Klick lädt hautuu **keinen** YouTube-/Vimeo-Player. Nach Zustimmung kann der Browser die Wahl in `localStorage` merken (kein Cookie; Erklärung unter **Rechtliches** weiter unten). Widerruf per Embed **Video-Freischaltung widerrufen**. [Glossar Consent](/glossar/consent/), [Folge 023](/artikel/folge-023-neue-features-demo-cms/).

### Was ist Cloudflare R2 bei Videos?

**Objektspeicher** für große MP4s statt Git-Repo. Bucket bei Cloudflare, **Video-Basis-URL** im CMS, Embed `provider="file"`. [Glossar Cloudflare R2](/glossar/cloudflare-r2/), Repo-Doku `docs/cloudflare/r2-videos.md`, [Folge 023](/artikel/folge-023-neue-features-demo-cms/).

### Was ist ein Slug?

Der **Kurzname** in URL und Ordner, z. B. `wasilij` in `/autoren/wasilij/`. Feld **Slug** im CMS. [Glossar Slug](/glossar/slug/), [Folge 023](/artikel/folge-023-neue-features-demo-cms/).

### Wie funktioniert die Suche auf der Website?

**Sitesuche** im Header durchsucht den beim [Build](/glossar/build/) erzeugten Index (MiniSearch), meist per **Strg+K**. [Glossar Sitesuche](/glossar/sitesuche/), [Features](/features/#design-und-nutzung), [Folge 023](/artikel/folge-023-neue-features-demo-cms/).

### Was ist die Mediathek im CMS?

Die **Galerie** für Bilder (Logo, Favicon, Avatar, …) unter `src/assets/`. Keine großen Videos fürs [Repo](/glossar/repository/): dafür [Cloudflare R2](/glossar/cloudflare-r2/). [Glossar Mediathek](/glossar/mediathek/), [Folge 023](/artikel/folge-023-neue-features-demo-cms/).

### Was bedeutet Inhaltsbreite (Standard, breit, vollbreit)?

Steuert, wie breit Text und Layout laufen (Lesespalte vs. volle Breite). Global unter **Einstellungen** → **Design**, pro Artikel oder Seite überschreibbar. [Glossar Inhaltsbreite](/glossar/inhaltsbreite/), [Folge 023](/artikel/folge-023-neue-features-demo-cms/).

### Was ist ein Repo-Dokument in der Toolbar?

Embed **Repo-Dokument** verlinkt eine Datei unter `docs/` auf GitHub als Hinweisbox im Inhalt. [Glossar Repo-Dokument](/glossar/repo-dokument/), [Demo](/features/demo/), [Folge 023](/artikel/folge-023-neue-features-demo-cms/).

### Was sind Breakpoints?

Layout-Umschaltung z. B. unter 680 px mobil. [Glossar Breakpoint](/glossar/breakpoint/), [Folge 005](/artikel/folge-005-astro-toolbar/).

### Seiten-Hintergrundbild?

Optionales Feld in Pages, Lesbarkeit per Overlay. [Folge 015](/artikel/folge-015-transkript-artikel/), [Folge 019](/artikel/folge-019-impressum-komponenten/).

---

## Rechtliches

### Brauche ich Impressum und Datenschutz?

Für einen öffentlichen Auftritt in Deutschland üblicherweise ja. Inhalte prüfen lassen, nicht blind der KI überlassen. [Folge 019](/artikel/folge-019-impressum-komponenten/), [Folge 003](/artikel/folge-003-erstes-design/).

### Wo liegen die Texte?

Als normale Pages im Repo, oft im Footer verlinkt. [Folge 003](/artikel/folge-003-erstes-design/).

### Sollen Legal-Seiten bei Google indexiert werden?

Oft **noindex** für Impressum/Datenschutz. [Folge 004](/artikel/folge-004-collection-pages/).

### Wie schütze ich die Kontakt-E-Mail?

[**ENV**](/glossar/env/) lokal und Secrets bei Cloudflare, nicht im Repo. [Folge 019](/artikel/folge-019-impressum-komponenten/).

### Bildnachweise?

Feld **Bildnachweis** (`background.attribution`) im CMS; gesammelte Credits auf dem Impressum. [Glossar Bildnachweis](/glossar/bildnachweis/), [Folge 019](/artikel/folge-019-impressum-komponenten/#bildnachweise-im-impressum), [Folge 021](/artikel/folge-021-bilder-suchen-nutzen/).

### KI-generierte Rechtstexte ungeprüft übernehmen?

Nein. Unpassende Abschnitte raus, Inhalt an dein Setup anpassen. [Folge 019](/artikel/folge-019-impressum-komponenten/).

### Was ist ein Cookie?

Ein **Cookie** ist ein kleiner Texteintrag, den eine Website im Browser speichern kann. Bei vielen Seitenaufrufen sendet der Browser das Cookie **mit der Anfrage** an den Server ([MDN: HTTP-Cookies](https://developer.mozilla.org/de/docs/Web/HTTP/Guides/Cookies)). In Datenschutzerklärungen erwähnst du Cookies, wenn du sie nutzt. [Glossar Cookie](/glossar/cookie/).

### Was ist localStorage?

**localStorage** ist ein **Speicher nur im Browser** auf dem Gerät des Besuchers. Die Daten bleiben für diese Domain gespeichert, werden aber **nicht** bei jedem Seitenaufruf automatisch an den Server geschickt ([MDN: Window.localStorage](https://developer.mozilla.org/de/docs/Web/API/Window/localStorage)). [Glossar localStorage](/glossar/localstorage/).

### Was ist der Unterschied zwischen Cookie und localStorage?

**Cookies** können der Server bei passenden Anfragen **mitlesen** (z. B. Login), oft mit **Ablaufdatum** und strengen Größenlimits. **localStorage** bleibt **clientseitig**: JavaScript der Seite liest und schreibt dort, typisch für UI-Einstellungen. Beides betrifft **Datenschutz**, wenn personenbezogene oder verhaltensbezogene Daten drinstehen. **hautuu:** die site-weite **Video-Freigabe** (YouTube/Vimeo) liegt in `localStorage` unter `hautuu-video-consent`, **nicht** in einem Cookie (`src/lib/video-consent.ts`). Kurz erklärt in den beiden Fragen direkt darüber; Video-Kontext: [Consent](/glossar/consent/).

---

## Sicherheit

### Was darf **nie** ins Repo?

Passwörter, [**PATs**](/glossar/pat/), API-Keys, private SSH-Keys, echte `.env`-Werte. [Folge 001](/artikel/folge-001-hautuu-intro/), [Folge 002](/artikel/folge-002-github-issues/).

### Ist ein PAT wie ein Passwort?

Ja. Einmal kopieren, nicht zeigen, bei Leak widerrufen. [Folge 013](/artikel/folge-013-sveltia-pat/).

### Darf ich meinen privaten SSH-Key teilen?

Nein. Nur die `.pub`-Datei gehört zu GitHub. [Folge 017](/artikel/folge-017-github-ssh/).

### Hilft ein öffentliches Repo Scrapern?

Ja, E-Mail im Klartext wäre sichtbar. Deshalb ENV/Secrets. [Folge 019](/artikel/folge-019-impressum-komponenten/).

### Wo liegen OAuth-Secrets?

Als Secrets im [**Worker**](/glossar/cloudflare-worker/), nicht in `config.yml` im Klartext. [Folge 014](/artikel/folge-014-sveltia-worker/).

### Gelöschte Dateien sind weg?

Aus dem aktuellen Stand ja, in der [**Historie**](/glossar/git-history/) oft noch lesbar. [Folge 006](/artikel/folge-006-git-push-pull/).

### Was sind Allowed domains im CMS?

Schutz, welche Domains Sveltia nutzen darf. [Folge 014](/artikel/folge-014-sveltia-worker/).

---

## Fehler und Problemlösung

### Was passiert, wenn ich etwas kaputt mache?

Git behält Historie; Cloudflare [**Rollback**](/glossar/rollback/); lokal Änderungen verwerfen. Nicht panisch. [Folge 012](/artikel/folge-012-cloudflare-branches/), [Folge 006](/artikel/folge-006-git-push-pull/).

### Merge-Konflikt, was tun?

Datei öffnen, Zeilen wählen, committen. Dem Agenten die Situation beschreiben. [Folge 006](/artikel/folge-006-git-push-pull/), [Folge 014](/artikel/folge-014-sveltia-worker/).

### PR-Build rot, was jetzt?

Logs lesen, oft `npm run build` lokal nachstellen, Fix committen. [Folge 016](/artikel/folge-016-artikel-pull-request/).

### Permission denied beim Clone?

Meist fehlender [**SSH-Key**](/glossar/ssh-key/) oder falscher Key bei GitHub. [Folge 017](/artikel/folge-017-github-ssh/).

### `npm run dev` startet nicht?

[Node](/glossar/nodejs/) installiert? Vorher `npm install`? [Folge 018](/artikel/folge-018-node-npm/).

### /admin geht online nicht?

[PAT](/glossar/pat/)/[OAuth](/glossar/oauth/), Chrome, Cloudflare-Build, richtige Domain. [Folge 013](/artikel/folge-013-sveltia-pat/).

### Lokal sieht es anders aus als live?

[Push](/glossar/push/) vergessen, anderer Branch, oder Build noch nicht durch. [Folge 011](/artikel/folge-011-cloudflare-setup/).

### Preview zeigt es, Production nicht?

Noch nicht auf **[main](/glossar/main/)** gemergt und deployed. [Folge 012](/artikel/folge-012-cloudflare-branches/).

### Deployment fehlgeschlagen, Retry?

„Retry“ (Erneut versuchen) baut denselben Commit nochmal, ersetzt keinen fehlenden Build. [Folge 014](/artikel/folge-014-sveltia-worker/).

### Der Agent hat 120 Gedankenstriche eingebaut?

Issue: Stil bereinigen, wie nach dem großen Artikel-Import. [Folge 016](/artikel/folge-016-artikel-pull-request/), [Folge 019](/artikel/folge-019-impressum-komponenten/).
