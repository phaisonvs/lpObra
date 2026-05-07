import { LightningElement } from "lwc";
import basePath from "@salesforce/community/basePath";

const SCROLL_EVT = "lpobra-scroll";
const MEDIA = {
  beneficiosIcone1: "MCL2KOEY6F25BHDDAD6OLZXG76WI",
  beneficiosIcone2: "MCS2CAWZ5TIBCOLBWERPYO53TY7A",
  beneficiosIcone3: "MCWRCTE2LHH5HGTCTCKS35KCRG6M",
  beneficiosIcone4: "MCD2RXWJWJJBBPZFXU7H7SFOAV6I",
  beneficiosBackground: "MC2CXJ5XPFWBGGJOC2YF4QGICDLI",
};

function mediaUrl(id) {
  return `${basePath}/sfsites/c/cms/delivery/media/${id}`;
}

export default class LpObraBeneficios extends LightningElement {
  urlIcone1 = mediaUrl(MEDIA.beneficiosIcone1);
  urlIcone2 = mediaUrl(MEDIA.beneficiosIcone2);
  urlIcone3 = mediaUrl(MEDIA.beneficiosIcone3);
  urlIcone4 = mediaUrl(MEDIA.beneficiosIcone4);

  _beneficiosFrame = 0;
  _onScroll = null;
  _onResize = null;
  _onScrollEvt = null;

  get sectionBgStyle() {
    return `--beneficios-vip-bg: url("${mediaUrl(MEDIA.beneficiosBackground)}");`;
  }

  connectedCallback() {
    this._onScroll = () => this.scheduleBeneficiosParallax();
    this._onResize = () => this.scheduleBeneficiosParallax();
    this._onScrollEvt = (event) => {
      if (event.detail?.target === "beneficios") {
        this.scrollSelfIntoView();
      }
    };
    window.addEventListener("scroll", this._onScroll, { passive: true });
    window.addEventListener("resize", this._onResize);
    window.addEventListener("load", this._onScroll);
    window.addEventListener(SCROLL_EVT, this._onScrollEvt);
    this.updateBeneficiosParallax();
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this._onScroll);
    window.removeEventListener("resize", this._onResize);
    window.removeEventListener("load", this._onScroll);
    window.removeEventListener(SCROLL_EVT, this._onScrollEvt);
  }

  handleScrollToForm(event) {
    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent(SCROLL_EVT, {
        detail: { target: "form" },
        bubbles: true,
        composed: true,
      })
    );
  }

  scrollSelfIntoView() {
    const el = this.template.querySelector('[data-lp-section="beneficios"]');
    if (!el) return;
    const offset = 104;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
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
