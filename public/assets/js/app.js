document.addEventListener("DOMContentLoaded", () => {
  const heroTitle = document.getElementById("hero-titulo");
  const heroText = document.getElementById("hero-text");
  const heroActions = document.getElementById("hero-actions");
  const scrollToServicesButton = document.getElementById("scroll-to-services-button");
  const targetSection = document.getElementById("que-podemos-hacer-por-ti-section");
  const contentSections = Array.from(document.querySelectorAll("main .story-section, main .widgets-shell"));
  const sparkLayer = document.querySelector(".scene-spark-layer");
  const gridStep = 72;

  const titleText = "Bethyra — Desarrollo Web y Agentes IA";
  const heroCopy = "Construimos experiencias web con estética futurista, automatización real y agentes autónomos que trabajan sobre tus procesos.";

  const revealButton = () => {
    if (heroActions) {
      heroActions.classList.remove("hidden");
    }
  };

  const typeWithTyped = (selector, text, options = {}) => {
    return new Promise((resolve) => {
      if (typeof Typed !== "undefined" && selector) {
        new Typed(selector, {
          strings: [text],
          typeSpeed: options.typeSpeed ?? 42,
          showCursor: options.showCursor ?? false,
          backSpeed: 0,
          loop: false,
          onComplete: resolve
        });
        return;
      }

      const element = document.querySelector(selector);
      if (!element) {
        resolve();
        return;
      }

      element.textContent = "";
      let index = 0;
      const tick = () => {
        element.textContent += text.charAt(index);
        index += 1;
        if (index < text.length) {
          window.setTimeout(tick, options.typeSpeed ?? 42);
        } else {
          resolve();
        }
      };
      tick();
    });
  };

  const typeInlineElement = (element, text, speed = 22) => {
    return new Promise((resolve) => {
      if (!element) {
        resolve();
        return;
      }

      if (element.dataset.typedDone === "true") {
        resolve();
        return;
      }

      element.dataset.typedDone = "pending";

      if (typeof Typed !== "undefined") {
        new Typed(element, {
          strings: [text],
          typeSpeed: speed,
          showCursor: false,
          backSpeed: 0,
          loop: false,
          onComplete: () => {
            element.dataset.typedDone = "true";
            resolve();
          }
        });
        return;
      }

      element.textContent = "";
      let index = 0;
      const tick = () => {
        element.textContent += text.charAt(index);
        index += 1;
        if (index < text.length) {
          window.setTimeout(tick, speed);
        } else {
          element.dataset.typedDone = "true";
          resolve();
        }
      };
      tick();
    });
  };

  const runHeroSequence = async () => {
    if (!heroTitle || !heroText) {
      revealButton();
      return;
    }

    heroTitle.textContent = "";
    heroText.textContent = "";
    if (heroActions) {
      heroActions.classList.add("hidden");
    }

    await typeWithTyped("#hero-titulo", titleText, { typeSpeed: 44, showCursor: false });
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    await typeWithTyped("#hero-text", heroCopy, { typeSpeed: 18, showCursor: false });
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    revealButton();
  };

  const prepareSectionText = (section) => {
    const textNodes = Array.from(section.querySelectorAll("h2, p"));
    textNodes.forEach((element) => {
      if (!element.dataset.originalText) {
        element.dataset.originalText = element.textContent.trim();
        element.textContent = "";
      }
    });
  };

  const typeSectionContent = async (section) => {
    const textNodes = Array.from(section.querySelectorAll("h2, p"));
    for (const element of textNodes) {
      const originalText = element.dataset.originalText || element.textContent.trim();
      if (!originalText) {
        continue;
      }

      const typingSpeed = element.tagName === "H2" ? 28 : 16;
      await typeInlineElement(element, originalText, typingSpeed);
      await new Promise((resolve) => window.setTimeout(resolve, element.tagName === "H2" ? 220 : 120));
    }
  };

  const observeContentSections = () => {
    if (!contentSections.length) {
      return;
    }

    contentSections.forEach(prepareSectionText);

    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const section = entry.target;
        observer.unobserve(section);
        typeSectionContent(section);
      });
    }, {
      threshold: 0.35,
      rootMargin: "0px 0px -10% 0px"
    });

    contentSections.forEach((section) => sectionObserver.observe(section));
  };

  const directionVectors = {
    right: { dx: 1, dy: 0, trailAngle: 180, coreAngle: 90 },
    left: { dx: -1, dy: 0, trailAngle: 0, coreAngle: -90 },
    up: { dx: 0, dy: -1, trailAngle: 90, coreAngle: 0 },
    down: { dx: 0, dy: 1, trailAngle: 270, coreAngle: 180 }
  };

  const oppositeDirections = {
    right: "left",
    left: "right",
    up: "down",
    down: "up"
  };

  const turnCandidates = {
    right: ["right", "up", "down"],
    left: ["left", "up", "down"],
    up: ["up", "left", "right"],
    down: ["down", "left", "right"]
  };

  const clampToGrid = (value) => Math.round(value / gridStep) * gridStep;

  const createLightBike = (className, startXRatio, startYRatio, direction, speed, trailLength) => {
    const bike = document.createElement("div");
    bike.className = `grid-bike ${className}`;

    const trail = document.createElement("span");
    trail.className = "grid-bike__trail";

    const core = document.createElement("span");
    core.className = "grid-bike__core";

    bike.append(trail, core);
    sparkLayer.appendChild(bike);

    const startX = clampToGrid(window.innerWidth * startXRatio);
    const startY = clampToGrid(window.innerHeight * startYRatio);

    bike.style.setProperty("--trail-length", `${trailLength}px`);
    bike.style.setProperty("--trail-thickness", "3px");
    bike.style.transform = `translate3d(${startX}px, ${startY}px, 0)`;
    core.style.transform = `rotate(${directionVectors[direction].coreAngle}deg) scale(0.8)`;

    return {
      element: bike,
      trail,
      core,
      x: startX,
      y: startY,
      fromX: startX,
      fromY: startY,
      toX: startX,
      toY: startY,
      direction,
      speed,
      trailLength,
      trailAngle: directionVectors[direction].trailAngle,
      progress: 1,
      segmentDuration: gridStep / speed
    };
  };

  const canMove = (x, y, direction) => {
    const vector = directionVectors[direction];
    const nextX = x + vector.dx * gridStep;
    const nextY = y + vector.dy * gridStep;
    const margin = gridStep;

    return nextX >= -margin && nextX <= window.innerWidth + margin && nextY >= -margin && nextY <= window.innerHeight + margin;
  };

  const chooseNextDirection = (bike) => {
    const options = turnCandidates[bike.direction].filter((direction) => canMove(bike.x, bike.y, direction));

    if (!options.length) {
      return oppositeDirections[bike.direction];
    }

    const weightedOptions = [];
    options.forEach((direction) => {
      const weight = direction === bike.direction ? 4 : 1;
      for (let index = 0; index < weight; index += 1) {
        weightedOptions.push(direction);
      }
    });

    return weightedOptions[Math.floor(Math.random() * weightedOptions.length)];
  };

  const advanceBike = (bike) => {
    bike.fromX = bike.x;
    bike.fromY = bike.y;
    bike.direction = chooseNextDirection(bike);

    const vector = directionVectors[bike.direction];
    bike.toX = bike.x + vector.dx * gridStep;
    bike.toY = bike.y + vector.dy * gridStep;
    bike.trailAngle = vector.trailAngle;
    bike.segmentDuration = Math.max(0.32, (gridStep / bike.speed) * (0.88 + Math.random() * 0.24));
    bike.progress = 0;

    bike.trail.style.width = `${bike.trailLength}px`;
    bike.trail.style.height = "3px";
    bike.trail.style.transform = `translateY(-50%) rotate(${bike.trailAngle}deg)`;
    bike.core.style.transform = `rotate(${vector.coreAngle}deg) scale(0.8)`;
  };

  const updateBike = (bike, deltaTime) => {
    if (bike.progress >= 1) {
      advanceBike(bike);
    }

    bike.progress += deltaTime / (bike.segmentDuration * 1000);

    if (bike.progress >= 1) {
      bike.x = bike.toX;
      bike.y = bike.toY;
      bike.element.style.transform = `translate3d(${bike.x}px, ${bike.y}px, 0)`;
      advanceBike(bike);
    }

    const currentX = bike.fromX + (bike.toX - bike.fromX) * bike.progress;
    const currentY = bike.fromY + (bike.toY - bike.fromY) * bike.progress;

    bike.x = currentX;
    bike.y = currentY;
    bike.element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  };

  const runLightBikeCycle = () => {
    if (!sparkLayer) {
      return;
    }

    const bikes = [
      createLightBike("blue", 0.22, 0.36, "right", 196.35, 198),
      createLightBike("orange", 0.74, 0.64, "left", 170.94, 216)
    ];

    bikes.forEach((bike) => advanceBike(bike));

    let lastTimestamp = null;

    const frame = (timestamp) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      const deltaTime = Math.min(40, timestamp - lastTimestamp);
      lastTimestamp = timestamp;

      bikes.forEach((bike) => updateBike(bike, deltaTime));
      window.requestAnimationFrame(frame);
    };

    window.requestAnimationFrame(frame);
  };

  runHeroSequence();
  observeContentSections();
  runLightBikeCycle();

  if (scrollToServicesButton && targetSection) {
    scrollToServicesButton.addEventListener("click", (event) => {
      event.preventDefault();
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 700,
      once: true,
      easing: "ease-out-cubic"
    });
  }
});

