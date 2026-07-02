"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initMenu();
  initReveal();
  initCurrentYear();
  initWorkFilters();
  initLightbox();
  initMoodDial();
  initBriefBuilder();
  initContactForms();
  initScrollProgress();
  initCreativeCursor();
  initInteractiveSurfaces();
  initClickRipples();
  initPortfolioData();
});

const PORTFOLIO_DATA = {
  "version": 1,
  "items": [
    { "id": "eagle_fly", "thumb": "images/thumbnails/portfolio/eagle_fly.jpg", "full": "images/portfolio/eagle_fly.jpg", "alt": "Eagle in flight", "category": "wildlife", "surfaces": ["web", "campaign", "print"], "title": "Wings of Freedom", "tagline": "Wildlife", "featured": true, "featuredOrder": 1 },
    { "id": "portrait-5", "thumb": "images/thumbnails/portfolio/portrait-5.jpg", "full": "images/portfolio/portrait-5.jpg", "alt": "Portrait study", "category": "portrait", "surfaces": ["web", "campaign"], "title": "Character Study", "tagline": "Portrait", "featured": true, "featuredOrder": 2 },
    { "id": "vivekanand_memorial", "thumb": "images/thumbnails/portfolio/vivekanand_memorial.jpg", "full": "images/portfolio/vivekanand_memorial.jpg", "alt": "Vivekananda Rock Memorial", "category": "travel", "surfaces": ["web", "print", "campaign"], "title": "Rock Memorial", "tagline": "Travel", "featured": true, "featuredOrder": 3 },
    { "id": "Flower with sun", "thumb": "images/thumbnails/portfolio/Flower with sun.jpg", "full": "images/portfolio/Flower with sun.jpg", "alt": "Flower silhouette against sun", "category": "texture", "surfaces": ["web", "print"], "title": "Sunlit Bloom", "tagline": "Texture", "featured": true, "featuredOrder": 4 },
    { "id": "Fire_nubra", "thumb": "images/thumbnails/portfolio/Fire_nubra.JPG", "full": "images/portfolio/Fire_nubra.JPG", "alt": "Camp fire at Nubra", "category": "travel", "surfaces": ["web", "campaign"], "title": "Nubra Fire", "tagline": "Travel" },
    { "id": "pamban_sunset", "thumb": "images/thumbnails/portfolio/pamban_sunset.jpg", "full": "images/portfolio/pamban_sunset.jpg", "alt": "Pamban sunset", "category": "travel", "surfaces": ["web", "print"], "title": "Pamban Sunset", "tagline": "Travel" },
    { "id": "Sunrise", "thumb": "images/thumbnails/portfolio/Sunrise.jpg", "full": "images/portfolio/Sunrise.jpg", "alt": "Sunrise over horizon", "category": "scenic", "surfaces": ["web", "print"], "title": "Sunrise", "tagline": "Scenic" },
    { "id": "Purple_heron", "thumb": "images/thumbnails/portfolio/Purple_heron.jpg", "full": "images/portfolio/Purple_heron.jpg", "alt": "Purple heron", "category": "wildlife", "surfaces": ["web", "print"], "title": "Purple Heron", "tagline": "Wildlife" },
    { "id": "Peacock", "thumb": "images/thumbnails/portfolio/Peacock.jpg", "full": "images/portfolio/Peacock.jpg", "alt": "Peacock", "category": "wildlife", "surfaces": ["web", "print", "campaign"], "title": "Regal Peacock", "tagline": "Wildlife" },
    { "id": "portrait-1", "thumb": "images/thumbnails/portfolio/portrait-1.jpg", "full": "images/portfolio/portrait-1.jpg", "alt": "Portrait in yellow saree", "category": "portrait", "surfaces": ["web", "campaign"], "title": "Personal Story", "tagline": "Portrait" },
    { "id": "portrait-8", "thumb": "images/thumbnails/portfolio/portrait-8.jpg", "full": "images/portfolio/portrait-8.jpg", "alt": "Smiling portrait", "category": "portrait", "surfaces": ["web", "campaign"], "title": "Laughing Frame", "tagline": "Portrait" },
    { "id": "Spotted_owl", "thumb": "images/thumbnails/portfolio/Spotted_owl.jpg", "full": "images/portfolio/Spotted_owl.jpg", "alt": "Spotted owl", "category": "wildlife", "surfaces": ["web", "print"], "title": "Spotted Owl", "tagline": "Wildlife" },
    { "id": "Pine Forest", "thumb": "images/thumbnails/portfolio/Pine Forest.jpg", "full": "images/portfolio/Pine Forest.jpg", "alt": "Pine forest", "category": "scenic", "surfaces": ["web", "print"], "title": "Pine Forest", "tagline": "Scenic" },
    { "id": "Black Winged Stilt", "thumb": "images/thumbnails/portfolio/Black Winged Stilt.jpg", "full": "images/portfolio/Black Winged Stilt.jpg", "alt": "Black winged stilt", "category": "wildlife", "surfaces": ["web", "print"], "title": "Black Winged Stilt", "tagline": "Wildlife" },
    { "id": "Blue Dragon", "thumb": "images/thumbnails/portfolio/Blue Dragon.JPG", "full": "images/portfolio/Blue Dragon.JPG", "alt": "Blue dragon light texture", "category": "texture", "surfaces": ["web", "print"], "title": "Blue Dragon", "tagline": "Texture" },
    { "id": "wave_splashing", "thumb": "images/thumbnails/portfolio/wave_splashing.jpg", "full": "images/portfolio/wave_splashing.jpg", "alt": "Wave splash", "category": "scenic", "surfaces": ["web", "print"], "title": "Wave Impact", "tagline": "Scenic" }
  ]
};

