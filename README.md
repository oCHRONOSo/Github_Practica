# Github_Practica

A 3D portfolio built with **React**, **Vite**, and **React Three Fiber**. The scene loads a baked GLB model with interactive targets and optional background music.

## What’s in this repo

- **Vite + React** app in `vite-project/`
- **3D scene** (Three.js / R3F) with a portfolio model and post-processing (bloom, tone mapping)
- **Static assets** in `vite-project/public/` (GLB models, `music.mp3`)
- **GitHub Actions** workflow to build and deploy to GitHub Pages

## Run locally

```bash
cd vite-project
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deploy

Pushing to `main` triggers the workflow in `.github/workflows/deploy-pages.yml`; the site is published to GitHub Pages (project site under `/Github_Practica/`).
