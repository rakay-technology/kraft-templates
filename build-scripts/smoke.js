#!/usr/bin/env node
/**
 * Boot smoke test for blueprints (needs a Docker daemon).
 *
 *   node build-scripts/smoke.js blueprints/uptime-kuma [blueprints/...]
 *
 * For each simplified blueprint it generates a dummy env file from
 * [variables] (every helper gets a harmless value), validates the compose
 * file (`docker compose config`), boots it, waits for crash-loops to surface,
 * then asserts every service is still RUNNING and tears it down (`down -v`).
 * Direct (kraft.json) blueprints are skipped — they are covered by Kraft's
 * own end-to-end suite.
 *
 * Deliberately NOT health-gated: per-app healthchecks encode production
 * routing assumptions (hostnames, real domains) that dummy smoke values
 * cannot satisfy. Smoke answers "does it boot and stay up", nothing more.
 * Exit non-zero on the first failure. This is the `available:true` gate:
 * a pinned-image app ships only with a green smoke run.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync, execSync } = require("child_process");
const { parse: parseToml } = require("smol-toml");
const { parse: parseYaml } = require("yaml");

const SETTLE_SECS = Number(process.env.SMOKE_SETTLE_SECS ?? "30");

function dummyFor(expr) {
  const head = expr.split(":")[0];
  switch (head) {
    case "domain":
      // Production always injects a full URL (scheme included) — mirror that.
      return "http://test.local";
    case "password":
    case "base64":
    case "hash":
    case "uuid":
    case "jwt":
      // Mirror the installer: 32 bytes, 64 hex chars (some apps enforce it).
      return "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    case "randomPort":
      return "23123";
    case "email":
      return "test@example.com";
    case "username":
      return "tester";
    case "timestamp":
    case "timestamps":
      return "1893456000";
    case "timestampms":
      return "1893456000000";
    default:
      return "smoke";
  }
}

/** Every ${...} inner expression in a string. */
function refsOf(value) {
  const out = [];
  const re = /\$\{([^{}]+)\}/g;
  let m;
  while ((m = re.exec(value)) !== null) out.push(m[1].trim());
  return out;
}

function sh(cmd, args, opts) {
  try {
    return execFileSync(cmd, args, { stdio: "pipe", encoding: "utf8", ...opts });
  } catch (e) {
    const detail = [e.stdout, e.stderr].filter(Boolean).join("\n");
    throw new Error(`command failed: ${cmd} ${args.join(" ")}\n${detail}`);
  }
}

function runningServices(composeFile, envFile) {
  const out = sh("docker", ["compose", "-f", composeFile, "--env-file", envFile, "ps", "--format", "json"]);
  return out
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function smokeOne(dir) {
  const composeFile = ["compose.yml", "compose.yaml"]
    .map((f) => path.join(dir, f))
    .find((f) => fs.existsSync(f));
  if (!composeFile) {
    console.log(`- ${dir}: skipped (direct kraft.json blueprint)`);
    return;
  }
  const id = path.basename(dir);
  const toml = parseToml(fs.readFileSync(path.join(dir, "blueprint.toml"), "utf8"));
  const compose = parseYaml(fs.readFileSync(composeFile, "utf8"));

  // Dummy env: one value per declared variable + anything compose references.
  // `other = "${first}"` aliases share the target's value (same as install).
  // Single-ref [env] entries are aliases too (e.g. BB_REDIS_PASSWORD): without
  // this they fall through to the fresh-dummy branch below and diverge from
  // the target (redis WRONGPASS) — same rule as the catalog converter.
  const defs = { ...(toml.variables ?? {}) };
  for (const [k, v] of Object.entries(toml.env ?? {})) {
    if (typeof v === "string" && !(k in defs)) defs[k] = v;
  }
  const values = {};
  for (const [k, v] of Object.entries(defs)) {
    if (typeof v !== "string") continue;
    const refs = refsOf(v);
    values[k] = refs.length === 1 ? dummyFor(refs[0]) : v;
  }
  for (let pass = 0; pass < 10; pass++) {
    let changed = false;
    for (const [k, v] of Object.entries(defs)) {
      if (typeof v !== "string") continue;
      const refs = refsOf(v.trim());
      if (refs.length === 1 && v.trim() === `\${${refs[0]}}` && refs[0] in values && values[k] !== values[refs[0]]) {
        values[k] = values[refs[0]];
        changed = true;
      }
    }
    if (!changed) break;
  }
  const envText = JSON.stringify(compose);
  for (const ref of refsOf(envText)) {
    const name = ref.split(":")[0];
    if (/^[A-Za-z_][A-Za-z0-9_-]*$/.test(name) && !(name in values)) {
      values[name] = dummyFor(ref);
    }
  }
  const envFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), `smoke-${id}-`)), ".env");
  fs.writeFileSync(
    envFile,
    Object.entries(values)
      .map(([k, v]) => `${k}=${v}`)
      .join("\n") + "\n",
  );

  console.log(`- ${dir}: config`);
  sh("docker", ["compose", "-f", composeFile, "--env-file", envFile, "config", "--quiet"]);
  console.log(`- ${dir}: up (settling ${SETTLE_SECS}s for crash-loops)`);
  sh("docker", ["compose", "-f", composeFile, "--env-file", envFile, "up", "-d"]);
  try {
    execSync(`sleep ${SETTLE_SECS}`);
    const states = runningServices(composeFile, envFile);
    if (states.length === 0) throw new Error("no services came up");
    for (const s of states) {
      if (s.State !== "running") {
        throw new Error(`service ${s.Service} is ${s.State} (exit ${s.ExitCode ?? "?"})`);
      }
    }
    console.log(`- ${dir}: STAYED UP (${states.map((s) => `${s.Service}:${s.State}`).join(", ")})`);
  } finally {
    sh("docker", ["compose", "-f", composeFile, "--env-file", envFile, "down", "-v"]);
  }
}

const dirs = process.argv.slice(2);
if (dirs.length === 0) {
  console.error("usage: node build-scripts/smoke.js <blueprints/<id>...>");
  process.exit(2);
}
try {
  execFileSync("docker", ["info"], { stdio: "pipe" });
} catch {
  console.error("docker daemon not reachable — cannot smoke test");
  process.exit(1);
}
for (const dir of dirs) smokeOne(dir);
console.log("smoke: all green");
