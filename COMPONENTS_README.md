# Component System for CodeAayu Creatives Website

## Status: **Experimental — not currently in use**

This folder holds an *experimental* header/footer component system that was set up to deduplicate navigation and footer markup across the 5 HTML pages. **It is not wired into any page on the site today.** Each HTML file inlines its own `<header>` and `<footer>`.

The data in this README is preserved so the system can be revived if and when the duplication becomes painful enough to justify a real include step. For the current state of the site, see [README.md](./README.md) -> "Known Limitations".

## What it was supposed to do

Keep the header and footer in a single location and dynamically load them into all pages, so navigation, footer links, and branding could be updated in one place.

## Structure (if revived)

```
components/
├── header.html        # Navigation bar component
└── footer.html        # Footer and back-to-top button component

components-loader.js   # Script that loads components into pages
```

The existing files in this folder are from the v2 design and use a different visual treatment (cream/warm-light theme, `nav-container` markup, dropdown menus, and a theme toggle) than the current dark mono design. **They are not drop-in replacements** for the current header/footer: the markup, classes, mobile-menu behavior, and assets have all changed.

## Why it was abandoned

The plan to wire it up was on the redesign checklist but got deprioritized in favor of:

- **Resilience over DRY**: Inlining the header/footer in each HTML page means no JS dependency for navigation. A failed loader script doesn't break the site.
- **A 5-page site doesn't justify the complexity**: At 5 pages, the cost of "edit navigation in 5 places" is low enough that the runtime cost of a JS fetch-based component loader isn't worth the trade-off.
- **No build-time include**: The repo now has an optional `npm run build` packaging step for OpenAI Sites, but it only copies static assets and writes a Worker entry. It does not compile HTML partials.

## When to revive this

Revisit this system if any of the following become true:

1. The site grows past ~10 pages.
2. The header or footer needs to change frequently (e.g., seasonal navigation, A/B tests).
3. The Sites build script is expanded to generate HTML from shared partials.

## What to do if you revive it

### 1. Rewrite the components

The current `components/header.html` and `components/footer.html` use the v2 visual treatment. Re-author them to match the v3 dark mono header/footer markup in `index.html`.

### 2. Update the loader

`components-loader.js` exists, but it was written for the older component markup. If this system is revived, update it to:
- Fetch the components in parallel, as it does today
- Inject them into `<div id="header-component">` and `<div id="footer-component">` placeholders
- Update the active link in the nav based on the `data-page` attribute on `<body>`
- Handle fetch failure gracefully (e.g., leave the inline header/footer as a fallback)
- Re-run or coordinate with `script.js` menu setup so the mobile close button, focus trap, and body scroll lock still work after injection

### 3. Migrate the HTML pages

In each of the 5 HTML files:
- Add a `data-page` attribute to `<body>` (e.g., `<body data-page="photography">`)
- Replace the inlined `<header>` with `<div id="header-component"></div>`
- Replace the inlined `<footer>` with `<div id="footer-component"></div>`
- Load `components-loader.js` before `script.js`
- Make sure the revived component markup includes the current close button (`data-menu-close`) and matches the current cache-busted `styles.css` / `script.js` version.

### 4. Test with JS off

Because inlined header/footer was a deliberate resilience choice, the revived component system should degrade gracefully when JS is disabled. Either keep the inline header/footer as a `<noscript>` fallback or accept the trade-off explicitly.

## Loader status

`components-loader.js` is present in the repository. It is archived with the v2 component experiment and is not referenced by the current pages.

Current behavior:

- It loads `components/header.html` and `components/footer.html` into `#header-component` and `#footer-component`.
- It dispatches `componentLoaded` for each component and `allComponentsLoaded` after both finish.
- It applies an `active` class based on `body[data-page]`.

Do not treat the loader as production-ready until the component HTML is rewritten to match the current dark mono header/footer and mobile-menu behavior.

## See also

- [README.md](./README.md) — current site architecture and known limitations
- [SEO-IMPLEMENTATION-GUIDE.md](./SEO-IMPLEMENTATION-GUIDE.md) — current meta and SEO strategy

---

**Last Updated**: 2026-07-02
