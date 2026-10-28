# Dreamora · 梦境星球

Bilingual research-vision website exploring active dream creation through an ultrasound-centered platform, AI content, neural feedback and audiovisual experiences.

This is an early-stage research project, not a validated or commercially available medical or consumer device. External studies are clearly separated from product claims. Generated artwork, illustrative signals and interactive fields visualize research ideas; they are not measurements or efficacy evidence.

## Development

Node.js 18+ and Python 3 are sufficient. No npm dependencies, API keys or paid services.

```sh
npm run build
npm run preview
```

Open http://localhost:4173/?lang=zh or http://localhost:4173/?lang=en. Only site/ is copied into dist/. Paths are relative for project-based GitHub Pages.

## Features

Chinese/English switching, original product and experience imagery, silent looping sleep-research films, a colorful AI workflow interface, synthetic signal animation, an interactive convergence field, and source-linked research summaries. Animations can be paused and respect reduced-motion preferences. No accounts, uploads, visitor analytics, payments, contact forms or device controls.

## Sources and assets

Design reference: https://www.prophetic.com/ . Layout and interaction patterns informed this independently written implementation. No Prophetic source code, brand assets, copy, photographs or videos are included.

Product/scenario/brain artwork was generated specifically for Dreamora. Motion overlays and research-count chart are original. Inter Tight and JetBrains Mono are distributed under SIL OFL; licenses are in site/assets/fonts/.

The research section links to the original papers. The trial-outcome chart was independently plotted from Konkoly et al. (2021), Table 2, DOI 10.1016/j.cub.2021.01.026. Restricted-license paper figures are not reproduced.

## Deployment

The GitHub Actions workflow builds and deploys dist/ to GitHub Pages. Repository Settings → Pages → Source should be GitHub Actions. Public deployment status is determined by the workflow and the live URL, not a local build.
