import { LightningElement } from "lwc";
import basePath from "@salesforce/community/basePath";

export default class LpSejaUmFranqueadoHeroSection extends LightningElement {

  //IMPORT ASSETS 
  companyLogoURL = `${basePath}/sfsites/c/cms/delivery/media/MCDM6XSPJPTBEEPEWNDNI24XTZ54`;
  // backgroundURL  = `${basePath}/sfsites/c/cms/delivery/media/MCXKTSTADKAZEOXA5ZFZGEANX6V4`; //ID antigo
  backgroundURL  = `${basePath}/sfsites/c/cms/delivery/media/MCY7L2PX5ZUVBBLGY3YA2BAOGHB4`;

    get heroBgStyle() {
    return `background-image: url(${this.backgroundURL});
            background-size: cover;
            background-position: center;`;
    }
  //IMPORT ASSETS 


  handleCtaClick(event) {
    event.preventDefault();
    this.createRippleEffect(event);
    this.executeCtaAction();

    this.scrollToComponent("c-lp-seja-um-franqueado-formulario2");
    this.dispatchEvent(new CustomEvent("ctaclick"));
  }


  scrollToComponent(selector, offset = 100) {
    const topDiv = document.querySelector(selector);
    if (topDiv) {
      const y = topDiv.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
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
      ".logo-container, .subtitulo, .titulo-principal, .cta-container"
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