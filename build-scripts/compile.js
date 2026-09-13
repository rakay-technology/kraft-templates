#!/usr/bin/env node
/**
 * Blueprint toolchain (zero dependencies, plain node).
 *
 *   node build-scripts/compile.js --check
 *     Fast structural check for pull requests: meta.json identity/required
 *     fields, logo presence, authoring-mode exclusivity, forbidden compose
 *     keys. No artifacts emitted.
 *
 *   node build-scripts/compile.js build [--in <blueprints-dir>] [--out <catalog.json>] [--index <index.json>]
 *     Authoritative build: converts every blueprint through the shared Kraft
 *     validator (vendored bundle, see converter.version for the Kraft commit
 *     it was built from) and writes catalog.json + index.json.
 */

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

const REQUIRED_META = ["id", "name", "description", "version", "logo", "category", "tags"];
const REQUIRED_LINKS = ["github", "website", "docs"];
const CATEGORIES = new Set(["backend", "database", "cms", "mail", "analytics", "automation", "other"]);
// Top-level compose keys a blueprint must never set. The edge publishes
// routes, the project network is automatic, and builds stay kraft.json-only.
const FORBIDDEN_COMPOSE = /^\s*(ports|container_name|networks|network_mode|privileged)\s*:/m;
const FORBIDDEN_BUILD = /^\s*build\s*:/m;

function listBlueprints(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b));
}

function check(blueprintsDir) {
  const errors = [];
  const dirs = listBlueprints(blueprintsDir);

  for (const dir of dirs) {
    const bp = path.join(blueprintsDir, dir);
    const at = (f) => `blueprints/${dir}/${f}`;

    let meta;
    try {
      meta = JSON.parse(fs.readFileSync(path.join(bp, "meta.json"), "utf8"));
    } catch (e) {
      errors.push(`${at("meta.json")}: invalid JSON (${e.message})`);
      continue;
    }
    if (Array.isArray(meta) || typeof meta !== "object" || meta === null) {
      errors.push(`${at("meta.json")}: must be a single JSON object`);
      continue;
    }
    if (meta.id !== dir) {
      errors.push(`${at("meta.json")}: "id" must be "${dir}" (got ${JSON.stringify(meta.id)})`);
    }
    for (const field of REQUIRED_META) {
      if (meta[field] === undefined || meta[field] === null || meta[field] === "") {
        errors.push(`${at("meta.json")}: missing required field "${field}"`);
      }
    }
    if (!CATEGORIES.has(meta.category)) {
      errors.push(`${at("meta.json")}: category must be one of ${[...CATEGORIES].join("|")}`);
    }
    if (!Array.isArray(meta.tags) || meta.tags.length === 0) {
      errors.push(`${at("meta.json")}: tags must be a non-empty array`);
    }
    if (typeof meta.links !== "object" || meta.links === null) {
      errors.push(`${at("meta.json")}: links must be an object with github, website, docs`);
    } else {
      for (const link of REQUIRED_LINKS) {
        if (typeof meta.links[link] !== "string") {
          errors.push(`${at("meta.json")}: links is missing required field "${link}"`);
        }
      }
    }
    if (typeof meta.logo === "string" && meta.logo && !fs.existsSync(path.join(bp, meta.logo))) {
      errors.push(`${at("meta.json")}: logo file "${meta.logo}" not found`);
    }

    const composeFile = ["compose.yml", "compose.yaml"].find((f) => fs.existsSync(path.join(bp, f)));
    const hasToml = fs.existsSync(path.join(bp, "blueprint.toml"));
    const hasDirect = fs.existsSync(path.join(bp, "kraft.json"));
    if (hasDirect && (composeFile || hasToml)) {
      errors.push(`${dir}: use compose + blueprint.toml OR kraft.json, never both`);
    } else if (!hasDirect && !(composeFile && hasToml)) {
      const missing = [composeFile ? null : "compose.yml", hasToml ? null : "blueprint.toml"]
        .filter(Boolean)
        .join(" and ");
      errors.push(`${dir}: missing ${missing} (or provide kraft.json instead)`);
    }
    if (composeFile) {
      const text = fs.readFileSync(path.join(bp, composeFile), "utf8");
      if (FORBIDDEN_COMPOSE.test(text)) {
        errors.push(
          `${at(composeFile)}: forbidden key (ports/container_name/networks/network_mode/privileged) — routes belong in blueprint.toml`,
        );
      }
      if (FORBIDDEN_BUILD.test(text)) {
        errors.push(`${at(composeFile)}: build: is not supported — use kraft.json for built images`);
      }
    }
  }
  return { dirs, errors };
}

function argValue(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const [cmd] = process.argv.slice(2);

if (cmd === "--check") {
  const { dirs, errors } = check(path.join(repoRoot, "blueprints"));
  if (errors.length > 0) {
    for (const e of errors) console.error(`error: ${e}`);
    console.error(`${errors.length} error(s) across ${dirs.length} blueprint(s)`);
    process.exit(1);
  }
  console.log(`ok: ${dirs.length} blueprint(s) structurally valid`);
} else if (cmd === "build") {
  const inDir = argValue("--in") || path.join(repoRoot, "blueprints");
  const outFile = argValue("--out") || path.join(repoRoot, "catalog.json");
  const indexFile = argValue("--index") || path.join(repoRoot, "index.json");
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const { compileBlueprints } = require("./converter.bundle.js");
  const { apps, index, failures } = compileBlueprints(inDir);
  for (const f of failures) {
    for (const e of f.errors) console.error(`error: ${e}`);
  }
  if (failures.length > 0) {
    console.error(`${failures.length} blueprint(s) failed`);
    process.exit(1);
  }
  fs.writeFileSync(outFile, JSON.stringify({ version: 1, apps }, null, 2) + "\n");
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + "\n");
  console.log(`ok: ${apps.length} blueprint(s) compiled -> ${outFile}, ${indexFile}`);
} else {
  console.error("usage: node build-scripts/compile.js (--check | build [--in <dir>] [--out <catalog.json>] [--index <index.json>])");
  process.exit(2);
}
