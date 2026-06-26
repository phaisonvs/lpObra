import { LightningElement } from "lwc";
import basePath from "@salesforce/community/basePath";
import lpObraAssets from "@salesforce/resourceUrl/lpCadastreSuaObra";

const HERO_BG_PATH_IN_STATIC_RESOURCE =
  "/hero/hero-section-lp-obra2.webp";

const SCROLL_EVT = "lpobra-scroll";

const MOBILE_HEADER_REVEAL_PX = 200;

const MOBILE_HEADER_MQ = "(max-width: 720px)";

export default class LpObraHeroSectionv2 extends LightningElement {

  companyLogoURL = `${basePath}/sfsites/c/cms/delivery/media/MC2XLLTWVOQZBHLIDCYNNG2MNL5I`;

  urlHeroStatIconMaiorRede = `${basePath}/sfsites/c/cms/delivery/media/MCJVZP7WT55VBTTDDTEJ4ZZ3PIDI`;
  urlHeroStatIconFranquias = `${basePath}/sfsites/c/cms/delivery/media/MCUB6X3YZF5NELJE7KWRP3ELBQ2Q`;
  urlHeroStatIconEstados = `${basePath}/sfsites/c/cms/delivery/media/MC77V6DWHB4VFJ7C3BQ63JDR5WK4`;
  urlHeroStatIconAnos = `${basePath}/sfsites/c/cms/delivery/media/MCM3QTX3NBBJCGVCI7CRIO5B4Z6U`;

  urlIcone1 = `${basePath}/sfsites/c/cms/delivery/media/MCL2KOEY6F25BHDDAD6OLZXG76WI`;
  urlIcone2 = `${basePath}/sfsites/c/cms/delivery/media/MCS2CAWZ5TIBCOLBWERPYO53TY7A`;
  urlIcone3 = `${basePath}/sfsites/c/cms/delivery/media/MCWRCTE2LHH5HGTCTCKS35KCRG6M`;
  urlIcone4 = `${basePath}/sfsites/c/cms/delivery/media/MCD2RXWJWJJBBPZFXU7H7SFOAV6I`;

  _observerPrimed = false;

  _intersectionObserver = null;

  _mqMobileHeader = null;

  _onWindowScrollHeader = null;

  _onResizeHeader = null;

  _lastMobileHeaderRevealed = null;

  get heroBackgroundSrc() {
    return `${lpObraAssets}/${HERO_BG_PATH_IN_STATIC_RESOURCE}`;
  }

  connectedCallback() {
    this._mqMobileHeader = window.matchMedia(MOBILE_HEADER_MQ);
    this._onWindowScrollHeader = () => this.updateMobileHeaderReveal();
    this._onResizeHeader = () => this.updateMobileHeaderReveal();
    window.addEventListener("scroll", this._onWindowScrollHeader, {
      passive: true,
    });
    window.addEventListener("resize", this._onResizeHeader);
    window.addEventListener("load", this._onResizeHeader);
    this._mqMobileHeader.addEventListener("change", this._onResizeHeader);
    this.updateMobileHeaderReveal();
  }

  disconnectedCallback() {
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
      this._intersectionObserver = null;
    }
    this._observerPrimed = false;
    if (this._mqMobileHeader && this._onResizeHeader) {
      this._mqMobileHeader.removeEventListener("change", this._onResizeHeader);
    }
    this._mqMobileHeader = null;
    if (this._onWindowScrollHeader) {
      window.removeEventListener("scroll", this._onWindowScrollHeader);
      window.removeEventListener("resize", this._onResizeHeader);
      window.removeEventListener("load", this._onResizeHeader);
      this._onWindowScrollHeader = null;
      this._onResizeHeader = null;
    }
    const hostEl = this.template.host;
    if (hostEl) {
      hostEl.classList.remove("cabecalho-mobile--visivel", "cabecalho-mobile--oculto");
    }
  }

  renderedCallback() {
    if (!this._observerPrimed) {
      this._observerPrimed = true;
      Promise.resolve().then(() => {
        if (!this.isConnected) {
          return;
        }
        this.setupIntersectionObserver();
      });
    }
  }

  handleLogoClick(event) {
    event.preventDefault();
    this.scrollPageToSection("hero");
  }

  handleHeaderCtaClick(event) {
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

  updateMobileHeaderReveal() {
    const host = this.template.host;
    if (!host) {
      return;
    }
    const mobile =
      typeof window !== "undefined" &&
      window.matchMedia(MOBILE_HEADER_MQ).matches;
    if (mobile) {
      const y =
        window.scrollY ||
        (typeof document !== "undefined"
          ? document.documentElement.scrollTop
          : 0) ||
        0;
      const revealed = y >= MOBILE_HEADER_REVEAL_PX;
      this._lastMobileHeaderRevealed = revealed;
      host.classList.toggle("cabecalho-mobile--visivel", revealed);
      host.classList.toggle("cabecalho-mobile--oculto", !revealed);
    } else {
      this._lastMobileHeaderRevealed = null;
      host.classList.remove("cabecalho-mobile--visivel", "cabecalho-mobile--oculto");
    }
  }

  getScrollOffset() {
    const host = this.template.host;
    if (!host) {
      return 108;
    }
    const mobile =
      typeof window !== "undefined" &&
      window.matchMedia(MOBILE_HEADER_MQ).matches;
    if (mobile && host.classList.contains("cabecalho-mobile--oculto")) {
      return 16;
    }
    if (mobile && host.classList.contains("cabecalho-mobile--visivel")) {
      return 76;
    }
    return 108;
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
    const offset = this.getScrollOffset();
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
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
      this._intersectionObserver = null;
    }

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

    this._intersectionObserver = observer;

    const animatableElements = this.template.querySelectorAll(
      ".logo-container, .subtitulo, .titulo-principal, .lp-hero__stats, .cta-container"
    );

    animatableElements.forEach((el) => observer.observe(el));
  }

  createRippleEffect(event) {
    const button = event.currentTarget;
    if (!button || !button.isConnected) {
      return;
    }
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "cta-button__ripple";

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
      animation: cta-button-ripple 0.6s linear;
      pointer-events: none;
    `;

    button.appendChild(ripple);

    setTimeout(() => {
      if (ripple.isConnected && ripple.parentNode === button) {
        ripple.remove();
      }
    }, 600);
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