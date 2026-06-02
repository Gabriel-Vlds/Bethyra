document.addEventListener("DOMContentLoaded", () => {
  const heroTitle = document.getElementById("hero-titulo");
  const heroText = document.getElementById("hero-text");
  const heroActions = document.getElementById("hero-actions");
  const scrollToServicesButton = document.getElementById("scroll-to-services-button");
  const targetSection = document.getElementById("que-podemos-hacer-por-ti-section");
  const contentSections = Array.from(document.querySelectorAll("main .story-section, main .widgets-shell"));

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

  runHeroSequence();
  observeContentSections();

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
