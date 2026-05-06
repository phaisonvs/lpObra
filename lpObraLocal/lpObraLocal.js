(function () {
  const ASSET_BASE =
    "https://abcdaconstrucao.my.site.com/lpencarte/sfsites/c/cms/delivery/media";

  const MEDIA = {
    logo: "MCQIMEUAX37NC27PV7N7UDNKPFSA",
    background: "MCQGXLH4BBAJBFFB4PM3QSHDGUH4",
    check: "MC5KOENH3UP5ENDNGGFNHQT3EANA",
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
  const scrollTriggers = document.querySelectorAll("[data-scroll-to]");

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
  const imgLogoForm = document.getElementById("img-logo-form");
  const imgLogoFooter = document.getElementById("img-logo-footer");
  const imgFormCheck = document.getElementById("img-form-check");
  let heroFrame = 0;

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
  if (imgLogoForm) {
    imgLogoForm.src = mediaUrl(MEDIA.logo);
  }
  imgLogoFooter.src = mediaUrl(MEDIA.logo);
  imgFormCheck.src = mediaUrl(MEDIA.check);
  root.style.backgroundImage = `url(${mediaUrl(MEDIA.background)})`;
  root.style.backgroundSize = "cover";
  root.style.backgroundPosition = "center";

  function setStepClass() {
    root.classList.remove("lp-step-1", "lp-step-2", "lp-step-3");
    root.classList.add(`lp-step-${state.currentStep}`);
  }

  function getHeaderOffset() {
    if (!fixedHeader) {
      return 92;
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

  function bindNavigation() {
    scrollTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (event) {
        const targetSelector = trigger.getAttribute("data-scroll-to");
        if (!targetSelector) return;

        event.preventDefault();
        scrollToTarget(targetSelector);
      });
    });
  }

  function updateHeroParallax() {
    if (!heroSection) return;

    const maxOffset = window.innerWidth <= 720 ? 42 : 160;
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
    btnSubmit.textContent = state.isSubmitting ? "CADASTRANDO..." : "CADASTRAR E VIRAR VIP";
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

  function init() {
    updateOwnerToggleUi();
    setStepClass();
    setProgress(0);
    updateLoadingState(false);
    syncButtons();
    bindEvents();
    bindNavigation();
    updateHeroParallax();
    window.addEventListener("scroll", scheduleHeroParallax, { passive: true });
    window.addEventListener("resize", scheduleHeroParallax);
    window.addEventListener("load", scheduleHeroParallax);
    updateStep1Progress();
    updateStep2Progress();
  }

  init();
})();
