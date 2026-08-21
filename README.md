# pipeline-playground

A deliberately small inventory CLI. It exists so an agentic delivery pipeline has
something real to plan, code, test, review, and open pull requests against.

```
inv add <sku> <name> <qty> [--price <cents>]
inv remove <sku> <qty>
inv list
```

Data lives in `inventory.json` in the working directory. Tests: `npm test`.
Lint: `npm run lint` (no dependencies; a tiny rule set in `scripts/lint.js`).

## Layout

- `src/inventory.js`: the pure domain model (no I/O)
- `src/store.js`: load/save the JSON file
- `src/format.js`: table rendering for `list`
- `bin/inv.js`: the CLI entry point
- `tests/`: `node:test` suites, one per module
- `docs/`: user-facing docs the pipeline keeps in sync
