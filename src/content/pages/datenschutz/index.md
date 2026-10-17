---
title: Datenschutz
description: Informationen zur Verarbeitung personenbezogener Daten auf hautuu.
status: published
publishDate: 2026-10-01
modifiedDate: 2026-10-18
seo:
  seo_title: Datenschutz
  seo_description: Informationen zur Verarbeitung personenbezogener Daten auf hautuu. Hosting, Matomo, Videos erst nach Consent, Kontakt und deine Rechte. Seite mit Noindex.
  index_visibility: noindex
  follow_visibility: follow
  noarchive: false
  noimageindex: false
  nosnippet: true
  max_snippet_enabled: false
  max_snippet: -1
  max_video_preview_enabled: false
  max_video_preview: -1
  max_image_preview_enabled: false
  max_image_preview: large
---

## Verantwortlicher

{{block id="kontakt-anschrift"}}

E-Mail:

{{contact-email layout="run-after"}}

## Überblick

Diese Website ist eine **statische** Website (HTML/[CSS](/glossar/css/)/Assets). Es gibt kein eigenes Nutzerkonto für Besucher und **keinen** Cookie-Banner für optionale Marketing-Cookies. Zur Reichweitenmessung nutzen wir den selbst gehosteten Analysedienst **Matomo** (siehe unten), cookielos und mit IP-Anonymisierung.

Personenbezogene Daten fallen vor allem dort an, wo Technik unvermeidbar ist (Hosting, Analyse, bei eingebetteten Videos) oder wenn du uns selbst kontaktierst.

## Hosting (Cloudflare)

Die Website wird über [**Cloudflare Pages**](/glossar/cloudflare-pages/) ausgeliefert. Cloudflare verarbeitet dabei technisch erforderliche Verbindungsdaten (siehe Server-Log-Dateien).

Anbieter: Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA, mit Niederlassungen in der EU. Cloudflare kann Daten in Drittländern verarbeiten; Cloudflare stellt dafür geeignete Garantien bereit (u. a. Standardvertragsklauseln). Details: [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/).

## Server-Log-Dateien

Der Anbieter der Seiten (Cloudflare) erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die dein Browser automatisch übermittelt. Das sind unter anderem:

- Browsertyp und Browserversion
- verwendetes Betriebssystem
- Referrer-URL
- Hostname des zugreifenden Rechners
- Uhrzeit der Serveranfrage
- IP-Adresse
- angeforderte URL / Status der Antwort

Eine Zusammenführung dieser Daten mit anderen Datenquellen nehmen wir nicht vor.

Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung der Website; dafür müssen Server-Log-Dateien erfasst werden.

## Analyse-Tools und Werbung

### Matomo

Diese Website benutzt den Open-Source-Webanalysedienst Matomo.

Mit Hilfe von Matomo können wir Daten über die Nutzung unserer Website erfassen und auswerten. So sehen wir unter anderem, wann welche Seitenaufrufe stattfanden und aus welcher Region sie kommen. Außerdem erfassen wir verschiedene Logdaten (z. B. IP-Adresse, Referrer, verwendete Browser und Betriebssysteme) und können messen, ob Besucher bestimmte Aktionen ausführen (z. B. Klicks).

Die Nutzung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an der Analyse des Nutzerverhaltens, um das Webangebot zu verbessern. Sofern eine Einwilligung abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG, soweit die Einwilligung die Speicherung von Cookies oder den Zugriff auf Informationen im Endgerät (z. B. Device-Fingerprinting) im Sinne des TDDDG umfasst. Die Einwilligung ist jederzeit widerrufbar.

#### IP-Anonymisierung

Bei der Analyse mit Matomo setzen wir IP-Anonymisierung ein. Die IP-Adresse wird vor der Analyse gekürzt, sodass sie dir nicht mehr eindeutig zuordenbar ist.

#### Cookielose Analyse

Wir haben Matomo so konfiguriert, dass Matomo keine Cookies in deinem Browser speichert (`disableCookies`).

#### Hosting

Wir hosten Matomo auf eigenen Servern unter `matomo.platomat.com`, sodass die Analysedaten bei uns verbleiben und nicht an Drittanbieter-Analyseplattformen weitergegeben werden.

#### Opt-Out

Du kannst verhindern, dass diese Website deine Aktionen hier zusammenfasst und auswertet. Das schützt deine Privatsphäre; wir lernen dann aber auch weniger darüber, wie die Website genutzt wird.

<iframe
  title="Matomo Opt-out"
  style="border:0;width:100%;height:12rem"
  src="https://matomo.platomat.com/index.php?module=CoreAdminHome&action=optOut&language=de"
></iframe>

## Schriften und Assets

Schriftarten werden **lokal** von dieser Website ausgeliefert (kein Google-Fonts-Aufruf im Browser). Dadurch entsteht kein zusätzlicher Drittanbieter-Kontakt allein durch die Typografie.

## Eingebettete Videos

### YouTube und Vimeo

Einzelne Seiten und Artikel können Videos von **YouTube** (privacy-enhanced / youtube-nocookie) oder **Vimeo** einbinden. **Vor** deiner aktiven Zustimmung wird kein Player geladen und dein Browser stellt **keine** Verbindung zu YouTube oder Vimeo her (Consent-Facade mit lokalem Platzhalter).

