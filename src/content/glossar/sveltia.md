---
title: Sveltia CMS
status: published
modifiedDate: 2026-10-10
definition: Git-basiertes CMS unter /admin, bearbeitet Markdown und YAML wie im Repo.
relatedTags:
- cms
- github
relatedArticles:
- folge-013-sveltia-pat
- folge-014-sveltia-worker
seo:
  seo_title: Sveltia CMS · Glossar
  seo_description: Git-basiertes CMS unter /admin mit deutschen Collection-Namen in der Config. Lokal Ordnerzugriff, online PAT oder Worker-Login. Speichern = Dateien in Git.
---

[**Sveltia CMS**](https://github.com/sveltia/sveltia-cms) erreichst du unter `/admin/` im Browser ([Folge 013](/artikel/folge-013-sveltia-pat/)). Gespeichert wird nicht in einer [Datenbank](/glossar/datenbank/), sondern als [Markdown](/glossar/markdown/) und YAML im [Git](/glossar/git/)-Repo — ein [CMS](/glossar/cms/) fürs [**Backend**](/glossar/backend/), nicht für das öffentliche [**Frontend**](/glossar/frontend/).

In der linken Leiste siehst du **Collections**; bei hautuu sind die sichtbaren Namen in `public/admin/config.yml` auf Deutsch gesetzt (z. B. **Seiten**, **Artikel**, **Glossar**, **Bausteine**, **Menüs**). Globale Site-Defaults liegen unter **Einstellungen** als eigene Einträge **Allgemein**, **Design** und **Inhalt** (JSON unter `src/content/settings/`). Im Markdown-Editor fügst du über die Toolbar Blöcke ein, z. B. **Baustein**, **Trennlinie** oder **Repo-Dokument** (Labels in `public/admin/editor-components.js`).

Lokal mit Ordnerzugriff oder auf der Domain mit [PAT](/glossar/pat/) bzw. [GitHub](/glossar/github/)-Login über einen [Worker](/glossar/cloudflare-worker/) ([Folge 014](/artikel/folge-014-sveltia-worker/)).
