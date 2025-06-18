
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Tournament, Player } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/contexts/TranslationContext";
import { useUpdateTournament } from "@/hooks/useTournaments";
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
  const updateTournamentMutation = useUpdateTournament();

  const activateTournament = (tournament: Tournament) => {
    // Update the tournament status to active
    const updatedTournament = { ...tournament, status: 'active' as const };
    
    updateTournamentMutation.mutate(updatedTournament, {
      onSuccess: () => {
        setActiveTournament(updatedTournament);
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
      },
      onError: (error) => {
        toast({
          title: t('general.error'),
          description: "Failed to activate tournament",
          variant: "destructive"
        });
        console.error('Error activating tournament:', error);
      }
    });
  };

  const completeTournament = (tournament: Tournament) => {
    const updatedTournament = { ...tournament, status: 'completed' as const };
    
    updateTournamentMutation.mutate(updatedTournament, {
      onSuccess: () => {
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
      },
      onError: (error) => {
        toast({
          title: t('general.error'),
          description: "Failed to complete tournament",
          variant: "destructive"
        });
        console.error('Error completing tournament:', error);
      }
    });
  };

  const deleteTournament = (tournamentId: string) => {
    // Note: We don't have a delete mutation in the Supabase hooks yet
    // This would need to be implemented if delete functionality is required
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    toast({
      title: "Not implemented",
      description: "Delete functionality not yet implemented with Supabase",
      variant: "destructive"
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
