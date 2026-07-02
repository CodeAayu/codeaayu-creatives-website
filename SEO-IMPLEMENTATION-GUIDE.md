# SEO Implementation Guide - CodeAayu Creatives

## Overview

This guide documents the current SEO setup for [codeaayucreatives.co.in](https://codeaayucreatives.co.in). The site is a 5-page static photography portfolio for Aayush Ahuja, with a current redesign focused on photography systems, selected portfolio frames, writing, and project briefs.

## Current Status

- **Last reviewed**: 2026-07-02
- **Site version**: `20260701-redesign-g` cache-bust suffix
- **Primary theme color**: `#050816`
- **Primary typography**: Inter + IBM Plex Mono

The redesign currently includes:

- Canonical URLs on all 5 pages.
- Page-specific titles, descriptions, keywords, author, robots, and theme color.
- Open Graph title, description, type, and image on all 5 pages.
- Twitter large-image card metadata on all 5 pages.
- JSON-LD on `index.html` (`Person`) and `contact.html` (`ContactPage`).
- `robots.txt` and `sitemap.xml`.
- Lazy-loaded portfolio, about, and writing-card images where they are not first-paint critical.

## Technical SEO Files

### robots.txt

**Location**: `/robots.txt`

Current behavior:

- Allows all crawlers.
- Points to `https://codeaayucreatives.co.in/sitemap.xml`.
- Uses `Crawl-delay: 1`.

### sitemap.xml

**Location**: `/sitemap.xml`

Current coverage:

- `/`
- `/photography.html`
- `/about.html`
- `/writing.html`
- `/contact.html`

Update each page's `<lastmod>` date when page copy, structure, or portfolio content materially changes.

## Page-Specific SEO

### Home Page (`index.html`)

- **Focus**: CodeAayu Creatives brand, Aayush Ahuja, photography systems, portraits, brands, travel, and wildlife.
- **Primary social image**: `images/thumbnails/portfolio/eagle_fly.jpg`.
- **Structured data**: `Person` JSON-LD with name, URL, image, job title, email, Bangalore address, and social profiles.
- **Current content signal**: Hero, selected work, 4-step production pipeline, and contact CTA.

### Photography Page (`photography.html`)

- **Focus**: Curated photography gallery across Portrait, Wildlife, Travel, Scenic, and Texture categories.
- **Current gallery count**: 16 inlined frames, mirrored in `script.js` and `data/portfolio.json`.
- **Primary social image**: `images/thumbnails/portfolio/vivekanand_memorial.jpg`.
- **Current content signal**: Use-case sub-nav, category filters, lightbox, and mood engine.

### About Page (`about.html`)

- **Focus**: Aayush Ahuja profile, Bangalore base, software-engineer background, photography operating style, and shoot protocol.
- **Open Graph type**: `profile`.
- **Primary social image**: `images/thumbnails/about/personality-photo-1.jpg`.
- **Current content signal**: Profile summary, image lab, operating principles, and availability CTA.

### Writing Page (`writing.html`)

- **Focus**: Medium essays by Aayush Ahuja on travel, creativity, personal growth, technology, and life.
- **Current article count**: 5 featured article links plus a Medium archive link.
- **Primary social image**: Medium CDN image for the latest featured article.
- **Current content signal**: Article cards with decorative cover images and external Medium links.

### Contact Page (`contact.html`)

- **Focus**: Project brief submission for portraits, brand image sets, travel stories, events, and collaborations.
- **Primary social image**: `images/thumbnails/about/personality-photo-1.jpg`.
- **Structured data**: `ContactPage` JSON-LD.
- **Current content signal**: Brief builder, Web3Forms form, and direct email/social details.

## Metadata Checklist

Every page should keep these tags current:

```html
<title>...</title>
<meta name="description" content="...">
<meta name="keywords" content="...">
<meta name="author" content="Aayush Ahuja">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#050816">
<link rel="canonical" href="https://codeaayucreatives.co.in/...">
<meta property="og:type" content="website">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://codeaayucreatives.co.in/...">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://codeaayucreatives.co.in/...">
```

The home page currently also includes `og:url`, `twitter:title`, and `twitter:description`. Add those to the other pages if you want stricter parity across social previews.

## Image SEO

- Use descriptive `alt` text for portfolio, logo, and about-page content images.
- Use empty `alt=""` for purely decorative writing-card cover images.
- Keep thumbnails in `images/thumbnails/portfolio/`.
- Keep full-size lightbox images in `images/portfolio/`.
- Keep `loading="lazy"` and `decoding="async"` on non-critical images.
- When adding a portfolio image, update `photography.html`, `index.html` if featured, `script.js`, and `data/portfolio.json` together.

## Structured Data

Current JSON-LD is intentionally narrow:

- `index.html`: `Person`
- `contact.html`: `ContactPage`

Potential future additions:

- `WebSite` schema for the whole domain.
- `ProfessionalService` schema if CodeAayu Creatives should rank more strongly as a local photography service.
- `ImageGallery` or `CreativeWork` schema if portfolio indexing becomes a priority.
- `Article` schema only if article content is hosted on this site instead of linking out to Medium.

## Verification Tools

- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema Markup Validator: https://validator.schema.org/
- PageSpeed Insights: https://pagespeed.web.dev/
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Maintenance Checklist

Run this checklist when changing page content, portfolio content, or social preview images:

1. Update page title, description, and keywords if the page focus changed.
2. Update Open Graph and Twitter images if the featured visual changed.
3. Update `sitemap.xml` `<lastmod>` dates for touched pages.
4. Bump `styles.css?v=...` and `script.js?v=...` when CSS or JS changes need cache busting.
5. Run `npm run build` to verify the OpenAI Sites package output.
6. Test a local static server with `python3 -m http.server 8080`.

## Target Keywords by Page

### Home Page

- Aayush Ahuja photographer
- CodeAayu Creatives
- Bangalore photographer
- portrait photography Bangalore
- brand photography India

### Photography Page

- photography portfolio India
- wildlife photography portfolio
- portrait photography samples
- travel photography India
- professional photographer portfolio

### About Page

- Aayush Ahuja biography
- software engineer photographer
- IIT ISM photographer
- Bangalore photographer profile

### Writing Page

- Aayush Ahuja writing
- CodeAayu Medium
- travel essays India
- creative writing photographer

### Contact Page

- hire photographer Bangalore
- photography project brief
- book photographer India
- brand photography contact

---

- **Last Updated**: 2026-07-02
- **Version**: 2.0
