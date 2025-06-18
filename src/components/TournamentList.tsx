
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Tournament, Player } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/contexts/TranslationContext";
import TournamentCard from "./TournamentCard";

interface TournamentListProps {
  tournaments: Tournament[];
  setTournaments: (tournaments: Tournament[]) => void;
  activeTournament: Tournament | null;
  setActiveTournament: (tournament: Tournament | null) => void;
  setCurrentRound: (round: number) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
}

const TournamentList = ({ 
  tournaments, 
  setTournaments, 
  activeTournament, 
  setActiveTournament,
  setCurrentRound,
  players,
  setPlayers
}: TournamentListProps) => {
  const { toast } = useToast();
  const { t } = useT();

  const activateTournament = (tournament: Tournament) => {
    // Deactivate all tournaments
    const updatedTournaments = tournaments.map(t => ({ ...t, isActive: false }));
    
    // Activate selected tournament
    const activatedTournaments = updatedTournaments.map(t => 
      t.id === tournament.id ? { ...t, isActive: true } : t
    );
    
    setTournaments(activatedTournaments);
    setActiveTournament({ ...tournament, isActive: true });
    setCurrentRound(1);

    // Reset current tournament stats for all players
    const resetPlayers = players.map(player => ({
      ...player,
      totalGames: 0,
      totalSpecials: 0,
      totalPoints: 0,
      matchesPlayed: 0
    }));
    setPlayers(resetPlayers);
    
    toast({
      title: t('tournament.activated'),
      description: `${tournament.name} ${t('tournament.activatedDescription')}`,
    });
  };

  const completeTournament = (tournament: Tournament) => {
    const updatedTournaments = tournaments.map(t => 
      t.id === tournament.id 
        ? { ...t, completed: true, isActive: false }
        : t
    );
    
    setTournaments(updatedTournaments);
    
    if (activeTournament?.id === tournament.id) {
      setActiveTournament(null);
      
      // Update overall stats for all players
      const updatedPlayers = players.map(player => ({
        ...player,
        overallStats: {
          totalGames: player.overallStats.totalGames + player.totalGames,
          totalSpecials: player.overallStats.totalSpecials + player.totalSpecials,
          totalPoints: player.overallStats.totalPoints + player.totalPoints,
          matchesPlayed: player.overallStats.matchesPlayed + player.matchesPlayed,
          tournamentsPlayed: player.overallStats.tournamentsPlayed + 1
        }
      }));
      setPlayers(updatedPlayers);
    }
    
    toast({
      title: t('tournament.completed'),
      description: `${tournament.name} ${t('tournament.completedDescription')}`,
    });
  };

  const deleteTournament = (tournamentId: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    setTournaments(tournaments.filter(t => t.id !== tournamentId));
    
    if (activeTournament?.id === tournamentId) {
      setActiveTournament(null);
    }
    
    toast({
      title: t('tournament.deleted'),
      description: `${tournament?.name} ${t('tournament.deletedDescription')}`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {tournaments.map((tournament) => (
        <TournamentCard
          key={tournament.id}
          tournament={tournament}
          onActivate={activateTournament}
          onComplete={completeTournament}
          onDelete={deleteTournament}
        />
      ))}
      
      {tournaments.length === 0 && (
        <Card className="bg-white/90 backdrop-blur-sm col-span-full">
          <CardContent className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t('tournament.noTournaments')}</p>
            <p className="text-gray-400 text-sm">{t('tournament.getStarted')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TournamentList;
