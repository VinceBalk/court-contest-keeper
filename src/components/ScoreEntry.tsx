
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, X } from "lucide-react";
import { Player, Match } from "@/pages/Index";
import { SpecialType } from "./SpecialManagement";
import { useToast } from "@/hooks/use-toast";

interface ScoreEntryProps {
  match: Match;
  players: Player[];
  specialTypes: SpecialType[];
  onSubmitScore: (
    match: Match, 
    team1Score: number, 
    team2Score: number, 
    specialPoints: { [playerId: string]: { count: number; type: string }[] }
  ) => void;
  onCancel: () => void;
}

const ScoreEntry = ({ match, players, specialTypes, onSubmitScore, onCancel }: ScoreEntryProps) => {
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(8);
  const [specialPoints, setSpecialPoints] = useState<{ [playerId: string]: { count: number; type: string }[] }>({});
  const { toast } = useToast();

  const activeSpecialTypes = specialTypes.filter(s => s.isActive);

  const handleTeam1ScoreChange = (value: number) => {
    if (value >= 0 && value <= 8) {
      setTeam1Score(value);
      setTeam2Score(8 - value);
    }
  };

  const handleSubmit = () => {
    const totalGames = team1Score + team2Score;
    if (totalGames !== 8) {
      toast({
        title: "Invalid Score",
        description: "Total games must equal 8",
        variant: "destructive"
      });
      return;
    }

    onSubmitScore(match, team1Score, team2Score, specialPoints);
  };

  const addSpecialPoint = (playerId: string, type: string) => {
    setSpecialPoints(prev => ({
      ...prev,
      [playerId]: [...(prev[playerId] || []), { count: 1, type }]
    }));
  };

  const removeSpecialPoint = (playerId: string, index: number) => {
    setSpecialPoints(prev => ({
      ...prev,
      [playerId]: (prev[playerId] || []).filter((_, i) => i !== index)
    }));
  };

  const getPlayerSpecialCount = (playerId: string) => {
    return (specialPoints[playerId] || []).reduce((sum, special) => sum + special.count, 0);
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-green-200 max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-green-700 text-lg">
          <Users className="h-5 w-5" />
          Enter Score - Court {match.court}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              {match.team1.map(id => players.find(p => p.id === id)?.name).join(" & ")}
            </label>
            <Input
              type="number"
              min="0"
              max="8"
              value={team1Score}
              onChange={(e) => handleTeam1ScoreChange(parseInt(e.target.value) || 0)}
              placeholder="Games"
              className="h-9"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {match.team2.map(id => players.find(p => p.id === id)?.name).join(" & ")}
            </label>
            <Input
              type="number"
              value={team2Score}
              readOnly
              className="h-9 bg-gray-100"
            />
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-sm">Special Points</h4>
          <div className="space-y-3">
            {[...match.team1, ...match.team2].map(playerId => {
              const player = players.find(p => p.id === playerId);
              const playerSpecials = specialPoints[playerId] || [];
              
              return (
                <div key={playerId} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{player?.name}</span>
                    <span className="text-xs text-gray-600">
                      Total: {getPlayerSpecialCount(playerId)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 mb-2">
                    <Select onValueChange={(type) => addSpecialPoint(playerId, type)}>
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue placeholder="Add special" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeSpecialTypes.map((specialType) => (
                          <SelectItem key={specialType.id} value={specialType.name}>
                            {specialType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {playerSpecials.map((special, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded cursor-pointer hover:bg-blue-200"
                        onClick={() => removeSpecialPoint(playerId, index)}
                      >
                        {special.type}
                        <X className="h-3 w-3 text-blue-600" />
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 flex-1">
            Submit Score
          </Button>
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreEntry;
