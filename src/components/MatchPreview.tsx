
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Check, X, Shuffle } from "lucide-react";
import { Player, Match } from "@/pages/Index";

interface MatchPreviewProps {
  previewMatches: Match[];
  players: Player[];
  onConfirm: () => void;
  onRegenerate: () => void;
  onCancel: () => void;
  currentRound: number;
}

const MatchPreview = ({ 
  previewMatches, 
  players, 
  onConfirm, 
  onRegenerate, 
  onCancel, 
  currentRound 
}: MatchPreviewProps) => {
  const topGroupMatches = previewMatches.filter(m => (m.group || 'top') === 'top');
  const bottomGroupMatches = previewMatches.filter(m => (m.group || 'bottom') === 'bottom');

  const renderMatchCard = (match: Match, group: 'top' | 'bottom') => {
    const team1Players = match.team1.map(id => players.find(p => p.id === id)?.name).join(" & ");
    const team2Players = match.team2.map(id => players.find(p => p.id === id)?.name).join(" & ");
    
    return (
      <div key={match.id} className="p-3 bg-white/90 rounded-lg border shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Court {match.court}</span>
          <Badge variant="outline">Round {match.round}</Badge>
        </div>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>{team1Players}</span>
            <span className="text-gray-500">vs</span>
          </div>
          <div className="flex justify-between">
            <span>{team2Players}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Shuffle className="h-5 w-5" />
          Round {currentRound} Match Preview
        </CardTitle>
        <p className="text-sm text-purple-600">
          Review the generated matches below. You can confirm, regenerate, or cancel.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-yellow-700">
              <Trophy className="h-4 w-4" />
              <h3 className="font-semibold">Linker Rijtje Matches</h3>
            </div>
            <div className="space-y-3">
              {topGroupMatches.map((match) => renderMatchCard(match, 'top'))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-700">
              <Target className="h-4 w-4" />
              <h3 className="font-semibold">Rechter Rijtje Matches</h3>
            </div>
            <div className="space-y-3">
              {bottomGroupMatches.map((match) => renderMatchCard(match, 'bottom'))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button onClick={onConfirm} className="bg-green-600 hover:bg-green-700">
            <Check className="h-4 w-4 mr-2" />
            Confirm Matches
          </Button>
          <Button onClick={onRegenerate} variant="outline">
            <Shuffle className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          <Button onClick={onCancel} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchPreview;
