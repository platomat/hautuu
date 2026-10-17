---
title: Cloudflare R2
status: published
modifiedDate: 2026-10-12
relatedTags:
- cloudflare
definition: Objektspeicher bei Cloudflare für große Dateien wie Videos, ohne sie ins Git-Repo zu legen.
relatedArticles:
- folge-023-neue-features-demo-cms
seo:
  seo_title: Cloudflare R2 · Glossar
  seo_description: R2 ist Cloudflare-Objektspeicher für große MP4s. hautuu nutzt einen R2-Bucket und Video-Basis-URL statt Videos in GitHub.
---

**Cloudflare R2** ist **Objektspeicher** (ähnlich einem großen Datei-Ordner in der Cloud) von [Cloudflare](/glossar/cloudflare-pages/). Du legst Dateien in einem **Bucket** ab und gibst sie über eine **öffentliche URL** aus, oft mit eigener Subdomain ([Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)).

Große Screencast-**MP4s** gehören bei hautuu **nicht** ins [GitHub](/glossar/github/)-[Repo](/glossar/repository/). Stattdessen: Upload in einen R2-Bucket, **Video-Basis-URL** unter **Einstellungen** → **Inhalt** → **Medien**, Embed `{{video provider="file" src="…"}}`. Poster-Bilder bleiben klein in der Mediathek. Anleitung im Repo: `docs/cloudflare/r2-videos.md`. [Folge 023](/artikel/folge-023-neue-features-demo-cms/).
