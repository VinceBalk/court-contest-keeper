
import { useState, useEffect } from 'react';

export interface Translation {
  id: string;
  key: string;
  en: string;
  nl: string;
  category: string;
}

export const defaultTranslations: Translation[] = [
  // Tournament Management
  { id: '1', key: 'tournament.create.title', en: 'Create New Tournament', nl: 'Nieuw Toernooi Aanmaken', category: 'tournament' },
  { id: '2', key: 'tournament.name.placeholder', en: 'Tournament name', nl: 'Toernooienaam', category: 'tournament' },
  { id: '3', key: 'tournament.maxPlayers.label', en: 'Max players', nl: 'Max spelers', category: 'tournament' },
  { id: '4', key: 'tournament.activate', en: 'Activate', nl: 'Activeren', category: 'tournament' },
  { id: '5', key: 'tournament.complete', en: 'Complete', nl: 'Voltooien', category: 'tournament' },
  { id: '6', key: 'tournament.confirm.title', en: 'Confirm Tournament Details', nl: 'Bevestig Toernooi Details', category: 'tournament' },
  { id: '7', key: 'tournament.confirm.description', en: 'Please confirm the tournament details before creating:', nl: 'Bevestig de toernooi details voordat je aanmaakt:', category: 'tournament' },
  { id: '29', key: 'tournament.noTournaments', en: 'No tournaments created yet', nl: 'Nog geen toernooien aangemaakt', category: 'tournament' },
  { id: '30', key: 'tournament.getStarted', en: 'Create your first tournament to get started', nl: 'Maak je eerste toernooi aan om te beginnen', category: 'tournament' },
  { id: '31', key: 'tournament.activated', en: 'Tournament Activated', nl: 'Toernooi Geactiveerd', category: 'tournament' },
  { id: '32', key: 'tournament.activatedDescription', en: 'is now the active tournament', nl: 'is nu het actieve toernooi', category: 'tournament' },
  { id: '33', key: 'tournament.completed', en: 'Tournament Completed', nl: 'Toernooi Voltooid', category: 'tournament' },
  { id: '34', key: 'tournament.completedDescription', en: 'has been marked as completed', nl: 'is gemarkeerd als voltooid', category: 'tournament' },
  { id: '35', key: 'tournament.deleted', en: 'Tournament Deleted', nl: 'Toernooi Verwijderd', category: 'tournament' },
  { id: '36', key: 'tournament.deletedDescription', en: 'has been deleted', nl: 'is verwijderd', category: 'tournament' },
  { id: '37', key: 'tournament.active', en: 'Active', nl: 'Actief', category: 'tournament' },
  { id: '38', key: 'tournament.activeDescription', en: 'Active Tournament:', nl: 'Actief Toernooi:', category: 'tournament' },
  
  // Player Management
  { id: '8', key: 'player.add.title', en: 'Add New Player', nl: 'Nieuwe Speler Toevoegen', category: 'player' },
  { id: '9', key: 'player.firstName', en: 'First Name', nl: 'Voornaam', category: 'player' },
  { id: '10', key: 'player.middleName', en: 'Middle Name', nl: 'Tussenvoegsel', category: 'player' },
  { id: '11', key: 'player.surname', en: 'Surname', nl: 'Achternaam', category: 'player' },
  { id: '12', key: 'player.group', en: 'Group', nl: 'Groep', category: 'player' },
  { id: '13', key: 'player.linkerRijtje', en: 'Linker Rijtje', nl: 'Linker Rijtje', category: 'player' },
  { id: '14', key: 'player.rechterRijtje', en: 'Rechter Rijtje', nl: 'Rechter Rijtje', category: 'player' },
  { id: '15', key: 'player.active', en: 'active', nl: 'actief', category: 'player' },
  { id: '16', key: 'player.total', en: 'total', nl: 'totaal', category: 'player' },
  { id: '39', key: 'player.maxPlayersPerGroup', en: 'per group', nl: 'per groep', category: 'player' },
  { id: '40', key: 'player.availablePool', en: 'Available player pool', nl: 'Beschikbare spelersgroep', category: 'player' },
  
  // General UI
  { id: '17', key: 'general.create', en: 'Create', nl: 'Aanmaken', category: 'general' },
  { id: '18', key: 'general.cancel', en: 'Cancel', nl: 'Annuleren', category: 'general' },
  { id: '19', key: 'general.confirm', en: 'Confirm', nl: 'Bevestigen', category: 'general' },
  { id: '20', key: 'general.date', en: 'Date', nl: 'Datum', category: 'general' },
  { id: '21', key: 'general.name', en: 'Name', nl: 'Naam', category: 'general' },
  { id: '22', key: 'general.error', en: 'Error', nl: 'Fout', category: 'general' },
  { id: '41', key: 'general.activePlayers', en: 'Active Players', nl: 'Actieve Spelers', category: 'general' },
  { id: '42', key: 'general.totalPlayers', en: 'Total Players', nl: 'Totaal Spelers', category: 'general' },
  { id: '43', key: 'general.currentRound', en: 'Current Round', nl: 'Huidige Ronde', category: 'general' },
  { id: '44', key: 'general.specialTypes', en: 'Special Types', nl: 'Speciale Types', category: 'general' },
  { id: '45', key: 'general.tournamentProgress', en: 'Tournament Progress', nl: 'Toernooi Voortgang', category: 'general' },
  { id: '46', key: 'general.activeSpecialTypes', en: 'Active Special Types', nl: 'Actieve Speciale Types', category: 'general' },
  { id: '47', key: 'general.max', en: 'Max', nl: 'Max', category: 'general' },
  { id: '48', key: 'general.players', en: 'players', nl: 'spelers', category: 'general' },
  
  // Navigation
  { id: '23', key: 'nav.tournaments', en: 'Tournaments', nl: 'Toernooien', category: 'navigation' },
  { id: '24', key: 'nav.players', en: 'Players & Groups', nl: 'Spelers & Groepen', category: 'navigation' },
  { id: '25', key: 'nav.specials', en: 'Special Types', nl: 'Speciale Types', category: 'navigation' },
  { id: '26', key: 'nav.matches', en: 'Matches & Schedule', nl: 'Wedstrijden & Schema', category: 'navigation' },
  { id: '27', key: 'nav.rankings', en: 'Rankings & Stats', nl: 'Rankings & Statistieken', category: 'navigation' },
  { id: '28', key: 'nav.translations', en: 'Translations', nl: 'Vertalingen', category: 'navigation' },
  
  // Headers and Titles
  { id: '49', key: 'header.title', en: 'Padel Tournament Manager', nl: 'Padel Toernooi Manager', category: 'header' },
  { id: '50', key: 'header.subtitle', en: 'Track your tournaments, matches, and player rankings', nl: 'Volg je toernooien, wedstrijden en speler rankings', category: 'header' },
  { id: '51', key: 'tournament.completed.badge', en: 'Completed', nl: 'Voltooid', category: 'tournament' },
];

export type Language = 'en' | 'nl';

export const useTranslations = () => {
  const [language, setLanguage] = useState<Language>('nl'); // Default to Dutch
  const [translations, setTranslations] = useState<Translation[]>(defaultTranslations);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    const translation = translations.find(t => t.key === key);
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translation[language] || translation.nl || key; // Fallback to Dutch instead of English
  };

  const updateTranslation = (id: string, updates: Partial<Translation>) => {
    setTranslations(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const addTranslation = (translation: Omit<Translation, 'id'>) => {
    const newTranslation: Translation = {
      ...translation,
      id: `${Date.now()}`
    };
    setTranslations(prev => [...prev, newTranslation]);
  };

  const deleteTranslation = (id: string) => {
    setTranslations(prev => prev.filter(t => t.id !== id));
  };

  return {
    language,
    changeLanguage,
    t,
    translations,
    updateTranslation,
    addTranslation,
    deleteTranslation
  };
};