Erst wenn du auf „Video laden“ klickst, wird der Player nachgeladen. Dann verbindet sich dein Browser mit den Servern des Anbieters. Dabei können personenbezogene Daten (z. B. IP-Adresse, Cookie-IDs) übermittelt werden, auch in die USA. Die Anbieter können eigene Cookies oder ähnliche Techniken setzen.

Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Du kannst die Einwilligung jederzeit widerrufen (Button unten oder indem du die Website-Daten für diese Domain in deinem Browser löschst). Bis zur erneuten Zustimmung werden die Player wieder nicht geladen.

{{video-consent-reset}}

Die Entscheidung speichern wir in deinem Browser unter dem Schlüssel `hautuu-video-consent` in der **localStorage** (kein First-Party-Cookie nur für diesen Schalter).

Anbieter:

- Google Ireland Limited / YouTube: [Google Privacy](https://policies.google.com/privacy)
- Vimeo.com, Inc.: [Vimeo Privacy](https://vimeo.com/privacy)

### Selbst gehostete Videos (Cloudflare R2)

Zusätzlich können Screencasts als Dateien über **Cloudflare R2** (Objekt-Speicher) ausgeliefert werden. Der Player ist ein normales HTML5-`<video>` auf unserer Site; es wird **kein** YouTube-/Vimeo-Player geladen und **kein** zusätzlicher Consent-Schalter wie oben genutzt. Beim Abspielen verbindet sich dein Browser mit dem Medien-Host (Cloudflare), typischerweise unter einer Subdomain dieser Website. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Auslieferung der Inhalte) bzw. Vertrag/Einwilligung je nach Kontext der Seite. Auftragsverarbeitung: Cloudflare.

### Geschützte Member-Videos (Zugangscode)

Manche Videos sind nur mit persönlichem Zugangscode abrufbar. Nach Eingabe eines gültigen Codes speichern wir in deinem Browser ein **Session-Token** in der **localStorage** (Schlüssel `hautuu-member-video-token`, optional Ablauf `hautuu-member-video-expires`), damit du nicht bei jedem Video erneut den Code eingeben musst. Der Klartext-Code wird nicht dauerhaft im Browser gespeichert; zur Prüfung liegt nur ein Hash in unserer Cloudflare-D1-Datenbank. Zum Abspielen verbindet sich dein Browser mit unserem Video-Access-Worker bei Cloudflare; die Dateien liegen in einem privaten R2-Bucket und sind ohne gültige Freischaltung nicht öffentlich streambar. Du kannst den Zugang auf der Seite über „Zugang zurücksetzen“ oder durch Löschen der Website-Daten im Browser beenden. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertrag/Mitgliedschaft) bzw. lit. f DSGVO, je nach Angebot. Auftragsverarbeitung: Cloudflare.

## Externe Links

Links zu anderen Websites (z. B. [GitHub](/glossar/github/), Unsplash) führen zu Angeboten Dritter. Für deren Datenschutz gelten die jeweiligen Erklärungen der Anbieter. Beim Folgen eines Links verlassen Sie unsere Website.

## Kontakt per E-Mail

Wenn du uns per E-Mail kontaktierst, verarbeiten wir die von dir mitgeteilten Daten (E-Mail-Adresse, Inhalt, ggf. Name) zur Bearbeitung deiner Anfrage. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertraglich/vertraglich) bzw. lit. f DSGVO (allgemeine Anfragen) oder lit. a DSGVO, soweit eine Einwilligung vorliegt.

Die Daten werden gelöscht, wenn die Konversation erledigt ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.

## Cookies und lokale Speicherung

Für den öffentlichen Teil der Website setzen wir **keine** eigenen Cookies zu Analyse- oder Werbezwecken. Matomo läuft bei uns **ohne Cookies** (siehe Abschnitt Matomo).

Für die YouTube/Vimeo-Freischaltung nutzen wir **localStorage** (`hautuu-video-consent`), damit du nicht auf jeder Seite erneut zustimmen musst. Für Member-Videos speichern wir das Session-Token unter `hautuu-member-video-token`. Beides sind keine Cookies; du kannst die Einträge über die jeweiligen Buttons auf der Seite oder über die Browser-Einstellungen für diese Website löschen.

Hoster und, **nach** deiner Video-Zustimmung, die Anbieter YouTube bzw. Vimeo können eigene Cookies oder ähnliche Techniken verwenden. Siehe deren Hinweise und den Abschnitt zu eingebetteten Videos.

## Speicherdauer

Soweit oben nicht anders angegeben, speichern wir personenbezogene Daten nur so lange, wie es für die jeweiligen Zwecke erforderlich ist oder gesetzliche Pflichten bestehen.

## Deine Rechte

Du hast gegenüber dem Verantwortlichen das Recht auf:

- Auskunft (Art. 15 DSGVO)
- Berichtigung (Art. 16 DSGVO)
- Löschung (Art. 17 DSGVO)
- Einschränkung der Verarbeitung (Art. 18 DSGVO)
- Datenübertragbarkeit (Art. 20 DSGVO)
- Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21 DSGVO)
- Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)

Außerdem hast du das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist u. a. die Aufsichtsbehörde deines gewöhnlichen Aufenthaltsorts; für Thüringen typischerweise der **Thüringer Landesbeauftragte für den Datenschutz und die Informationsfreiheit**.

## Änderungen

Wir können diese Datenschutzerklärung anpassen, wenn sich die Website, die Rechtslage oder eingesetzte Dienste ändern. Es gilt die jeweils hier veröffentlichte Fassung.
