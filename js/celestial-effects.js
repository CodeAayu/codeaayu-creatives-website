(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const layers = new Map();
  const maxPixelRatio = 1.5;
  let reducedMotion = reduceMotionQuery.matches;
  let documentHidden = document.visibilityState === "hidden";
  let manuallyPaused = false;
  let animationFrame = 0;
  let resizeFrame = 0;
  let observer;

  root.classList.add("has-celestial-js");

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  // Small deterministic generator keeps the constellation stable between redraws.
  const createRandom = (seed) => {
    let value = seed >>> 0;
    return () => {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  };

  const getDensity = (element) => element.dataset.density === "dense" ? "dense" : "sparse";

  const getStarCount = (element, width, height) => {
    const areaCount = Math.round((width * height) / (getDensity(element) === "dense" ? 7600 : 15000));
    const baseCount = getDensity(element) === "dense" ? 52 : 28;
    const maxCount = getDensity(element) === "dense" ? 150 : 82;
    return clamp(baseCount + areaCount, baseCount, maxCount);
  };

  const buildStars = (element, width, height) => {
    const random = createRandom(element.dataset.celestialLayer === "moon" ? 70421 : 18031);
    const count = getStarCount(element, width, height);

    return Array.from({ length: count }, (_, index) => ({
      x: random(),
      y: random(),
      radius: 0.35 + random() * (index % 11 === 0 ? 1.35 : 0.8),
      alpha: 0.22 + random() * 0.64,
      twinkle: 0.35 + random() * 1.35,
      phase: random() * Math.PI * 2,
      depth: 0.25 + random() * 0.75
    }));
  };

  const resizeLayer = (layer) => {
    const rect = layer.element.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, maxPixelRatio);

    layer.width = width;
    layer.height = height;
    layer.pixelRatio = pixelRatio;
    layer.canvas.width = Math.round(width * pixelRatio);
    layer.canvas.height = Math.round(height * pixelRatio);
    layer.canvas.style.width = `${width}px`;
    layer.canvas.style.height = `${height}px`;
    layer.stars = buildStars(layer.element, width, height);
    layer.dirty = true;
  };

  const drawOrbit = (context, layer, orbit, time) => {
    const { width, height } = layer;
    const centerX = width * orbit.x;
    const centerY = height * orbit.y;
    const rotation = orbit.rotation + (reducedMotion ? 0 : time * orbit.speed);

    context.save();
    context.translate(centerX, centerY);
    context.rotate(rotation);
    context.beginPath();
    context.ellipse(0, 0, width * orbit.radiusX, height * orbit.radiusY, 0, 0, Math.PI * 2);
    context.strokeStyle = orbit.color;
    context.lineWidth = orbit.lineWidth;
    context.setLineDash(orbit.dash);
    context.stroke();

    if (orbit.node) {
      const nodeAngle = time * orbit.nodeSpeed + orbit.nodeOffset;
      const nodeX = Math.cos(nodeAngle) * width * orbit.radiusX;
      const nodeY = Math.sin(nodeAngle) * height * orbit.radiusY;
      context.beginPath();
      context.arc(nodeX, nodeY, orbit.node, 0, Math.PI * 2);
      context.fillStyle = orbit.nodeColor;
      context.fill();
    }
    context.restore();
  };

  const drawLayer = (layer, time = 0) => {
    const context = layer.context;
    const { width, height, pixelRatio } = layer;
    if (!context || !width || !height) return;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);

    const isMoon = layer.element.dataset.celestialLayer === "moon";
    const drift = reducedMotion ? 0 : time;
    const stars = layer.stars;

    stars.forEach((star) => {
      const x = star.x * width + Math.sin(drift * 0.055 + star.phase) * star.depth * (isMoon ? 2.8 : 1.5);
      const y = star.y * height + Math.cos(drift * 0.045 + star.phase) * star.depth * (isMoon ? 2.2 : 1.1);
      const pulse = reducedMotion ? 1 : 0.72 + Math.sin(drift * star.twinkle + star.phase) * 0.28;
      const radius = star.radius * (isMoon ? 1 : 0.78);

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = isMoon
        ? `rgba(232, 236, 255, ${(star.alpha * pulse).toFixed(3)})`
        : `rgba(255, 250, 241, ${(star.alpha * pulse * 0.72).toFixed(3)})`;
      context.fill();

      if (star.radius > 1.25) {
        context.beginPath();
        context.arc(x, y, radius * 3.5, 0, Math.PI * 2);
        context.fillStyle = isMoon
          ? `rgba(190, 198, 255, ${(star.alpha * pulse * 0.08).toFixed(3)})`
          : `rgba(243, 166, 198, ${(star.alpha * pulse * 0.06).toFixed(3)})`;
        context.fill();
      }
    });

    const orbitColor = isMoon ? "rgba(190, 198, 255, 0.17)" : "rgba(243, 166, 198, 0.18)";
    const orbitAccent = isMoon ? "rgba(255, 221, 115, 0.7)" : "rgba(255, 221, 115, 0.58)";
    const orbits = isMoon
      ? [
          { x: 0.5, y: 0.54, radiusX: 0.43, radiusY: 0.18, rotation: -0.22, speed: 0.018, dash: [], lineWidth: 1, color: orbitColor, node: 2.2, nodeColor: orbitAccent, nodeSpeed: 0.32, nodeOffset: 1.1 },
          { x: 0.5, y: 0.54, radiusX: 0.33, radiusY: 0.34, rotation: 0.68, speed: -0.014, dash: [2, 7], lineWidth: 0.8, color: "rgba(190, 198, 255, 0.12)", node: 1.5, nodeColor: "rgba(232, 236, 255, 0.62)", nodeSpeed: -0.26, nodeOffset: -0.4 },
          { x: 0.5, y: 0.54, radiusX: 0.2, radiusY: 0.42, rotation: 1.14, speed: 0.01, dash: [1, 9], lineWidth: 0.7, color: "rgba(190, 198, 255, 0.1)" }
        ]
      : [
          { x: 0.73, y: 0.47, radiusX: 0.36, radiusY: 0.14, rotation: -0.25, speed: 0.012, dash: [], lineWidth: 0.8, color: orbitColor, node: 1.8, nodeColor: orbitAccent, nodeSpeed: 0.28, nodeOffset: 2.2 },
          { x: 0.73, y: 0.47, radiusX: 0.27, radiusY: 0.24, rotation: 0.66, speed: -0.01, dash: [2, 8], lineWidth: 0.7, color: "rgba(243, 166, 198, 0.12)" }
        ];

    orbits.forEach((orbit) => drawOrbit(context, layer, orbit, drift));
    layer.dirty = false;
  };

  const shouldAnimate = () => !reducedMotion && !documentHidden && !manuallyPaused;

  const animationTick = (timestamp) => {
    animationFrame = 0;
    if (!shouldAnimate()) return;

    layers.forEach((layer) => {
      if (layer.visible) drawLayer(layer, timestamp / 1000);
    });

    animationFrame = window.requestAnimationFrame(animationTick);
  };

  const scheduleAnimation = () => {
    if (shouldAnimate() && !animationFrame) {
      animationFrame = window.requestAnimationFrame(animationTick);
    }
  };

  const redraw = () => {
    layers.forEach((layer) => {
      resizeLayer(layer);
      drawLayer(layer);
    });
    scheduleAnimation();
  };

  const pause = () => {
    manuallyPaused = true;
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
    layers.forEach((layer) => drawLayer(layer));
  };

  const resume = () => {
    manuallyPaused = false;
    scheduleAnimation();
  };

  const setPaused = (value) => value ? pause() : resume();

  const api = Object.freeze({
    pause,
    resume,
    setPaused,
    refresh: redraw,
    isPaused: () => manuallyPaused || documentHidden || reducedMotion
  });

  window.CelestialEffects = api;
  document.addEventListener("celestial:pause", pause);
  document.addEventListener("celestial:resume", resume);
  document.addEventListener("codeaayu:motionchange", (event) => {
    manuallyPaused = Boolean(event.detail?.paused);
    if (shouldAnimate()) {
      scheduleAnimation();
      return;
    }
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
    layers.forEach((layer) => drawLayer(layer));
  });
  document.addEventListener("visibilitychange", () => {
    documentHidden = document.visibilityState === "hidden";
    if (documentHidden && animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    } else {
      layers.forEach((layer) => drawLayer(layer));
      scheduleAnimation();
    }
  });

  const handleMotionPreference = (event) => {
    reducedMotion = event.matches;
    layers.forEach((layer) => drawLayer(layer));
    if (reducedMotion && animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    } else {
      scheduleAnimation();
    }
  };

  if (typeof reduceMotionQuery.addEventListener === "function") {
    reduceMotionQuery.addEventListener("change", handleMotionPreference);
  } else {
    reduceMotionQuery.addListener(handleMotionPreference);
  }

  document.querySelectorAll("[data-celestial-layer]").forEach((element) => {
    const canvas = element.querySelector("canvas");
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const layer = { element, canvas, context, width: 0, height: 0, pixelRatio: 1, stars: [], visible: true, dirty: true };
    layers.set(element, layer);
    resizeLayer(layer);
    drawLayer(layer);

    if (typeof IntersectionObserver === "function") {
      if (!observer) {
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const observedLayer = layers.get(entry.target);
            if (!observedLayer) return;
            observedLayer.visible = entry.isIntersecting;
            if (observedLayer.visible) drawLayer(observedLayer);
          });
          scheduleAnimation();
        }, { rootMargin: "120px 0px" });
      }
      observer.observe(element);
    }
  });

  const refreshOnResize = () => {
    if (resizeFrame) return;
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      redraw();
    });
  };

  window.addEventListener("resize", refreshOnResize, { passive: true });
  if (typeof ResizeObserver === "function") {
    const sizeObserver = new ResizeObserver(refreshOnResize);
    layers.forEach((layer) => sizeObserver.observe(layer.element));
  }

  redraw();
})();
