
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Play, Archive, Trash2, Users } from "lucide-react";
import { Tournament } from "@/pages/Index";

interface TournamentCardProps {
  tournament: Tournament;
  onActivate: (tournament: Tournament) => void;
  onComplete: (tournament: Tournament) => void;
  onDelete: (tournamentId: string) => void;
}

const TournamentCard = ({ 
  tournament, 
  onActivate, 
  onComplete, 
  onDelete 
}: TournamentCardProps) => {
  return (
    <Card className={`bg-white/90 backdrop-blur-sm ${
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
              onClick={() => onActivate(tournament)}
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
              onClick={() => onComplete(tournament)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Archive className="h-4 w-4 mr-1" />
              Complete
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(tournament.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentCard;
