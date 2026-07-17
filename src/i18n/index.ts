import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import esUi from "../locales/es/ui.json";
import enUi from "../locales/en/ui.json";
import frUi from "../locales/fr/ui.json";
import ptUi from "../locales/pt/ui.json";
import zhUi from "../locales/zh/ui.json";
import { DEFAULT_LOCALE } from "../lib/locale";

void i18n.use(initReactI18next).init({
  resources: {
    es: { ui: esUi },
    en: { ui: enUi },
    fr: { ui: frUi },
    pt: { ui: ptUi },
    zh: { ui: zhUi },
  },
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  defaultNS: "ui",
  interpolation: { escapeValue: false },
});

export default i18n;
