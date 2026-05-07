import { LightningElement, track } from "lwc";
import basePath from "@salesforce/community/basePath";
import upsertLead from "@salesforce/apex/LpSejaUmFranqueadoService.upsertLead";

const SCROLL_EVT = "lpobra-scroll";
const MEDIA_CHECK = "MCVRWGAJ42NFFITBCCJLEOV4KKYE";
const MEDIA_FORM_BG = "MC3AV2PUUGKZG7VLGYS7ZVLDWKKY";
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_COUNT = 5;
const ALLOWED_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const ORIGEM_LEAD = "Hotsite";
const CAMPANHA = "Cadastro Sua Obra";
const TIPO_LEAD = "Obra";
const CANAL = "LP";
const CANAL_DE_ENTRADA = "Landing Page Catalogo";
const RECORDTYPE_DEV_NAME = "Cliente_Final";
const COMPANY = "ABC";
const COMPANY2 = "Cliente_Final";

function mediaUrl(id) {
  return `${basePath}/sfsites/c/cms/delivery/media/${id}`;
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

function readLandingQueryContext() {
  const qp = new URLSearchParams(window.location.search);
  const referralToken = qp.get("ref") || qp.get("storeRef") || "";
  const storeRef = qp.get("storeRef") || referralToken;
  return {
    origemLead: ORIGEM_LEAD,
    campanha: CAMPANHA,
    tipoLead: TIPO_LEAD,
    canal: CANAL,
    storeRef,
    referralToken,
    lojaIndicadora: referralToken,
    lojaSugerida: "",
    utm_source: qp.get("utm_source") || "",
    utm_medium: qp.get("utm_medium") || "",
    utm_campaign: qp.get("utm_campaign") || "",
    utm_content: qp.get("utm_content") || "",
    pageUrl: window.location.href,
    dataHoraCadastro: new Date().toISOString(),
  };
}

// Transitório: substituir por LpObraService.submitLead({ payloadJson: JSON.stringify(payload) }) quando o Apex dedicado existir.
async function submitLpObraLead(payload) {
  return upsertLead({ lead: JSON.stringify(payload) });
}

function apexUiMessage(error) {
  if (!error) return "";
  const b = error.body;
  if (b && Array.isArray(b.pageErrors) && b.pageErrors.length) {
    return b.pageErrors.map((p) => p.message).filter(Boolean).join(" ");
  }
  if (b && b.message) return String(b.message);
  if (error.message) return String(error.message);
  return "";
}

function parseLeadSubmitResult(raw) {
  let leadId = "";
  let guideShopName = "";
  let success = true;
  if (raw == null || raw === "") {
    return { success: true, leadId, guideShopName };
  }
  if (typeof raw === "string") {
    const t = raw.trim();
    if (/^[a-zA-Z0-9]{15,18}$/.test(t)) {
      leadId = t;
    }
    return { success: true, leadId, guideShopName };
  }
  if (typeof raw === "object") {
    if (raw.success === false) {
      success = false;
    }
    if (raw.leadId) leadId = String(raw.leadId);
    else if (raw.id) leadId = String(raw.id);
    if (raw.guideShopName) guideShopName = String(raw.guideShopName);
    return { success, leadId, guideShopName };
  }
  return { success: true, leadId, guideShopName };
}

function createInitialFormData() {
  const initialContext = readLandingQueryContext();
  return {
    data: {
      cepclient: "",
      ceplead: "",
      name: "",
      lastname: "",
      responsibleName: "",
      isOwner: true,
      email: "",
      tel: "",
      telDisplay: "",
      privacyPolicy: false,
      marketingConsent: false,
      firstName: "",
      lastName: "",
      idLead: "",
      recordtypeDevName: RECORDTYPE_DEV_NAME,
      company: COMPANY,
      company2: COMPANY2,
      canalDeEntrada: CANAL_DE_ENTRADA,
      nameGuideShop: "",
      photos: [],
      ...initialContext,
    },
    context: initialContext,
  };
}

function buildLeadPayload(formData, idLead) {
  return {
    cepclient: formData.cepclient,
    ceplead: formData.ceplead,
    name: formData.name,
    lastname: formData.lastname,
    email: formData.email,
    tel: formData.tel,
    privacyPolicy: String(formData.privacyPolicy),
    marketingConsent: String(formData.marketingConsent),
    firstName: formData.firstName,
    lastName: formData.lastName,
    idLead,
    recordtypeDevName: formData.recordtypeDevName,
    company: formData.company,
    company2: formData.company2,
    canalDeEntrada: formData.canalDeEntrada,
    nameGuideShop: formData.nameGuideShop,

    // TODO LpObraService:
    // Esses campos abaixo pertencem ao contrato futuro da LP Cadastre Sua Obra.
    // Não enviar ao LpSejaUmFranqueadoService legado enquanto ele não aceitar campos extras, booleanos, arrays ou objetos complexos.
    // responsibleName: formData.isOwner ? "" : formData.responsibleName,
    // isOwner: formData.isOwner,
    // photos: Array.isArray(formData.photos) ? formData.photos : [],
    // origemLead: formData.origemLead,
    // campanha: formData.campanha,
    // tipoLead: formData.tipoLead,
    // canal: formData.canal,
    // storeRef: formData.storeRef,
    // referralToken: formData.referralToken,
    // lojaIndicadora: formData.lojaIndicadora,
    // lojaSugerida: formData.lojaSugerida,
    // utm_source: formData.utm_source,
    // utm_medium: formData.utm_medium,
    // utm_campaign: formData.utm_campaign,
    // utm_content: formData.utm_content,
    // pageUrl: formData.pageUrl,
    // dataHoraCadastro: formData.dataHoraCadastro,
  };
}


async function uploadSelectedFiles(_leadId, _files) {
  return Promise.resolve();
}

export default class LpObraFormulario extends LightningElement {
  checkUrl = mediaUrl(MEDIA_CHECK);

  get formBgImageStyle() {
    return `--form-bg-url: url("${mediaUrl(MEDIA_FORM_BG)}");`;
  }

  @track currentStep = 1;
  @track progress = 0;
  @track validEmail = false;
  @track isSubmitting = false;
  @track selectedFiles = [];
  @track uploadFileRows = [];
  @track uploadFeedbackText = "";
  @track uploadFeedbackKind = "";
  @track dropzoneDrag = false;
  @track submitError = "";

  @track formData = {};

  _formFrame = 0;
  _onScroll = null;
  _onResize = null;
  _onScrollEvt = null;

  connectedCallback() {
    const initial = createInitialFormData();
    this.formData = initial.data;
    this._context = { ...initial.context };

    this._onScroll = () => this.scheduleFormParallax();
    this._onResize = () => this.scheduleFormParallax();
    this._onScrollEvt = (event) => {
      if (event.detail?.target === "form") {
        this.scrollSelfIntoView();
      }
    };
    window.addEventListener("scroll", this._onScroll, { passive: true });
    window.addEventListener("resize", this._onResize);
    window.addEventListener("load", this._onScroll);
    window.addEventListener(SCROLL_EVT, this._onScrollEvt);
    this.updateFormBgParallax();
    this.updateStep1Progress();
    this.updateStep2Progress();
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this._onScroll);
    window.removeEventListener("resize", this._onResize);
    window.removeEventListener("load", this._onScroll);
    window.removeEventListener(SCROLL_EVT, this._onScrollEvt);
  }

  get formRootClass() {
    return `lp-form-root etapa-${this.currentStep}`;
  }

  get formsClass() {
    return `forms${this.isSubmitting ? " is-submitting" : ""}`;
  }

  get progressBarStyle() {
    return `width: ${this.progress}%`;
  }

  get nextStep1Disabled() {
    return !/^\d{5}-\d{3}$/.test(this.formData.cepclient) || this.isSubmitting;
  }

  get nextStep1Class() {
    return "botao-proxima-etapa" + (this.nextStep1Disabled ? "" : " selected");
  }

  get submitDisabled() {
    return !this.isStep2Valid() || this.isSubmitting;
  }

  get submitBtnClass() {
    const ready = this.isStep2Valid() || this.isSubmitting;
    return "botao-proxima-etapa" + (ready ? " selected" : "");
  }

  get submitBtnLabel() {
    return this.isSubmitting ? "CADASTRANDO..." : "QUERO SER VIP!";
  }

  get submitAriaBusy() {
    return this.isSubmitting ? "true" : "false";
  }

  get ownerStateLabel() {
    return this.formData.isOwner ? "Sim" : "Não";
  }

  get overlayClass() {
    return "submit-loading-overlay" + (this.isSubmitting ? " is-visible" : "");
  }

  get overlayAriaHidden() {
    return this.isSubmitting ? "false" : "true";
  }

  get dropzoneClass() {
    let c = "upload-dropzone";
    if (this.selectedFiles.length) c += " has-files";
    if (this.dropzoneDrag) c += " is-dragover";
    return c;
  }

  get hasUploadFiles() {
    return this.uploadFileRows.length > 0;
  }

  get showUploadFeedback() {
    return Boolean(this.uploadFeedbackText);
  }

  get hasSubmitError() {
    return Boolean(this.submitError);
  }

  get uploadFeedbackClass() {
    let c = "upload-feedback";
    if (this.uploadFeedbackKind === "error") c += " is-error";
    if (this.uploadFeedbackKind === "success") c += " is-success";
    return c;
  }

  get responsibleRequired() {
    return !this.formData.isOwner;
  }

  handleFormSubmit(event) {
    event.preventDefault();
  }

  scrollSelfIntoView() {
    const el = this.template.querySelector('[data-lp-section="form"]');
    if (!el) return;
    const offset = 108;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  scheduleFormParallax() {
    if (this._formFrame) return;
    this._formFrame = window.requestAnimationFrame(() => {
      this._formFrame = 0;
      this.updateFormBgParallax();
    });
  }

  updateFormBgParallax() {
    const section = this.template.querySelector(".section-formulario");
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.style.setProperty("--form-bg-parallax-y", "0px");
      section.style.setProperty("--form-bg-parallax-x", "0px");
      return;
    }
    if (window.innerWidth <= 720) {
      section.style.setProperty("--form-bg-parallax-y", "0px");
      section.style.setProperty("--form-bg-parallax-x", "0px");
      return;
    }
    const vh = window.innerHeight || 1;
    const rect = section.getBoundingClientRect();
    if (rect.bottom < -100 || rect.top > vh + 100) return;
    const scrollMid = window.scrollY + vh * 0.5;
    const sectionMid = section.offsetTop + section.offsetHeight * 0.5;
    const delta = scrollMid - sectionMid;
    const maxY = 44;
    const maxX = 20;
    const py = Math.max(-maxY, Math.min(maxY, delta * 0.1));
    const px = Math.max(-maxX, Math.min(maxX, delta * 0.04));
    section.style.setProperty("--form-bg-parallax-y", `${py}px`);
    section.style.setProperty("--form-bg-parallax-x", `${px}px`);
  }

  setProgress(value) {
    this.progress = Math.max(0, Math.min(100, value));
  }

  updateStep1Progress() {
    const cepDigits = normalizeDigits(this.formData.cepclient).length;
    const stepProgress = Math.round((Math.min(cepDigits, 8) / 8) * 45);
    this.setProgress(stepProgress);
  }

  isResponsibleRequired() {
    return !this.formData.isOwner;
  }

  getStep2Progress() {
    const fields = [];
    fields.push(this.formData.name.trim().length > 1);
    fields.push(this.formData.lastname.trim().length > 1);
    fields.push(!this.isResponsibleRequired() || this.formData.responsibleName.trim().length > 1);
    fields.push(normalizeDigits(this.formData.tel).length >= 10);
    fields.push(this.validEmail);
    fields.push(this.formData.privacyPolicy);
    const completedCount = fields.filter(Boolean).length;
    const progressRatio = fields.length ? completedCount / fields.length : 0;
    return 45 + Math.round(progressRatio * 50);
  }

  isStep2Valid() {
    const cepValid = /^\d{5}-\d{3}$/.test(this.formData.cepclient);
    const nameValid = this.formData.name.trim().length > 1;
    const lastnameValid = this.formData.lastname.trim().length > 1;
    const responsibleValid =
      !this.isResponsibleRequired() || this.formData.responsibleName.trim().length > 1;
    const telValid = normalizeDigits(this.formData.tel).length >= 10;
    const emailValid = this.validEmail;
    const privacyValid = this.formData.privacyPolicy;
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

  updateStep2Progress() {
    if (this.currentStep === 2) {
      this.setProgress(this.getStep2Progress());
    }
  }

  handleCepInput(event) {
    const formatted = formatCep(event.target.value);
    this.formData = { ...this.formData, cepclient: formatted };
    this.updateStep1Progress();
    this.updateStep2Progress();
  }

  handleCepChange(event) {
    const formatted = formatCep(event.target.value);
    this.formData = { ...this.formData, cepclient: formatted };
    this.updateStep1Progress();
    this.updateStep2Progress();
  }

  handleNameInput(event) {
    const value = sanitizeName(event.target.value);
    this.formData = { ...this.formData, name: value };
    this.updateStep2Progress();
  }

  handleLastnameInput(event) {
    const value = sanitizeName(event.target.value);
    this.formData = { ...this.formData, lastname: value };
    this.updateStep2Progress();
  }

  handleResponsibleInput(event) {
    const value = sanitizeName(event.target.value);
    this.formData = { ...this.formData, responsibleName: value };
    this.updateStep2Progress();
  }

  handleOwnerChange(event) {
    this.formData = { ...this.formData, isOwner: event.target.checked };
    this.updateStep2Progress();
  }

  handleTelInput(event) {
    const formatted = formatPhone(event.target.value);
    const digits = normalizeDigits(formatted);
    this.formData = { ...this.formData, tel: digits, telDisplay: formatted };
    this.updateStep2Progress();
  }

  handleTelChange(event) {
    const formatted = formatPhone(event.target.value);
    const digits = normalizeDigits(formatted);
    this.formData = { ...this.formData, tel: digits, telDisplay: formatted };
    this.updateStep2Progress();
  }

  handleEmailInput(event) {
    const email = event.target.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    this.formData = { ...this.formData, email };
    this.validEmail = valid;
    this.updateStep2Progress();
  }

  handlePrivacyChange(event) {
    this.formData = { ...this.formData, privacyPolicy: event.target.checked };
    this.updateStep2Progress();
  }

  handleMarketingChange(event) {
    this.formData = { ...this.formData, marketingConsent: event.target.checked };
  }

  handleDropzoneClick() {
    const input = this.template.querySelector("#obraPhotos");
    if (input) input.click();
  }

  handleDropzoneKey(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleDropzoneClick();
    }
  }

  handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dropzoneDrag = true;
  }

  handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dropzoneDrag = true;
  }

  handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dropzoneDrag = false;
  }

  handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dropzoneDrag = false;
    const files = event.dataTransfer && event.dataTransfer.files;
    if (files && files.length) this.addFiles(files);
  }

  handlePhotosChange(event) {
    this.addFiles(event.target.files);
    event.target.value = "";
  }

  setUploadError(message) {
    this.uploadFeedbackText = message;
    this.uploadFeedbackKind = "error";
  }

  renderFileList() {
    if (!this.selectedFiles.length) {
      this.uploadFileRows = [];
      this.uploadFeedbackText = "";
      this.uploadFeedbackKind = "";
      return;
    }
    const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    const totalSize = this.selectedFiles.reduce((acc, file) => acc + file.size, 0);
    this.uploadFileRows = this.selectedFiles.map((file, i) => ({
      key: `${file.name}-${file.size}-${file.lastModified}-${i}`,
      label: `${file.name} • ${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    }));
    this.uploadFeedbackText =
      totalSize > maxSizeBytes * MAX_FILE_COUNT
        ? "Atenção: revise o volume total de arquivos para evitar exceder o limite recomendado."
        : `${this.selectedFiles.length} arquivo(s) pronto(s) para envio.`;
    this.uploadFeedbackKind = "success";
  }

  addFiles(fileList) {
    const incomingFiles = Array.from(fileList || []);
    if (!incomingFiles.length) return;
    const existingKeys = new Set(
      this.selectedFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
    );
    const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    let changed = false;
    const next = [...this.selectedFiles];
    for (const file of incomingFiles) {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      const extension = file.name.split(".").pop().toLowerCase();
      const isAllowedType = ALLOWED_FILE_TYPES.has(file.type);
      const isAllowedExtension = ["jpg", "jpeg", "png", "webp", "pdf"].includes(extension);
      if (!isAllowedType && !isAllowedExtension) {
        this.setUploadError(`"${file.name}" não foi adicionado. Use JPG, JPEG, PNG, WEBP ou PDF.`);
        continue;
      }
      if (file.size > maxSizeBytes) {
        this.setUploadError(`"${file.name}" excede o limite de ${MAX_FILE_SIZE_MB} MB.`);
        continue;
      }
      if (existingKeys.has(key)) continue;
      if (next.length >= MAX_FILE_COUNT) {
        this.setUploadError(`Limite de ${MAX_FILE_COUNT} arquivos atingido.`);
        break;
      }
      next.push(file);
      existingKeys.add(key);
      changed = true;
    }
    if (changed) {
      this.selectedFiles = next;
      this.syncFormPhotos();
      this.renderFileList();
      this.updateStep2Progress();
    }
  }

  syncFormPhotos() {
    // TODO Salesforce: hoje "photos" contém metadados de imagens/PDFs. Valida...
    this.formData = {
      ...this.formData,
      photos: this.selectedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      })),
    };
  }

  updateHiddenContext() {
    const pageUrl = window.location.href;
    const dataHoraCadastro = new Date().toISOString();
    this.formData = {
      ...this.formData,
      ceplead: this.formData.cepclient,
      firstName: this.formData.name.trim(),
      lastName: this.formData.lastname.trim(),
      // O token/referral deve ser resolvido no Apex para encontrar a Guide Shop real. Não usar referralToken como nameGuideShop.
      nameGuideShop: this.formData.lojaSugerida || "",
      pageUrl,
      dataHoraCadastro,
    };
    this._context = { ...this._context, pageUrl, dataHoraCadastro };
  }

  pushDataLayerAfterSuccess({ leadId, guideShopName }) {
    const w = window;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: "Lead",
      formName: CAMPANHA,
      email: this.formData.email,
      phone: this.formData.tel,
      cep: this.formData.cepclient,
      storeRef: this.formData.storeRef,
      referralToken: this.formData.referralToken,
      leadId: leadId || "",
      guideShopName: guideShopName || "",
      utm_source: this.formData.utm_source,
      utm_medium: this.formData.utm_medium,
      utm_campaign: this.formData.utm_campaign,
      utm_content: this.formData.utm_content,
      isOwner: this.formData.isOwner,
      // Mantido por compatibilidade; preferir hasFiles/fileCount para o fluxo atual.
      hasPhotos: this.selectedFiles.length > 0,
      hasFiles: this.selectedFiles.length > 0,
      fileCount: this.selectedFiles.length,
    });
  }

  handleNextStep1() {
    if (this.nextStep1Disabled) return;
    this.currentStep = 2;
    this.setProgress(45);
  }

  handlePrevStep2() {
    if (this.isSubmitting) return;
    this.submitError = "";
    this.currentStep = 1;
    this.updateStep1Progress();
  }

  async handleSubmit() {
    if (this.isSubmitting || !this.isStep2Valid()) return;
    this.submitError = "";
    this.updateHiddenContext();
    const idLead = buildIdLead(
      this.formData.firstName,
      this.formData.lastName,
      normalizeDigits(this.formData.tel)
    );
    const payload = buildLeadPayload(this.formData, idLead);
    this.isSubmitting = true;
    try {
      const raw = await submitLpObraLead(payload);
      const parsed = parseLeadSubmitResult(raw);
      if (!parsed.success) {
        this.submitError =
          "Não conseguimos concluir o cadastro agora. Tente novamente em instantes ou entre em contato com o suporte.";
        return;
      }
      let leadId = parsed.leadId;
      let guideShopName = parsed.guideShopName;
      if (this.selectedFiles.length && leadId) {
        await uploadSelectedFiles(leadId, this.selectedFiles);
      }
      if (!guideShopName && this.formData.nameGuideShop) {
        guideShopName = this.formData.nameGuideShop;
      }
      this.pushDataLayerAfterSuccess({ leadId, guideShopName });
      this.currentStep = 3;
      this.progress = 100;
    } catch (e) {
      const apexMsg = apexUiMessage(e);
      this.submitError =
        apexMsg ||
        "Não conseguimos concluir o cadastro agora. Tente novamente em instantes ou entre em contato com o suporte.";
    } finally {
      this.isSubmitting = false;
    }
  }

  handleReset() {
    const initial = createInitialFormData();
    this.currentStep = 1;
    this.progress = 0;
    this.validEmail = false;
    this.isSubmitting = false;
    this.submitError = "";
    this.selectedFiles = [];
    this.uploadFileRows = [];
    this.uploadFeedbackText = "";
    this.uploadFeedbackKind = "";
    this.dropzoneDrag = false;
    this._context = { ...initial.context };
    this.formData = initial.data;
    this.updateStep1Progress();
    this.updateStep2Progress();
  }
}
