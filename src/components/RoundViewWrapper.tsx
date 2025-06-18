import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RoundView from "@/pages/RoundView";
import { Player, Match, Tournament } from "@/pages/Index";
import { useTournaments } from "@/hooks/useTournaments";
import { usePlayers } from "@/hooks/usePlayers";
import { useMatches } from "@/hooks/useMatches";
import { useSpecials } from "@/hooks/useSpecials";

const RoundViewWrapper = () => {
  const { round } = useParams();
  const currentRound = parseInt(round || '1');
  
  // Use React Query hooks to fetch data from Supabase
  const { data: tournaments = [] } = useTournaments();
  const { data: players = [] } = usePlayers();
  const { data: specials = [] } = useSpecials();
  
  // Get active tournament
  const activeTournament = tournaments.find(t => t.status === 'active') || null;
  const { data: matches = [] } = useMatches(activeTournament?.id);

  // Local state for temporary tournament data
  const [localPlayers, setLocalPlayers] = useState<Player[]>([]);
  const [localMatches, setLocalMatches] = useState<Match[]>([]);

  // Initialize local state from localStorage for backwards compatibility
  useEffect(() => {
    if (players.length === 0) {
      const savedPlayers = localStorage.getItem('tournament-players');
      if (savedPlayers) {
        setLocalPlayers(JSON.parse(savedPlayers));
      }
    }
    
    if (matches.length === 0) {
      const savedMatches = localStorage.getItem('tournament-matches');
      if (savedMatches) {
        setLocalMatches(JSON.parse(savedMatches));
      }
    }
  }, [players.length, matches.length]);

  const handleSetPlayers = (newPlayers: Player[]) => {
    setLocalPlayers(newPlayers);
    // Keep localStorage for backwards compatibility during transition
    localStorage.setItem('tournament-players', JSON.stringify(newPlayers));
  };

  const handleSetMatches = (newMatches: Match[]) => {
    setLocalMatches(newMatches);
    // Keep localStorage for backwards compatibility during transition
    localStorage.setItem('tournament-matches', JSON.stringify(newMatches));
  };

  // Use database data if available, fallback to local state
  const finalPlayers = players.length > 0 ? players : localPlayers;
  const finalMatches = matches.length > 0 ? matches : localMatches;
  const finalSpecials = specials.length > 0 ? specials : [
    { id: 'ace', name: 'Ace', description: 'Unreturnable serve', isActive: true },
    { id: 'winner', name: 'Winner', description: 'Shot that wins the point', isActive: true },
    { id: 'smash', name: 'Smash', description: 'Overhead winning shot', isActive: true },
    { id: 'via-glass', name: 'Via Glass', description: 'Shot off the glass walls', isActive: true },
    { id: 'out-of-cage', name: 'Out of Cage', description: 'Shot that goes out of bounds', isActive: true },
  ];

  return (
    <RoundView
      players={finalPlayers}
      matches={finalMatches}
      setMatches={handleSetMatches}
      setPlayers={handleSetPlayers}
      activeTournament={activeTournament}
      specialTypes={finalSpecials}
    />
  );
};

export default RoundViewWrapper;
