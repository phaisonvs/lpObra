import { LightningElement } from "lwc";
import basePath from "@salesforce/community/basePath";

const SCROLL_EVT = "lpobra-scroll";

export default class LpObraHeroSection extends LightningElement {

  isMenuActive = false;

  _onDocClick = null;

  companyLogoURL = `${basePath}/sfsites/c/cms/delivery/media/MC2XLLTWVOQZBHLIDCYNNG2MNL5I`;
  backgroundURL = `${basePath}/sfsites/c/cms/delivery/media/MCV4X6FNU46RHJLOY54YLVVCO53E`;

  urlHeroStatIconMaiorRede = `${basePath}/sfsites/c/cms/delivery/media/MCJVZP7WT55VBTTDDTEJ4ZZ3PIDI`;
  urlHeroStatIconFranquias = `${basePath}/sfsites/c/cms/delivery/media/MCUB6X3YZF5NELJE7KWRP3ELBQ2Q`;
  urlHeroStatIconEstados = `${basePath}/sfsites/c/cms/delivery/media/MC77V6DWHB4VFJ7C3BQ63JDR5WK4`;
  urlHeroStatIconAnos = `${basePath}/sfsites/c/cms/delivery/media/MCM3QTX3NBBJCGVCI7CRIO5B4Z6U`;

  urlIcone1 = `${basePath}/sfsites/c/cms/delivery/media/MCL2KOEY6F25BHDDAD6OLZXG76WI`;
  urlIcone2 = `${basePath}/sfsites/c/cms/delivery/media/MCS2CAWZ5TIBCOLBWERPYO53TY7A`;
  urlIcone3 = `${basePath}/sfsites/c/cms/delivery/media/MCWRCTE2LHH5HGTCTCKS35KCRG6M`;
  urlIcone4 = `${basePath}/sfsites/c/cms/delivery/media/MCD2RXWJWJJBBPZFXU7H7SFOAV6I`;

  _observerPrimed = false;

  get obraNavbarClass() {
    return `obra-navbar${this.isMenuActive ? " obra-navbar--active" : ""}`;
  }

  get menuAriaExpanded() {
    return String(this.isMenuActive);
  }

  get menuButtonLabel() {
    return this.isMenuActive ? "Fechar menu" : "Abrir menu";
  }

  get heroBgStyle() {
    return `background-image: url(${this.backgroundURL});
            background-size: cover;
            background-position: center;`;
  }

  connectedCallback() {
    this._onDocClick = (event) => {
      if (!this.isMenuActive) return;
      const path =
        typeof event.composedPath === "function" ? event.composedPath() : [];
      if (path.includes(this.template.host)) return;
      this.isMenuActive = false;
    };
    document.addEventListener("click", this._onDocClick);
  }

  disconnectedCallback() {
    document.removeEventListener("click", this._onDocClick);
    this._onDocClick = null;
  }

  renderedCallback() {
    this.addRippleStyles();
    if (!this._observerPrimed) {
      this._observerPrimed = true;
      Promise.resolve().then(() => this.setupIntersectionObserver());
    }
  }

  toggleMenu(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isMenuActive = !this.isMenuActive;
  }

  handleLogoClick(event) {
    event.preventDefault();
    this.scrollPageToSection("hero");
  }

  handleMenuNavClick(event) {
    event.preventDefault();
    const t = event.currentTarget.dataset.scrollTarget;
    this.isMenuActive = false;
    if (t) {
      this.scrollPageToSection(t);
    }
  }

  handleHeaderCtaClick(event) {
    event.preventDefault();
    this.isMenuActive = false;
    window.dispatchEvent(
      new CustomEvent(SCROLL_EVT, {
        detail: { target: "form" },
        bubbles: true,
        composed: true,
      })
    );
    this.dispatchEvent(new CustomEvent("ctaclick"));
  }

  scrollPageToSection(target) {
    if (target === "form") {
      window.dispatchEvent(
        new CustomEvent(SCROLL_EVT, {
          detail: { target: "form" },
          bubbles: true,
          composed: true,
        })
      );
      return;
    }
    let el = this.template.querySelector(`[data-lp-section="${target}"]`);
    if (!el) {
      el = document.querySelector(`[data-lp-section="${target}"]`);
    }
    if (!el) return;
    const offset = 108;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  handleScrollHintClick(event) {
    event.preventDefault();
    this.scrollPageToSection("beneficios");
  }

  handleBeneficiosCtaClick(event) {
    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent(SCROLL_EVT, {
        detail: { target: "form" },
        bubbles: true,
        composed: true,
      })
    );
    this.dispatchEvent(new CustomEvent("ctaclick"));
  }

  handleCtaClick(event) {
    event.preventDefault();
    this.createRippleEffect(event);
    this.executeCtaAction();
    this.scrollPageToSection("form");
    this.dispatchEvent(new CustomEvent("ctaclick"));
  }


  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    const animatableElements = this.template.querySelectorAll(
      ".logo-container, .subtitulo, .titulo-principal, .lp-hero__stats, .cta-container"
    );

    animatableElements.forEach((el) => observer.observe(el));
  }

  createRippleEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");

    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  addRippleStyles() {
    const styleElement = this.template.querySelector("#ripple-style");

    if (!styleElement) {
      const style = document.createElement("style");
      style.id = "ripple-style";
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .cta-button {
          position: relative;
          overflow: hidden;
        }
      `;

      this.template.appendChild(style);
    }
  }

  executeCtaAction() {
    const contatoSection = this.template.querySelector('[data-id="contato"]');
    if (contatoSection) {
      contatoSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
}