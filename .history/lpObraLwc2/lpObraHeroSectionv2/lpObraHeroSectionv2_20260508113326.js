import { LightningElement, api } from "lwc";
import basePath from "@salesforce/community/basePath";

const SCROLL_EVT = "lpobra-scroll";
const MEDIA_LOGO = "MC2XLLTWVOQZBHLIDCYNNG2MNL5I";
const MEDIA_HERO_BG_DEFAULT = "MCVNHFJIPNTJHUVKP2H2X56ZMWUE";

function mediaUrl(id) {
  return `${basePath}/sfsites/c/cms/delivery/media/${id}`;
}

export default class LpObraHeroSectionv2 extends LightningElement {
  @api heroBackgroundMediaId = MEDIA_HERO_BG_DEFAULT;

  get companyLogoURL() {
    return mediaUrl(MEDIA_LOGO);
  }

  get heroBgStyle() {
    const raw = typeof this.heroBackgroundMediaId === "string" ? this.heroBackgroundMediaId.trim() : "";
    const id = raw || MEDIA_HERO_BG_DEFAULT;
    const u = mediaUrl(id);
    return `background-image:url("${u}");background-size:cover;background-position:center;background-repeat:no-repeat;`;
  }

  handleCtaClick(event) {
    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent(SCROLL_EVT, {
        detail: { target: "form" },
        bubbles: true,
        composed: true,
      })
    );
  }
}
