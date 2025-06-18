
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    specialPoints: { [playerId: string]: number }
  ) => void;
  onCancel: () => void;
}

const ScoreEntry = ({ match, players, onSubmitScore, onCancel }: ScoreEntryProps) => {
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [specialPoints, setSpecialPoints] = useState<{ [playerId: string]: number }>({});
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

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Users className="h-5 w-5" />
          Enter Score - Court {match.court}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            />
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Special Points (Aces, Via Glass, Out of Cage)</h4>
          <div className="grid grid-cols-2 gap-2">
            {[...match.team1, ...match.team2].map(playerId => {
              const player = players.find(p => p.id === playerId);
              return (
                <div key={playerId} className="flex items-center gap-2">
                  <label className="text-sm flex-1">{player?.name}</label>
                  <Input
                    type="number"
                    min="0"
                    value={specialPoints[playerId] || 0}
                    onChange={(e) => setSpecialPoints({
                      ...specialPoints,
                      [playerId]: parseInt(e.target.value) || 0
                    })}
                    className="w-20"
                  />
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
