
import React from "react";
import { useParams } from "react-router-dom";
import RoundView from "@/pages/RoundView";

interface RoundViewWrapperProps {
  matches: any[];
  players: any[];
  tournaments: any[];
  setMatches: (matches: any[]) => void;
  currentRound: number;
  activeTournament: any;
}

const RoundViewWrapper = () => {
  const { round } = useParams();
  
  // Since we're using local state management, we need to get data from parent components
  // For now, return a placeholder that explains the integration needed
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Round {round}</h1>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800">
          This round view needs to be integrated with the main application data flow.
          For now, navigate back to the main app to view and manage matches.
        </p>
      </div>
    </div>
  );
};

export default RoundViewWrapper;
