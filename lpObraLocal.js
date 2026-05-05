(function () {
  const ASSET_BASE =
    "https://abcdaconstrucao.my.site.com/lpencarte/sfsites/c/cms/delivery/media";

  const MEDIA = {
    logo: "MCQIMEUAX37NC27PV7N7UDNKPFSA",
    label: "MCPQMJB625K5H7LDKQ6MMNGBZHS4",
    background: "MCQGXLH4BBAJBFFB4PM3QSHDGUH4",
    check: "MC5KOENH3UP5ENDNGGFNHQT3EANA",
  };

  function mediaUrl(id) {
    return `${ASSET_BASE}/${id}`;
  }

  const root = document.getElementById("lp-obra-local-root");
  const section = document.getElementById("section-formulario");
  const progressBarFill = document.getElementById("progress-bar-fill");
  const progressText = document.getElementById("progress-text");
  const btnNext1 = document.getElementById("btn-next-step1");
  const btnPrev2 = document.getElementById("btn-prev-step2");
  const btnSubmit = document.getElementById("btn-submit");
  const btnReset = document.getElementById("btn-reset");

  const elCep = document.getElementById("cepclient");
  const elName = document.getElementById("name");
  const elLastname = document.getElementById("lastname");
  const elTel = document.getElementById("tel");
  const elEmail = document.getElementById("email");
  const elPrivacy = document.getElementById("privacyPolicy");
  const elMarketing = document.getElementById("marketingConsent");

  const imgLogoHero = document.getElementById("img-logo-hero");
  const imgLogoFooter = document.getElementById("img-logo-footer");
  const imgFormLabel = document.getElementById("img-form-label");
  const imgFormCheck = document.getElementById("img-form-check");

  imgLogoHero.src = mediaUrl(MEDIA.logo);
  imgLogoFooter.src = mediaUrl(MEDIA.logo);
  imgFormLabel.src = mediaUrl(MEDIA.label);
  imgFormCheck.src = mediaUrl(MEDIA.check);
  section.style.backgroundImage = `url(${mediaUrl(MEDIA.background)})`;
  section.style.backgroundSize = "cover";
  section.style.backgroundPosition = "center";

  window.dataLayer = window.dataLayer || [];

  let currentStep = 1;
  let progress = 0;
  let validEmail = false;

  let formData = {
    cepclient: "",
    ceplead: "",
    name: "",
    lastname: "",
    email: "",
    tel: "",
    privacyPolicy: true,
    marketingConsent: true,
    firstName: "",
    lastName: "",
    idLead: "",
    recordtypeDevName: "Cliente_Final",
    company: "ABC",
    company2: "Cliente_Final",
    owner: "005bJ000006pPLxQAM",
    canalDeEntrada: "Landing Page Catalogo",
    nameGuideShop: "",
  };

  function setStepClass() {
    root.classList.remove("lp-step-1", "lp-step-2", "lp-step-3");
    root.classList.add("lp-step-" + currentStep);
  }

  function isNextButtonStep1Disabled() {
    const cepPattern = /^\d{5}-\d{3}$/;
    return !formData.cepclient || !cepPattern.test(formData.cepclient);
  }

  function isNextButtonStep2Disabled() {
    const { cepclient, name, lastname, email, tel, privacyPolicy } = formData;
    const isTelValid = tel && tel.length === 11;
    return !(
      cepclient &&
      name &&
      lastname &&
      email &&
      validEmail &&
      tel &&
      isTelValid &&
      privacyPolicy
    );
  }

  function syncButtons() {
    btnNext1.disabled = isNextButtonStep1Disabled();
    btnNext1.className =
      "botao-proxima-etapa" + (btnNext1.disabled ? "" : " selected");
    btnSubmit.disabled = isNextButtonStep2Disabled();
    btnSubmit.className =
      "botao-proxima-etapa" + (btnSubmit.disabled ? "" : " selected");
  }

  function renderProgressBar() {
    setTimeout(function () {
      if (currentStep !== 3 && progressBarFill && progressText) {
        progressBarFill.style.width = progress + "%";
        progressText.textContent = progress + "%";
      }
    }, 0);
  }

  function updateStep1Progress() {
    const cepPattern = /^\d{5}-\d{3}$/;
    const isCepValid =
      formData.cepclient && cepPattern.test(formData.cepclient);
    progress = isCepValid ? 90 : 0;
    renderProgressBar();
    syncButtons();
  }

  function updateStep2Progress() {
    const { cepclient, name, lastname, email, tel } = formData;
    const isEmailValid = validEmail;
    const isTelValid = tel && tel.length === 11;
    const requiredFieldsFilled =
      cepclient &&
      name &&
      lastname &&
      email &&
      tel &&
      isEmailValid &&
      isTelValid;
    progress = requiredFieldsFilled ? 99 : 90;
    renderProgressBar();
    syncButtons();
  }

  function implementSticky() {
    const franquiaInfo = root.querySelector(".franquia-info");
    if (!franquiaInfo) return;
    if (window.innerWidth <= 1000) {
      franquiaInfo.style.position = "static";
      franquiaInfo.style.width = "100%";
      franquiaInfo.style.maxWidth = "100%";
      franquiaInfo.style.top = "auto";
    } else {
      franquiaInfo.style.position = "";
      franquiaInfo.style.top = "";
      franquiaInfo.style.width = "";
    }
  }

  function init() {
    progress = 0;
    setStepClass();
    renderProgressBar();
    syncButtons();
    Promise.resolve().then(function () {
      implementSticky();
      window.addEventListener("resize", implementSticky);
    });
  }

  elCep.addEventListener("input", function (e) {
    let value = e.target.value;
    const numericValue = value.replace(/\D/g, "");
    let formattedValue = numericValue;
    if (numericValue.length > 5) {
      formattedValue =
        numericValue.substring(0, 5) + "-" + numericValue.substring(5, 8);
    }
    e.target.value = formattedValue;
    formData.cepclient = formattedValue;
    updateStep1Progress();
  });

  elCep.addEventListener("change", function (e) {
    formData.cepclient = e.target.value;
    updateStep1Progress();
  });

  elName.addEventListener("change", handleNameChange);
  elName.addEventListener("input", handleNameChange);
  elLastname.addEventListener("change", handleLastnameChange);
  elLastname.addEventListener("input", handleLastnameChange);
  elEmail.addEventListener("change", handleEmailChange);
  elTel.addEventListener("change", handleTelChange);
  elTel.addEventListener("input", handleTelChange);
  elPrivacy.addEventListener("change", function (e) {
    formData.privacyPolicy = e.target.checked;
    updateStep2Progress();
  });
  elMarketing.addEventListener("change", function (e) {
    formData.marketingConsent = e.target.checked;
  });

  function handleNameChange(e) {
    let value = e.target.value;
    const cleanValue = value.replace(/[^a-zA-ZÀ-ÿ\u00C0-\u017F\s]/g, "");
    const finalValue = cleanValue.replace(/\s+/g, " ");
    e.target.value = finalValue;
    formData.name = finalValue;
    updateStep2Progress();
  }

  function handleLastnameChange(e) {
    let value = e.target.value;
    const cleanValue = value.replace(/[^a-zA-ZÀ-ÿ\u00C0-\u017F\s]/g, "");
    const finalValue = cleanValue.replace(/\s+/g, " ");
    e.target.value = finalValue;
    formData.lastname = finalValue;
    updateStep2Progress();
  }

  function handleEmailChange(e) {
    const email = e.target.value;
    formData.email = email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validEmail = emailRegex.test(email);
    updateStep2Progress();
  }

  function handleTelChange(e) {
    let value = e.target.value;
    const numericValue = value.replace(/\D/g, "");
    let formattedValue = "";
    if (numericValue.length > 0) {
      if (numericValue.length <= 2) {
        formattedValue = "(" + numericValue;
      } else if (numericValue.length <= 3) {
        formattedValue =
          "(" + numericValue.substring(0, 2) + ") " + numericValue.substring(2);
      } else if (numericValue.length <= 7) {
        formattedValue =
          "(" +
          numericValue.substring(0, 2) +
          ") " +
          numericValue.substring(2, 3) +
          " " +
          numericValue.substring(3);
      } else if (numericValue.length <= 11) {
        formattedValue =
          "(" +
          numericValue.substring(0, 2) +
          ") " +
          numericValue.substring(2, 3) +
          " " +
          numericValue.substring(3, 7) +
          "-" +
          numericValue.substring(7, 11);
      }
    }
    if (numericValue.length > 11) {
      const limitedNumeric = numericValue.substring(0, 11);
      formattedValue =
        "(" +
        limitedNumeric.substring(0, 2) +
        ") " +
        limitedNumeric.substring(2, 3) +
        " " +
        limitedNumeric.substring(3, 7) +
        "-" +
        limitedNumeric.substring(7, 11);
      formData.tel = limitedNumeric;
    } else {
      formData.tel = numericValue;
    }
    e.target.value = formattedValue;
    updateStep2Progress();
  }

  btnNext1.addEventListener("click", function () {
    if (currentStep < 2) {
      currentStep++;
      if (currentStep === 2) {
        progress = 90;
        renderProgressBar();
      }
      setStepClass();
      syncButtons();
    }
  });

  btnPrev2.addEventListener("click", function () {
    if (currentStep > 1) {
      currentStep--;
      if (currentStep === 1) {
        updateStep1Progress();
      } else if (currentStep === 2) {
        updateStep2Progress();
      }
      setStepClass();
      syncButtons();
    }
  });

  btnSubmit.addEventListener("click", function () {
    const firstName = formData.name.trim();
    const lastName = formData.lastname.trim();
    const idLead = firstName.concat(
      lastName.replaceAll(" ", ""),
      formData.tel.trim()
    );
    formData.ceplead = formData.cepclient;
    formData.idLead = idLead;
    formData.firstName = firstName;
    formData.lastName = lastName;
    formData.marketingConsent = String(formData.marketingConsent);
    formData.privacyPolicy = String(formData.privacyPolicy);
    formData.nameGuideShop = formData.guide_shop || "";

    currentStep = 3;
    progress = 100;
    setStepClass();
    syncButtons();
    renderProgressBar();

    Promise.resolve()
      .then(function () {
        console.log("PUSH:", JSON.stringify(formData));
        console.log("submit ok (local preview)");
        window.dataLayer.push({
          event: "Lead",
          email: formData.email,
          phone: formData.tel,
        });
      })
      .catch(function (error) {
        console.log("submit error: ", error);
      });
  });

  btnReset.addEventListener("click", function () {
    currentStep = 1;
    progress = 0;
    validEmail = false;
    formData = {
      cepclient: "",
      ceplead: "",
      name: "",
      lastname: "",
      email: "",
      tel: "",
      privacyPolicy: true,
      marketingConsent: true,
      firstName: "",
      lastName: "",
      idLead: "",
      recordtypeDevName: "Cliente_Final",
      company: "ABC",
      company2: "Cliente_Final",
      owner: "005bJ000006pPLxQAM",
      canalDeEntrada: "Landing Page Catalogo",
      nameGuideShop: "",
    };
    elCep.value = "";
    elName.value = "";
    elLastname.value = "";
    elTel.value = "";
    elEmail.value = "";
    elPrivacy.checked = true;
    elMarketing.checked = true;
    setStepClass();
    renderProgressBar();
    syncButtons();
    updateStep1Progress();
  });

  init();
})();
