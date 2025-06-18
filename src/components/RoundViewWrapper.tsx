
import React from "react";
import { useParams } from "react-router-dom";
import RoundView from "@/pages/RoundView";

const RoundViewWrapper = () => {
  const { round } = useParams();
  
  // For now, return a simple component until we can properly integrate with the existing data flow
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Round {round}</h1>
      <p className="text-muted-foreground">Round view is being updated...</p>
    </div>
  );
};

export default RoundViewWrapper;
