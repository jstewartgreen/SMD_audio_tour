# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A static website (no build step, no npm, no framework) that serves as a mobile audio tour for San Miguel de Allende, Mexico. Users see an interactive map, tap a numbered pin, and a bottom sheet slides up with the site name, photo, description, and an audio player. An EN/ES toggle switches the language.

## Commands

No build or install step required. Open `index.html` directly in a browser, or serve locally:

```bash
python3 -m http.server   # then visit http://localhost:8000
```

## Architecture

All files are loaded by the browser directly — no bundler, no server-side rendering.

| File | Purpose |
|------|---------|
| `index.html` | Landing page: hero section, stop preview cards, "How it works", footer. Links to `map.html`. |
| `map.html` | Map page shell. Loads Leaflet CSS/JS from CDN, then `stops.js` and `app.js`. Has a back-arrow link to `index.html`. |
| `stops.js` | Defines the global `STOPS` array. This is the **only** file a non-developer needs to edit. |
| `landing.js` | Landing page logic: renders stop preview cards from `STOPS`, handles language toggle, persists `lang` to `sessionStorage` for `map.html` to restore. |
| `app.js` | Initializes the Leaflet map, places pins from `STOPS`, handles pin clicks, bottom-sheet open/close, and language switching. Restores `lang` from `sessionStorage` on load. All logic is in an IIFE to avoid global pollution. |
| `style.css` | Mobile-first styles. CSS custom properties for the color palette are at the top. Map-page styles first, then landing-page styles (scoped to `body.landing`) at the bottom. The bottom sheet uses `transform: translateY` for the slide animation. |
| `audio/` | `.mp3` audio files, named `<stop_id>_en.mp3` / `<stop_id>_es.mp3`. |
| `images/` | `.jpg` photos, named `<stop_id>.jpg`. |

## Key patterns

- **`stops.js` vs `stops.json`**: Data is a JS file (not JSON) so it loads without a `fetch()` call and works when opening `index.html` from the filesystem (avoids browser CORS restrictions on `file://`).
- **Language switching**: `lang` state variable (`'en'` or `'es'`). `updateLanguage(stop)` reads `stop['name_' + lang]` etc. and swaps the audio `src`. The player is paused but not re-played automatically on toggle.
- **Map pins**: Leaflet `divIcon` with a CSS-styled circle containing the stop number. The `.active` class scales the pin up. `marker._pinInner` holds a reference to the inner DOM element for activation.
- **Bottom sheet**: Fixed position, `transform: translateY(100%)` when hidden, `translateY(0)` when `.open`. A semi-transparent `#overlay` dims the map and closes the sheet on tap. On desktop (≥600px) the sheet floats centered above the bottom of the viewport.
- **Images are optional**: If `stop.image` is falsy or the file is missing (`onerror`), the `<img>` is hidden.

## Hosting

Deployed via GitHub Pages (free). No CI/CD pipeline — push to `main` and GitHub Pages rebuilds automatically.
