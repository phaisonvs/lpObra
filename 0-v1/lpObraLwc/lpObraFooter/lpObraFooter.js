import { LightningElement } from "lwc";
import basePath from "@salesforce/community/basePath";

const SCROLL_EVT = "lpobra-scroll";
const MEDIA_LOGO = "MCAOMDZSUL4NB2VCUWVWSZOVGR7E";

function mediaUrl(id) {
  return `${basePath}/sfsites/c/cms/delivery/media/${id}`;
}

export default class LpObraFooter extends LightningElement {
  logoUrl = "";

  connectedCallback() {
    this.logoUrl = mediaUrl(MEDIA_LOGO);
  }

  handleLogoClick(event) {
    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent(SCROLL_EVT, {
        detail: { target: "hero" },
        bubbles: true,
        composed: true,
      })
    );
  }
}