const PORTFOLIO_SOURCE = "data/portfolio.json";
let portfolioCache = null;

async function loadPortfolio() {
  if (typeof window !== "undefined" && window.PORTFOLIO_DATA) {
    portfolioCache = window.PORTFOLIO_DATA;
    return portfolioCache;
  }
  if (portfolioCache) return portfolioCache;
  try {
    const res = await fetch(PORTFOLIO_SOURCE, { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load portfolio");
    portfolioCache = await res.json();
  } catch (error) {
    console.warn("Portfolio data could not be loaded; using inline fallback.", error);
    portfolioCache = PORTFOLIO_DATA;
  }
  return portfolioCache;
}

async function initPortfolioData() {
  const data = await loadPortfolio();
  if (!data.items || !data.items.length) return;

  const selectedContainer = document.querySelector("[data-selected-work]");
  if (selectedContainer && !selectedContainer.querySelector("[data-lightbox-src]")) {
    const featured = data.items
      .filter((item) => item.featured)
      .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
    selectedContainer.insertAdjacentHTML(
      "afterbegin",
      featured.map((item, index) => renderSelectedTile(item, index)).join("")
    );
  }

  const galleryContainer = document.querySelector("[data-portfolio-grid]");
  if (galleryContainer && !galleryContainer.children.length) {
    galleryContainer.innerHTML = data.items
      .map((item) => renderGalleryTile(item))
      .join("");
    initWorkFilters();
  }
}

function renderSelectedTile(item, index) {
  const sizeClass = index === 0 ? "work-tile large" : "work-tile";
  return `
    <button class="${sizeClass}" type="button"
      data-lightbox-src="${item.full}"
      data-lightbox-id="${item.id}"
      data-caption="${item.tagline} / ${item.title}"
      data-reveal>
      <img src="${item.thumb}" alt="${item.alt}" loading="lazy" decoding="async">
      <span class="work-caption">
        <span>${item.tagline}</span>
        <span>${item.title}</span>
      </span>
    </button>
  `;
}

function renderGalleryTile(item) {
  return `
    <button class="work-tile" data-category="${item.category}" type="button"
      data-lightbox-src="${item.full}"
      data-lightbox-id="${item.id}"
      data-caption="${item.tagline} / ${item.title}"
      data-reveal>
      <img src="${item.thumb}" alt="${item.alt}" loading="lazy" decoding="async">
      <span class="work-caption">
        <span>${item.tagline}</span>
        <span>${item.title}</span>
      </span>
    </button>
  `;
}

function initLoader() {
  const loader = document.getElementById("loading");
  if (!loader) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hide = () => loader.classList.add("is-hidden");

  if (reduceMotion) {
    hide();
    return;
  }

  window.addEventListener("load", () => window.setTimeout(hide, 350));
  window.setTimeout(hide, 1200);
}

function initMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!toggle || !menu) return;

  const openMenu = () => {
    toggle.classList.add("is-open");
    menu.classList.add("is-open");
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-label", "Close menu");
    trapFocus(menu);
  };

  const closeMenu = () => {
    toggle.classList.remove("is-open");
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-label", "Open menu");
    releaseFocusTrap();
    if (document.activeElement && menu.contains(document.activeElement)) {
      toggle.focus();
    }
  };

  toggle.addEventListener("click", () => {
    if (menu.classList.contains("is-open")) closeMenu();
    else openMenu();
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  menu.querySelector("[data-menu-close]")?.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
  });
}

