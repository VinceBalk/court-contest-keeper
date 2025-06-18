
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { Player, Match } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface ScoreEntryProps {
  match: Match;
  players: Player[];
  onSubmitScore: (
    match: Match, 
    team1Score: number, 
    team2Score: number, 
    specialPoints: { [playerId: string]: { count: number; type: string }[] }
  ) => void;
  onCancel: () => void;
}

const SPECIAL_TYPES = [
  "Ace",
  "Via Glass", 
  "Out of Cage",
  "Winner",
  "Smash"
];

const ScoreEntry = ({ match, players, onSubmitScore, onCancel }: ScoreEntryProps) => {
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [specialPoints, setSpecialPoints] = useState<{ [playerId: string]: { count: number; type: string }[] }>({});
  const { toast } = useToast();

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
    <Card className="bg-white/95 backdrop-blur-sm border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Users className="h-5 w-5" />
          Enter Score - Court {match.court}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {match.team1.map(id => players.find(p => p.id === id)?.name).join(" & ")}
            </label>
            <Input
              type="number"
              min="0"
              max="8"
              value={team1Score}
              onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
              placeholder="Games won"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {match.team2.map(id => players.find(p => p.id === id)?.name).join(" & ")}
            </label>
            <Input
              type="number"
              min="0"
              max="8"
              value={team2Score}
              onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
              placeholder="Games won"
            />
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Special Points</h4>
          <div className="space-y-4">
            {[...match.team1, ...match.team2].map(playerId => {
              const player = players.find(p => p.id === playerId);
              const playerSpecials = specialPoints[playerId] || [];
              
              return (
                <div key={playerId} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{player?.name}</span>
                    <span className="text-sm text-gray-600">
                      Total: {getPlayerSpecialCount(playerId)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 mb-2">
                    <Select onValueChange={(type) => addSpecialPoint(playerId, type)}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Add special" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPECIAL_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                        <span className="text-blue-600">×</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Submit Score
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>

        <p className="text-sm text-gray-600">
          Total games: {team1Score + team2Score}/8
        </p>
      </CardContent>
    </Card>
  );
};

export default ScoreEntry;
