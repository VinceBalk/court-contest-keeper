
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/contexts/TranslationContext";
import { useCreateTournament } from "@/hooks/useTournaments";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TournamentFormProps {
  tournaments: any[];
  setTournaments: (tournaments: any[]) => void;
}

const TournamentForm = ({ tournaments, setTournaments }: TournamentFormProps) => {
  const { t } = useT();
  const [newTournamentName, setNewTournamentName] = useState("");
  const [newTournamentStartDate, setNewTournamentStartDate] = useState("");
  const [newTournamentEndDate, setNewTournamentEndDate] = useState("");
  const [newTournamentMaxPlayers, setNewTournamentMaxPlayers] = useState(16);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();
  
  const createTournamentMutation = useCreateTournament();

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
    const newTournament = {
      name: newTournamentName.trim(),
      description: '',
      status: 'draft' as const,
      startDate: newTournamentStartDate,
      endDate: newTournamentEndDate || newTournamentStartDate,
      maxPlayers: newTournamentMaxPlayers,
      currentRound: 1,
      totalRounds: 3,
    };

    createTournamentMutation.mutate(newTournament, {
      onSuccess: () => {
        setNewTournamentName("");
        setNewTournamentStartDate("");
        setNewTournamentEndDate("");
        setNewTournamentMaxPlayers(16);
        setShowConfirmDialog(false);
        
        toast({
          title: "Tournament Created",
          description: `${newTournament.name} has been created with ${newTournament.maxPlayers} players max`,
        });
      },
      onError: (error) => {
        toast({
          title: t('general.error'),
          description: "Failed to create tournament",
          variant: "destructive"
        });
        console.error('Error creating tournament:', error);
      }
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
            {/* Tournament Name - Full width on all screens */}
            <div className="w-full">
              <label className="block text-sm font-medium mb-2 sm:hidden">Tournament Name</label>
              <Input
                placeholder={t('tournament.name.placeholder')}
                value={newTournamentName}
                onChange={(e) => setNewTournamentName(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Date and Player Fields - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">{t('tournament.startDate')}</label>
                <Input
                  type="date"
                  value={newTournamentStartDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">{t('tournament.endDate')}</label>
                <Input
                  type="date"
                  value={newTournamentEndDate}
                  onChange={(e) => setNewTournamentEndDate(e.target.value)}
                  min={newTournamentStartDate}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-600" />
                  Max Players
                </label>
                <Input
                  type="number"
                  min="8"
                  step="4"
                  value={newTournamentMaxPlayers}
                  onChange={(e) => setNewTournamentMaxPlayers(Number(e.target.value))}
                  className="w-full"
                  placeholder={t('tournament.maxPlayers.label')}
                />
              </div>

              {/* Create Button - Takes full width on mobile, auto on larger screens */}
              <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
                <label className="text-sm font-medium opacity-0 select-none">Action</label>
                <Button 
                  onClick={handleCreateTournamentClick} 
                  className="bg-green-600 hover:bg-green-700 w-full"
                  disabled={createTournamentMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="sm:hidden">Create</span>
                  <span className="hidden sm:inline">
                    {createTournamentMutation.isPending ? 'Creating...' : t('general.create')}
                  </span>
                </Button>
              </div>
            </div>

            {/* Help text - responsive */}
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
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
            <Button 
              onClick={confirmCreateTournament} 
              className="bg-green-600 hover:bg-green-700"
              disabled={createTournamentMutation.isPending}
            >
              {createTournamentMutation.isPending ? 'Creating...' : `${t('general.create')} Tournament`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TournamentForm;
