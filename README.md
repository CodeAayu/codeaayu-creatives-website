# CodeAayu Creatives - Photography Portfolio Website

A modern photography portfolio for **Aayush Ahuja** — a Bangalore-based photographer and software engineer. The site frames photography as a "visual systems" practice: planning, capturing, grading, and shipping coherent image sets that work across web, social, print, and campaign surfaces.

**Live Site:** [codeaayucreatives.co.in](https://codeaayucreatives.co.in)

## Features

### Portfolio Showcase
- **Multi-category Gallery**: Wildlife, Portrait, Travel, Scenic, and Texture photography (16 curated frames)
- **Filterable Gallery**: Filter by category (Wildlife, Portrait, Travel, Scenic, Texture) or by use case (Portraits & brand, Travel & stories, Wildlife & nature, Texture & detail)
- **Lightbox View**: Full-screen viewing with arrow-key, Escape, and click-to-close navigation
- **Responsive Grid Layout**: Adaptive gallery that works on all screen sizes
- **Mood Engine**: On the gallery page, a Motion / Intimate / Horizon / Texture selector previews the visual range

### Design & Aesthetics
- **Dark Mono Theme**: Deep space background (`#050816`) with violet (`#915eff`) and teal (`#00cea8`) accents
- **Engineering Typography**: Inter (display + body) and IBM Plex Mono (code / labels) for a developer-meets-photographer feel
- **Scroll-triggered Reveals**: Subtle motion; respects `prefers-reduced-motion`
- **Scroll Progress Indicator**: A thin violet bar tracks page position
- **Custom Cursor Halo**: A subtle follower cursor on pointer-fine devices (desktop with mouse)

### Interactive Elements
- **Responsive Navigation**: Desktop nav with mobile hamburger menu
- **Mobile Menu**: Full-screen overlay with close button, body scroll lock, and focus trap
- **Contact Form**: Web3Forms integration with project-type, timeline, location, and budget fields
- **Brief Builder**: On the contact page, ticking the checkboxes prepends a "Brief signal" line to the form notes, with copy-to-clipboard support
- **Toast Notifications**: Lightweight success/error feedback on form submission
- **Back-to-Top Button**: Easy navigation on long pages
- **Loading Screen**: Branded loading animation (skipped under `prefers-reduced-motion`)

### Content Sections
- **Home Page** (`index.html`): Hero, selected work (4 featured frames), 4-step production pipeline (Brief → Capture → Grade → Ship), contact CTA
- **Photography Page** (`photography.html`): Page hero, use-case sub-nav, full 16-frame gallery with filters, mood engine
- **About Page** (`about.html`): Profile, operating style, image lab, shoot protocol (3 steps), availability CTA
- **Writing Page** (`writing.html`): Linked list of Medium essays with cover images
- **Contact Page** (`contact.html`): Brief builder + project brief form

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables (no framework, no preprocessor)
- **Typography**: Google Fonts (Inter, IBM Plex Mono)
- **Form Handling**: Web3Forms API integration
- **Hosting**: Static hosting with GitHub Pages custom-domain files plus an OpenAI Sites/Cloudflare Worker package path
- **Build**: Optional `npm run build` packages selected static assets into `dist/server/public` and writes a Worker entry at `dist/server/index.js`

## Project Structure

```
codeaayu-creatives-website/
├── .openai/
│   └── hosting.json                # OpenAI Sites project metadata
├── assets/                         # Downloadable PDFs
├── public/                         # Public build extras, including screenshot.jpeg
├── data/
│   └── portfolio.json              # Mirror of inlined portfolio data
├── images/
│   ├── about/                      # About page images
│   ├── logos/                      # Brand logos (white/black variants)
│   ├── portfolio/                  # Full-size portfolio images
│   └── thumbnails/
│       ├── portfolio/              # Portfolio thumbnails
│       └── about/                  # About page thumbnails
├── components/                     # Component system (experimental, not wired up — see COMPONENTS_README.md)
│   ├── header.html
│   └── footer.html
├── components-loader.js            # Loader for the components above (not used)
├── scripts/
│   └── build-sites.mjs             # Packages the static site for OpenAI Sites
├── script.js                       # Main JavaScript file
├── styles.css                      # Main stylesheet
├── index.html                      # Home page
├── photography.html                # Photography portfolio
├── about.html                      # About page
├── writing.html                    # Writing / Medium list
├── contact.html                    # Contact form + brief builder
├── CNAME                           # Custom domain configuration
├── robots.txt                      # Crawler guidance
├── sitemap.xml                     # Sitemap
├── README.md                       # This file
├── COMPONENTS_README.md            # Component system docs
└── SEO-IMPLEMENTATION-GUIDE.md     # SEO strategy + meta reference
```

## Data-driven Portfolio

The visible home and gallery tiles are inlined in HTML for resilience. The same portfolio set is mirrored in two data locations:

- `script.js` has a `PORTFOLIO_DATA` fallback const near the top of the file.
- `data/portfolio.json` mirrors that data for tooling and future build work.

The current set has 16 items, 5 categories, 3 surface tags, and 4 featured home-page frames. Runtime behavior is intentionally conservative: if `[data-selected-work]` or `[data-portfolio-grid]` already contains tiles, `script.js` leaves the inline HTML alone. If a future page empties those containers, the script can render from `data/portfolio.json`, falling back to the inline JS const if the fetch fails.

Each item has:

```js
{
  id: "eagle_fly",                  // Stable identifier
  thumb: "images/thumbnails/...",   // Thumbnail path
  full: "images/portfolio/...",     // Full-size path (used by lightbox)
  alt: "Eagle in flight",           // Alt text
  category: "wildlife",             // wildlife | portrait | travel | scenic | texture
  surfaces: ["web", "campaign"],    // web | print | campaign
  title: "Wings of Freedom",        // Tile caption
  tagline: "Wildlife",              // Short label
  featured: true,                   // Optional: appears on home page
  featuredOrder: 1                  // Optional: ordering on home page
}
```

**To add a frame**: update all visible and mirrored sources:

1. Add the tile to the inlined `<div data-portfolio-grid>` block in `photography.html`.
2. Add or update the matching item in `PORTFOLIO_DATA` inside `script.js`.
3. Add or update the matching item in `data/portfolio.json`.
4. If it should appear on the home page, add/update the tile in `[data-selected-work]` in `index.html` and mark the data item with `featured: true` plus `featuredOrder`.

**To remove or re-order a frame**: update the same locations together.

> **Why not render the gallery from data alone?** A JS-only gallery can go blank if the script fails, the network is slow, or the page is opened from `file://` where `fetch` can be blocked. For a static portfolio, inlining the tiles keeps the page usable and preserves the data mirror for future tooling.

## Getting Started

### Prerequisites
- A modern web browser
- A text editor (VS Code, Sublime, etc.)
- Git (for version control)

### Local Development

```bash
git clone https://github.com/CodeAayu/codeaayu-creatives-website.git
cd codeaayu-creatives-website
python3 -m http.server 8080
# Then visit http://localhost:8080
```

No dependency install is required for local browsing. To verify the OpenAI Sites package output, run:

```bash
npm run build
```

That command creates `dist/server/public` with the deployable static assets and `dist/server/index.js` with the Worker-compatible request handler.

## Design System

### Color Palette

```css
:root {
  --ink: #050816;        /* Deep space (background) */
  --ink-2: #080b18;      /* Slightly lighter ink */
  --surface: #10152b;    /* Card surface */
  --surface-2: #1d1836;  /* Elevated surface */
  --paper: #f7f5ff;      /* Primary text (warm white) */
  --muted: #9b94c7;      /* Muted secondary text */
  --violet: #915eff;     /* Primary accent */
  --teal: #00cea8;       /* Secondary accent */
  --sky: #5bd5ff;        /* Tertiary accent */
  --gold: #f7c948;       /* Warning / highlight */
}
```

### Typography

- **Display + Body**: Inter (sans-serif, weights 400–900)
- **Mono (code, labels, captions)**: IBM Plex Mono

### Breakpoints
- **Desktop**: 1024px and above
- **Tablet**: 641px – 1023px
- **Mobile**: 640px and below

## Responsive Design

- Mobile-first approach
- Touch-optimized interactions
- Mobile menu with body scroll lock and focus trap
- Animations disabled under `prefers-reduced-motion`
- All non-critical images use `loading="lazy"` and `decoding="async"`

## Accessibility

- Semantic HTML5 elements (`<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`, `<article>`)
- `aria-label` on icon-only buttons and nav regions
- Focus trap inside the mobile menu; focus returns to the toggle on close
- Lightbox supports keyboard navigation (`←`, `→`, `Esc`)
- `prefers-reduced-motion` honored across loader, reveal, scroll progress, custom cursor, ripples, and interactive surfaces
- Content images have meaningful `alt` text; decorative article-cover images use empty `alt=""`

## Performance

- Vanilla JS, no framework runtime cost
- CSS uses variables and grid for layout (no preprocessor)
- All gallery thumbnails use `loading="lazy"`
- Local browsing does not require a build step
- Cache-busting via `?v=YYYYMMDD-shortname` query strings on `styles.css` and `script.js`

## Deployment

### Static Custom Domain
1. Push to GitHub repository
2. Go to Settings → Pages
3. Select branch (usually `main`)
4. Set custom domain in `CNAME` file

### Custom Domain (codeaayucreatives.co.in)
DNS configuration:
```
Type: A
Name: @
Value: 185.199.108.153 (and other GitHub Pages IPs)

Type: CNAME
Name: www
Value: codeaayu.github.io
```

### OpenAI Sites Package

This repo also contains OpenAI Sites metadata in `.openai/hosting.json` and a static packaging script:

```bash
npm run build
```

The script copies the deployable HTML, CSS, JS, `data/portfolio.json`, selected images, public files, and `.openai/hosting.json` into `dist/`, then writes a Worker entry that serves assets through the Sites asset binding.

## Contact Form Setup

The contact form uses [Web3Forms](https://web3forms.com/):

1. Get an access key from Web3Forms
2. Update the `access_key` hidden input in `contact.html`
3. Form submissions are sent to the configured email

## Browser Support

- Chrome / Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile: iOS Safari, Chrome Mobile

## Known Limitations

- **Header/footer duplication**: The 5 HTML pages each have an inlined `<header>` and `<footer>`. A `components/` folder with a JS loader exists (see `COMPONENTS_README.md`) but is not currently wired in. Edit each HTML file when navigation or footer changes.
- **Portfolio data in three places**: The visible gallery is inlined in `photography.html`, the selected home frames are inlined in `index.html`, and the same data is mirrored in `PORTFOLIO_DATA` plus `data/portfolio.json`. Future work: generate the HTML from the JSON during the Sites build.
- **The brief builder is unstructured form data**: Selected checkbox values are prepended into the `message` textarea and submit as part of the notes. They are not sent as a separate structured field. Add a hidden input if you need dedicated analytics or routing on those signals.

## Versioning

Cache-bust query strings on the CSS and JS follow a date-based scheme:

```
styles.css?v=20260701-redesign-g
script.js?v=20260701-redesign-g
```

When you make a meaningful change, bump the `?v=` suffix in every HTML file to force browsers to refetch.

## Author

**Aayush Ahuja**
- Website: [codeaayucreatives.co.in](https://codeaayucreatives.co.in)
- Instagram: [@codeaayu.creatives](https://instagram.com/codeaayu.creatives)
- Medium: [@codeaayu](https://medium.com/@codeaayu)
- LinkedIn: [codeaayu](https://www.linkedin.com/in/codeaayu/)
- YouTube: [@codeaayucreatives](https://www.youtube.com/@codeaayucreatives)

## License

This project is private and proprietary. All rights reserved.

---

**Last Updated**: 2026-07-02 (redesign documentation pass)
