# Mohammad Maaitah · AI/ML Engineer

Personal portfolio: generative AI, RAG systems, multi-agent automation and deep learning.

**Live site:** https://maaitah-resume.github.io/ai-portfolio/
(also on Vercel: https://mohammad-maaitah-portfolio.vercel.app)

## Features

- Interactive 3D robot (Three.js) that follows the cursor, smiles and waves on hover
- Project cards that flip in 3D to show a live architecture diagram
- Light and dark themes
- English and Arabic, with a full right-to-left layout
- Motion built on the animate-ui conventions, with reduced-motion support

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Every push to `main` publishes to GitHub Pages automatically (`.github/workflows/pages.yml`).

To update the Vercel copy:

```bash
npx vercel@latest deploy --prod
```

## Edit the content

All text lives in `src/data.ts` (English) and `src/data.ar.ts` (Arabic).
