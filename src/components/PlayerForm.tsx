
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/contexts/TranslationContext";
import { useCreatePlayer } from "@/hooks/usePlayers";

const PlayerForm = () => {
  const { t } = useT();
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerGroup, setNewPlayerGroup] = useState<'top' | 'bottom'>('top');
  const { toast } = useToast();
  const createPlayerMutation = useCreatePlayer();

  const handleAddPlayer = async () => {
    if (!newPlayerName.trim()) {
      toast({
        title: t('general.error'),
        description: t('player.enterName'),
        variant: "destructive"
      });
      return;
    }

    const newPlayerData = {
      name: newPlayerName.trim(),
      email: '',
      phone: '',
      skillLevel: 5,
      group: newPlayerGroup,
      totalGames: 0,
      totalSpecials: 0,
      totalPoints: 0,
      matchesPlayed: 0,
      isActive: true,
    };

    createPlayerMutation.mutate(newPlayerData, {
      onSuccess: () => {
        setNewPlayerName("");
        setNewPlayerGroup('top');
        
        toast({
          title: t('player.added'),
          description: `${newPlayerData.name} ${t('player.addedToGroup')} ${newPlayerData.group === 'top' ? t('player.topGroup') : t('player.bottomGroup')} ${t('player.group.label')}`,
        });
      },
      onError: (error) => {
        toast({
          title: t('general.error'),
          description: "Failed to add player",
          variant: "destructive"
        });
        console.error('Error adding player:', error);
      }
    });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-blue-600" />
          {t('player.add.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <Input
              placeholder={t('player.name.placeholder')}
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Select value={newPlayerGroup} onValueChange={(value: 'top' | 'bottom') => setNewPlayerGroup(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">{t('player.topGroup')}</SelectItem>
                <SelectItem value="bottom">{t('player.bottomGroup')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Button 
              onClick={handleAddPlayer} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={createPlayerMutation.isPending}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {createPlayerMutation.isPending ? 'Adding...' : t('general.add')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerForm;
