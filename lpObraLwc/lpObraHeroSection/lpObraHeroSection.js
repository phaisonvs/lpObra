import { LightningElement, track } from "lwc";
import basePath from "@salesforce/community/basePath";

const SCROLL_EVT = "lpobra-scroll";
const MEDIA_LOGO = "MC2XLLTWVOQZBHLIDCYNNG2MNL5I";
const MEDIA_HERO_BG = "MCYNXJIOGJYJBQTBFOAQRDYZ77YM";
const MEDIA_BENEFICIOS = {
  beneficiosIcone1: "MCL2KOEY6F25BHDDAD6OLZXG76WI",
  beneficiosIcone2: "MCS2CAWZ5TIBCOLBWERPYO53TY7A",
  beneficiosIcone3: "MCWRCTE2LHH5HGTCTCKS35KCRG6M",
  beneficiosIcone4: "MCD2RXWJWJJBBPZFXU7H7SFOAV6I",
  beneficiosBackground: "MC2CXJ5XPFWBGGJOC2YF4QGICDLI",
};
const MOBILE_HEADER_REVEAL_PX = 200;

function mediaUrl(id) {
  return `${basePath}/sfsites/c/cms/delivery/media/${id}`;
}

export default class LpObraHeroSection extends LightningElement {
  @track drawerOpen = false;

  urlIcone1 = mediaUrl(MEDIA_BENEFICIOS.beneficiosIcone1);
  urlIcone2 = mediaUrl(MEDIA_BENEFICIOS.beneficiosIcone2);
  urlIcone3 = mediaUrl(MEDIA_BENEFICIOS.beneficiosIcone3);
  urlIcone4 = mediaUrl(MEDIA_BENEFICIOS.beneficiosIcone4);

  _heroFrame = 0;
  _beneficiosFrame = 0;
  _mq = null;
  _onWindowScroll = null;
  _onResize = null;
  _onMq = null;
  _onDocClick = null;
  _onKey = null;
  _onScrollEvt = null;
  _heroContentMotionBound = false;
  _lastMobileHeaderRevealed = null;

  get drawerHidden() {
    return !this.drawerOpen;
  }

  get drawerExpanded() {
    return String(this.drawerOpen);
  }

  get menuBtnLabel() {
    return this.drawerOpen ? "Fechar menu" : "Abrir menu";
  }

  get logoUrl() {
    return mediaUrl(MEDIA_LOGO);
  }

  get heroMediaStyle() {
    return `--hero-bg-image: url("${mediaUrl(MEDIA_HERO_BG)}");`;
  }

  get sectionBgStyle() {
    return `--beneficios-vip-bg: url("${mediaUrl(MEDIA_BENEFICIOS.beneficiosBackground)}");`;
  }

  connectedCallback() {
    this._mq = window.matchMedia("(max-width: 720px)");
    this._onWindowScroll = () => {
      this.scheduleHeroParallax();
      this.updateMobileHeaderReveal();
      this.scheduleBeneficiosParallax();
    };
    this._onResize = () => {
      this.scheduleHeroParallax();
      this.updateMobileHeaderReveal();
      this.scheduleBeneficiosParallax();
    };
    this._onMq = () => this.updateMobileHeaderReveal();
    this._onDocClick = (event) => {
      if (!this.drawerOpen) return;
      const header = this.template.querySelector(".lp-fixed-header");
      if (!header) return;
      const path = typeof event.composedPath === "function" ? event.composedPath() : [];
      const inside = path.some(
        (node) =>
          node === header ||
          (typeof Node !== "undefined" && node instanceof Node && header.contains(node))
      );
      if (inside) return;
      this.closeDrawer();
    };
    this._onKey = (event) => {
      if (event.key === "Escape") this.closeDrawer();
    };
    this._onScrollEvt = (event) => {
      const t = event.detail?.target;
      if (t === "hero") {
        this.scrollSectionIntoView("hero");
      } else if (t === "beneficios") {
        this.scrollSectionIntoView("beneficios");
      }
    };
    window.addEventListener("scroll", this._onWindowScroll, { passive: true });
    window.addEventListener("resize", this._onResize);
    window.addEventListener("load", this._onWindowScroll);
    this._mq.addEventListener("change", this._onMq);
    document.addEventListener("click", this._onDocClick);
    document.addEventListener("keydown", this._onKey);
    window.addEventListener(SCROLL_EVT, this._onScrollEvt);
    this.updateMobileHeaderReveal();
    this.updateHeroParallax();
    this.updateBeneficiosParallax();
  }

