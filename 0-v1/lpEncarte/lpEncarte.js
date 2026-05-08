import { LightningElement, track } from "lwc";

import basePath from '@salesforce/community/basePath';
import upsertLead from "@salesforce/apex/LpSejaUmFranqueadoService.upsertLead";
import getCityByUf from "@salesforce/apex/LpSejaUmFranqueadoService.getCityByUfWithActiveGuideShop";
import getGuideByCity from "@salesforce/apex/LpSejaUmFranqueadoService.getFranchisesByStateAndCity";

export default class LpEncarte extends LightningElement {

    companyLogoURL = `${basePath}/sfsites/c/cms/delivery/media/MCQIMEUAX37NC27PV7N7UDNKPFSA`;
    labelFormURL = `${basePath}/sfsites/c/cms/delivery/media/MCPQMJB625K5H7LDKQ6MMNGBZHS4`;
    // backgroundURL = `${basePath}/sfsites/c/cms/delivery/media/MCO2DUFHCURFHRFKZALKFRSSTQIA`;
    backgroundURL = `${basePath}/sfsites/c/cms/delivery/media/MCQGXLH4BBAJBFFB4PM3QSHDGUH4`;
    checkBulletURL = `${basePath}/sfsites/c/cms/delivery/media/MC5KOENH3UP5ENDNGGFNHQT3EANA`;

