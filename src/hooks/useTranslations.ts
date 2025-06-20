
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
  { id: '1', key: 'tournament.create.title', en: 'Create New Tournament', nl: 'Nieuw toernooi aanmaken', category: 'tournament' },
  { id: '2', key: 'tournament.name.placeholder', en: 'Tournament name', nl: 'Toernooienaam', category: 'tournament' },
  { id: '3', key: 'tournament.maxPlayers.label', en: 'Max players', nl: 'Max spelers', category: 'tournament' },
  { id: '4', key: 'tournament.activate', en: 'Activate', nl: 'Activeren', category: 'tournament' },
  { id: '5', key: 'tournament.complete', en: 'Complete', nl: 'Voltooien', category: 'tournament' },
  { id: '6', key: 'tournament.confirm.title', en: 'Confirm Tournament Details', nl: 'Bevestig toernooi details', category: 'tournament' },
  { id: '7', key: 'tournament.confirm.description', en: 'Please confirm the tournament details before creating:', nl: 'Bevestig de toernooi details voordat je aanmaakt:', category: 'tournament' },
  { id: '29', key: 'tournament.noTournaments', en: 'No tournaments created yet', nl: 'Nog geen toernooien aangemaakt', category: 'tournament' },
  { id: '30', key: 'tournament.getStarted', en: 'Create your first tournament to get started', nl: 'Maak je eerste toernooi aan om te beginnen', category: 'tournament' },
  { id: '31', key: 'tournament.activated', en: 'Tournament Activated', nl: 'Toernooi geactiveerd', category: 'tournament' },
  { id: '32', key: 'tournament.activatedDescription', en: 'is now the active tournament', nl: 'is nu het actieve toernooi', category: 'tournament' },
  { id: '33', key: 'tournament.completed', en: 'Tournament Completed', nl: 'Toernooi voltooid', category: 'tournament' },
  { id: '34', key: 'tournament.completedDescription', en: 'has been marked as completed', nl: 'is gemarkeerd als voltooid', category: 'tournament' },
  { id: '35', key: 'tournament.deleted', en: 'Tournament Deleted', nl: 'Toernooi verwijderd', category: 'tournament' },
  { id: '36', key: 'tournament.deletedDescription', en: 'has been deleted', nl: 'is verwijderd', category: 'tournament' },
  { id: '37', key: 'tournament.active', en: 'Active', nl: 'Actief', category: 'tournament' },
  { id: '38', key: 'tournament.activeDescription', en: 'Active Tournament:', nl: 'Actief toernooi:', category: 'tournament' },
  { id: '73', key: 'tournament.startDate', en: 'Start Date', nl: 'Startdatum', category: 'tournament' },
  { id: '74', key: 'tournament.endDate', en: 'End Date', nl: 'Einddatum', category: 'tournament' },
  { id: '75', key: 'tournament.upcoming', en: 'Upcoming Tournament', nl: 'Aankomend toernooi', category: 'tournament' },
  { id: '76', key: 'tournament.noTournament', en: 'No tournament yet', nl: 'Nog geen toernooi', category: 'tournament' },
  { id: '77', key: 'tournament.spots', en: 'spots', nl: 'plekken', category: 'tournament' },
  { id: '78', key: 'tournament.available', en: 'available', nl: 'beschikbaar', category: 'tournament' },
  
  // Player Management
  { id: '8', key: 'player.add.title', en: 'Add New Player', nl: 'Nieuwe speler toevoegen', category: 'player' },
  { id: '9', key: 'player.firstName', en: 'First Name', nl: 'Voornaam', category: 'player' },
  { id: '10', key: 'player.middleName', en: 'Middle Name', nl: 'Tussenvoegsel', category: 'player' },
  { id: '11', key: 'player.surname', en: 'Surname', nl: 'Achternaam', category: 'player' },
  { id: '12', key: 'player.group', en: 'Group', nl: 'Groep', category: 'player' },
  { id: '13', key: 'player.linkerRijtje', en: 'Linker Rijtje', nl: 'Linker rijtje', category: 'player' },
  { id: '14', key: 'player.rechterRijtje', en: 'Rechter Rijtje', nl: 'Rechter rijtje', category: 'player' },
  { id: '15', key: 'player.active', en: 'active', nl: 'actief', category: 'player' },
  { id: '16', key: 'player.total', en: 'total', nl: 'totaal', category: 'player' },
  { id: '39', key: 'player.maxPlayersPerGroup', en: 'per group', nl: 'per groep', category: 'player' },
  { id: '40', key: 'player.availablePool', en: 'Available player pool', nl: 'Beschikbare spelersgroep', category: 'player' },
  { id: '80', key: 'player.name.placeholder', en: 'Player name', nl: 'Speler naam', category: 'player' },
  { id: '81', key: 'player.email.placeholder', en: 'Email (optional)', nl: 'Email (optioneel)', category: 'player' },
  { id: '82', key: 'player.phone.placeholder', en: 'Phone (optional)', nl: 'Telefoon (optioneel)', category: 'player' },
  { id: '83', key: 'player.level', en: 'Level', nl: 'Level', category: 'player' },
  { id: '84', key: 'player.topGroup', en: 'Top Group', nl: 'Linker rijtje', category: 'player' },
  { id: '85', key: 'player.bottomGroup', en: 'Bottom Group', nl: 'Rechter rijtje', category: 'player' },
  { id: '86', key: 'player.added', en: 'Player Added', nl: 'Speler toegevoegd', category: 'player' },
  { id: '87', key: 'player.deleted', en: 'Player Deleted', nl: 'Speler verwijderd', category: 'player' },
  { id: '88', key: 'player.enterName', en: 'Please enter a player name', nl: 'Voer een speler naam in', category: 'player' },
  { id: '89', key: 'player.addedToGroup', en: 'has been added to the', nl: 'is toegevoegd aan de', category: 'player' },
  { id: '90', key: 'player.removed', en: 'has been removed', nl: 'is verwijderd', category: 'player' },
  { id: '91', key: 'player.group.label', en: 'group', nl: 'groep', category: 'player' },
  
  // Special Management (renamed from Special Types)
  { id: '52', key: 'special.create.title', en: 'Create New Special', nl: 'Nieuwe special aanmaken', category: 'special' },
  { id: '53', key: 'special.name.placeholder', en: 'Special name (e.g., Ace, Winner)', nl: 'Special naam (bijv. ace, winner)', category: 'special' },
  { id: '54', key: 'special.description.placeholder', en: 'Description (optional)', nl: 'Beschrijving (optioneel)', category: 'special' },
  { id: '55', key: 'special.create', en: 'Create Special', nl: 'Special aanmaken', category: 'special' },
  { id: '56', key: 'special.created', en: 'Special Created', nl: 'Special aangemaakt', category: 'special' },
  { id: '57', key: 'special.createdDescription', en: 'has been created', nl: 'is aangemaakt', category: 'special' },
  { id: '58', key: 'special.updated', en: 'Special Updated', nl: 'Special bijgewerkt', category: 'special' },
  { id: '59', key: 'special.updatedDescription', en: 'Special has been updated', nl: 'Special is bijgewerkt', category: 'special' },
  { id: '60', key: 'special.deleted', en: 'Special Deleted', nl: 'Special verwijderd', category: 'special' },
  { id: '61', key: 'special.deletedDescription', en: 'has been deleted', nl: 'is verwijderd', category: 'special' },
  { id: '62', key: 'special.active', en: 'Active', nl: 'Actief', category: 'special' },
  { id: '63', key: 'special.inactive', en: 'Inactive', nl: 'Inactief', category: 'special' },
  { id: '64', key: 'special.noSpecials', en: 'No specials created yet', nl: 'Nog geen specials aangemaakt', category: 'special' },
  { id: '65', key: 'special.getStarted', en: 'Create your first special to get started', nl: 'Maak je eerste special aan om te beginnen', category: 'special' },
  { id: '66', key: 'special.name.required', en: 'Please enter a special name', nl: 'Voer een special naam in', category: 'special' },
  { id: '67', key: 'special.edit', en: 'Edit', nl: 'Bewerken', category: 'special' },
  { id: '68', key: 'special.save', en: 'Save', nl: 'Opslaan', category: 'special' },
  { id: '69', key: 'special.cancel', en: 'Cancel', nl: 'Annuleren', category: 'special' },
  { id: '70', key: 'special.activate', en: 'Activate', nl: 'Activeren', category: 'special' },
  { id: '71', key: 'special.deactivate', en: 'Deactivate', nl: 'Deactiveren', category: 'special' },
  { id: '72', key: 'special.delete', en: 'Delete', nl: 'Verwijderen', category: 'special' },
  
  // General UI
  { id: '17', key: 'general.create', en: 'Create', nl: 'Aanmaken', category: 'general' },
  { id: '18', key: 'general.cancel', en: 'Cancel', nl: 'Annuleren', category: 'general' },
  { id: '19', key: 'general.confirm', en: 'Confirm', nl: 'Bevestigen', category: 'general' },
  { id: '20', key: 'general.date', en: 'Date', nl: 'Datum', category: 'general' },
  { id: '21', key: 'general.name', en: 'Name', nl: 'Naam', category: 'general' },
  { id: '22', key: 'general.error', en: 'Error', nl: 'Fout', category: 'general' },
  { id: '41', key: 'general.activePlayers', en: 'Active Players', nl: 'Actieve spelers', category: 'general' },
  { id: '42', key: 'general.totalPlayers', en: 'Total Players', nl: 'Totaal spelers', category: 'general' },
  { id: '43', key: 'general.currentRound', en: 'Current Round', nl: 'Huidige ronde', category: 'general' },
  { id: '44', key: 'general.specials', en: 'Specials', nl: 'Specials', category: 'general' },
  { id: '45', key: 'general.tournamentProgress', en: 'Tournament Progress', nl: 'Toernooi voortgang', category: 'general' },
  { id: '46', key: 'general.activeSpecials', en: 'Active Specials', nl: 'Actieve specials', category: 'general' },
  { id: '47', key: 'general.max', en: 'Max', nl: 'Max', category: 'general' },
  { id: '48', key: 'general.players', en: 'players', nl: 'spelers', category: 'general' },
  { id: '92', key: 'general.add', en: 'Add', nl: 'Toevoegen', category: 'general' },
  { id: '93', key: 'general.active', en: 'Active', nl: 'Actief', category: 'general' },
  { id: '94', key: 'general.inactive', en: 'Inactive', nl: 'Inactief', category: 'general' },
  { id: '95', key: 'general.skill', en: 'Skill', nl: 'Vaardigheid', category: 'general' },
  { id: '96', key: 'general.email', en: 'Email', nl: 'Email', category: 'general' },
  { id: '97', key: 'general.phone', en: 'Phone', nl: 'Telefoon', category: 'general' },
  
  // Navigation
  { id: '23', key: 'nav.tournaments', en: 'Tournaments', nl: 'Toernooien', category: 'navigation' },
  { id: '24', key: 'nav.players', en: 'Players & Groups', nl: 'Spelers & groepen', category: 'navigation' },
  { id: '25', key: 'nav.specials', en: 'Specials', nl: 'Specials', category: 'navigation' },
  { id: '26', key: 'nav.matches', en: 'Matches & Schedule', nl: 'Wedstrijden & schema', category: 'navigation' },
  { id: '27', key: 'nav.rankings', en: 'Rankings & Stats', nl: 'Rankings & statistieken', category: 'navigation' },
  { id: '28', key: 'nav.translations', en: 'Translations', nl: 'Vertalingen', category: 'navigation' },
  { id: '79', key: 'nav.settings', en: 'Settings', nl: 'Instellingen', category: 'navigation' },
  
  // Headers and Titles
  { id: '49', key: 'header.title', en: 'Padel Tournament Manager', nl: 'Padel toernooi manager', category: 'header' },
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
