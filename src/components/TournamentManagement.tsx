import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Trophy, Play, Archive, Trash2, Users } from "lucide-react";
import { Tournament, Player } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [newTournamentName, setNewTournamentName] = useState("");
  const [newTournamentDate, setNewTournamentDate] = useState("");
  const [newTournamentMaxPlayers, setNewTournamentMaxPlayers] = useState(16);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  const handleCreateTournamentClick = () => {
    if (!newTournamentName.trim() || !newTournamentDate) {
      toast({
        title: "Error",
        description: "Please enter tournament name and date",
        variant: "destructive"
      });
      return;
    }

    if (newTournamentMaxPlayers < 8 || newTournamentMaxPlayers % 4 !== 0) {
      toast({
        title: "Error",
        description: "Maximum players must be a multiple of 4 and at least 8",
        variant: "destructive"
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmCreateTournament = () => {
    const newTournament: Tournament = {
      id: `tournament-${Date.now()}`,
      name: newTournamentName.trim(),
      date: newTournamentDate,
      isActive: false,
      completed: false,
      maxPlayers: newTournamentMaxPlayers
    };

    setTournaments([...tournaments, newTournament]);
    setNewTournamentName("");
    setNewTournamentDate("");
    setNewTournamentMaxPlayers(16);
    setShowConfirmDialog(false);
    
    toast({
      title: "Tournament Created",
      description: `${newTournament.name} has been created with ${newTournament.maxPlayers} players max`,
    });
  };

  const cancelCreateTournament = () => {
    setShowConfirmDialog(false);
  };

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
      title: "Tournament Activated",
      description: `${tournament.name} is now the active tournament`,
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
      title: "Tournament Completed",
      description: `${tournament.name} has been marked as completed`,
    });
  };

  const deleteTournament = (tournamentId: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    setTournaments(tournaments.filter(t => t.id !== tournamentId));
    
    if (activeTournament?.id === tournamentId) {
      setActiveTournament(null);
    }
    
    toast({
      title: "Tournament Deleted",
      description: `${tournament?.name} has been deleted`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Create New Tournament
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Tournament name"
                value={newTournamentName}
                onChange={(e) => setNewTournamentName(e.target.value)}
                className="flex-1"
              />
              <Input
                type="date"
                value={newTournamentDate}
                onChange={(e) => setNewTournamentDate(e.target.value)}
                className="w-48"
              />
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <Input
                  type="number"
                  min="8"
                  step="4"
                  value={newTournamentMaxPlayers}
                  onChange={(e) => setNewTournamentMaxPlayers(Number(e.target.value))}
                  className="w-24"
                  placeholder="Max players"
                />
              </div>
              <Button onClick={handleCreateTournamentClick} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Maximum players must be a multiple of 4 (minimum 8). Default is 16 players (8 per group).
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {tournaments.map((tournament) => (
          <Card key={tournament.id} className={`bg-white/90 backdrop-blur-sm ${
            tournament.isActive ? 'ring-2 ring-blue-500 bg-blue-50/90' : ''
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  {tournament.name}
                </CardTitle>
                <div className="flex gap-1">
                  {tournament.isActive && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                      Active
                    </Badge>
                  )}
                  {tournament.completed && (
                    <Badge className="bg-green-100 text-green-700 border-green-300">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{tournament.date}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>Max {tournament.maxPlayers} players ({tournament.maxPlayers/2} per group)</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2 flex-wrap">
                {!tournament.completed && !tournament.isActive && (
                  <Button
                    size="sm"
                    onClick={() => activateTournament(tournament)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Activate
                  </Button>
                )}
                
                {tournament.isActive && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => completeTournament(tournament)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteTournament(tournament.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {tournaments.length === 0 && (
          <Card className="bg-white/90 backdrop-blur-sm col-span-full">
            <CardContent className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No tournaments created yet</p>
              <p className="text-gray-400 text-sm">Create your first tournament to get started</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Tournament Details</DialogTitle>
            <DialogDescription>
              Please confirm the tournament details before creating:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div>
              <strong>Tournament Name:</strong> {newTournamentName}
            </div>
            <div>
              <strong>Date:</strong> {newTournamentDate}
            </div>
            <div>
              <strong>Maximum Players:</strong> {newTournamentMaxPlayers} ({newTournamentMaxPlayers/2} per group)
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelCreateTournament}>
              Cancel
            </Button>
            <Button onClick={confirmCreateTournament} className="bg-green-600 hover:bg-green-700">
              Create Tournament
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TournamentManagement;