let focusTrapHandler = null;
function trapFocus(container) {
  releaseFocusTrap();
  const selector = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusables = () => Array.from(container.querySelectorAll(selector)).filter((el) => el.offsetParent !== null);
  focusables()[0]?.focus();
  focusTrapHandler = (event) => {
    if (event.key !== "Tab") return;
    const list = focusables();
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  document.addEventListener("keydown", focusTrapHandler);
}

function releaseFocusTrap() {
  if (focusTrapHandler) {
    document.removeEventListener("keydown", focusTrapHandler);
    focusTrapHandler = null;
  }
}

function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  items.forEach((item) => observer.observe(item));
}

function initCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

function initWorkFilters() {
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const targetSelector = group.dataset.filterGroup;
    const items = document.querySelectorAll(targetSelector);
    if (!items.length) return;

    const apply = (value) => {
      group.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("is-active"));
      const target = group.querySelector(`[data-filter="${value}"]`);
      if (target) target.classList.add("is-active");
      else {
        const fallback = group.querySelector('[data-filter="all"]');
        if (fallback) fallback.classList.add("is-active");
        value = "all";
      }
      items.forEach((item) => {
        const show = value === "all" || item.dataset.category === value;
        item.classList.toggle("is-hidden", !show);
      });
    };

    group.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => apply(button.dataset.filter));
    });

    document.querySelectorAll("[data-jump-filter]").forEach((link) => {
      link.addEventListener("click", () => apply(link.dataset.jumpFilter));
    });
  });
}

function initLightbox() {
  const lightbox = document.querySelector("[data-lightbox]");
  if (!lightbox) return;

  const image = lightbox.querySelector("[data-lightbox-image]");
  const caption = lightbox.querySelector("[data-lightbox-caption]");
  const close = lightbox.querySelector("[data-lightbox-close]");

  const triggers = () => Array.from(document.querySelectorAll("[data-lightbox-src]"));
  let currentIndex = -1;

  const showAt = (index) => {
    const list = triggers();
    if (!list.length) return;
    if (index < 0) index = list.length - 1;
    if (index >= list.length) index = 0;
    currentIndex = index;
    const trigger = list[index];
    image.src = trigger.dataset.lightboxSrc;
    image.alt = trigger.querySelector("img")?.alt || "Portfolio image";
    caption.textContent = trigger.dataset.caption || "";
    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    currentIndex = -1;
    window.setTimeout(() => image.removeAttribute("src"), 200);
  };

  close?.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-lightbox-src]");
    if (!trigger) return;
    event.preventDefault();
    const list = triggers();
    const index = list.indexOf(trigger);
    showAt(index >= 0 ? index : 0);
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    else if (event.key === "ArrowRight") showAt(currentIndex + 1);
    else if (event.key === "ArrowLeft") showAt(currentIndex - 1);
  });
}

function initMoodDial() {
  const stage = document.querySelector("[data-mood-stage]");
  if (!stage) return;

  const image = stage.querySelector("[data-mood-image]");
  const title = stage.querySelector("[data-mood-title]");
  const note = stage.querySelector("[data-mood-note]");
  const buttons = document.querySelectorAll("[data-mood]");

  const moods = {
    motion: {
      title: "Motion",
      note: "Birds, roads, wind, timing. Built for kinetic stories.",
      src: "images/thumbnails/portfolio/eagle_fly.jpg",
      accent: "#c7ff5f"
    },
    intimate: {
      title: "Intimate",
      note: "Portraits that feel observed, not manufactured.",
      src: "images/thumbnails/portfolio/portrait-8.jpg",
      accent: "#ff6b4a"
    },
    horizon: {
      title: "Horizon",
      note: "Travel frames with scale, weather, and destination memory.",
      src: "images/thumbnails/portfolio/pamban_sunset.jpg",
      accent: "#55c7ff"
    },
    texture: {
      title: "Texture",
      note: "Close details for campaigns, essays, covers, and pauses.",
      src: "images/thumbnails/portfolio/Flower with sun.jpg",
      accent: "#ffd166"
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const mood = moods[button.dataset.mood];
      if (!mood) return;

      buttons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      stage.classList.add("is-switching");
      stage.style.setProperty("--mood-accent", mood.accent);

      window.setTimeout(() => {
        image.src = mood.src;
        title.textContent = mood.title;
        note.textContent = mood.note;
        stage.classList.remove("is-switching");
      }, 160);
    });
  });
}

