
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Play, Archive, Trash2, Users, ArrowRight } from "lucide-react";
import { Tournament } from "@/pages/Index";
import { useT } from "@/contexts/TranslationContext";
import { useNavigate } from "react-router-dom";

interface TournamentCardProps {
  tournament: Tournament & { 
    isActive?: boolean; 
    completed?: boolean; 
  };
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
  const { t } = useT();
  const navigate = useNavigate();

  const isToday = (dateString: string) => {
    const today = new Date();
    const tournamentDate = new Date(dateString);
    return today.toDateString() === tournamentDate.toDateString();
  };

  const isFuture = (dateString: string) => {
    const today = new Date();
    const tournamentDate = new Date(dateString);
    return tournamentDate > today;
  };

  const getStatusLabel = () => {
    if (tournament.completed) return t('tournament.completed.badge');
    if (tournament.isActive && isToday(tournament.startDate)) return 'Now Playing';
    if (tournament.isActive) return t('tournament.active');
    if (isFuture(tournament.startDate)) return 'Upcoming Tournament';
    return '';
  };

  const getStatusColor = () => {
    if (tournament.completed) return 'bg-green-100 text-green-700 border-green-300';
    if (tournament.isActive && isToday(tournament.startDate)) return 'bg-red-100 text-red-700 border-red-300';
    if (tournament.isActive) return 'bg-blue-100 text-blue-700 border-blue-300';
    if (isFuture(tournament.startDate)) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getDateDisplay = () => {
    if (tournament.startDate === tournament.endDate) {
      return tournament.startDate;
    }
    return `${tournament.startDate} - ${tournament.endDate}`;
  };

  const handleCardClick = () => {
    navigate(`/tournament/${tournament.id}`);
  };

  return (
    <Card className={`bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all duration-200 ${
      tournament.isActive ? 'ring-2 ring-blue-500 bg-blue-50/90' : ''
    }`} onClick={handleCardClick}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            {tournament.name}
          </CardTitle>
          <div className="flex gap-1 items-center">
            {getStatusLabel() && (
              <Badge className={getStatusColor()}>
                {getStatusLabel()}
              </Badge>
            )}
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <p className="text-sm text-gray-600">{getDateDisplay()}</p>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{t('general.max')} {tournament.maxPlayers} {t('general.players')} ({tournament.maxPlayers/2} {t('player.maxPlayersPerGroup')})</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2 flex-wrap">
          {!tournament.completed && !tournament.isActive && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onActivate(tournament);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="h-4 w-4 mr-1" />
              {t('tournament.activate')}
            </Button>
          )}
          
          {tournament.isActive && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onComplete(tournament);
              }}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Archive className="h-4 w-4 mr-1" />
              {t('tournament.complete')}
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(tournament.id);
            }}
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
