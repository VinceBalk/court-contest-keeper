
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface RoundHeaderProps {
  currentRound: number;
  canGenerateMatches: boolean;
  hasCurrentRoundMatches: boolean;
  hasPreviewMatches: boolean;
  onNextRound: () => void;
}

const RoundHeader = ({ 
  currentRound, 
  canGenerateMatches, 
  hasCurrentRoundMatches, 
  hasPreviewMatches,
  onNextRound 
}: RoundHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Calendar className="h-6 w-6 text-blue-600" />
        Round {currentRound} Matches
        {currentRound === 3 && (
          <Badge className="bg-yellow-500 text-yellow-900 ml-2">Final Round</Badge>
        )}
      </h2>
      <div className="flex gap-2">
        {currentRound < 3 && !hasPreviewMatches && (
          <Button 
            onClick={onNextRound}
            variant="outline"
          >
            Next Round
          </Button>
        )}
      </div>
    </div>
  );
};

export default RoundHeader;
