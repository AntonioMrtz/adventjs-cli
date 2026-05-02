# AI Agent Instructions for adventjs-cli

## Purpose

This repo is a TypeScript CLI tool that generates AdventJS challenge starter projects and daily challenge boilerplate.

## What the project does

- `src/index.ts` boots a `commander` CLI and loads commands from `src/schema/command.schema.ts`.
- The app scaffolds a new AdventJS project, generates challenge files, and copies templates from `src/templates/`.
- Core behavior is implemented in `src/services/*` and data definitions are in `src/schema/*`.

## Key commands

- `npm run dev` — run the app locally in dev mode
- `npm run start` — run the CLI normally
- `npm run build` — compile TypeScript to `dist/`
- `npm test` — run unit tests with Vitest
- `npm run lint` — run ESLint
- `npm run format` — run Prettier

## Important conventions

- The codebase is TypeScript-only; `src/` is the source root and `dist/` is generated output.
- `tsconfig.json` uses `module: nodenext` and strict type checking.
- Do not modify generated content under `dist/` or `node_modules/`.
- Tests live in `src/__tests__` and focus on app-specific behavior such as scraping and file generation.
- `src/templates/` contains project scaffolding templates used by the CLI.

## What to focus on for code changes

- Prefer changes in `src/services/` for CLI behavior and scaffolding logic.
- Use `src/schema/` for command metadata, app metadata, and validation shapes.
- `src/services/file.service.ts` and `src/services/init.service.ts` are central for project generation.
- `src/services/scrapping.service.ts`, `src/services/markdown.service.ts`, and `src/services/puppeteer.service.ts` handle challenge scraping and markdown generation.

## Useful docs

- [README.md](README.md)
- [docs/DEV.md](docs/DEV.md)
