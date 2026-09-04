(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  root.classList.add("has-js");
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let prefersReducedMotion = motionPreference.matches;
  let motionPaused = false;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  let stopCursorAnimation = () => {};
  let startCursorAnimation = () => {};
  let clearPointerMotion = () => {};

  const motionDisabled = () => prefersReducedMotion || motionPaused;
  root.classList.toggle("motion-reduced", prefersReducedMotion);
  root.dataset.motionReduced = String(prefersReducedMotion);
  root.dataset.motionPaused = "false";

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (start, end, progress) => start + (end - start) * progress;
  const smoothstep = (start, end, value) => {
    const x = clamp((value - start) / (end - start));
    return x * x * (3 - 2 * x);
  };

  const loader = document.querySelector("[data-loader]");
  const dismissLoader = () => loader?.classList.add("is-gone");
  window.addEventListener("load", () => window.setTimeout(dismissLoader, prefersReducedMotion ? 0 : 260), { once: true });
  window.setTimeout(dismissLoader, 1800);

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const header = document.querySelector("[data-header]");
  const scrollMeter = document.querySelector("[data-scroll-meter]");
  const stackStory = document.querySelector("[data-stack-story]");
  const photoStack = document.querySelector("[data-photo-stack]");
  const stackCards = [...document.querySelectorAll("[data-stack-card]")];
  const stackCenter = document.querySelector("[data-stack-center]");
  const stackProgress = document.querySelector("[data-stack-progress]");
  const moonRoom = document.querySelector("[data-moon-room]");
  const moonStage = document.querySelector("[data-moon-stage]");
  const nightWindow = document.querySelector(".night-window");
  const kineticLines = [...document.querySelectorAll("[data-kinetic-line]")];
  const courses = [...document.querySelectorAll("[data-course]")];
  let activeCourse;
  let ticking = false;

  const sectionProgress = (section) => {
    if (!section) return 0;
    const rect = section.getBoundingClientRect();
    const distance = Math.max(1, section.offsetHeight - window.innerHeight);
    return clamp(-rect.top / distance);
  };

  const updateStack = (forcedProgress = null) => {
    if (motionDisabled() || !stackStory || !photoStack || !stackCards.length) return;
    const progress = forcedProgress ?? sectionProgress(stackStory);
    const fan = smoothstep(0.07, 0.72, progress);
    const settle = smoothstep(0.72, 1, progress);
    const width = photoStack.clientWidth;
    const height = photoStack.clientHeight;

    stackCards.forEach((card, index) => {
      const finalX = Number(card.dataset.x || 0) * width / 100;
      const finalY = Number(card.dataset.y || 0) * height / 100;
      const finalZ = Number(card.dataset.z || 0);
      const finalRotation = Number(card.dataset.r || 0);
      const startRotation = (index - (stackCards.length - 1) / 2) * 1.3;
      const breathing = Math.sin(progress * Math.PI + index * 0.7) * settle * 5;

      card.style.setProperty("--move-x", `${lerp(0, finalX, fan).toFixed(2)}px`);
      card.style.setProperty("--move-y", `${(lerp(0, finalY, fan) + breathing).toFixed(2)}px`);
      card.style.setProperty("--move-z", `${lerp(-90 - index * 7, finalZ, fan).toFixed(2)}px`);
      card.style.setProperty("--rotation", `${lerp(startRotation, finalRotation, fan).toFixed(2)}deg`);
      card.style.setProperty("--card-scale", lerp(0.74, 1, fan).toFixed(3));
    });

    if (stackCenter) {
      stackCenter.style.setProperty("--center-y", `${lerp(18, -12, smoothstep(0.15, 0.85, progress)).toFixed(2)}px`);
      stackCenter.style.setProperty("--center-turn", `${(Math.sin(progress * Math.PI) * 4.5).toFixed(2)}deg`);
      stackCenter.style.setProperty("--center-scale", lerp(0.92, 1.04, smoothstep(0.05, 0.68, progress)).toFixed(3));
    }

    if (stackProgress) stackProgress.style.transform = `scaleX(${progress.toFixed(4)})`;
  };

  const updateMoon = (forcedProgress = null) => {
    if (motionDisabled() || !moonRoom || !moonStage) return;
    const progress = forcedProgress ?? sectionProgress(moonRoom);
    const reveal = smoothstep(0.08, 0.58, progress);
    const orbit = smoothstep(0.25, 0.9, progress);
    const studyOpacity = clamp((progress - 0.18) * 1.85);

    moonStage.style.setProperty("--main-moon-scale", lerp(0.52, 1.14, reveal).toFixed(3));
    moonStage.style.setProperty("--main-moon-rotate", `${lerp(-7, 3, reveal).toFixed(2)}deg`);
    moonStage.style.setProperty("--halo-scale", lerp(0.72, 1.12, reveal).toFixed(3));
    moonStage.style.setProperty("--halo-rotate", `${lerp(0, 60, orbit).toFixed(2)}deg`);
    moonStage.style.setProperty("--study-opacity", studyOpacity.toFixed(3));
    moonStage.style.setProperty("--study-one-x", `${lerp(0, -0.11 * window.innerWidth, orbit).toFixed(2)}px`);
    moonStage.style.setProperty("--study-one-y", `${lerp(0, -0.03 * window.innerHeight, orbit).toFixed(2)}px`);
    moonStage.style.setProperty("--study-one-r", `${lerp(-5, -11, orbit).toFixed(2)}deg`);
    moonStage.style.setProperty("--study-two-x", `${lerp(0, 0.12 * window.innerWidth, orbit).toFixed(2)}px`);
    moonStage.style.setProperty("--study-two-y", `${lerp(0, -0.08 * window.innerHeight, orbit).toFixed(2)}px`);
    moonStage.style.setProperty("--study-two-r", `${lerp(5, 11, orbit).toFixed(2)}deg`);
    moonStage.style.setProperty("--study-three-x", `${lerp(0, 0.09 * window.innerWidth, orbit).toFixed(2)}px`);
    moonStage.style.setProperty("--study-three-y", `${lerp(0, 0.07 * window.innerHeight, orbit).toFixed(2)}px`);
    moonStage.style.setProperty("--study-three-r", `${lerp(-3, 6, orbit).toFixed(2)}deg`);
  };

  const updateKineticType = () => {
    if (!kineticLines.length || motionDisabled()) return;
    const heading = kineticLines[0]?.closest(".kinetic-heading");
    if (!heading) return;
    const rect = heading.getBoundingClientRect();
    const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
    const offset = (progress - 0.5) * Math.min(window.innerWidth * 0.1, 110);
    kineticLines[0].style.transform = `translate3d(${offset.toFixed(1)}px, 0, 0)`;
    if (kineticLines[1]) kineticLines[1].style.transform = `translate3d(${(-offset).toFixed(1)}px, 0, 0)`;
  };

  const updateNightWindow = () => {
    if (!nightWindow || motionDisabled()) return;
    const rect = nightWindow.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
    nightWindow.style.setProperty("--night-shift", `${lerp(-28, 28, progress).toFixed(1)}px`);
  };

  const setActiveCourse = (selected) => {
    if (activeCourse === selected) return;
    activeCourse = selected;
    courses.forEach((course) => {
      const isSelected = course === selected;
      course.classList.toggle("is-active", isSelected);
      course.querySelector("button")?.setAttribute("aria-expanded", String(isSelected));
      course.querySelector(".course-visuals")?.setAttribute("aria-hidden", String(!isSelected));
    });
  };

  const updateCoursesOnScroll = () => {
    if (!courses.length) return;
    const readingLine = window.innerHeight * 0.58;
    const selected = courses.find((course) => {
      const rect = course.getBoundingClientRect();
      return rect.top <= readingLine && rect.bottom > readingLine;
    }) || null;
    setActiveCourse(selected);
  };

  const updatePage = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    header?.classList.toggle("is-scrolled", scrollTop > 24);
    if (scrollMeter) {
      if (motionDisabled()) scrollMeter.style.removeProperty("transform");
      else scrollMeter.style.transform = `scaleY(${clamp(scrollTop / total).toFixed(4)})`;
    }
    if (!motionDisabled()) {
      updateStack();
      updateMoon();
    }
    updateKineticType();
    updateNightWindow();
    updateCoursesOnScroll();
    ticking = false;
  };

  const resetMotionTransforms = () => {
    stackCards.forEach((card) => {
      ["--move-x", "--move-y", "--move-z", "--rotation", "--card-scale"].forEach((property) => {
        card.style.removeProperty(property);
      });
    });
    ["--center-y", "--center-turn", "--center-scale"].forEach((property) => {
      stackCenter?.style.removeProperty(property);
    });
    stackProgress?.style.removeProperty("transform");
    [
      "--main-moon-scale", "--main-moon-rotate", "--halo-scale", "--halo-rotate", "--study-opacity",
      "--study-one-x", "--study-one-y", "--study-one-r", "--study-two-x", "--study-two-y", "--study-two-r",
      "--study-three-x", "--study-three-y", "--study-three-r"
    ].forEach((property) => moonStage?.style.removeProperty(property));
    kineticLines.forEach((line) => line.style.removeProperty("transform"));
    nightWindow?.style.removeProperty("--night-shift");
    document.querySelector("[data-hero-visual]")?.style.removeProperty("transform");
    document.querySelectorAll(".magnetic").forEach((element) => element.style.removeProperty("transform"));
  };

  const requestPageUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updatePage);
  };

  window.addEventListener("scroll", requestPageUpdate, { passive: true });
  window.addEventListener("resize", requestPageUpdate, { passive: true });
  updatePage();

  const reveals = [...document.querySelectorAll(".reveal")];
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    reveals.forEach((element) => revealObserver.observe(element));
  }

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const menuClose = document.querySelector("[data-menu-close]");
  let menuReturnFocus = null;
  let menuFocusTimer = 0;

  const getMenuFocusable = () => mobileMenu ? [...mobileMenu.querySelectorAll("a, button")].filter((item) => !item.hasAttribute("disabled")) : [];

  const openMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    menuReturnFocus = document.activeElement;
    body.classList.add("menu-open");
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
    window.clearTimeout(menuFocusTimer);
    menuFocusTimer = window.setTimeout(() => {
      if (mobileMenu.classList.contains("is-open")) getMenuFocusable()[0]?.focus();
    }, motionDisabled() ? 0 : 150);
  };

  const closeMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    window.clearTimeout(menuFocusTimer);
    body.classList.remove("menu-open");
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    if (menuReturnFocus instanceof HTMLElement && menuReturnFocus.isConnected && !menuReturnFocus.disabled) menuReturnFocus.focus();
    menuReturnFocus = null;
  };

  menuToggle?.addEventListener("click", () => mobileMenu?.classList.contains("is-open") ? closeMenu() : openMenu());
  menuClose?.addEventListener("click", closeMenu);
  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  mobileMenu?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = getMenuFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  courses.forEach((course) => {
    const button = course.querySelector("button");
    if (!button) return;
    button.addEventListener("click", () => {
      setActiveCourse(course);
      const top = course.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  const filmstrip = document.querySelector("[data-filmstrip]");
  if (filmstrip) {
    let dragging = false;
    let axisLocked = false;
    let gestureRejected = false;
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let startScroll = 0;
    let moved = false;

    filmstrip.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging = event.pointerType === "mouse";
      axisLocked = event.pointerType === "mouse";
      gestureRejected = false;
      pointerId = event.pointerId;
      moved = false;
      startX = event.clientX;
      startY = event.clientY;
      startScroll = filmstrip.scrollLeft;
      if (dragging) {
        filmstrip.classList.add("is-dragging");
        filmstrip.setPointerCapture(event.pointerId);
      }
    });

    filmstrip.addEventListener("pointermove", (event) => {
      if (pointerId !== event.pointerId || gestureRejected) return;
      const delta = event.clientX - startX;
      const crossDelta = event.clientY - startY;
      if (!axisLocked) {
        if (Math.max(Math.abs(delta), Math.abs(crossDelta)) < 6) return;
        if (Math.abs(crossDelta) > Math.abs(delta)) {
          gestureRejected = true;
          return;
        }
        axisLocked = true;
        dragging = true;
        filmstrip.classList.add("is-dragging");
        filmstrip.setPointerCapture(event.pointerId);
      }
      if (!dragging) return;
      if (Math.abs(delta) > 4) moved = true;
      if (event.pointerType !== "mouse") event.preventDefault();
      filmstrip.scrollLeft = startScroll - delta;
    });

    const endDrag = (event) => {
      if (pointerId !== event.pointerId) return;
      dragging = false;
      axisLocked = false;
      gestureRejected = false;
      pointerId = null;
      filmstrip.classList.remove("is-dragging");
      if (filmstrip.hasPointerCapture(event.pointerId)) filmstrip.releasePointerCapture(event.pointerId);
    };

    filmstrip.addEventListener("pointerup", endDrag);
    filmstrip.addEventListener("pointercancel", endDrag);
    filmstrip.addEventListener("click", (event) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    }, true);
  }

  const lightbox = document.querySelector("[data-lightbox-dialog]");
  const lightboxImage = document.querySelector("[data-lightbox-image]");
  const lightboxCaption = document.querySelector("[data-lightbox-caption]");
  const lightboxClose = document.querySelector("[data-lightbox-close]");
  let lightboxReturnFocus = null;

  const restoreLightboxFocus = () => {
    if (lightboxReturnFocus instanceof HTMLElement && lightboxReturnFocus.isConnected && !lightboxReturnFocus.disabled) {
      lightboxReturnFocus.focus();
    }
    lightboxReturnFocus = null;
  };

  const closeLightbox = () => {
    if (!lightbox?.open) return;
    lightbox.close();
  };

  const openLightbox = (trigger) => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    lightboxReturnFocus = trigger;
    lightboxImage.src = trigger.dataset.lightbox || "";
    lightboxImage.alt = trigger.querySelector("img")?.alt || "Expanded photograph";
    lightboxCaption.textContent = trigger.dataset.caption || "CodeAayu Creatives";
    lightbox.showModal();
    lightboxClose?.focus();
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target instanceof Element ? event.target.closest("[data-lightbox]") : null;
    if (!trigger) return;
    openLightbox(trigger);
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeLightbox();
  });
  lightbox?.addEventListener("close", restoreLightboxFocus);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  const galleryGrid = document.querySelector("[data-gallery-grid]");
  const galleryMore = document.querySelector("[data-gallery-more]");
  const galleryStatus = document.querySelector("[data-gallery-status]");
  const galleryTotal = document.querySelector("[data-gallery-total]");
  const galleryFilters = [...document.querySelectorAll("[data-gallery-filter]")];

  if (galleryGrid && galleryMore && galleryStatus) {
    let galleryItems = [];
    let filteredItems = [];
    let displayedItems = 0;
    const batchSize = window.innerWidth <= 620 ? 18 : window.innerWidth <= 900 ? 28 : 36;

    const createGalleryItem = (item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "archive-item";
      button.dataset.lightbox = item.full;
      button.dataset.caption = `${item.title} / ${item.source}`;
      button.dataset.category = item.category;
      button.setAttribute("aria-label", `Open ${item.title}`);

      const image = document.createElement("img");
      image.alt = item.alt;
      image.width = item.width;
      image.height = item.height;
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("load", () => button.classList.add("is-loaded"), { once: true });
      image.src = item.thumb;

      const caption = document.createElement("span");
      caption.className = "archive-caption";
      const captionText = document.createElement("span");
      const title = document.createElement("strong");
      const source = document.createElement("small");
      const openMark = document.createElement("i");
      title.textContent = item.title;
      source.textContent = item.source;
      openMark.textContent = "↗";
      openMark.setAttribute("aria-hidden", "true");
      captionText.append(title, source);
      caption.append(captionText, openMark);
      button.append(image, caption);

      if (image.complete) window.requestAnimationFrame(() => button.classList.add("is-loaded"));
      return button;
    };

    const updateGalleryStatus = () => {
      const total = filteredItems.length;
      galleryStatus.textContent = `Showing ${Math.min(displayedItems, total)} of ${total} frames`;
      galleryMore.hidden = displayedItems >= total;
    };

    const renderGalleryBatch = () => {
      if (displayedItems >= filteredItems.length) {
        updateGalleryStatus();
        return;
      }
      const fragment = document.createDocumentFragment();
      filteredItems.slice(displayedItems, displayedItems + batchSize).forEach((item) => {
        fragment.append(createGalleryItem(item));
      });
      displayedItems += batchSize;
      galleryGrid.append(fragment);
      updateGalleryStatus();
    };

    const applyGalleryFilter = (category) => {
      filteredItems = category === "all" ? galleryItems : galleryItems.filter((item) => item.category === category);
      displayedItems = 0;
      galleryGrid.replaceChildren();
      galleryFilters.forEach((button) => {
        const selected = button.dataset.galleryFilter === category;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      renderGalleryBatch();
    };

    galleryFilters.forEach((button) => {
      button.addEventListener("click", () => applyGalleryFilter(button.dataset.galleryFilter || "all"));
    });
    galleryMore.addEventListener("click", renderGalleryBatch);

    if ("IntersectionObserver" in window) {
      const moreObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) renderGalleryBatch();
      }, { rootMargin: "600px 0px" });
      moreObserver.observe(galleryMore);
    }

    fetch("data/gallery.json?v=20260710-178")
      .then((response) => {
        if (!response.ok) throw new Error("Gallery manifest could not be loaded");
        return response.json();
      })
      .then((manifest) => {
        galleryItems = Array.isArray(manifest.items) ? manifest.items : [];
        if (galleryTotal) galleryTotal.textContent = String(manifest.count || galleryItems.length);
        document.querySelectorAll("[data-filter-count]").forEach((element) => {
          const category = element.dataset.filterCount;
          const count = category === "all" ? galleryItems.length : manifest.counts?.[category] || 0;
          element.textContent = String(count);
        });
        applyGalleryFilter("all");
      })
      .catch(() => {
        galleryStatus.textContent = "The archive could not load. Please refresh the page.";
        galleryMore.hidden = true;
      });
  }

  const briefForm = document.querySelector("[data-brief-form]");
  const formStatus = document.querySelector("[data-form-status]");
  const submitLabel = document.querySelector("[data-submit-label]");
  document.querySelectorAll(".botcheck, [name='botcheck']").forEach((honeypot) => {
    honeypot.setAttribute("aria-hidden", "true");
    honeypot.setAttribute("tabindex", "-1");
  });

  briefForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = briefForm.querySelector("button[type='submit']");
    if (submitButton) submitButton.disabled = true;
    if (submitLabel) submitLabel.textContent = "Sending your inquiry…";
    if (formStatus) formStatus.textContent = "";

    try {
      const response = await fetch(briefForm.action, {
        method: "POST",
        body: new FormData(briefForm),
        headers: { Accept: "application/json" }
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error("Submission failed");
      briefForm.reset();
      if (formStatus) formStatus.textContent = "Inquiry received. I’ll be in touch soon.";
    } catch (error) {
      if (formStatus) formStatus.innerHTML = "The form had a moment. Please email <a href=\"mailto:codeaayu@gmail.com\">codeaayu@gmail.com</a>.";
    } finally {
      if (submitButton) submitButton.disabled = false;
      if (submitLabel) submitLabel.textContent = "Send an inquiry";
    }
  });

  if (finePointer) {
    const cursor = document.querySelector("[data-cursor]");
    let cursorX = -100;
    let cursorY = -100;
    let renderedX = -100;
    let renderedY = -100;
    let cursorFrame = 0;

    const renderCursor = () => {
      if (motionDisabled() || document.hidden) {
        cursorFrame = 0;
        return;
      }
      renderedX = lerp(renderedX, cursorX, 0.2);
      renderedY = lerp(renderedY, cursorY, 0.2);
      cursor?.style.setProperty("--cursor-x", `${renderedX.toFixed(1)}px`);
      cursor?.style.setProperty("--cursor-y", `${renderedY.toFixed(1)}px`);
      cursorFrame = window.requestAnimationFrame(renderCursor);
    };

    startCursorAnimation = () => {
      if (motionDisabled() || document.hidden || cursorFrame) return;
      cursorFrame = window.requestAnimationFrame(renderCursor);
    };
    stopCursorAnimation = () => {
      if (cursorFrame) window.cancelAnimationFrame(cursorFrame);
      cursorFrame = 0;
      cursor?.classList.remove("is-visible", "is-active");
    };
    clearPointerMotion = () => {
      cursor?.style.removeProperty("--cursor-x");
      cursor?.style.removeProperty("--cursor-y");
      document.querySelector("[data-hero-visual]")?.style.removeProperty("transform");
      document.querySelectorAll(".magnetic").forEach((element) => element.style.removeProperty("transform"));
    };

    document.addEventListener("pointermove", (event) => {
      if (motionDisabled()) return;
      cursorX = event.clientX;
      cursorY = event.clientY;
      cursor?.classList.add("is-visible");
    }, { passive: true });
    document.addEventListener("pointerleave", () => cursor?.classList.remove("is-visible"));
    document.querySelectorAll("a, button, input, select, textarea").forEach((target) => {
      target.addEventListener("pointerenter", () => {
        if (!motionDisabled()) cursor?.classList.add("is-active");
      });
      target.addEventListener("pointerleave", () => cursor?.classList.remove("is-active"));
    });
    startCursorAnimation();

    const heroVisual = document.querySelector("[data-hero-visual]");
    heroVisual?.addEventListener("pointermove", (event) => {
      if (motionDisabled()) return;
      const rect = heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroVisual.style.transform = `rotateY(${(x * 4).toFixed(2)}deg) rotateX(${(-y * 3).toFixed(2)}deg)`;
    });
    heroVisual?.addEventListener("pointerleave", () => {
      heroVisual.style.removeProperty("transform");
    });

    document.querySelectorAll(".magnetic").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        if (motionDisabled()) return;
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate3d(${(x * 0.08).toFixed(1)}px, ${(y * 0.12).toFixed(1)}px, 0)`;
      });
      element.addEventListener("pointerleave", () => {
        element.style.removeProperty("transform");
      });
    });

    window.addEventListener("pagehide", stopCursorAnimation, { once: true });
  }

  const updateMotionControls = () => {
    document.querySelectorAll("[data-motion-toggle]").forEach((control) => {
      control.setAttribute("aria-pressed", String(motionPaused));
      control.textContent = motionPaused ? "Resume motion" : "Pause motion";
    });
  };

  const applyMotionState = () => {
    root.classList.toggle("motion-reduced", prefersReducedMotion);
    root.classList.toggle("motion-paused", motionPaused);
    root.dataset.motionReduced = String(prefersReducedMotion);
    root.dataset.motionPaused = String(motionPaused);
    if (motionDisabled()) {
      stopCursorAnimation();
      clearPointerMotion();
      resetMotionTransforms();
      updatePage();
    } else {
      startCursorAnimation();
      requestPageUpdate();
    }
    updateMotionControls();
    document.dispatchEvent(new CustomEvent("codeaayu:motionchange", {
      detail: { prefersReducedMotion, paused: motionPaused, disabled: motionDisabled() }
    }));
  };

  const setMotionPaused = (paused) => {
    motionPaused = Boolean(paused);
    applyMotionState();
  };

  window.CodeAayuMotion = {
    pause: () => setMotionPaused(true),
    resume: () => setMotionPaused(false),
    toggle: () => setMotionPaused(!motionPaused),
    get isPaused() { return motionPaused; },
    get prefersReducedMotion() { return prefersReducedMotion; },
    get isDisabled() { return motionDisabled(); }
  };

  document.querySelectorAll("[data-motion-toggle]").forEach((control) => {
    control.addEventListener("click", () => setMotionPaused(!motionPaused));
  });
  document.querySelectorAll("[data-motion-pause]").forEach((control) => {
    control.addEventListener("click", () => setMotionPaused(true));
  });
  document.querySelectorAll("[data-motion-resume]").forEach((control) => {
    control.addEventListener("click", () => setMotionPaused(false));
  });

  const handleMotionPreferenceChange = (event) => {
    prefersReducedMotion = event.matches;
    applyMotionState();
  };
  if (typeof motionPreference.addEventListener === "function") {
    motionPreference.addEventListener("change", handleMotionPreferenceChange);
  } else if (typeof motionPreference.addListener === "function") {
    motionPreference.addListener(handleMotionPreferenceChange);
  }

  document.addEventListener("visibilitychange", () => {
    root.classList.toggle("page-hidden", document.hidden);
    if (document.hidden) stopCursorAnimation();
    else startCursorAnimation();
  });
  applyMotionState();
})();