// ── Audit Widget ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const btn      = document.getElementById("audit-btn");
  const input    = document.getElementById("audit-url");
  const loading  = document.getElementById("audit-loading");
  const errorBox = document.getElementById("audit-error");
  const results  = document.getElementById("audit-results");

  if (!btn) return;

  const scoreMap = {
    performance:     "score-performance",
    seo:             "score-seo",
    accessibility:   "score-accessibility",
    "best-practices": "score-best-practices",
  };

  const setState = (state) => {
    loading.classList.add("hidden");
    errorBox.classList.add("hidden");
    results.classList.add("hidden");
    btn.disabled = false;
    input.disabled = false;
    if (state === "loading") {
      loading.classList.remove("hidden");
      btn.disabled = true;
      input.disabled = true;
    } else if (state === "error") {
      errorBox.classList.remove("hidden");
    } else if (state === "results") {
      results.classList.remove("hidden");
    }
  };

  const scoreClass = (n) => {
    if (n >= 90) return "score-good";
    if (n >= 50) return "score-mid";
    return "score-bad";
  };

  const normalizeUrl = (raw) => {
    const s = raw.trim();
    if (/^https?:\/\//i.test(s)) return s;
    return "https://" + s;
  };

  const isValidUrl = (str) => {
    try { new URL(str); return true; } catch { return false; }
  };

  btn.addEventListener("click", async () => {
    const url = normalizeUrl(input.value);

    if (!isValidUrl(url)) {
      setState("error");
      errorBox.textContent = "URL inválida. Ejemplo: https://ejemplo.com";
      return;
    }

    setState("loading");

    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch("analyze.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok || data.error) {
        setState("error");
        errorBox.textContent = data.error || "Error al analizar la URL.";
        return;
      }

      Object.entries(scoreMap).forEach(([cat, elemId]) => {
        const el    = document.getElementById(elemId);
        const valueEl = el.querySelector(".audit-score-value");
        const score = data.scores[cat];
        valueEl.textContent = score !== null ? score : "—";
        valueEl.className   = "audit-score-value" + (score !== null ? " " + scoreClass(score) : "");
      });

      setState("results");

    } catch (err) {
      clearTimeout(timeoutId);
      setState("error");
      errorBox.textContent = err.name === "AbortError"
        ? "Tiempo de espera agotado (20s). Intenta con otra URL."
        : "Error de conexión. Verifica tu red e intenta de nuevo.";
    }
  });
});
