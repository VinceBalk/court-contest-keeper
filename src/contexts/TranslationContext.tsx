
import React, { createContext, useContext, useState } from 'react';

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Default translations
const translations = {
  en: {
    'nav.tournaments': 'Tournaments',
    'nav.players': 'Players',
    'nav.users': 'Users',
    'nav.specials': 'Specials',
    'nav.matches': 'Matches',
    'nav.rankings': 'Rankings',
    'nav.translations': 'Translations',
    'nav.settings': 'Settings',
    'stats.totalPlayers': 'Total Players',
    'stats.activePlayers': 'Active Players',
    'stats.tournaments': 'Tournaments',
    'stats.currentRound': 'Current Round',
    'stats.specialTypes': 'Special Types',
    'stats.settings': 'Settings',
    'header.title': 'Court Contest Keeper',
    'header.subtitle': 'Tournament Management System'
  }
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
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
