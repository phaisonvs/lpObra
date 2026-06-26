(function () {
  const ASSET_BASE =
    "https://abcdaconstrucao.my.site.com/lpencarte/sfsites/c/cms/delivery/media";

  const MEDIA = {
    logo: "MCAOMDZSUL4NB2VCUWVWSZOVGR7E",
    check: "MCVRWGAJ42NFFITBCCJLEOV4KKYE",
    beneficiosIcone1: "MCL2KOEY6F25BHDDAD6OLZXG76WI",
    beneficiosIcone2: "MCS2CAWZ5TIBCOLBWERPYO53TY7A",
    beneficiosIcone3: "MCWRCTE2LHH5HGTCTCKS35KCRG6M",
    beneficiosIcone4: "MCD2RXWJWJJBBPZFXU7H7SFOAV6I",
    beneficiosBackground: "MCWYKNQ3QJNNFFBIOUM3JPJILYNI",
    formBackground: "MC3AV2PUUGKZG7VLGYS7ZVLDWKKY",
    heroStatMaiorRede: "MCJVZP7WT55VBTTDDTEJ4ZZ3PIDI",
    heroStatFranquias: "MCUB6X3YZF5NELJE7KWRP3ELBQ2Q",
    heroStatEstados: "MC77V6DWHB4VFJ7C3BQ63JDR5WK4",
    heroStatAnos: "MCM3QTX3NBBJCGVCI7CRIO5B4Z6U",
  };

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_COUNT = 5;
  const ALLOWED_FILE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

  function mediaUrl(id) {
    return `${ASSET_BASE}/${id}`;
  }

  const FAQ_ITEMS = [
  {
    id: "q1",
    q: "O que é o Cadastro Sua Obra?",
    paragraphs: [
      "É uma campanha da ABC da Construção para conectar pessoas que estão reformando ou construindo a uma Guide Shop ou loja preparada para ajudar no atendimento, orçamento e escolha de produtos para a obra.",
    ],
  },
  {
    id: "q2",
    q: "Para que serve cadastrar minha obra?",
    paragraphs: [
      "O cadastro ajuda a direcionar seu atendimento de acordo com a localização da obra e as informações informadas. Assim, uma Guide Shop pode entender melhor sua necessidade e entrar em contato para apoiar os próximos passos do orçamento.",
    ],
  },
  {
    id: "q3",
    q: "Quem pode cadastrar uma obra?",
    paragraphs: [
      "Qualquer pessoa que esteja construindo, reformando ou planejando uma obra pode fazer o cadastro. O formulário também pode ser preenchido por um responsável no local, familiar, arquiteto, designer ou pessoa que esteja ajudando o dono da obra.",
    ],
  },
  {
    id: "q4",
    q: "Preciso estar com a obra em andamento para me cadastrar?",
    paragraphs: [
      "Não necessariamente. O cadastro também pode ser feito por quem ainda está planejando a reforma ou construção e quer começar a conversar sobre orçamento, produtos e atendimento.",
    ],
  },
  {
    id: "q5",
    q: "O cadastro da obra é gratuito?",
    paragraphs: [
      "Sim. O cadastro não tem custo e serve para iniciar o atendimento com uma Guide Shop ou loja relacionada à sua região ou indicação comercial.",
    ],
  },
  {
    id: "q6",
    q: "O cadastro me obriga a comprar?",
    paragraphs: [
      "Não. O cadastro não gera obrigação de compra. Ele serve para que a ABC da Construção ou uma Guide Shop entre em contato e ajude você a avançar no atendimento e no orçamento.",
    ],
  },
  {
    id: "q7",
    q: "Em quanto tempo receberei contato?",
    paragraphs: [
      "Após o envio do cadastro, a previsão é que uma Guide Shop entre em contato em até 2 dias úteis. Esse prazo ajuda a organizar o atendimento e direcionar sua solicitação corretamente.",
    ],
  },
  {
    id: "q8",
    q: "Por que preciso informar o CEP da obra?",
    paragraphs: [
      "O CEP ajuda a identificar a localização da obra e pode ser usado para sugerir uma Guide Shop ou loja mais adequada para o atendimento. Isso facilita o direcionamento e evita contatos genéricos.",
    ],
  },
  {
    id: "q9",
    q: "Quem vai entrar em contato comigo?",
    paragraphs: [
      "O contato pode ser feito por uma Guide Shop, loja ou equipe comercial vinculada à ABC da Construção, de acordo com a origem do cadastro, indicação da loja ou localização da obra.",
    ],
  },
  {
    id: "q10",
    q: "Posso falar pelo WhatsApp depois do cadastro?",
    paragraphs: [
      "Sim. O WhatsApp é o canal recomendado para acelerar a conversa depois do cadastro. Ele facilita o envio de informações, alinhamento de orçamento e continuidade do atendimento.",
    ],
  },
  {
    id: "q11",
    q: "Preciso enviar fotos da obra?",
    paragraphs: [
      "Não. O envio de fotos é opcional. Mesmo assim, quando disponíveis, as fotos podem ajudar a equipe a entender melhor a fase da obra e preparar um atendimento mais direcionado.",
    ],
  },
  {
    id: "q12",
    q: "Quais dados preciso informar no cadastro?",
    paragraphs: [
      "O formulário solicita dados básicos como CEP da obra, nome, sobrenome, responsável no local, WhatsApp, e-mail e aceite da Política de Privacidade. Esses dados ajudam a iniciar o atendimento comercial de forma organizada.",
    ],
  },
  {
    id: "q13",
    q: "Posso cadastrar uma obra de outra pessoa?",
    paragraphs: [
      "Sim, desde que você tenha relação com a obra ou esteja autorizado a informar os dados necessários. O formulário permite identificar o dono da obra e também o responsável no local.",
    ],
  },
  {
    id: "q14",
    q: "Como a loja ou Guide Shop é definida?",
    paragraphs: [
      "Quando o cadastro vem de um link indicado por loja ou franqueado, essa origem comercial pode ser considerada. Quando não há indicação, a localização da obra pode ajudar a sugerir uma loja ou Guide Shop mais adequada.",
    ],
  },
  {
    id: "q15",
    q: "O que acontece depois que eu envio o formulário?",
    paragraphs: [
      "Você verá uma confirmação de recebimento dos dados. Depois disso, uma Guide Shop ou equipe responsável deve analisar o cadastro e entrar em contato em até 2 dias úteis.",
    ],
  },
  {
    id: "q16",
    q: "Meus dados estarão seguros?",
    paragraphs: [
      "Os dados informados devem ser usados para atendimento relacionado à sua obra, conforme a Política de Privacidade aceita no formulário. Comunicações promocionais por e-mail, SMS ou WhatsApp devem depender de aceite específico, quando aplicável.",
    ],
  },
  {
    id: "q17",
    q: "Posso receber comunicações por WhatsApp, SMS ou e-mail?",
    paragraphs: [
      "Sim, desde que você autorize esse tipo de comunicação no formulário. Essa autorização é opcional e ajuda a mantê-lo informado sobre atendimento, oportunidades e campanhas relacionadas.",
    ],
  },
  {
    id: "q18",
    q: "A campanha é para qualquer cidade?",
    paragraphs: [
      "O cadastro pode ser feito informando o CEP da obra. A disponibilidade de atendimento e o direcionamento para loja ou Guide Shop dependem da região e da operação comercial vinculada ao cadastro.",
    ],
  },
  {
    id: "q19",
    q: "O que é uma Guide Shop?",
    paragraphs: [
      "Guide Shop é um ponto de atendimento preparado para orientar o cliente na escolha de produtos, composição de orçamento e próximos passos da compra para reforma ou construção.",
    ],
  },
  {
    id: "q20",
    q: "A campanha faz parte do Pé na Obra?",
    paragraphs: [
      "A campanha pode estar relacionada ao guarda-chuva Pé na Obra, mas a comunicação principal da landing page deve ser Cadastro Sua Obra, com foco em captar interessados em construir, reformar e avançar no orçamento.",
    ],
  },
  ];

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function mountFaqAccordion() {
    const root = document.getElementById("lp-faq-accordion-root");
    if (!root || !FAQ_ITEMS.length) return;
    root.innerHTML = FAQ_ITEMS.map(function (item, index) {
      const paras = item.paragraphs
        .map(function (p) {
          return '<p class="lp-faq-accordion-text">' + escapeHtml(p) + "</p>";
        })
        .join("");
      return (
        '<div class="lp-faq-accordion-item">' +
        '<button type="button" class="lp-faq-accordion-header" data-index="' +
        index +
        '" aria-expanded="false" aria-controls="lp-faq-panel-' +
        item.id +
        '" id="lp-faq-heading-' +
        item.id +
        '">' +
        '<span class="lp-faq-accordion-title">' +
        escapeHtml(item.q) +
        '</span><span class="lp-faq-accordion-icon" aria-hidden="true"></span></button>' +
        '<div class="lp-faq-accordion-content" id="lp-faq-panel-' +
        item.id +
        '" role="region" aria-labelledby="lp-faq-heading-' +
        item.id +
        '">' +
        paras +
        "</div></div>"
      );
    }).join("");
    root.addEventListener("click", function onFaqAccordionClick(e) {
      const header = e.target.closest(".lp-faq-accordion-header");
      if (!header || !root.contains(header)) return;
      const item = header.closest(".lp-faq-accordion-item");
      if (!item) return;
      const was = item.classList.contains("ativo");
      root.querySelectorAll(".lp-faq-accordion-item").forEach(function (el) {
        el.classList.remove("ativo");
        const h = el.querySelector(".lp-faq-accordion-header");
        if (h) h.setAttribute("aria-expanded", "false");
      });
      if (!was) {
        item.classList.add("ativo");
        header.setAttribute("aria-expanded", "true");
      }
    });
  }

  function normalizeDigits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function formatCep(value) {
    const digits = normalizeDigits(value).slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  function formatPhone(value) {
    const digits = normalizeDigits(value).slice(0, 11);
    if (!digits) return "";

    if (digits.length <= 2) {
      return `(${digits}`;
    }

    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);

    if (rest.length <= 4) {
      return `(${ddd}) ${rest}`;
    }

    if (rest.length <= 8) {
      return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
    }

    return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
  }

  function sanitizeName(value) {
    return String(value || "")
      .replace(/[^A-Za-zÀ-ÿ\s'-]/g, "")
      .replace(/\s+/g, " ")
      .trimStart();
  }

  function buildIdLead(firstName, lastName, phoneDigits) {
    return `${firstName}${lastName.replace(/\s+/g, "")}${phoneDigits}`;
  }

  function getQueryParams() {
    return new URLSearchParams(window.location.search);
  }

  const root = document.getElementById("pagina-obra");
  const progressBarFill = document.getElementById("progress-bar-fill");
  const progressText = document.getElementById("progress-text");
  const btnNext1 = document.getElementById("btn-next-step1");
  const btnPrev2 = document.getElementById("btn-prev-step2");
  const btnSubmit = document.getElementById("btn-submit");
  const btnReset = document.getElementById("btn-reset");
  const submitLoadingOverlay = document.getElementById("submit-loading-overlay");
  const formsContainer = document.querySelector(".forms");
  const formElement = document.getElementById("lp-form");
  const fixedHeader = document.querySelector(".lp-fixed-header");
  const heroSection = document.getElementById("lp-hero");
  const formSection = document.getElementById("lp-form-anchor");
  if (formSection) {
    formSection.style.setProperty("--form-bg-image", `url("${mediaUrl(MEDIA.formBackground)}")`);
  }
  const scrollTriggers = document.querySelectorAll("[data-scroll-to]");
  const headerMenuBtn = document.getElementById("lp-header-menu-btn");
  const headerDrawer = document.getElementById("lp-header-drawer");
  const drawerLinks = document.querySelectorAll(".lp-fixed-header__drawer-link");
  const MOBILE_HEADER_MQ = window.matchMedia("(max-width: 720px)");
  const MOBILE_HEADER_REVEAL_PX = 200;
  let lastMobileHeaderRevealed = null;

  const elCep = document.getElementById("cepclient");
  const elName = document.getElementById("name");
  const elLastname = document.getElementById("lastname");
  const elResponsibleName = document.getElementById("responsibleName");
  const elIsOwner = document.getElementById("isOwner");
  const elTel = document.getElementById("tel");
  const elEmail = document.getElementById("email");
  const elPrivacy = document.getElementById("privacyPolicy");
  const elMarketing = document.getElementById("marketingConsent");
  const elObraPhotos = document.getElementById("obraPhotos");
  const elUploadDropzone = document.getElementById("upload-dropzone");
  const elUploadFileList = document.getElementById("upload-file-list");
  const elUploadFeedback = document.getElementById("upload-feedback");
  const elOwnerState = document.getElementById("owner-state");
  const imgLogoHero = document.getElementById("img-logo-hero");
  const imgLogoFooter = document.getElementById("img-logo-footer");
  const imgFormCheck = document.getElementById("img-form-check");
  const beneficiosSection = document.getElementById("lp-beneficios-vip");
  const imgBeneficioVip1 = document.getElementById("img-beneficio-vip-1");
  const imgBeneficioVip2 = document.getElementById("img-beneficio-vip-2");
  const imgBeneficioVip3 = document.getElementById("img-beneficio-vip-3");
  const imgBeneficioVip4 = document.getElementById("img-beneficio-vip-4");
  const imgHeroStat1 = document.getElementById("lp-hero-stat-icon-1");
  const imgHeroStat2 = document.getElementById("lp-hero-stat-icon-2");
  const imgHeroStat3 = document.getElementById("lp-hero-stat-icon-3");
  const imgHeroStat4 = document.getElementById("lp-hero-stat-icon-4");
  let heroFrame = 0;
  let formParallaxFrame = 0;
  let beneficiosParallaxFrame = 0;

  const queryParams = getQueryParams();

  const initialContext = {
    origemLead: "Hotsite",
    campanha: "Cadastro sua obra",
    tipoLead: "Obra",
    canal: "LP",
    storeRef: queryParams.get("storeRef") || "",
    lojaIndicadora: queryParams.get("storeRef") || "",
    lojaSugerida: "",
    utm_source: queryParams.get("utm_source") || "",
    utm_medium: queryParams.get("utm_medium") || "",
    utm_campaign: queryParams.get("utm_campaign") || "",
    utm_content: queryParams.get("utm_content") || "",
    pageUrl: window.location.href,
    dataHoraCadastro: new Date().toISOString(),
  };

  const state = {
    currentStep: 1,
    progress: 0,
    validEmail: false,
    isSubmitting: false,
    selectedFiles: [],
    context: { ...initialContext },
    formData: {
      cepclient: "",
      ceplead: "",
      name: "",
      lastname: "",
      responsibleName: "",
      isOwner: true,
      email: "",
      tel: "",
      privacyPolicy: false,
      marketingConsent: false,
      firstName: "",
      lastName: "",
      idLead: "",
      recordtypeDevName: "Cliente_Final",
      company: "ABC",
      company2: "Cliente_Final",
      owner: "005bJ000006pPLxQAM",
      canalDeEntrada: "Landing Page Catalogo",
      nameGuideShop: "",
      ...initialContext,
      photos: [],
    },
  };

  window.dataLayer = window.dataLayer || [];

  imgLogoHero.src = mediaUrl(MEDIA.logo);
  imgLogoFooter.src = mediaUrl(MEDIA.logo);
  imgFormCheck.src = mediaUrl(MEDIA.check);

  if (beneficiosSection) {
    beneficiosSection.style.setProperty(
      "--beneficios-bg-image",
      `url("${mediaUrl(MEDIA.beneficiosBackground)}")`
    );
  }

  if (imgBeneficioVip1) {
    imgBeneficioVip1.src = mediaUrl(MEDIA.beneficiosIcone1);
  }

  if (imgBeneficioVip2) {
    imgBeneficioVip2.src = mediaUrl(MEDIA.beneficiosIcone2);
  }

  if (imgBeneficioVip3) {
    imgBeneficioVip3.src = mediaUrl(MEDIA.beneficiosIcone3);
  }

  if (imgBeneficioVip4) {
    imgBeneficioVip4.src = mediaUrl(MEDIA.beneficiosIcone4);
  }

  if (imgHeroStat1) {
    imgHeroStat1.src = mediaUrl(MEDIA.heroStatMaiorRede);
  }

  if (imgHeroStat2) {
    imgHeroStat2.src = mediaUrl(MEDIA.heroStatFranquias);
  }

  if (imgHeroStat3) {
    imgHeroStat3.src = mediaUrl(MEDIA.heroStatEstados);
  }

  if (imgHeroStat4) {
    imgHeroStat4.src = mediaUrl(MEDIA.heroStatAnos);
  }

  function setStepClass() {
    root.classList.remove("etapa-1", "etapa-2", "etapa-3");
    root.classList.add(`etapa-${state.currentStep}`);
  }

  function getHeaderOffset() {
    if (!fixedHeader) {
      return 92;
    }

    if (MOBILE_HEADER_MQ.matches && root && root.classList.contains("cabecalho-mobile--oculto")) {
      return 0;
    }

    return Math.ceil(fixedHeader.getBoundingClientRect().height + 12);
  }

  function scrollToTarget(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    window.scrollTo({
      top: Math.max(0, top),
      behavior: "smooth",
    });
  }

  function syncHeaderMenuBtnLabel() {
    if (!headerMenuBtn || !headerDrawer) return;
    headerMenuBtn.setAttribute("aria-label", headerDrawer.hidden ? "Abrir menu" : "Fechar menu");
  }

  function closeHeaderDrawer() {
    if (!fixedHeader || !headerMenuBtn || !headerDrawer) return;
    headerMenuBtn.setAttribute("aria-expanded", "false");
    headerDrawer.hidden = true;
    syncHeaderMenuBtnLabel();
  }

  function toggleHeaderDrawer() {
    if (!fixedHeader || !headerMenuBtn || !headerDrawer) return;
    const open = headerDrawer.hidden;
    headerMenuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    headerDrawer.hidden = !open;
    syncHeaderMenuBtnLabel();
  }

  function bindMobileHeaderMenu() {
    if (headerMenuBtn && headerDrawer) {
      headerMenuBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        toggleHeaderDrawer();
      });
    }

    drawerLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeHeaderDrawer();
      });
    });

    document.addEventListener("click", function (event) {
      if (!fixedHeader || !headerDrawer || headerDrawer.hidden) return;
      const t = event.target;
      if (fixedHeader.contains(t)) return;
      closeHeaderDrawer();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeHeaderDrawer();
      }
    });
  }

  function updateMobileHeaderReveal() {
    if (!root || !fixedHeader) return;
    const mobile = MOBILE_HEADER_MQ.matches;
    if (mobile) {
      const revealed = window.scrollY >= MOBILE_HEADER_REVEAL_PX;
      if (lastMobileHeaderRevealed === true && !revealed) {
        closeHeaderDrawer();
      }
      lastMobileHeaderRevealed = revealed;
      root.classList.toggle("cabecalho-mobile--visivel", revealed);
      root.classList.toggle("cabecalho-mobile--oculto", !revealed);
    } else {
      lastMobileHeaderRevealed = null;
      root.classList.remove("cabecalho-mobile--visivel", "cabecalho-mobile--oculto");
      closeHeaderDrawer();
    }
  }

  function bindNavigation() {
    scrollTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (event) {
        const targetSelector = trigger.getAttribute("data-scroll-to");
        if (!targetSelector) return;

        event.preventDefault();
        scrollToTarget(targetSelector);
        closeHeaderDrawer();
      });
    });
  }

  function updateHeroParallax() {
    if (!heroSection || !root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.style.setProperty("--hero-parallax", "0px");
      return;
    }

    if (window.innerWidth <= 720) {
      root.style.setProperty("--hero-parallax", "0px");
      return;
    }
    const maxOffset = 160;
    const nextOffset = Math.min(window.scrollY * 0.24, maxOffset);
    root.style.setProperty("--hero-parallax", `${nextOffset}px`);
  }

  function scheduleHeroParallax() {
    if (heroFrame) return;

    heroFrame = window.requestAnimationFrame(function () {
      heroFrame = 0;
      updateHeroParallax();
    });
  }

  function updateFormBgParallax() {
    if (!formSection) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      formSection.style.setProperty("--form-bg-parallax-y", "0px");
      formSection.style.setProperty("--form-bg-parallax-x", "0px");
      return;
    }

    if (window.innerWidth <= 720) {
      formSection.style.setProperty("--form-bg-parallax-y", "0px");
      formSection.style.setProperty("--form-bg-parallax-x", "0px");
      return;
    }

    const vh = window.innerHeight || 1;
    const rect = formSection.getBoundingClientRect();
    if (rect.bottom < -100 || rect.top > vh + 100) {
      return;
    }

    const scrollMid = window.scrollY + vh * 0.5;
    const sectionMid =
      formSection.offsetTop + formSection.offsetHeight * 0.5;
    const delta = scrollMid - sectionMid;
    const maxY = 44;
    const maxX = 20;
    const py = Math.max(-maxY, Math.min(maxY, delta * 0.1));
    const px = Math.max(-maxX, Math.min(maxX, delta * 0.04));
    formSection.style.setProperty("--form-bg-parallax-y", `${py}px`);
    formSection.style.setProperty("--form-bg-parallax-x", `${px}px`);
  }

  function scheduleFormBgParallax() {
    if (formParallaxFrame) return;

    formParallaxFrame = window.requestAnimationFrame(function () {
      formParallaxFrame = 0;
      updateFormBgParallax();
    });
  }

  function updateBeneficiosParallax() {
    if (!beneficiosSection) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth <= 720) {
      beneficiosSection.style.setProperty("--beneficios-bg-parallax-y", "0px");
      beneficiosSection.style.setProperty("--beneficios-bg-parallax-x", "0px");
      return;
    }

    const vh = window.innerHeight || 1;
    const rect = beneficiosSection.getBoundingClientRect();
    if (rect.bottom < -100 || rect.top > vh + 100) {
      return;
    }

    const scrollMid = window.scrollY + vh * 0.5;
    const sectionMid = beneficiosSection.offsetTop + beneficiosSection.offsetHeight * 0.5;
    const delta = scrollMid - sectionMid;
    const maxY = 56;
    const maxX = 22;
    const py = Math.max(-maxY, Math.min(maxY, delta * 0.08));
    const px = Math.max(-maxX, Math.min(maxX, delta * 0.03));
    beneficiosSection.style.setProperty("--beneficios-bg-parallax-y", `${py}px`);
    beneficiosSection.style.setProperty("--beneficios-bg-parallax-x", `${px}px`);
  }

  function scheduleBeneficiosParallax() {
    if (beneficiosParallaxFrame) return;

    beneficiosParallaxFrame = window.requestAnimationFrame(function () {
      beneficiosParallaxFrame = 0;
      updateBeneficiosParallax();
    });
  }

  function scheduleParallax() {
    scheduleHeroParallax();
    scheduleFormBgParallax();
    scheduleBeneficiosParallax();
  }

  function updateLoadingState(isVisible) {
    if (submitLoadingOverlay) {
      submitLoadingOverlay.classList.toggle("is-visible", isVisible);
      submitLoadingOverlay.setAttribute("aria-hidden", isVisible ? "false" : "true");
    }

    if (formsContainer) {
      formsContainer.classList.toggle("is-submitting", isVisible);
    }

    if (formElement) {
      formElement.inert = isVisible;
      formElement.setAttribute("aria-hidden", isVisible ? "true" : "false");
    }
  }

  function updateOwnerToggleUi() {
    const isOwner = elIsOwner.checked;
    state.formData.isOwner = isOwner;
    elOwnerState.textContent = isOwner ? "Sim" : "Não";
    elResponsibleName.required = !isOwner;
  }

  function setProgress(value) {
    state.progress = Math.max(0, Math.min(100, value));

    if (state.currentStep !== 3 && progressBarFill && progressText) {
      progressBarFill.style.width = `${state.progress}%`;
      progressText.textContent = `${state.progress}%`;
    }
  }

  function updateStep1Progress() {
    const cepDigits = normalizeDigits(state.formData.cepclient).length;
    const stepProgress = Math.round((Math.min(cepDigits, 8) / 8) * 45);
    setProgress(stepProgress);
    syncButtons();
  }

  function getStep2Progress() {
    const fields = [];

    fields.push(state.formData.name.trim().length > 1);
    fields.push(state.formData.lastname.trim().length > 1);
    fields.push(!isResponsibleRequired() || state.formData.responsibleName.trim().length > 1);
    fields.push(normalizeDigits(state.formData.tel).length >= 10);
    fields.push(state.validEmail);
    fields.push(state.formData.privacyPolicy);

    const completedCount = fields.filter(Boolean).length;
    const progressRatio = fields.length ? completedCount / fields.length : 0;
    return 45 + Math.round(progressRatio * 50);
  }

  function isResponsibleRequired() {
    return !state.formData.isOwner;
  }

  function isStep2Valid() {
    const cepValid = /^\d{5}-\d{3}$/.test(state.formData.cepclient);
    const nameValid = state.formData.name.trim().length > 1;
    const lastnameValid = state.formData.lastname.trim().length > 1;
    const responsibleValid =
      !isResponsibleRequired() || state.formData.responsibleName.trim().length > 1;
    const telValid = normalizeDigits(state.formData.tel).length >= 10;
    const emailValid = state.validEmail;
    const privacyValid = state.formData.privacyPolicy;

    return (
      cepValid &&
      nameValid &&
      lastnameValid &&
      responsibleValid &&
      telValid &&
      emailValid &&
      privacyValid
    );
  }

  function updateStep2Progress() {
    if (state.currentStep === 2) {
      setProgress(getStep2Progress());
    }

    syncButtons();
  }

  function syncButtons() {
    const step1Disabled = !/^\d{5}-\d{3}$/.test(state.formData.cepclient) || state.isSubmitting;
    btnNext1.disabled = step1Disabled;
    btnNext1.className = "botao-proxima-etapa" + (step1Disabled ? "" : " selected");

    const step2Ready = isStep2Valid();
    const step2Disabled = !step2Ready || state.isSubmitting;
    btnSubmit.disabled = step2Disabled;
    btnSubmit.className =
      "botao-proxima-etapa" + (step2Ready || state.isSubmitting ? " selected" : "");
    btnSubmit.textContent = state.isSubmitting ? "CADASTRANDO..." : "QUERO SER VIP!";
    btnSubmit.setAttribute("aria-busy", state.isSubmitting ? "true" : "false");

    btnPrev2.disabled = state.isSubmitting;
  }

  function syncUploadVisibility(showFiles, showFeedback) {
    elUploadFileList.hidden = !showFiles;
    elUploadFeedback.hidden = !showFeedback;
  }

  function renderFileList() {
    if (!elUploadFileList) return;

    elUploadFileList.innerHTML = "";

    if (!state.selectedFiles.length) {
      elUploadFeedback.textContent = "";
      elUploadDropzone.classList.remove("has-files");
      syncUploadVisibility(false, false);
      return;
    }

    syncUploadVisibility(true, true);
    elUploadDropzone.classList.add("has-files");
    const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    const totalSize = state.selectedFiles.reduce((acc, file) => acc + file.size, 0);

    state.selectedFiles.forEach((file) => {
      const item = document.createElement("li");
      item.className = "upload-file-item";
      item.textContent = `${file.name} • ${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      elUploadFileList.appendChild(item);
    });

    elUploadFeedback.textContent =
      totalSize > maxSizeBytes * MAX_FILE_COUNT
        ? "Atenção: revise o volume total de fotos para evitar exceder o limite recomendado."
        : `${state.selectedFiles.length} foto(s) pronta(s) para envio.`;
    elUploadFeedback.classList.remove("is-error");
    elUploadFeedback.classList.add("is-success");
  }

  function setUploadError(message) {
    elUploadFeedback.textContent = message;
    elUploadFeedback.classList.remove("is-success");
    elUploadFeedback.classList.add("is-error");
    syncUploadVisibility(state.selectedFiles.length > 0, true);
  }

  function syncFormState() {
    state.formData.photos = state.selectedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }));
  }

  function addFiles(fileList) {
    const incomingFiles = Array.from(fileList || []);
    if (!incomingFiles.length) return;

    const existingKeys = new Set(
      state.selectedFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
    );
    const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    let changed = false;

    for (const file of incomingFiles) {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      const extension = file.name.split(".").pop().toLowerCase();
      const isAllowedType = ALLOWED_FILE_TYPES.has(file.type);
      const isAllowedExtension = ["jpg", "jpeg", "png", "webp"].includes(extension);

      if (!isAllowedType && !isAllowedExtension) {
        setUploadError(`"${file.name}" não foi adicionado. Use JPG, JPEG, PNG ou WEBP.`);
        continue;
      }

      if (file.size > maxSizeBytes) {
        setUploadError(`"${file.name}" excede o limite de ${MAX_FILE_SIZE_MB} MB.`);
        continue;
      }

      if (existingKeys.has(key)) {
        continue;
      }

      if (state.selectedFiles.length >= MAX_FILE_COUNT) {
        setUploadError(`Limite de ${MAX_FILE_COUNT} fotos atingido.`);
        break;
      }

      state.selectedFiles.push(file);
      existingKeys.add(key);
      changed = true;
    }

    if (changed) {
      renderFileList();
      syncFormState();
      updateStep2Progress();
    }
  }

  function setSubmitting(isSubmitting) {
    state.isSubmitting = isSubmitting;
    updateLoadingState(isSubmitting);
    syncButtons();
  }

  function updateHiddenContext() {
    state.formData.ceplead = state.formData.cepclient;
    state.formData.firstName = state.formData.name.trim();
    state.formData.lastName = state.formData.lastname.trim();
    state.formData.nameGuideShop =
      state.context.lojaIndicadora || state.context.lojaSugerida || "";
    state.formData.pageUrl = window.location.href;
    state.formData.dataHoraCadastro = new Date().toISOString();
    state.context.pageUrl = state.formData.pageUrl;
    state.context.dataHoraCadastro = state.formData.dataHoraCadastro;
  }

  function pushDataLayer() {
    window.dataLayer.push({
      event: "Lead",
      email: state.formData.email,
      phone: state.formData.tel,
      cep: state.formData.cepclient,
      storeRef: state.context.storeRef,
      isOwner: state.formData.isOwner,
      hasPhotos: state.selectedFiles.length > 0,
    });
  }

  function showSuccessState() {
    state.currentStep = 3;
    state.progress = 100;
    setStepClass();

    if (progressBarFill) {
      progressBarFill.style.width = "100%";
    }

    if (progressText) {
      progressText.textContent = "100%";
    }

    syncButtons();
  }

  function submitLead() {
    if (state.isSubmitting || !isStep2Valid()) return;

    updateHiddenContext();
    state.formData.idLead = buildIdLead(
      state.formData.firstName,
      state.formData.lastName,
      normalizeDigits(state.formData.tel)
    );
    state.formData.marketingConsent = String(state.formData.marketingConsent);
    state.formData.privacyPolicy = String(state.formData.privacyPolicy);
    state.formData.isOwner = state.formData.isOwner;
    state.formData.lojaIndicadora = state.context.lojaIndicadora;
    state.formData.lojaSugerida = state.context.lojaSugerida;
    state.formData.origemLead = state.context.origemLead;
    state.formData.campanha = state.context.campanha;
    state.formData.tipoLead = state.context.tipoLead;
    state.formData.canal = state.context.canal;
    state.formData.storeRef = state.context.storeRef;
    state.formData.utm_source = state.context.utm_source;
    state.formData.utm_medium = state.context.utm_medium;
    state.formData.utm_campaign = state.context.utm_campaign;
    state.formData.utm_content = state.context.utm_content;
    state.formData.pageUrl = state.context.pageUrl;
    state.formData.dataHoraCadastro = state.context.dataHoraCadastro;

    setSubmitting(true);

    window.setTimeout(function () {
      console.log("PUSH:", JSON.stringify(state.formData));
      console.log("submit ok (local preview)");
      pushDataLayer();
      setSubmitting(false);
      showSuccessState();
    }, 2500);
  }

  function resetForm() {
    state.currentStep = 1;
    state.progress = 0;
    state.validEmail = false;
    state.isSubmitting = false;
    state.selectedFiles = [];
    state.context = { ...initialContext };
    state.formData = {
      cepclient: "",
      ceplead: "",
      name: "",
      lastname: "",
      responsibleName: "",
      isOwner: true,
      email: "",
      tel: "",
      privacyPolicy: false,
      marketingConsent: false,
      firstName: "",
      lastName: "",
      idLead: "",
      recordtypeDevName: "Cliente_Final",
      company: "ABC",
      company2: "Cliente_Final",
      owner: "005bJ000006pPLxQAM",
      canalDeEntrada: "Landing Page Catalogo",
      nameGuideShop: "",
      ...initialContext,
      photos: [],
    };

    elCep.value = "";
    elName.value = "";
    elLastname.value = "";
    elResponsibleName.value = "";
    elIsOwner.checked = true;
    elTel.value = "";
    elEmail.value = "";
    elPrivacy.checked = false;
    elMarketing.checked = false;
    elObraPhotos.value = "";
    elUploadFileList.innerHTML = "";
    elUploadFeedback.textContent = "";
    elUploadFeedback.classList.remove("is-error", "is-success");
    syncUploadVisibility(false, false);
    elUploadDropzone.classList.remove("has-files", "is-dragover");
    updateOwnerToggleUi();
    setStepClass();
    setProgress(0);
    updateLoadingState(false);
    syncButtons();
  }

  function bindEvents() {
    elCep.addEventListener("input", function (event) {
      const formattedValue = formatCep(event.target.value);
      event.target.value = formattedValue;
      state.formData.cepclient = formattedValue;
      updateStep1Progress();
      updateStep2Progress();
    });

    elCep.addEventListener("change", function (event) {
      state.formData.cepclient = formatCep(event.target.value);
      event.target.value = state.formData.cepclient;
      updateStep1Progress();
      updateStep2Progress();
    });

    elName.addEventListener("input", function (event) {
      const value = sanitizeName(event.target.value);
      event.target.value = value;
      state.formData.name = value;
      updateStep2Progress();
    });

    elLastname.addEventListener("input", function (event) {
      const value = sanitizeName(event.target.value);
      event.target.value = value;
      state.formData.lastname = value;
      updateStep2Progress();
    });

    elResponsibleName.addEventListener("input", function (event) {
      const value = sanitizeName(event.target.value);
      event.target.value = value;
      state.formData.responsibleName = value;
      updateStep2Progress();
    });

    elIsOwner.addEventListener("change", function (event) {
      state.formData.isOwner = event.target.checked;
      updateOwnerToggleUi();
      updateStep2Progress();
    });

    elTel.addEventListener("input", function (event) {
      const formattedValue = formatPhone(event.target.value);
      event.target.value = formattedValue;
      state.formData.tel = normalizeDigits(formattedValue);
      updateStep2Progress();
    });

    elTel.addEventListener("change", function (event) {
      const formattedValue = formatPhone(event.target.value);
      event.target.value = formattedValue;
      state.formData.tel = normalizeDigits(formattedValue);
      updateStep2Progress();
    });

    elEmail.addEventListener("input", function (event) {
      state.formData.email = event.target.value.trim();
      state.validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.formData.email);
      updateStep2Progress();
    });

    elPrivacy.addEventListener("change", function (event) {
      state.formData.privacyPolicy = event.target.checked;
      updateStep2Progress();
    });

    elMarketing.addEventListener("change", function (event) {
      state.formData.marketingConsent = event.target.checked;
    });

    elObraPhotos.addEventListener("change", function (event) {
      addFiles(event.target.files);
      event.target.value = "";
    });

    elUploadDropzone.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        elObraPhotos.click();
      }
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      elUploadDropzone.addEventListener(eventName, function (event) {
        event.preventDefault();
        event.stopPropagation();
        elUploadDropzone.classList.add("is-dragover");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      elUploadDropzone.addEventListener(eventName, function (event) {
        event.preventDefault();
        event.stopPropagation();
        elUploadDropzone.classList.remove("is-dragover");
      });
    });

    elUploadDropzone.addEventListener("drop", function (event) {
      const files = event.dataTransfer && event.dataTransfer.files;
      if (files && files.length) {
        addFiles(files);
      }
    });

    btnNext1.addEventListener("click", function () {
      if (btnNext1.disabled) return;
      state.currentStep = 2;
      setStepClass();
      setProgress(45);
      syncButtons();
      updateOwnerToggleUi();
    });

    btnPrev2.addEventListener("click", function () {
      if (btnPrev2.disabled) return;
      state.currentStep = 1;
      setStepClass();
      updateStep1Progress();
      syncButtons();
    });

    btnSubmit.addEventListener("click", function () {
      submitLead();
    });

    btnReset.addEventListener("click", function () {
      resetForm();
    });
  }

  function scheduleHeaderReveal() {
    updateMobileHeaderReveal();
  }

  function initHeroContentEntrance() {
    const el = document.querySelector(".lp-hero__content");
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.addEventListener(
      "animationend",
      function onHeroContentInEnd(e) {
        const name = e.animationName || "";
        if (!name.includes("lp-hero-content-in")) return;
        el.removeEventListener("animationend", onHeroContentInEnd);
        el.classList.add("lp-hero-content--settled");
      }
    );
  }

  function init() {
    updateOwnerToggleUi();
    setStepClass();
    setProgress(0);
    updateLoadingState(false);
    syncButtons();
    bindEvents();
    bindMobileHeaderMenu();
    bindNavigation();
    mountFaqAccordion();
    updateMobileHeaderReveal();
    updateHeroParallax();
    updateFormBgParallax();
    updateBeneficiosParallax();
    window.addEventListener("scroll", scheduleParallax, { passive: true });
    window.addEventListener("scroll", scheduleHeaderReveal, { passive: true });
    window.addEventListener("resize", scheduleParallax);
    window.addEventListener("resize", scheduleHeaderReveal);
    window.addEventListener("load", scheduleParallax);
    MOBILE_HEADER_MQ.addEventListener("change", scheduleHeaderReveal);
    updateStep1Progress();
    updateStep2Progress();
    initHeroContentEntrance();
  }

  init();
})();
