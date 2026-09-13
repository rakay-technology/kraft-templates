#!/usr/bin/env node
/**
 * Fast structural check for blueprint pull requests (zero dependencies).
 *
 *   node build-scripts/compile.js --check
 *
 * Verifies per-blueprint shape only: meta.json identity/required fields, logo
 * presence, authoring-mode exclusivity, and the forbidden compose keys. The
 * AUTHORITATIVE build (full conversion to catalog.json through the shared
 * Kraft validator) runs in CI via the pinned Kraft checkout — this script
 * never emits installable artifacts, so the two can never drift apart.
 */

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
if (!args.includes("--check")) {
  console.error("usage: node build-scripts/compile.js --check");
  process.exit(2);
}

const repoRoot = path.resolve(__dirname, "..");
const blueprintsDir = path.join(repoRoot, "blueprints");

const REQUIRED_META = ["id", "name", "description", "version", "logo", "category", "tags"];
const REQUIRED_LINKS = ["github", "website", "docs"];
const CATEGORIES = new Set(["backend", "database", "cms", "mail", "analytics", "automation", "other"]);
// Top-level compose keys a blueprint must never set. The edge publishes
// routes, the project network is automatic, and builds stay kraft.json-only.
const FORBIDDEN_COMPOSE = /^\s*(ports|container_name|networks|network_mode|privileged)\s*:/m;
const FORBIDDEN_BUILD = /^\s*build\s*:/m;

const errors = [];

let dirs = [];
try {
  dirs = fs
    .readdirSync(blueprintsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b));
} catch (e) {
  console.error(`cannot read blueprints/: ${e.message}`);
  process.exit(1);
}

for (const dir of dirs) {
  const bp = path.join(blueprintsDir, dir);
  const at = (f) => `blueprints/${dir}/${f}`;

  // meta.json
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

  // Authoring mode: (compose + toml) XOR kraft.json, never both, never neither.
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
      errors.push(`${at(composeFile)}: forbidden key (ports/container_name/networks/network_mode/privileged) — routes belong in blueprint.toml`);
    }
    if (FORBIDDEN_BUILD.test(text)) {
      errors.push(`${at(composeFile)}: build: is not supported — use kraft.json for built images`);
    }
  }
}

if (errors.length > 0) {
  for (const e of errors) console.error(`error: ${e}`);
  console.error(`${errors.length} error(s) across ${dirs.length} blueprint(s)`);
  process.exit(1);
}
console.log(`ok: ${dirs.length} blueprint(s) structurally valid`);
