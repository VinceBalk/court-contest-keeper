
import { Tournament, Player } from "@/pages/Index";
import TournamentForm from "./TournamentForm";
import TournamentList from "./TournamentList";

interface TournamentManagementProps {
  tournaments: Tournament[];
  setTournaments: (tournaments: Tournament[]) => void;
  activeTournament: Tournament | null;
  setActiveTournament: (tournament: Tournament | null) => void;
  setCurrentRound: (round: number) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
}

const TournamentManagement = ({ 
  tournaments, 
  setTournaments, 
  activeTournament, 
  setActiveTournament,
  setCurrentRound,
  players,
  setPlayers
}: TournamentManagementProps) => {
  return (
    <div className="space-y-6">
      <TournamentForm 
        tournaments={tournaments}
        setTournaments={setTournaments}
      />
      
      <TournamentList 
        tournaments={tournaments}
        setTournaments={setTournaments}
        activeTournament={activeTournament}
        setActiveTournament={setActiveTournament}
        setCurrentRound={setCurrentRound}
        players={players}
        setPlayers={setPlayers}
      />
    </div>
  );
};

export default TournamentManagement;
