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
});

function initLoader() {
  const loader = document.getElementById("loading");
  if (!loader) return;

  window.addEventListener("load", () => {
    window.setTimeout(() => loader.classList.add("is-hidden"), 350);
  });

  window.setTimeout(() => loader.classList.add("is-hidden"), 1200);
}

function initMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!toggle || !menu) return;

  const closeMenu = () => {
    toggle.classList.remove("is-open");
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("is-open");
    menu.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", menu.classList.contains("is-open"));
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

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

    group.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.filter;
        group.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");

        items.forEach((item) => {
          const show = value === "all" || item.dataset.category === value;
          item.classList.toggle("is-hidden", !show);
        });
      });
    });
  });
}

function initLightbox() {
  const lightbox = document.querySelector("[data-lightbox]");
  if (!lightbox) return;

  const image = lightbox.querySelector("[data-lightbox-image]");
  const caption = lightbox.querySelector("[data-lightbox-caption]");
  const close = lightbox.querySelector("[data-lightbox-close]");
  const galleryItems = Array.from(document.querySelectorAll("[data-lightbox-src]"));

  const open = (item) => {
    image.src = item.dataset.lightboxSrc;
    image.alt = item.querySelector("img")?.alt || "Portfolio image";
    caption.textContent = item.dataset.caption || item.querySelector("h3")?.textContent || "";
    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    image.removeAttribute("src");
  };

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => open(item));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(item);
      }
    });
  });

  close?.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
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
  const update = () => {
    const checked = Array.from(form.querySelectorAll("input:checked")).map((input) => input.value);
    output.textContent = checked.length
      ? `Brief signal: ${checked.join(" + ")}.`
      : "Brief signal: choose what matters most.";
  };

  form.addEventListener("change", update);
  update();
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
