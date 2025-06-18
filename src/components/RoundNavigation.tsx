
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Match, Tournament } from "@/pages/Index";

interface RoundNavigationProps {
  matches: Match[];
  activeTournament: Tournament | null;
  currentRound: number;
}

const RoundNavigation = ({ matches, activeTournament, currentRound }: RoundNavigationProps) => {
  const navigate = useNavigate();

  const getRoundStatus = (round: number) => {
    const roundMatches = matches.filter(m => m.round === round);
    if (roundMatches.length === 0) return 'not-started';
    
    const completedMatches = roundMatches.filter(m => m.completed);
    if (completedMatches.length === roundMatches.length) return 'completed';
    if (completedMatches.length > 0) return 'in-progress';
    return 'scheduled';
  };

  const getStatusBadge = (status: string, round: number) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500 text-yellow-900">In Progress</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500 text-white">Scheduled</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const getMatchCounts = (round: number) => {
    const roundMatches = matches.filter(m => m.round === round);
    const completedMatches = roundMatches.filter(m => m.completed);
    return `${completedMatches.length}/${roundMatches.length}`;
  };

  if (!activeTournament) {
    return null;
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Calendar className="h-5 w-5" />
          Round Overview & Navigation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((round) => {
            const status = getRoundStatus(round);
            const matchCounts = getMatchCounts(round);
            const isCurrentRound = round === currentRound;
            
            return (
              <div key={round} className={`p-4 rounded-lg border ${
                isCurrentRound 
                  ? 'bg-blue-50 border-blue-300' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    {round === 3 && <Trophy className="h-4 w-4 text-yellow-500" />}
                    Round {round}
                    {round === 3 && <span className="text-sm text-gray-600">(Final)</span>}
                  </h3>
                  {getStatusBadge(status, round)}
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  Matches: {matchCounts}
                </div>

                <Button 
                  onClick={() => navigate(`/round/${round}`)}
                  variant={isCurrentRound ? "default" : "outline"}
                  className="w-full"
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Round {round}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoundNavigation;
