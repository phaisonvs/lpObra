(function () {
  const ASSET_BASE =
    "https://abcdaconstrucao.my.site.com/lpencarte/sfsites/c/cms/delivery/media";

  const MEDIA = {
    logo: "MCQIMEUAX37NC27PV7N7UDNKPFSA",
    check: "MC5KOENH3UP5ENDNGGFNHQT3EANA",
    beneficiosIcone1: "MCL2KOEY6F25BHDDAD6OLZXG76WI",
    beneficiosIcone2: "MCS2CAWZ5TIBCOLBWERPYO53TY7A",
    beneficiosIcone3: "MCWRCTE2LHH5HGTCTCKS35KCRG6M",
    beneficiosIcone4: "MCD2RXWJWJJBBPZFXU7H7SFOAV6I",
    beneficiosBackground: "MC2CXJ5XPFWBGGJOC2YF4QGICDLI",
  };

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_COUNT = 5;
  const ALLOWED_FILE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

  function mediaUrl(id) {
    return `${ASSET_BASE}/${id}`;
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

  const root = document.getElementById("lp-obra-local-root");
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
  const scrollTriggers = document.querySelectorAll("[data-scroll-to]");
  const headerMenuBtn = document.getElementById("lp-header-menu-btn");
  const headerDrawer = document.getElementById("lp-header-drawer");
  const headerDrawerClose = document.getElementById("lp-header-drawer-close");
  const drawerLinks = document.querySelectorAll(".lp-fixed-header__drawer-link");
  const MOBILE_HEADER_MQ = window.matchMedia("(max-width: 720px)");
  const MOBILE_HEADER_REVEAL_PX = 200;

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
  let heroFrame = 0;
  let formParallaxFrame = 0;

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
      "--beneficios-vip-bg",
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

  function setStepClass() {
    root.classList.remove("lp-step-1", "lp-step-2", "lp-step-3");
    root.classList.add(`lp-step-${state.currentStep}`);
  }

  function getHeaderOffset() {
    if (!fixedHeader) {
      return 92;
    }

    if (MOBILE_HEADER_MQ.matches && root && root.classList.contains("lp-root--mobile-header-hidden")) {
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
      headerMenuBtn.addEventListener("click", function () {
        toggleHeaderDrawer();
      });
    }

    if (headerDrawerClose && headerDrawer) {
      headerDrawerClose.addEventListener("click", function () {
        closeHeaderDrawer();
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
      root.classList.toggle("lp-root--mobile-header-revealed", revealed);
      root.classList.toggle("lp-root--mobile-header-hidden", !revealed);
      if (!revealed) {
        closeHeaderDrawer();
      }
    } else {
      root.classList.remove("lp-root--mobile-header-revealed", "lp-root--mobile-header-hidden");
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
    const maxY = 72;
    const maxX = 32;
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

  function scheduleParallax() {
    scheduleHeroParallax();
    scheduleFormBgParallax();
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

  function init() {
    updateOwnerToggleUi();
    setStepClass();
    setProgress(0);
    updateLoadingState(false);
    syncButtons();
    bindEvents();
    bindMobileHeaderMenu();
    bindNavigation();
    updateMobileHeaderReveal();
    updateHeroParallax();
    updateFormBgParallax();
    window.addEventListener("scroll", scheduleParallax, { passive: true });
    window.addEventListener("scroll", scheduleHeaderReveal, { passive: true });
    window.addEventListener("resize", scheduleParallax);
    window.addEventListener("resize", scheduleHeaderReveal);
    window.addEventListener("load", scheduleParallax);
    MOBILE_HEADER_MQ.addEventListener("change", scheduleHeaderReveal);
    updateStep1Progress();
    updateStep2Progress();
  }

  init();
})();
