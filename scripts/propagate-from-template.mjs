#!/usr/bin/env node
/**
 * Copy shared “engine” files from this template (hautoo) into sites that were
 * created via GitHub “Use this template”.
 *
 * Template repos are not git forks: there is no upstream merge. This script is a
 * deliberate rsync of allowlisted paths. It will not magically reconcile
 * site-specific content or intentional forks of the same file.
 *
 * Usage (from hautoo root):
 *   node scripts/propagate-from-template.mjs --to ../maminds-website
 *   node scripts/propagate-from-template.mjs --to ../maminds-website --to ../hdb-website-platomat
 *   node scripts/propagate-from-template.mjs --to ../maminds-website --dry-run
 *
 * Safe by default: skips site content, settings JSON (except maintenance.json
 * when missing), astro site URL, and package name. Pass --include-config-yml
 * to overwrite public/admin/config.yml (CMS schema).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Relative paths always copied (engine). */
const ENGINE_PATHS = [
	"src/cms",
	"src/components",
	"src/layouts",
	"src/lib",
	"src/scripts",
	"src/styles/global.css",
	"src/content.config.ts",
	"scripts/build-search-index.mjs",
	"scripts/build-redirects.mjs",
	"scripts/check-content-links.py",
	"scripts/pack-dist-bridge.sh",
	"scripts/resolve-site-url.mjs",
	"scripts/sync-site-fonts.mjs",
	"scripts/sync-author-avatars.mjs",
	"docs/sveltia/collections.md",
	"docs/design/README.md",
];
// Note: propagate script + template-propagate.md stay template-only (hautoo).

/** Never overwrite (generated or site-specific even under engine dirs). */
const SKIP_BASENAMES = new Set([
	"site-fonts.generated.json",
	"fonts.generated.css",
]);

/** Copied only if the destination file does not exist yet. */
const SEED_IF_MISSING = ["src/content/settings/maintenance.json"];

function parseArgs(argv) {
	const targets = [];
	let dryRun = false;
	let includeConfigYml = false;
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === "--dry-run") dryRun = true;
		else if (arg === "--include-config-yml") includeConfigYml = true;
		else if (arg === "--to") {
			const value = argv[++i];
			if (!value) throw new Error("--to needs a path");
			targets.push(path.resolve(value));
		} else if (arg === "--help" || arg === "-h") {
			console.log(`Usage: node scripts/propagate-from-template.mjs --to <dir> [--to <dir>…] [--dry-run] [--include-config-yml]`);
			process.exit(0);
		} else {
			throw new Error(`Unknown argument: ${arg}`);
		}
	}
	if (targets.length === 0) {
		throw new Error("Pass at least one --to <site-repo>");
	}
	return { targets, dryRun, includeConfigYml };
}

/** Keep site identity in config.yml (repo / auth worker must not become hautoo’s). */
function mergeConfigYml(srcPath, destPath, dryRun) {
	const incoming = fs.readFileSync(srcPath, "utf8");
	let outgoing = incoming;
	if (fs.existsSync(destPath)) {
		const existing = fs.readFileSync(destPath, "utf8");
		const repo = existing.match(/^\s*repo:\s*(.+)$/m)?.[1]?.trim();
		const baseUrl = existing.match(/^\s*base_url:\s*(.+)$/m)?.[1]?.trim();
		if (repo) {
			outgoing = outgoing.replace(/^(\s*repo:\s*).+$/m, `$1${repo}`);
		}
		if (baseUrl) {
			outgoing = outgoing.replace(/^(\s*base_url:\s*).+$/m, `$1${baseUrl}`);
		}
	}
	if (dryRun) {
		console.log(
			`  merge config.yml (preserve backend.repo/base_url) → ${destPath}`,
		);
		return;
	}
	fs.mkdirSync(path.dirname(destPath), { recursive: true });
	fs.writeFileSync(destPath, outgoing);
	console.log("  ok public/admin/config.yml (repo/base_url preserved)");
}

function copyFile(src, dest, dryRun) {
	if (dryRun) {
		console.log(`  copy ${path.relative(ROOT, src)} → ${dest}`);
		return;
	}
	fs.mkdirSync(path.dirname(dest), { recursive: true });
	fs.copyFileSync(src, dest);
}

function copyPath(rel, destRoot, dryRun) {
	const src = path.join(ROOT, rel);
	const dest = path.join(destRoot, rel);
	if (!fs.existsSync(src)) {
		console.warn(`  skip missing source: ${rel}`);
		return;
	}
	const stat = fs.statSync(src);
	if (stat.isDirectory()) {
		for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
			if (SKIP_BASENAMES.has(entry.name)) {
				console.log(`  skip generated ${path.join(rel, entry.name)}`);
				continue;
			}
			const childRel = path.join(rel, entry.name);
			copyPath(childRel, destRoot, dryRun);
		}
		return;
	}
	if (SKIP_BASENAMES.has(path.basename(rel))) {
		console.log(`  skip generated ${rel}`);
		return;
	}
	copyFile(src, dest, dryRun);
	if (!dryRun) console.log(`  ok ${rel}`);
}

function main() {
	const { targets, dryRun, includeConfigYml } = parseArgs(process.argv.slice(2));
	const paths = [...ENGINE_PATHS];
	if (includeConfigYml) paths.push("public/admin/config.yml");

	for (const destRoot of targets) {
		if (!fs.existsSync(destRoot)) {
			throw new Error(`Target not found: ${destRoot}`);
		}
		console.log(`${dryRun ? "[dry-run] " : ""}→ ${destRoot}`);
		for (const rel of paths) {
			if (rel === "public/admin/config.yml") {
				mergeConfigYml(
					path.join(ROOT, rel),
					path.join(destRoot, rel),
					dryRun,
				);
				continue;
			}
			copyPath(rel, destRoot, dryRun);
		}
		for (const rel of SEED_IF_MISSING) {
			const dest = path.join(destRoot, rel);
			const src = path.join(ROOT, rel);
			if (fs.existsSync(dest)) {
				console.log(`  keep existing ${rel}`);
				continue;
			}
			if (!fs.existsSync(src)) continue;
			copyFile(src, dest, dryRun);
			if (!dryRun) console.log(`  seeded ${rel}`);
		}
		if (!includeConfigYml) {
			console.log(
				"  note: public/admin/config.yml not copied (pass --include-config-yml)",
			);
		}
	}
}

try {
	main();
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
}