function initBriefBuilder() {
  const form = document.querySelector("[data-brief-builder]");
  if (!form) return;

  const output = document.querySelector("[data-brief-output]");
  const messageField = document.querySelector("[data-brief-message]");
  const copyButton = document.querySelector("[data-brief-copy]");
  const build = () => {
    const checked = Array.from(form.querySelectorAll("input:checked")).map((input) => input.value);
    const summary = checked.length ? `Brief signal: ${checked.join(" + ")}.` : "";
    if (output) {
      output.textContent = checked.length
        ? `Brief signal: ${checked.join(" + ")}.`
        : "Brief signal: choose what matters most.";
    }
    if (messageField) {
      const existing = messageField.value.trim();
      const prefix = summary ? `${summary} ` : "";
      const stripped = existing.replace(/^Brief signal:.*?\.\s*/, "");
      messageField.value = prefix + stripped;
    }
  };

  form.addEventListener("change", build);
  build();

  copyButton?.addEventListener("click", async () => {
    const text = output?.textContent || "";
    try {
      await navigator.clipboard.writeText(text);
      copyButton.classList.add("is-copied");
      window.setTimeout(() => copyButton.classList.remove("is-copied"), 1400);
    } catch {
      showToast("Copy failed. Select the text manually.", "error");
    }
  });
}

function initContactForms() {
  const forms = document.querySelectorAll('form[action*="api.web3forms.com/submit"]');
  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector("button[type='submit']");
      const original = button?.innerHTML;

      if (button) {
        button.disabled = true;
        button.textContent = "Sending...";
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(form)))
        });
        const payload = await response.json();
        showToast(payload.success ? "Brief sent. I will reply soon." : "Could not send. Please email codeaayu@gmail.com.", payload.success ? "success" : "error");
        if (payload.success) form.reset();
      } catch {
        showToast("Could not send. Please email codeaayu@gmail.com.", "error");
      } finally {
        if (button) {
          button.disabled = false;
          button.innerHTML = original;
        }
      }
    });
  });
}

function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.classList.add("is-visible"), 20);
  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => toast.remove(), 300);
  }, 3600);
}

function initScrollProgress() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.setProperty("--scroll-progress", Math.min(Math.max(ratio, 0), 1).toString());
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initCreativeCursor() {
  const canUsePointer = window.matchMedia("(pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canUsePointer || reduceMotion) return;

  const halo = document.createElement("div");
  halo.className = "cursor-halo";
  halo.setAttribute("aria-hidden", "true");
  document.body.appendChild(halo);
  document.body.classList.add("has-creative-cursor");

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  const render = () => {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    halo.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    window.requestAnimationFrame(render);
  };

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    halo.classList.add("is-visible");
  }, { passive: true });

  document.addEventListener("pointerover", (event) => {
    if (event.target.closest("a, button, input, textarea, select, [data-lightbox-src]")) {
      halo.classList.add("is-active");
    }
  });

  document.addEventListener("pointerout", (event) => {
    if (event.target.closest("a, button, input, textarea, select, [data-lightbox-src]")) {
      halo.classList.remove("is-active");
    }
  });

  window.addEventListener("pointerleave", () => halo.classList.remove("is-visible"));
  render();
}

function initInteractiveSurfaces() {
  const canUsePointer = window.matchMedia("(pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canUsePointer || reduceMotion) return;

  const selector = [
    ".hero-console",
    ".profile-card",
    ".metric",
    ".about-copy-panel",
    ".about-media-panel",
    ".about-principles article",
    ".about-stats div",
    ".about-hero-card",
    ".about-page-card",
    ".about-image-lab",
    ".about-metrics div",
    ".about-method-card",
    ".about-cta",
    ".process-step",
    ".stack-card",
    ".work-tile",
    ".mood-stage",
    ".contact-console",
    ".contact-card",
    ".article"
  ].join(",");

  document.querySelectorAll(selector).forEach((surface) => {
    surface.classList.add("interactive-surface");
    surface.addEventListener("pointermove", (event) => {
      const rect = surface.getBoundingClientRect();
      surface.style.setProperty("--surface-x", `${event.clientX - rect.left}px`);
      surface.style.setProperty("--surface-y", `${event.clientY - rect.top}px`);
    }, { passive: true });
  });
}

function initClickRipples() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const selector = [
    ".button",
    ".nav-cta",
    ".nav-link",
    ".menu-toggle",
    ".filter-bar button",
    ".mood-controls button",
    ".work-tile",
    ".lightbox-close"
  ].join(",");

  document.addEventListener("click", (event) => {
    const target = event.target.closest(selector);
    if (!target || target.disabled) return;

    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "click-ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height) * 1.25}px`;
    target.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 650);
  });
}
