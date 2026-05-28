# Hongji Li Homepage

This is Hongji Li's personal homepage, built from the [PRISM](https://github.com/xyjoey/PRISM) academic portfolio template.

## Edit Content

Most site content is configuration-driven:

- `content/` contains the default English content.
- `content_zh/` contains the Chinese content.
- `public/` contains static assets such as the profile image and favicon.

Examples:

- To change the name, title, avatar, or GitHub link, edit `content/config.toml`.
- To update the homepage biography, edit `content/bio.md` and `content_zh/bio.md`.
- To add a project, append an `[[items]]` block in `content/projects.toml`.
- To replace research notes with formal papers, update `content/publications.bib`.

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build

```bash
npm run build
```

The project uses Next.js static export, so production files are generated under `out/`.

## Deploy to GitHub Pages

The current GitHub account is `Neon-Jing`. For a root GitHub Pages homepage, the repository should be:

```text
Neon-Jing/Neon-Jing.github.io
```

This publishes at:

```text
https://Neon-Jing.github.io
```

If the repository is named `hongji-li.github.io`, it does not publish at `https://hongji-li.github.io`; it publishes as a project site at `https://Neon-Jing.github.io/hongji-li.github.io/`. To use `https://hongji-li.github.io`, the GitHub account or organization must also be named `hongji-li`.

This project handles project-site paths in `next.config.ts`: during GitHub Actions builds, if the repository is not named `<owner>.github.io`, it automatically sets `basePath` and `assetPrefix`.

Push with:

```bash
git remote set-url origin git@github.com:Neon-Jing/Neon-Jing.github.io.git
git push -u origin main
```

In the GitHub repository, go to **Settings -> Pages -> Build and deployment**, then set **Source** to **GitHub Actions**. After that, every push to `main` will build the site and deploy the exported `out/` folder.
