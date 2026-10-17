# Template-Updates auf abgeleitete Sites

GitHub-**Template**-Repos (maminds, hdb-website-platomat, …) sind **keine** Forks. Es gibt kein `git pull upstream`. Gemeinsame Engine-Änderungen aus hautoo überträgst du bewusst.

## Was funktioniert

Skript im Template-Repo:

```bash
# im hautoo-Root
node scripts/propagate-from-template.mjs --to ../maminds-website --to ../hdb-website-platomat --dry-run
node scripts/propagate-from-template.mjs --to ../maminds-website --include-config-yml
```

Kopiert Allowlist-Pfade (`src/cms`, `src/components`, `src/layouts`, `src/lib`, `global.css`, zentrale Scripts, ausgewählte Doku). Optional `--include-config-yml` für das CMS-Schema (`backend.repo` / `base_url` bleiben erhalten).

## Was scheitern oder überschrieben werden kann

| Bereich | Risiko |
| --- | --- |
| `src/content/**` | Site-Inhalte; absichtlich **nicht** im Default-Sync |
| `settings/*.json` (außer fehlendem `maintenance.json`) | Marke, Farben, Claims; **nicht** überschreiben |
| `astro.config.mjs` (`site`-URL) | pro Domain anders |
| `package.json` Name / Scripts | kann divergieren |
| Bewusst angepasste Engine-Dateien in der Site | Sync überschreibt sie |
| Generierte Font-Dateien | werden übersprungen |
| Volle Engine-Sync bei divergierter Site | kann zu große Diffs erzeugen; für ein einzelnes Feature oft gezielter Datei-Copy besser |

Deshalb: Sync nur auf Wunsch, vorher `--dry-run`, Diff prüfen, lokal bauen und committen. Kein Ersatz für `git merge` aus einem Fork.

## Alternative

Einzelne Commits/Dateien manuell nachziehen (wie bisher), wenn der Diff klein ist oder die Site stark abweicht.
