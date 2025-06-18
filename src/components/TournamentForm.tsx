
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users } from "lucide-react";
import { Tournament } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/contexts/TranslationContext";
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
  const { t } = useT();
  const [newTournamentName, setNewTournamentName] = useState("");
  const [newTournamentStartDate, setNewTournamentStartDate] = useState("");
  const [newTournamentEndDate, setNewTournamentEndDate] = useState("");
  const [newTournamentMaxPlayers, setNewTournamentMaxPlayers] = useState(16);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  const handleStartDateChange = (date: string) => {
    setNewTournamentStartDate(date);
    // If end date is empty or before start date, set it to start date
    if (!newTournamentEndDate || newTournamentEndDate < date) {
      setNewTournamentEndDate(date);
    }
  };

  const handleCreateTournamentClick = () => {
    if (!newTournamentName.trim() || !newTournamentStartDate) {
      toast({
        title: t('general.error'),
        description: "Please enter tournament name and start date",
        variant: "destructive"
      });
      return;
    }

    if (!newTournamentEndDate) {
      setNewTournamentEndDate(newTournamentStartDate);
    }

    if (newTournamentEndDate < newTournamentStartDate) {
      toast({
        title: t('general.error'),
        description: "End date cannot be before start date",
        variant: "destructive"
      });
      return;
    }

    if (newTournamentMaxPlayers < 8 || newTournamentMaxPlayers % 4 !== 0) {
      toast({
        title: t('general.error'),
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
      startDate: newTournamentStartDate,
      endDate: newTournamentEndDate || newTournamentStartDate,
      isActive: false,
      completed: false,
      maxPlayers: newTournamentMaxPlayers
    };

    setTournaments([...tournaments, newTournament]);
    setNewTournamentName("");
    setNewTournamentStartDate("");
    setNewTournamentEndDate("");
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
            {t('tournament.create.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder={t('tournament.name.placeholder')}
                value={newTournamentName}
                onChange={(e) => setNewTournamentName(e.target.value)}
                className="flex-1"
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">{t('tournament.startDate')}</label>
                <Input
                  type="date"
                  value={newTournamentStartDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">{t('tournament.endDate')}</label>
                <Input
                  type="date"
                  value={newTournamentEndDate}
                  onChange={(e) => setNewTournamentEndDate(e.target.value)}
                  min={newTournamentStartDate}
                  className="w-40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <Input
                  type="number"
                  min="8"
                  step="4"
                  value={newTournamentMaxPlayers}
                  onChange={(e) => setNewTournamentMaxPlayers(Number(e.target.value))}
                  className="w-24"
                  placeholder={t('tournament.maxPlayers.label')}
                />
              </div>
              <Button onClick={handleCreateTournamentClick} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                {t('general.create')}
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
            <DialogTitle>{t('tournament.confirm.title')}</DialogTitle>
            <DialogDescription>
              {t('tournament.confirm.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div>
              <strong>Tournament Name:</strong> {newTournamentName}
            </div>
            <div>
              <strong>{t('tournament.startDate')}:</strong> {newTournamentStartDate}
            </div>
            <div>
              <strong>{t('tournament.endDate')}:</strong> {newTournamentEndDate || newTournamentStartDate}
            </div>
            <div>
              <strong>Maximum Players:</strong> {newTournamentMaxPlayers} ({newTournamentMaxPlayers/2} per group)
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelCreateTournament}>
              {t('general.cancel')}
            </Button>
            <Button onClick={confirmCreateTournament} className="bg-green-600 hover:bg-green-700">
              {t('general.create')} Tournament
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TournamentForm;