  renderedCallback() {
    if (this._heroContentMotionBound) return;
    const content = this.template.querySelector(".lp-hero__content");
    if (!content) return;
    this._heroContentMotionBound = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    content.addEventListener(
      "animationend",
      (e) => {
        const name = e.animationName || "";
        if (!name.includes("lp-hero-content-in")) return;
        content.classList.add("lp-hero-content--settled");
      },
      { once: true }
    );
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this._onWindowScroll);
    window.removeEventListener("resize", this._onResize);
    window.removeEventListener("load", this._onWindowScroll);
    if (this._mq) this._mq.removeEventListener("change", this._onMq);
    document.removeEventListener("click", this._onDocClick);
    document.removeEventListener("keydown", this._onKey);
    window.removeEventListener(SCROLL_EVT, this._onScrollEvt);
  }

  dispatchScroll(target) {
    window.dispatchEvent(
      new CustomEvent(SCROLL_EVT, {
        detail: { target },
        bubbles: true,
        composed: true,
      })
    );
  }

  getHeaderOffset() {
    const host = this.template.host;
    if (this._mq.matches && host.classList.contains("cabecalho-mobile--oculto")) {
      return 0;
    }
    const header = this.template.querySelector(".lp-fixed-header");
    if (!header) return 104;
    return Math.ceil(header.getBoundingClientRect().height + 12);
  }

  scrollSectionIntoView(target) {
    const el = this.template.querySelector(`[data-lp-section="${target}"]`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - this.getHeaderOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  handleScrollHero(event) {
    event.preventDefault();
    this.scrollSectionIntoView("hero");
  }

  handleNavScroll(event) {
    event.preventDefault();
    const t = event.currentTarget.dataset.scrollTarget;
    if (t) this.dispatchScroll(t);
    this.closeDrawer();
  }

  handleDrawerLink(event) {
    this.handleNavScroll(event);
  }

  handleScrollToForm(event) {
    event.preventDefault();
    this.dispatchScroll("form");
  }

  toggleDrawer(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.drawerOpen = !this.drawerOpen;
  }

  closeDrawer(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.drawerOpen = false;
  }

  updateMobileHeaderReveal() {
    const host = this.template.host;
    const mobile = this._mq.matches;
    if (mobile) {
      const revealed = window.scrollY >= MOBILE_HEADER_REVEAL_PX;
      if (this._lastMobileHeaderRevealed === true && !revealed) {
        this.closeDrawer();
      }
      this._lastMobileHeaderRevealed = revealed;
      host.classList.toggle("cabecalho-mobile--visivel", revealed);
      host.classList.toggle("cabecalho-mobile--oculto", !revealed);
    } else {
      this._lastMobileHeaderRevealed = null;
      host.classList.remove("cabecalho-mobile--visivel", "cabecalho-mobile--oculto");
      this.closeDrawer();
    }
  }

  scheduleHeroParallax() {
    if (this._heroFrame) return;
    this._heroFrame = window.requestAnimationFrame(() => {
      this._heroFrame = 0;
      this.updateHeroParallax();
    });
  }

  updateHeroParallax() {
    const host = this.template.host;
    const hero = this.template.querySelector(".lp-hero");
    if (!hero || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      host.style.setProperty("--hero-parallax", "0px");
      return;
    }
    if (window.innerWidth <= 720) {
      host.style.setProperty("--hero-parallax", "0px");
      return;
    }
    const maxOffset = 160;
    const nextOffset = Math.min(window.scrollY * 0.24, maxOffset);
    host.style.setProperty("--hero-parallax", `${nextOffset}px`);
  }

  scheduleBeneficiosParallax() {
    if (this._beneficiosFrame) return;
    this._beneficiosFrame = window.requestAnimationFrame(() => {
      this._beneficiosFrame = 0;
      this.updateBeneficiosParallax();
    });
  }

  updateBeneficiosParallax() {
    const section = this.template.querySelector(".lp-beneficios-vip");
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth <= 720) {
      section.style.setProperty("--beneficios-bg-parallax-y", "0px");
      section.style.setProperty("--beneficios-bg-parallax-x", "0px");
      return;
    }
    const vh = window.innerHeight || 1;
    const rect = section.getBoundingClientRect();
    if (rect.bottom < -100 || rect.top > vh + 100) return;
    const scrollMid = window.scrollY + vh * 0.5;
    const sectionMid = section.offsetTop + section.offsetHeight * 0.5;
    const delta = scrollMid - sectionMid;
    const maxY = 56;
    const maxX = 22;
    const py = Math.max(-maxY, Math.min(maxY, delta * 0.08));
    const px = Math.max(-maxX, Math.min(maxX, delta * 0.03));
    section.style.setProperty("--beneficios-bg-parallax-y", `${py}px`);
    section.style.setProperty("--beneficios-bg-parallax-x", `${px}px`);
  }
}
