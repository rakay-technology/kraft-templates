# Kraft application blueprints

One-click applications for Kraft, authored as data — no Kraft rebuild needed.
Each blueprint compiles to an `AppTemplate` and ships in the generated
`catalog.json`, which Kraft instances fetch automatically (within minutes,
offline-safe).

- `blueprints/<id>/` — one directory per app (see CONTRIBUTING).
- `catalog.json` — **generated**, the only artifact Kraft reads. Never edit by hand.
- `index.json` — **generated**, light gallery index.
- `build-scripts/compile.js --check` — fast structural check for pull requests.

To add an application, read [CONTRIBUTING.md](./CONTRIBUTING.md).
