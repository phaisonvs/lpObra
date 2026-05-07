import { LightningElement } from "lwc";

const SCROLL_EVT = "lpobra-scroll";

export default class LpObraFaq extends LightningElement {
  _onScrollEvt = null;

  connectedCallback() {
    this._onScrollEvt = (event) => {
      if (event.detail?.target === "faq") {
        this.scrollSectionIntoView();
      }
    };
    window.addEventListener(SCROLL_EVT, this._onScrollEvt);
  }

  disconnectedCallback() {
    window.removeEventListener(SCROLL_EVT, this._onScrollEvt);
  }

  scrollSectionIntoView() {
    const el = this.template.querySelector('[data-lp-section="faq"]');
    if (!el) return;
    const offset = 104;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  toggleAccordion(event) {
    const index = parseInt(event.currentTarget.dataset.index, 10);
    const accordionItems = this.template.querySelectorAll(".accordion-item");
    const clickedItem = accordionItems[index];
    if (!clickedItem) return;
    const wasActive = clickedItem.classList.contains("ativo");

    if (wasActive) {
      clickedItem.classList.remove("ativo");
    } else {
      accordionItems.forEach((item) => {
        item.classList.remove("ativo");
      });
      clickedItem.classList.add("ativo");
    }
  }
}
