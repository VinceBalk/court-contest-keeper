
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users } from "lucide-react";
import { Tournament } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TournamentFormProps {
  tournaments: Tournament[];
  setTournaments: (tournaments: Tournament[]) => void;
}

const TournamentForm = ({ tournaments, setTournaments }: TournamentFormProps) => {
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

  return (
    <>
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
    </>
  );
};

export default TournamentForm;
