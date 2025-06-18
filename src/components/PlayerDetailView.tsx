
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Trophy, Target, Star, Medal, Edit2, X } from "lucide-react";
import { Player, Match } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface PlayerDetailViewProps {
  player: Player;
  matches: Match[];
  players: Player[];
  onUpdatePlayer: (updatedPlayer: Player) => void;
  onClose: () => void;
}

interface PlayerStats {
  tournamentsPlayed: number;
  gamesWon: number;
  gamesLost: number;
  specialsByType: { [specialType: string]: number };
  ranking: number;
  winRate: number;
}

const PlayerDetailView = ({ player, matches, players, onUpdatePlayer, onClose }: PlayerDetailViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlayer, setEditedPlayer] = useState({
    firstName: player.name.split(' ')[0] || '',
    middleName: player.name.split(' ').slice(1, -1).join(' ') || '',
    surname: player.name.split(' ').slice(-1)[0] || '',
    group: player.group
  });
  const { toast } = useToast();

  // Calculate player statistics
  const calculatePlayerStats = (): PlayerStats => {
    const playerMatches = matches.filter(match => 
      match.completed && (
        match.team1.includes(player.id) || 
        match.team2.includes(player.id)
      )
    );

    const gamesWon = playerMatches.filter(match => {
      const isTeam1 = match.team1.includes(player.id);
      return isTeam1 ? match.team1Score > match.team2Score : match.team2Score > match.team1Score;
    }).length;

    const gamesLost = playerMatches.length - gamesWon;

    // Calculate specials by type
    const specialsByType: { [specialType: string]: number } = {};
    playerMatches.forEach(match => {
      if (match.specialPoints && match.specialPoints[player.id]) {
        const playerSpecials = match.specialPoints[player.id];
        if (typeof playerSpecials === 'number') {
          specialsByType['total'] = (specialsByType['total'] || 0) + playerSpecials;
        }
      }
    });

    // Calculate ranking within group
    const groupPlayers = players.filter(p => p.group === player.group && p.isActive);
    const sortedPlayers = groupPlayers.sort((a, b) => {
      // Sort by total points descending, then by matches played ascending
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      return a.matchesPlayed - b.matchesPlayed;
    });
    const ranking = sortedPlayers.findIndex(p => p.id === player.id) + 1;

    const winRate = playerMatches.length > 0 ? (gamesWon / playerMatches.length) * 100 : 0;

    return {
      tournamentsPlayed: player.overallStats.tournamentsPlayed,
      gamesWon,
      gamesLost,
      specialsByType,
      ranking: ranking || 0,
      winRate
    };
  };

  const stats = calculatePlayerStats();

  const handleSaveEdit = () => {
    if (!editedPlayer.firstName.trim() || !editedPlayer.surname.trim()) {
      toast({
        title: "Error",
        description: "First name and surname are required",
        variant: "destructive"
      });
      return;
    }

    const fullName = [
      editedPlayer.firstName.trim(),
      editedPlayer.middleName.trim(),
      editedPlayer.surname.trim()
    ].filter(Boolean).join(' ');

    const updatedPlayer: Player = {
      ...player,
      name: fullName,
      group: editedPlayer.group
    };

    onUpdatePlayer(updatedPlayer);
    setIsEditing(false);
    
    toast({
      title: "Player Updated",
      description: `${fullName} has been updated successfully`,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isEditing ? "Edit Player" : "Player Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Player Header */}
          <Card className={`${
            player.group === 'top' 
              ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
              : 'bg-gradient-to-br from-blue-50 to-green-50 border-blue-200'
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    player.group === 'top' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {player.group === 'top' ? (
                      <Trophy className="h-6 w-6 text-yellow-600" />
                    ) : (
                      <Target className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              value={editedPlayer.firstName}
                              onChange={(e) => setEditedPlayer(prev => ({ ...prev, firstName: e.target.value }))}
                              placeholder="First name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="middleName">Middle Name</Label>
                            <Input
                              id="middleName"
                              value={editedPlayer.middleName}
                              onChange={(e) => setEditedPlayer(prev => ({ ...prev, middleName: e.target.value }))}
                              placeholder="Middle name (optional)"
                            />
                          </div>
                          <div>
                            <Label htmlFor="surname">Surname *</Label>
                            <Input
                              id="surname"
                              value={editedPlayer.surname}
                              onChange={(e) => setEditedPlayer(prev => ({ ...prev, surname: e.target.value }))}
                              placeholder="Surname"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="group">Group</Label>
                          <Select value={editedPlayer.group} onValueChange={(value: 'top' | 'bottom') => setEditedPlayer(prev => ({ ...prev, group: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="top">Linker Rijtje</SelectItem>
                              <SelectItem value="bottom">Rechter Rijtje</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold">{player.name}</h2>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${
                            player.group === 'top' 
                              ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                              : 'bg-blue-100 text-blue-700 border-blue-300'
                          }`}>
                            {player.group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'}
                          </Badge>
                          <Badge variant={player.isActive ? "default" : "secondary"}>
                            {player.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {stats.ranking > 0 && (
                            <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                              <Medal className="h-3 w-3 mr-1" />
                              Rank #{stats.ranking}
                            </Badge>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveEdit} size="sm">
                        Save
                      </Button>
                      <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  <Button onClick={onClose} variant="outline" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tournaments</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.tournamentsPlayed}</div>
                <p className="text-xs text-muted-foreground">Total played</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Games Won</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.gamesWon}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.gamesLost} lost | {stats.winRate.toFixed(1)}% win rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Special Points</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.specialsByType.total || 0}
                </div>
                <p className="text-xs text-muted-foreground">Total earned</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Points</CardTitle>
                <Medal className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{player.totalPoints}</div>
                <p className="text-xs text-muted-foreground">Tournament points</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Tournament Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Matches Played</span>
                    <span className="text-sm">{player.matchesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Games</span>
                    <span className="text-sm">{player.totalGames}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Special Points</span>
                    <span className="text-sm">{player.totalSpecials}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tournament Points</span>
                    <span className="text-sm font-bold">{player.totalPoints}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overall Career Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Tournaments</span>
                    <span className="text-sm">{player.overallStats.tournamentsPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Career Games</span>
                    <span className="text-sm">{player.overallStats.totalGames}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Career Specials</span>
                    <span className="text-sm">{player.overallStats.totalSpecials}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Career Points</span>
                    <span className="text-sm font-bold">{player.overallStats.totalPoints}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDetailView;
