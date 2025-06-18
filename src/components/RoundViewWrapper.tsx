
import { useState } from "react";
import RoundView from "@/pages/RoundView";
import { Player, Match, Tournament } from "@/pages/Index";
import { SpecialType } from "@/components/SpecialManagement";

const RoundViewWrapper = () => {
  // In a real app, you'd get this data from a context or state management solution
  // For now, we'll use localStorage to maintain state between page navigations
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('tournament-players');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('tournament-matches');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeTournament, setActiveTournament] = useState<Tournament | null>(() => {
    const saved = localStorage.getItem('active-tournament');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [specialTypes] = useState<SpecialType[]>(() => {
    const saved = localStorage.getItem('special-types');
    return saved ? JSON.parse(saved) : [
      { id: 'ace', name: 'Ace', description: 'Unreturnable serve', isActive: true },
      { id: 'winner', name: 'Winner', description: 'Shot that wins the point', isActive: true },
      { id: 'smash', name: 'Smash', description: 'Overhead winning shot', isActive: true },
      { id: 'via-glass', name: 'Via Glass', description: 'Shot off the glass walls', isActive: true },
      { id: 'out-of-cage', name: 'Out of Cage', description: 'Shot that goes out of bounds', isActive: true },
    ];
  });

  const handleSetPlayers = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
    localStorage.setItem('tournament-players', JSON.stringify(newPlayers));
  };

  const handleSetMatches = (newMatches: Match[]) => {
    setMatches(newMatches);
    localStorage.setItem('tournament-matches', JSON.stringify(newMatches));
  };

  return (
    <RoundView
      players={players}
      matches={matches}
      setMatches={handleSetMatches}
      setPlayers={handleSetPlayers}
      activeTournament={activeTournament}
      specialTypes={specialTypes}
    />
  );
};

export default RoundViewWrapper;
