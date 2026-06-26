(function () {
  const ASSET_BASE = "https://abcdaconstrucao.my.site.com/resource/lpCadastreSuaObra";
  const MOBILE_HEADER_MQ = "(max-width: 720px)";

  const assets = {
    logo: `${ASSET_BASE}/logo/logo-abc.png`,
    heroBackground: `${ASSET_BASE}/hero/bg-hero.jpg`,
    beneficiosBackground: `${ASSET_BASE}/beneficios/bg-beneficios.jpg`,
    cardLoja: `${ASSET_BASE}/beneficios/card-loja.png`,
    cardObra: `${ASSET_BASE}/beneficios/card-obra.png`,
  };

  const bigNumbersData = [
    {
      id: "1",
      iconSrc: `${ASSET_BASE}/icon/bn-icon-guides.png`,
      value: "+450",
      displayValue: "+",
      description: "lojas espalhadas no Brasil",
    },
    {
      id: "2",
      iconSrc: `${ASSET_BASE}/icon/bn-icon-cidades.png`,
      value: "+1.200",
      displayValue: "+",
      description: "cidades possuem cobertura ABC",
    },
    {
      id: "3",
      iconSrc: `${ASSET_BASE}/icon/bn-icon-10x-agil.png`,
      value: "+1.000.000",
      displayValue: "0",
      description: "de itens vendidos em 2025",
    },
    {
      id: "4",
      iconSrc: `${ASSET_BASE}/icon/bn-estados.png`,
      value: "+11",
      displayValue: "+",
      description: "estados do Brasil estao com a ABC",
    },
    {
      id: "5",
      iconSrc: `${ASSET_BASE}/icon/bn-idade-abc.png`,
      value: `+${new Date().getFullYear() - 1958}`,
      displayValue: "+",
      description: "anos de experiencia no varejo",
    },
    {
      id: "6",
      iconSrc: `${ASSET_BASE}/icon/bn-icon-centros-distribuicao.png`,
      value: "23",
      displayValue: "0",
      description: "centros de distribuicao no Brasil",
    },
  ];

  const headerLogo = document.getElementById("header-logo");
  const heroLogo = document.getElementById("hero-logo");
  const heroBackground = document.getElementById("hero-background");
  const benefitCardStore = document.getElementById("benefit-card-store");
  const benefitCardWork = document.getElementById("benefit-card-work");
  const bigNumbersList = document.getElementById("big-numbers-list");

  function setAssets() {
    if (headerLogo) {
      headerLogo.src = assets.logo;
    }

    if (heroLogo) {
      heroLogo.src = assets.logo;
    }

    if (heroBackground) {
      heroBackground.src = assets.heroBackground;
    }

    if (benefitCardStore) {
      benefitCardStore.src = assets.cardLoja;
    }

    if (benefitCardWork) {
      benefitCardWork.src = assets.cardObra;
    }

    document.documentElement.style.setProperty(
      "--beneficios-bg-image",
      `url("${assets.beneficiosBackground}")`
    );
  }

  function renderBigNumbers() {
    if (!bigNumbersList) {
      return;
    }

    bigNumbersList.innerHTML = bigNumbersData
      .map(
        (item) => `
          <li data-item-id="${item.id}">
            <div>
              <img class="big-numbers__icon" src="${item.iconSrc}" alt="" aria-hidden="true" />
            </div>
            <div class="big-numbers__info">
              <span class="number" data-original-value="${item.value}">${item.displayValue}</span>
              <span>${item.description}</span>
            </div>
          </li>
        `
      )
      .join("");
  }

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  function animateCounters(elements) {
    elements.forEach((counterElement) => {
      const targetText = counterElement.dataset.originalValue;

      if (!targetText) {
        return;
      }

      let finalValueText = targetText;
      let prefix = "";
      let suffix = "";

      if (finalValueText.startsWith("+")) {
        prefix = "+";
        finalValueText = finalValueText.substring(1);
      }

      if (finalValueText.endsWith("x")) {
        suffix = "x";
        finalValueText = finalValueText.substring(0, finalValueText.length - 1);
      }

      const cleanedValueText = finalValueText.replace(/\./g, "");
      const numericValue = Number.parseFloat(cleanedValueText);

      if (Number.isNaN(numericValue)) {
        counterElement.textContent = targetText;
        return;
      }

      const finalIntegerValue = Math.round(numericValue);
      const duration = 1800;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;

      counterElement.classList.add("counting");

      const animate = () => {
        frame += 1;

        const progress = frame / totalFrames;
        const easedProgress = easeOutCubic(progress);
        const currentValue = Math.min(finalIntegerValue * easedProgress, finalIntegerValue);
        const displayValue = Math.floor(currentValue);

        counterElement.textContent = `${prefix}${displayValue.toLocaleString("pt-BR")}${suffix}`;

        if (frame < totalFrames) {
          window.requestAnimationFrame(animate);
          return;
        }

        counterElement.textContent = targetText;
        counterElement.classList.remove("counting");
        counterElement.classList.add("finished");

        window.setTimeout(() => {
          counterElement.classList.remove("finished");
        }, 600);
      };

      window.requestAnimationFrame(animate);
    });
  }

  function setupBigNumbersAnimation() {
    const bigNumbersSection = document.querySelector(".big-numbers");

    if (!bigNumbersSection) {
      return;
    }

    const listItems = bigNumbersSection.querySelectorAll("li");
    const counters = bigNumbersSection.querySelectorAll(".number");
    let hasAnimated = false;

    const revealItems = () => {
      listItems.forEach((item, index) => {
        window.setTimeout(() => {
          item.classList.add("is-visible");
        }, index * 60);
      });
    };

    const startAnimation = () => {
      if (hasAnimated) {
        return;
      }

      hasAnimated = true;
      revealItems();
      animateCounters(Array.from(counters));
    };

    if (!("IntersectionObserver" in window)) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          startAnimation();
          observer.disconnect();
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.15,
      }
    );

    observer.observe(bigNumbersSection);
  }

  function getScrollOffset() {
    return window.matchMedia(MOBILE_HEADER_MQ).matches ? 84 : 108;
  }

  function smoothScrollToSection(targetId) {
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    const top = target.getBoundingClientRect().top + window.scrollY - getScrollOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function bindScrollTriggers() {
    const triggers = document.querySelectorAll("[data-scroll-target]");

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        smoothScrollToSection(trigger.dataset.scrollTarget);
      });
    });
  }

  setAssets();
  renderBigNumbers();
  bindScrollTriggers();
  setupBigNumbersAnimation();
})();
