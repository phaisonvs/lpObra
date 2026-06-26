import { LightningElement } from "lwc";
import basePath from "@salesforce/community/basePath";
import lpObraAssets from "@salesforce/resourceUrl/lpCadastreSuaObra";

const SCROLL_EVT = "lpobra-scroll";

const MOBILE_HEADER_REVEAL_PX = 200;

const MOBILE_HEADER_MQ = "(max-width: 720px)";

export default class LpObraHeroSectionv2 extends LightningElement {

    animatedCounters = new Set();

    companyLogoURL = `${lpObraAssets}/logo/logo-abc.png`;

    urlHeroBackground = `${lpObraAssets}/hero/bg-hero.jpg`;
    urlBeneficiosBackground = `${lpObraAssets}/beneficios/bg-beneficios.jpg`;

    urlHeroStatIconMaiorRede = `${basePath}/sfsites/c/cms/delivery/media/MCJVZP7WT55VBTTDDTEJ4ZZ3PIDI`;
    urlHeroStatIconFranquias = `${basePath}/sfsites/c/cms/delivery/media/MCUB6X3YZF5NELJE7KWRP3ELBQ2Q`;
    urlHeroStatIconEstados = `${basePath}/sfsites/c/cms/delivery/media/MC77V6DWHB4VFJ7C3BQ63JDR5WK4`;
    urlHeroStatIconAnos = `${basePath}/sfsites/c/cms/delivery/media/MCM3QTX3NBBJCGVCI7CRIO5B4Z6U`;

    urlCardLoja = `${lpObraAssets}/beneficios/card-loja.png`;
    urlCardObra = `${lpObraAssets}/beneficios/card-obra.png`;
    urlCardArgamassa = `${lpObraAssets}/beneficios/card-argamassa.png`;
    urlCardPrime = `${lpObraAssets}/beneficios/card-prime.png`;
    urlIconCrown = `${lpObraAssets}/icon/crown.svg`;

    _observerPrimed = false;

    _intersectionObserver = null;

    _mqMobileHeader = null;

    _onWindowScrollHeader = null;

    _onResizeHeader = null;

    _lastMobileHeaderRevealed = null;

    setupEntranceAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.15,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const targetElement = entry.target;

