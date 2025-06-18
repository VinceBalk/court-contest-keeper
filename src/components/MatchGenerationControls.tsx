
import { Button } from "@/components/ui/button";
import { Shuffle, Edit } from "lucide-react";

interface MatchGenerationControlsProps {
  currentRound: number;
  canGenerateMatches: boolean;
  hasCurrentRoundMatches: boolean;
  hasPreviewMatches: boolean;
  isManualMode: boolean;
  onGeneratePreview: () => void;
  onToggleManualMode: () => void;
}

const MatchGenerationControls = ({
  currentRound,
  canGenerateMatches,
  hasCurrentRoundMatches,
  hasPreviewMatches,
  isManualMode,
  onGeneratePreview,
  onToggleManualMode
}: MatchGenerationControlsProps) => {
  if (!canGenerateMatches || hasCurrentRoundMatches || hasPreviewMatches) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button onClick={onGeneratePreview} className="bg-green-600 hover:bg-green-700">
        <Shuffle className="h-4 w-4 mr-2" />
        {currentRound === 3 ? 'Preview Final Round' : (isManualMode ? 'Preview Manual' : 'Preview Random')}
      </Button>
      {currentRound !== 3 && (
        <Button 
          onClick={onToggleManualMode}
          variant="outline"
        >
          <Edit className="h-4 w-4 mr-2" />
          {isManualMode ? 'Switch to Random' : 'Manual Setup'}
        </Button>
      )}
    </div>
  );
};

export default MatchGenerationControls;
