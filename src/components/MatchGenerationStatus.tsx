
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface MatchGenerationStatusProps {
  currentRound: number;
  canGenerateMatches: boolean;
  hasCurrentRoundMatches: boolean;
  hasPreviewMatches: boolean;
  topGroupCount: number;
  bottomGroupCount: number;
}

const MatchGenerationStatus = ({
  currentRound,
  canGenerateMatches,
  hasCurrentRoundMatches,
  hasPreviewMatches,
  topGroupCount,
  bottomGroupCount
}: MatchGenerationStatusProps) => {
  if (hasCurrentRoundMatches || hasPreviewMatches) {
    return null;
  }

  if (currentRound === 3) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <p className="text-yellow-800 text-center">
            <Trophy className="h-5 w-5 inline mr-2" />
            Final round matches will be generated based on scores from rounds 1 and 2.
            Players will be ranked by total points within each group.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!canGenerateMatches) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <p className="text-yellow-800 text-center">
            Both groups need at least 4 active players each with even numbers to generate matches.
            <br />
            Current Active: Linker Rijtje ({topGroupCount}), Rechter Rijtje ({bottomGroupCount})
            <br />
            <span className="text-sm">Use the Players & Groups tab to activate players for the tournament (max 8 per group)</span>
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default MatchGenerationStatus;