                if (targetElement.classList.contains("big-numbers")) {
                    const listItems = targetElement.querySelectorAll("ul li");
                    const counters = targetElement.querySelectorAll(".number");

                    if (entry.isIntersecting) {
                        counters.forEach((counter) => {
                            const originalValue = counter.dataset.originalValue;

                            if (!originalValue) return;

                            if (originalValue.startsWith("+")) {
                                counter.textContent = "+";
                            } else {
                                counter.textContent = "0";
                            }

                            counter.classList.remove("counting", "finished");
                        });

                        this.animateCounters(counters);

                        listItems.forEach((item, index) => {
                            item.style.visibility = "visible";
                            item.classList.add(
                                "animate__animated",
                                "animate__fadeInUp"
                            );

                            item.style.animationDelay = `${index * 0.05}s`;
                        });
                    }
                }
            });
        }, observerOptions);

        const bigNumbersSection =
            this.template.querySelector(".big-numbers");

        if (bigNumbersSection) {
            const listItems =
                bigNumbersSection.querySelectorAll("ul li");

            listItems.forEach((item) => {
                item.style.visibility = "hidden";
            });

            observer.observe(bigNumbersSection);
        }
    }

    animateCounters(elements) {
        if (!elements || elements.length === 0) return;

        elements.forEach((counterElement) => {
            const targetText = counterElement.dataset.originalValue;

            if (!targetText) return;

            let finalValueText = targetText;
            let prefix = "";
            let suffix = "";

            if (finalValueText.startsWith("+")) {
                prefix = "+";
                finalValueText = finalValueText.substring(1);
            }

            if (finalValueText.endsWith("x")) {
                suffix = "x";
                finalValueText = finalValueText.substring(
                    0,
                    finalValueText.length - 1
                );
            }

            const cleanedValueText =
                finalValueText.replace(/\./g, "");

            const numericValue = parseFloat(cleanedValueText);

            if (isNaN(numericValue)) {
                counterElement.textContent = targetText;
                return;
            }

            const finalIntegerValue = Math.round(numericValue);

            counterElement.classList.add("counting");

            const duration = 1200;
            const frameDuration = 1000 / 60;
            const totalFrames = Math.round(duration / frameDuration);

            let frame = 0;

            const animate = () => {
                frame++;

                const progress = frame / totalFrames;

                const easedProgress =
                    this.easeOutQuart(progress);

                const currentValue = Math.min(
                    finalIntegerValue * easedProgress,
                    finalIntegerValue
                );

                const displayValue = Math.floor(currentValue);

                const formattedDisplayValue =
                    displayValue.toLocaleString("pt-BR");

                counterElement.textContent =
                    `${prefix}${formattedDisplayValue}${suffix}`;

                if (frame < totalFrames) {
                    requestAnimationFrame(animate);
                } else {
                    counterElement.textContent = targetText;

                    counterElement.classList.remove("counting");

                    counterElement.classList.add("finished");

                    setTimeout(() => {
                        counterElement.classList.remove("finished");
                    }, 600);
                }
            };

            requestAnimationFrame(animate);
        });
    }

    easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }


    get beneficiosBackgroundStyle() {
        return `
            background-image:
                linear-gradient(
                    rgba(0, 0, 0, 0.45),
                    rgba(0, 0, 0, 0.45)
            ),
            url(${this.urlBeneficiosBackground});
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        `;
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

    // big numbers imgs
    bigNumbersData = [
        {
            id: "1",
            iconSrc: `${lpObraAssets}/icon/bn-icon-guides.png`,
            value: "+450",
            displayValue: "+",
            description: " lojas espalhadas no Brasil",
        },
        {
            id: "2",
            iconSrc: `${lpObraAssets}/icon/bn-icon-cidades.png`,
            value: "+1.200",
            displayValue: "+",
            description: " cidades possuem cobertura ABC",
        },
        {
            id: "3",
            iconSrc: `${lpObraAssets}/icon/bn-icon-10x-agil.png`,
            value: "+1.000.000",
            displayValue: "0",
            description: " de itens vendidos em 2025",
        },
        {
            id: "4",
            iconSrc: `${lpObraAssets}/icon/bn-estados.png`,
            value: "+11",
            displayValue: "+",
            description: " estados do Brasil estão com a ABC",
        },
        {
            id: "5",
            iconSrc: `${lpObraAssets}/icon/bn-idade-abc.png`,
            value: `+${new Date().getFullYear() - 1958}`,
            displayValue: "+",
            description: " anos de experiência no varejo",
        },
        {
            id: "6",
            iconSrc: `${lpObraAssets}/icon/bn-icon-centros-distribuicao.png`,
            value: "23",
            displayValue: "0",
            description: " centros de distribuição no Brasil",
        },
    ];

    animateCounters(elements) {
        if (!elements || elements.length === 0) return;

        elements.forEach((counterElement) => {
            const targetText = counterElement.dataset.originalValue;

            if (!targetText) return;

            let finalValueText = targetText;
            let prefix = "";
            let suffix = "";

            if (finalValueText.startsWith("+")) {
                prefix = "+";
                finalValueText = finalValueText.substring(1);
            }

            if (finalValueText.endsWith("x")) {
                suffix = "x";
                finalValueText = finalValueText.substring(
                    0,
                    finalValueText.length - 1
                );
            }

            const cleanedValueText =
                finalValueText.replace(/\./g, "");

            const numericValue = parseFloat(cleanedValueText);

            if (isNaN(numericValue)) {
                counterElement.textContent = targetText;
                return;
            }

            const finalIntegerValue = Math.round(numericValue);

            counterElement.classList.add("counting");

            const duration = 4500;
            const frameDuration = 1000 / 60;
            const totalFrames = Math.round(duration / frameDuration);

            let frame = 0;

            const animate = () => {
                frame++;

                const progress = frame / totalFrames;

                const easedProgress = this.easeOutCubic(progress);

                const currentValue = Math.min(
                    finalIntegerValue * easedProgress,
                    finalIntegerValue
                );

                const displayValue = Math.floor(currentValue);

                const formattedDisplayValue =
                    displayValue.toLocaleString("pt-BR");

                counterElement.textContent =
                    `${prefix}${formattedDisplayValue}${suffix}`;

                if (frame < totalFrames) {
                    requestAnimationFrame(animate);
                } else {
                    counterElement.textContent = targetText;

                    counterElement.classList.remove("counting");

                    counterElement.classList.add("finished");

                    setTimeout(() => {
                        counterElement.classList.remove("finished");
                    }, 600);
                }
            };

            requestAnimationFrame(animate);
        });
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
                this.setupEntranceAnimations();
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