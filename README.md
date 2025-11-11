# AdventJS-CLI

AdventJS CLI Generator – Spin up your AdventJS challenges in seconds! 🎄⚡

- 📝 Generates TypeScript starter files + tests
- 📖 Adds challenge description in Markdown format
- ⚙️ Handles project init, dependencies, and config automatically
- 📅 Ready for 2024, 2025, and beyond

Focus on solving the challenges, not setting them up! 🚀

## Run

```bash
npm run start
```

## Publish package

```bash
npm publish
```

### Debug package content

```bash
npm pack --dry-run
```

## Debug package

### Generate package from root

```bash
npm run build && chmod +x dist/index.js
```

### Install while being on the generated folder

```bash
npm install ../ && npx adventjs-cli init
```