    @track formData = {
        // CAMPOS COMENTADOS - BACKUP
        // stateGuide: "",
        // cityGuide: "",
        // guide_shop: "",

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

    @track currentStep = 1;
    @track progress = 0;
    @track validEmail = false;

    get backgroundStyle() {
    return `background-image: url(${this.backgroundURL});
            background-size: cover;
            background-position: center;`;
    }

    // OPÇÕES DE ESTADO - BACKUP
    /*
    get stateOptions() {
        return [
            { label: "Selecione", value: "", disabled: true },
            // { label: "AC", value: "AC" },
            // { label: "AL", value: "AL" },
            // { label: "AM", value: "AM" },
            // { label: "AP", value: "AP" },
            { label: "BA", value: "BA" },
            // { label: "CE", value: "CE" },
            { label: "DF", value: "DF" },
            { label: "ES", value: "ES" },
            { label: "GO", value: "GO" },
            // { label: "MA", value: "MA" },
            { label: "MS", value: "MS" },
            // { label: "MT", value: "MT" },
            { label: "MG", value: "MG" },
            // { label: "PA", value: "PA" },
            // { label: "PB", value: "PB" },
            // { label: "PE", value: "PE" },
            // { label: "PI", value: "PI" },
            { label: "PR", value: "PR" },
            { label: "RJ", value: "RJ" },
            // { label: "RN", value: "RN" },
            // { label: "RS", value: "RS" },
            // { label: "RO", value: "RO" },
            // { label: "RR", value: "RR" },
            { label: "SC", value: "SC" },
            { label: "SP", value: "SP" },
            // { label: "SE", value: "SE" },
            // { label: "TO", value: "TO" },
        ];
    }

    @track cityOptions = [{ label: "Selecione", value: "", disabled: true }];

    @track guideShopOptions = [{ label: "Selecione", value: "", disabled: true }];
    */

    get isStep1() {
        return this.currentStep === 1;
    }

    get isStep2() {
        return this.currentStep === 2;
    }

    get isStep3() {
        return this.currentStep === 3;
    }

    get progressBarStyle() {
        return `width: ${this.progress}%`;
    }

    // GETTERS DE ESTAO E CIDADE COMENTADOS
    /*
    get isCitySelectDisabled() {
        return !this.formData.stateGuide;
    }

    get isGuideShopSelectDisabled() {
        return !this.formData.cityGuide;
    }
    */

    get isNextButtonStep1Disabled() {
        // GETTERS DE ESTAO E CIDADE E GUIDE SHOP COMENTADOS
        // return !(
        //   this.formData.stateGuide &&
        //   this.formData.cityGuide &&
        //   this.formData.guide_shop
        // );

        // VALIDAÇÃO DO CEP
        const cepPattern = /^\d{5}-\d{3}$/;
        return (
        !this.formData.cepclient || !cepPattern.test(this.formData.cepclient)
        );
    }

    get isNextButtonStep2Disabled() {
        const { cepclient, name, lastname, email, tel, privacyPolicy } =
        this.formData;
        const isTelValid = tel && tel.length === 11;

        return !(
        cepclient &&
        name &&
        lastname &&
        email &&
        this.validEmail &&
        tel &&
        isTelValid &&
        privacyPolicy
        );
    }

    get nextButtonStep1Class() {
        return `botao-proxima-etapa ${
        !this.isNextButtonStep1Disabled ? "selected" : ""
        }`;
    }

    get nextButtonStep2Class() {
        return `botao-proxima-etapa ${
        !this.isNextButtonStep2Disabled ? "selected" : ""
        }`;
    }

  connectedCallback() {
    this.initializeProgressBar();

    Promise.resolve().then(() => {
      this.implementSticky();

      window.addEventListener("resize", this.implementSticky.bind(this));
    });
  }

  initializeProgressBar() {
    this.progress = 0;
    this.renderProgressBar();
  }

  renderProgressBar() {
    setTimeout(() => {
      if (this.currentStep !== 3) {
        const progressBarElement = this.template.querySelector(".progress-bar");
        if (progressBarElement) {
          progressBarElement.style.width = `${this.progress}%`;
        }
      }
    }, 0);
  }

  // FUNÇÕES - ESTADO, CIDADE, GUIDE SHOP
  /*
  handleStateChange(event) {
    const state = event.target.value;        
    this.formData.stateGuide = state;
    this.formData.cityGuide = "";
    this.formData.guide_shop = "";
    this.updateStep1Progress();

    // Reset do select de cidade e guide shop
    const citySelect = this.template.querySelector("#city");
    const guideShopSelect = this.template.querySelector("#guide_shop");

    if (citySelect) {
      // Limpar as opções existentes exceto a primeira
      while (citySelect.options.length > 1) {
        citySelect.remove(1);
      }
    }

    if (guideShopSelect) {
      while (guideShopSelect.options.length > 1) {
        guideShopSelect.remove(1);
      }
    }

    if (state) {
      getCityByUf({ uf: state, guideShopActive: true })
      .then((cities) => {
        this.cityOptions = [
          { label: "Selecione", value: "", disabled: true },
             ...cities.map((city) => ({
               label: city.NameCity__c,
               value: city.NameCity__c,
             })),
        ];
      })
      .catch((error) => {
           console.error("Erro ao buscar cidades:", error);
      });

      if (citySelect) {
        this.cityOptions.forEach((option, index) => {
          if (index > 0) {
            const opt = document.createElement("option");
            opt.value = option.value;
            opt.text = option.label;
            if (option.disabled) opt.disabled = true;
            citySelect.add(opt);
          }
        });
      }
    }
  }

  handleCityChange(event) {
    const city = event.target.value;
    this.formData.cityGuide = city;
    this.formData.guide_shop = "";
    this.updateStep1Progress();

    const guideShopSelect = this.template.querySelector("#guide_shop");

    if (guideShopSelect) {
      while (guideShopSelect.options.length > 1) {
        guideShopSelect.remove(1);
      }
    }

    if (city) {
      this.loadGuideShops(this.formData.stateGuide, city);
    }
  }

  loadGuideShops(state, city) {
    getGuideByCity({ uf: state, city: city })
      .then((guides) => {
        this.guideShopOptions = [
          { label: "Selecione", value: "", disabled: true },
           ...guides.map((guide) => ({
             label: guide.NomeAmigavel__c,
             value: guide.Id,
           })),
        ];
      })
      .catch((error) => {
         console.error("Erro ao buscar guides:", error);
      });

    const guideShopSelect = this.template.querySelector("#guide_shop");
    if (guideShopSelect) {
      this.guideShopOptions.forEach((option, index) => {
        if (index > 0) {
          const opt = document.createElement("option");
          opt.value = option.value;
          opt.text = option.label;
          if (option.disabled) opt.disabled = true;
          guideShopSelect.add(opt);
        }
      });
    }
  }

  handleGuideShopChange(event) {
    this.formData.guide_shop = event.target.value;
    this.updateStep1Progress();
  }
  */

  handleCepInput(event) {
    let value = event.target.value;

    const numericValue = value.replace(/\D/g, "");

    let formattedValue = numericValue;

    if (numericValue.length > 5) {
      formattedValue = `${numericValue.substring(
        0,
        5
      )}-${numericValue.substring(5, 8)}`;
    }

    event.target.value = formattedValue;

    this.formData.cepclient = formattedValue;
    this.updateStep1Progress();
  }

  handleCepChange(event) {
    this.formData.cepclient = event.target.value;
    this.updateStep1Progress();
  }

  updateStep1Progress() {
    // LÓGICA ESTADO, CIDADE, GUIDE SHOP
    // const { state, city, guide_shop } = this.formData;
    // const fields = [state, city, guide_shop];
    // const filledFields = fields.filter(
    //   (field) => field && field.trim() !== ""
    // ).length;
    // this.progress = filledFields > 0 ? (filledFields / fields.length) * 90 : 0;

    // CEP
    const cepPattern = /^\d{5}-\d{3}$/;
    const isCepValid =
      this.formData.cepclient && cepPattern.test(this.formData.cepclient);

    this.progress = isCepValid ? 90 : 0;
    this.renderProgressBar();
  }

  updateStep2Progress() {
    const { cepclient, name, lastname, email, tel } = this.formData;

    const isEmailValid = this.validEmail;
    const isTelValid = tel && tel.length === 11;
    const requiredFieldsFilled =
      cepclient &&
      name &&
      lastname &&
      email &&
      tel &&
      isEmailValid &&
      isTelValid;

    this.progress = requiredFieldsFilled ? 99 : 90;
    this.renderProgressBar();
  }

  handleNextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;

      if (this.currentStep === 2) {
        this.progress = 90;
        this.renderProgressBar();
      }
    }
  }

  handlePreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;

      if (this.currentStep === 1) {
        this.updateStep1Progress();
      } else if (this.currentStep === 2) {
        this.updateStep2Progress();
      }
    }
  }

  handleSubmitForm() {
    let firstName = this.formData.name.trim();
    let lastName = this.formData.lastname.trim();

    let idLead = firstName.concat(
      lastName.replaceAll(" ", ""),
      this.formData.tel.trim()
    );

    this.formData.cepclient = this.formData.cepclient;
    this.formData.ceplead = this.formData.cepclient;
    console.log("this.formData.cepclient: ", this.formData.cepclient);
    console.log("this.formData.ceplead: ", this.formData.ceplead);

    this.formData.idLead = idLead;
    this.formData.firstName = firstName;
    this.formData.lastName = lastName;

    this.formData.marketingConsent = this.formData.marketingConsent.toString();
    this.formData.privacyPolicy = this.formData.privacyPolicy.toString();
    this.formData.nameGuideShop = this.formData.guide_shop;

    this.currentStep = 3;
    this.progress = 100;

    upsertLead({ lead: JSON.stringify(this.formData) })
      .then(() => {
        console.log("PUSH:", JSON.stringify(this.formData));
        console.log("submit ok: ");
        window.dataLayer.push({
          event: "Lead",
          email: this.formData.email,
          phone: this.formData.tel,
        });
      })
      .catch((error) => {
        console.log("submit error: ", error);
      });
    this.renderProgressBar();
  }

  resetForm() {
    this.currentStep = 1;
    this.progress = 0;
    this.validEmail = false;
    this.formData = {
      // ESTADO, CIDADE, GUIDE SHOP - BACKUP
      // stateGuide: "",
      // cityGuide: "",
      // guide_shop: "",

      cepclient: "",
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

    // CIDADE E GUIDE SHOP - BACKUP
    // this.cityOptions = [{ label: "Selecione", value: "", disabled: true }];
    // this.guideShopOptions = [{ label: "Selecione", value: "", disabled: true }];

    this.renderProgressBar();
  }

  handleNameChange(event) {
    let value = event.target.value;
    const cleanValue = value.replace(/[^a-zA-ZÀ-ÿ\u00C0-\u017F\s]/g, "");
    const finalValue = cleanValue.replace(/\s+/g, " ");
    event.target.value = finalValue;
    this.formData.name = finalValue;
    this.updateStep2Progress();
  }

  handleLastnameChange(event) {
    let value = event.target.value;
    const cleanValue = value.replace(/[^a-zA-ZÀ-ÿ\u00C0-\u017F\s]/g, "");
    const finalValue = cleanValue.replace(/\s+/g, " ");
    event.target.value = finalValue;
    this.formData.lastname = finalValue;
    this.updateStep2Progress();
  }

  handleEmailChange(event) {
    const email = event.target.value;
    this.formData.email = email;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.validEmail = emailRegex.test(email);

    this.updateStep2Progress();
  }

  handleTelChange(event) {
    let value = event.target.value;

    const numericValue = value.replace(/\D/g, "");

    let formattedValue = "";

    if (numericValue.length > 0) {
      if (numericValue.length <= 2) {
        formattedValue = `(${numericValue}`;
      } else if (numericValue.length <= 3) {
        formattedValue = `(${numericValue.substring(
          0,
          2
        )}) ${numericValue.substring(2)}`;
      } else if (numericValue.length <= 7) {
        formattedValue = `(${numericValue.substring(
          0,
          2
        )}) ${numericValue.substring(2, 3)} ${numericValue.substring(3)}`;
      } else if (numericValue.length <= 11) {
        formattedValue = `(${numericValue.substring(
          0,
          2
        )}) ${numericValue.substring(2, 3)} ${numericValue.substring(
          3,
          7
        )}-${numericValue.substring(7, 11)}`;
      }
    }

    if (numericValue.length > 11) {
      const limitedNumeric = numericValue.substring(0, 11);
      formattedValue = `(${limitedNumeric.substring(
        0,
        2
      )}) ${limitedNumeric.substring(2, 3)} ${limitedNumeric.substring(
        3,
        7
      )}-${limitedNumeric.substring(7, 11)}`;
      this.formData.tel = limitedNumeric;
    } else {
      this.formData.tel = numericValue;
    }

    event.target.value = formattedValue;
    this.updateStep2Progress();
  }

  handlePrivacyPolicyChange(event) {
    this.formData.privacyPolicy = event.target.checked;
    this.updateStep2Progress();
  }

  handleMarketingConsentChange(event) {
    this.formData.marketingConsent = event.target.checked;
  }

  handleNameInput(event) {
    this.handleNameChange(event);
  }

  handleLastnameInput(event) {
    this.handleLastnameChange(event);
  }

  handleTelInput(event) {
    this.handleTelChange(event);
  }

  implementSticky() {
    const franquiaInfo = this.template.querySelector(".franquia-info");
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
}