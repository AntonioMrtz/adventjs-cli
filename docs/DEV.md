# 🔧 Dev docs

## Run

```bash
npm run start
```

## Publish package

```bash
npm publish
```

## Publish package using pipelines

1. Change `package.json` and `APP_VERSION` version number.
2. Push changes
3. Create tag with version v.x.x
4. Push tags

### Debug package content

```bash
npm pack --dry-run
```

## Debug package

### 1. Generate package from root project

```bash
npm run build && chmod +x dist/index.js
```

### 2. Install the package

Create a temp folder

```bash
mkdir /tmp/adventjs-test && cd /tmp/adventjs-test
```

Install the package from the repo path

```bash
npm i /path/to/repo && npx adventjs-cli init
```
