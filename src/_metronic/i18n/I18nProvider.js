import React from "react";
import {useLang} from "./Metronici18n";
import {IntlProvider} from "react-intl";
import "@formatjs/intl-relativetimeformat/polyfill";
// import {getAllLanguage, getAllI18n} from "../../redux/http/controlCenter";
// import "@formatjs/intl-relativetimeformat/dist/locale-data/en";
// import "@formatjs/intl-relativetimeformat/dist/locale-data/es";
// import "@formatjs/intl-relativetimeformat/dist/locale-data/de";
// import "@formatjs/intl-relativetimeformat/dist/locale-data/fr";
// import "@formatjs/intl-relativetimeformat/dist/locale-data/zh";

import enMessages from "./messages/en";
import koMessages from "./messages/ko";

const allMessages = {
  en: enMessages,
  ko: koMessages,
};

export function I18nProvider({ children }) {
  const locale = useLang();
  const messages = allMessages[locale];

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
}


