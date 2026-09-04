# SEO Implementation Guide - CodeAayu Creatives

## Current status

- **Last reviewed**: 2026-09-04
- **Deployment**: Framework-free static site served from the repository root on GitHub Pages.
- **Canonical host**: `https://codeaayucreatives.co.in`
- **Indexable pages**: `/` (`index.html`) and `/photography.html`
- **Legacy compatibility stubs**: `about.html` and `contact.html` remain available for old links but are `noindex, follow` pages that redirect to the corresponding sections on the home page.

The visible site experience is intentionally concentrated in the home page and the full photography gallery. No new routes or capabilities are required for the current SEO setup.

## Indexable pages

### Home page (`index.html`)

- **Focus**: CodeAayu Creatives photography services by Aayush Ahuja, based in Bangalore (Bengaluru), with a feeling-led brand voice.
- **Title**: `CodeAayu Creatives — Bangalore Photography, served with feeling`
- **Description signal**: Bangalore (Bengaluru) photography services for portraits, celebrations, brands, travel stories, wildlife, and honest moments.
- **Social metadata**: Open Graph and Twitter titles/descriptions use the same location and service vocabulary as the page title and description.
- **Structured data**: `ProfessionalService` JSON-LD with CodeAayu Creatives, Aayush Ahuja, email, Bangalore service area, and social profiles.
- **Primary content signal**: Hero, service categories, selected work, photographer profile, process, and an inquiry form.

### Photography page (`photography.html`)

- **Focus**: Bangalore photography portfolio and the complete CodeAayu Creatives archive.
- **Title**: `Bangalore Photography Portfolio — CodeAayu Creatives`
- **Description signal**: 178 frames by Aayush Ahuja across portraits, brands, wildlife, places, nature, and cosmos.
- **Gallery source of truth**: `data/gallery.json` is the manifest consumed by `script.js`; its declared count is **178** and its category counts are 20 portraits, 11 brand, 55 wildlife, 55 places, 27 nature, and 10 cosmos.
- **Primary content signal**: Gallery hero, manifest-driven archive, category filters, progressive loading, lightbox, and inquiry CTA.

## Legacy stubs

- `about.html`: `noindex, follow`, canonical `https://codeaayucreatives.co.in/#about`, and a meta refresh to `./#about`.
- `contact.html`: `noindex, follow`, canonical `https://codeaayucreatives.co.in/#reserve`, and a meta refresh to `./#reserve`.

These files preserve old inbound links without creating additional indexable page targets. The current inquiry flow lives in the `#reserve` section of `index.html`.

## Technical SEO files

### `sitemap.xml`

The sitemap intentionally lists only the two indexable pages:

- `https://codeaayucreatives.co.in/`
- `https://codeaayucreatives.co.in/photography.html`

Update `<lastmod>` when page copy, structure, or gallery content materially changes. The legacy stubs should not be added to the sitemap.

### `robots.txt`

The current file allows crawlers and points to the canonical sitemap. Keep it aligned with the two-page indexable information architecture.

## Content and image guidance

- Keep location wording consistent in search-facing metadata: use `Bangalore (Bengaluru)` when both the common search term and the official city name are useful.
- Keep the inquiry wording clear: submitting the form starts a conversation and does not confirm a booking.
- Use descriptive `alt` text for featured and manifest-driven gallery images.
- Keep the gallery manifest, `script.js`, and any future gallery content changes synchronized. Do not hard-code a second gallery inventory in `photography.html`.
- Preserve the existing canonical host, root deployment, social image, typography, and visual identity unless a focused change requires otherwise.

## Focused verification

- Parse both indexable documents and confirm one canonical, title, description, Open Graph title/description, and Twitter title/description per page.
- Confirm `data/gallery.json` declares `count: 178` and contains 178 manifest items.
- Confirm `about.html` and `contact.html` retain `noindex` and anchor redirects.
- Run `npm run build` when packaging behavior needs verification, then test the generated static output with a local server such as `python3 -m http.server 8080`.

---

- **Last updated**: 2026-09-04
- **Version**: 3.0
