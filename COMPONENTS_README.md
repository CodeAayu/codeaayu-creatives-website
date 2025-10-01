# Component System for CodeAayu Creatives Website

## Overview
The header and footer are now maintained in a single location and dynamically loaded into all pages. This makes it easy to update navigation, footer links, or branding across the entire website.

## Structure

```
components/
├── header.html   - Navigation bar component
└── footer.html   - Footer and back-to-top button component

components-loader.js  - Script that loads components into pages
```

## How to Use

### 1. Add Component Placeholders to Your HTML Pages

In the `<body>` tag, add a `data-page` attribute:
```html
<body data-page="index">   <!-- for v2-index.html -->
<body data-page="about">   <!-- for v2-about.html -->
<body data-page="writing"> <!-- for v2-writing.html -->
etc.
```

Replace the entire `<nav>...</nav>` section with:
```html
<div id="header-component"></div>
```

Replace the entire `<footer>...</footer>` and back-to-top button with:
```html
<div id="footer-component"></div>
```

### 2. Load the Component Loader Script

Add this script **BEFORE** your main `v2-script.js`:
```html
<script src="components-loader.js"></script>
<script src="v2-script.js"></script>
```

### 3. Example: Converting a Page

**Before:**
```html
<body>
    <nav class="nav navbar" id="mainNav">
        <!-- 50 lines of navigation code -->
    </nav>

    <!-- Page content -->

    <footer class="footer">
        <!-- 50 lines of footer code -->
    </footer>

    <script src="v2-script.js"></script>
</body>
```

**After:**
```html
<body data-page="about">
    <div id="header-component"></div>

    <!-- Page content -->

    <div id="footer-component"></div>

    <script src="components-loader.js"></script>
    <script src="v2-script.js"></script>
</body>
```

## Making Updates

### To Update Navigation
Edit `components/header.html` - changes will appear on all pages

### To Update Footer
Edit `components/footer.html` - changes will appear on all pages

### To Update Branding/Logo
Edit `components/header.html` and `components/footer.html`

## Benefits

1. **Single Source of Truth**: Update header/footer in one place
2. **Consistency**: All pages automatically have the same navigation and footer
3. **Easy Maintenance**: No need to update 5 different HTML files
4. **Active Link Highlighting**: The current page is automatically highlighted in navigation

## Active Link Detection

The component loader automatically highlights the active page link based on the `data-page` attribute on the `<body>` tag.

- `data-page="index"` → "Home" link gets `active` class
- `data-page="photography"` → "Photography" link gets `active` class
- etc.

## Notes

- The components are loaded asynchronously using JavaScript fetch
- Components load very quickly and are cached by the browser
- If JavaScript is disabled, components won't load (consider server-side includes for production)
- The `allComponentsLoaded` event is fired when all components are ready
