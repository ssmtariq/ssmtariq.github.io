# ssmtariq.github.io

Personal site of Syed Salauddin Mohammad Tariq.

## Layouts

| URL | Template | Notes |
|-----|----------|--------|
| `/` | HTML5 UP (`index.html`) | Original layout; update this file directly if you only use the classic site. |
| `/skeleton/` | Skeleton + Raleway (`skeleton/index.html`) | Inspired by [dmelis.github.io](https://github.com/dmelis/dmelis.github.io): fixed nav, sectioned page, timeline vitæ. |

Shared assets (images, `cv.pdf`) live at the repository root so both layouts can link to them (`/cv.pdf`, `/images/...`).

## Pluggable content (Skeleton layout)

1. Edit **`content/site.json`** (single source of truth for the Skeleton page).
2. Regenerate the HTML:
   ```bash
   npm run build
   ```
   or:
   ```bash
   node scripts/render-site.mjs
   ```
3. Commit `content/site.json` and `skeleton/index.html`.

To add another template later, add a new script under `scripts/` that reads the same `content/site.json` and writes to a new folder (for example `minimal/index.html`), then expose it with an `npm run build:…` script.

## CV

The canonical CV file for both layouts is **`cv.pdf`** at the site root. The classic homepage resume link points to `/cv.pdf`.
