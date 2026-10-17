---
title: Consent (Einwilligung)
status: published
modifiedDate: 2026-10-12
relatedTags:
- cms
definition: Besucher bestätigen aktiv, dass eingebettete YouTube- oder Vimeo-Videos geladen werden dürfen.
relatedArticles:
- folge-023-neue-features-demo-cms
seo:
  seo_title: Consent (Einwilligung) · Glossar
  seo_description: 'Video-Consent auf hautuu: Facade statt Player, Klick zum Laden, Hinweis zur Datenschutz-Seite. YouTube und Vimeo, nicht bei selbst gehosteten MP4.'
---

**Consent** (Einwilligung) bedeutet hier: Der Besucher **willigt aktiv ein**, dass ein **YouTube-** oder **Vimeo-**Player geladen wird und Daten an den Anbieter gehen können.

Auf hautuu zeigt `VideoEmbed` zuerst nur eine **Facade** (Platzhalter), **ohne** iframe. Nach Klick auf **„Video von YouTube laden“** bzw. Vimeo startet der Player. Die Wahl kann **site-weit** im Browser gespeichert werden ([`localStorage`](/glossar/localstorage/), Schlüssel `hautuu-video-consent`, **kein** [Cookie](/glossar/cookie/)). **Privacy page** in **Allgemein** verlinkt den Hinweis auf deine Datenschutz-Seite; **Video-Freischaltung widerrufen** setzt die Einwilligung zurück. Selbst gehostete MP4 über [Cloudflare R2](/glossar/cloudflare-r2/) brauchen diesen Schalter nicht. [Folge 023](/artikel/folge-023-neue-features-demo-cms/), Doku: `docs/cloudflare/r2-videos.md` im [Repo](/glossar/repository/).
