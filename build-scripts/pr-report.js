#!/usr/bin/env node
/**
 * PR report helper: summarize changed blueprints from a built catalog and
 * export import envelopes for manual testing.
 *
 *   node build-scripts/pr-report.js --catalog catalog.json --dirs uptime-kuma,ghost [--emit-envelopes envelopes/]
 *
 * Prints markdown to stdout. Envelopes are the JSON the dashboard Import
 * modal (paste Base64) and POST /apps/blueprints/preview accept.
 */

const fs = require("fs");
const path = require("path");

function argValue(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const catalogPath = argValue("--catalog") || "catalog.json";
const dirs = (argValue("--dirs") || "").split(",").map((s) => s.trim()).filter(Boolean);
const emitDir = argValue("--emit-envelopes");

const repoRoot = path.resolve(__dirname, "..");
const catalog = JSON.parse(fs.readFileSync(path.resolve(catalogPath), "utf8"));
const byId = new Map(catalog.apps.map((a) => [a.id, a]));

const lines = [];
for (const id of dirs) {
  const app = byId.get(id);
  if (!app) {
    lines.push(`- **${id}**: failed to compile (see the build job)`);
    continue;
  }
  const svc = (app.services ?? []).map((s) => `\`${s.name}\` (${s.image})`).join(", ");
  const routes = (app.endpoints ?? []).map((e) => `${e.service}:${e.port}/${e.kind}`).join(", ");
  lines.push(`- **${app.name}** (\`${id}\`): ${svc}${routes ? ` — routes ${routes}` : ""}${app.available ? "" : " — **unavailable** (unpinned image)"}`);
  if (emitDir) {
    const dir = path.join(repoRoot, "blueprints", id);
    const read = (f) => {
      const p = path.join(dir, f);
      return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : undefined;
    };
    const envelope = {
      dirId: id,
      metaText: read("meta.json"),
      composeYaml: read("compose.yml") ?? read("compose.yaml"),
      tomlText: read("blueprint.toml"),
      kraftJsonText: read("kraft.json"),
    };
    fs.mkdirSync(emitDir, { recursive: true });
    fs.writeFileSync(path.join(emitDir, `${id}.envelope.json`), JSON.stringify(envelope, null, 2) + "\n");
  }
}
console.log(lines.join("\n") || "No blueprint changes with compiled output.");
