
import React, { createContext, useContext } from 'react';
import { useTranslations, Language } from '@/hooks/useTranslations';

interface TranslationContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, changeLanguage, t } = useTranslations();

  return (
    <TranslationContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useT = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useT must be used within a TranslationProvider');
  }
  return context;
};
