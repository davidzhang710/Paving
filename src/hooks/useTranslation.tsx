import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import Storage from '@react-native-async-storage/async-storage';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import translations from '../constants/translations';
import { ITranslate } from '../constants/types';



// Create a new i18n instance
const i18n = new I18n(translations);
i18n.locale = 'zh'
i18n.enableFallback = true;

type Locale =  'zh' | 'en';

interface TranslationContextProps extends ITranslate {
  locale: Locale;
  setLocale: (lang: Locale) => void;
}

export const TranslationContext = React.createContext<TranslationContextProps>({
t: (key: string | string[], options?: object) => key.toString(),
translate: (key: string | string[], options?: object) => key.toString(),
  locale: 'en',
  setLocale: () => {},
});

export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('zh');

  const updateI18nLocale = useCallback((lang: string) => {
    const normalizedLang = lang.startsWith('zh') ? 'zh' : 'en';
    setLocale(normalizedLang as Locale);
    i18n.locale = normalizedLang;
  }, []);

  const t = useCallback(
    (scope: string | string[], options?: object) => {
      return i18n.translate(scope, { ...options, locale }); // ✅ use current locale
    },
    [locale]
  );

  const getStoredLocale = useCallback(async () => {
    const saved = await Storage.getItem('locale');
    if (saved) {
      updateI18nLocale(saved);
    } else {
      updateI18nLocale(Localization.locale);
    }
  }, [updateI18nLocale]);

  useEffect(() => {
    getStoredLocale();
  }, [getStoredLocale]);

  useEffect(() => {
    Storage.setItem('locale', locale);
  }, [locale]);

  const contextValue: TranslationContextProps = {
    t,
    translate: t,
    locale,
    setLocale: updateI18nLocale,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
