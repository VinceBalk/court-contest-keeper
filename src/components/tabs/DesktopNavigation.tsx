
import React from "react";
import { TabsList } from "@/components/ui/tabs";
import { TabDefinition } from "./TabDefinition";
import TabButton from "./TabButton";

interface DesktopNavigationProps {
  visibleTabs: TabDefinition[];
}

const DesktopNavigation = ({ visibleTabs }: DesktopNavigationProps) => {
  return (
    <div className="hidden sm:block">
      <TabsList 
        className={`grid w-full bg-white/90 backdrop-blur-sm gap-1 h-auto p-1 border border-gray-200 shadow-sm`} 
        style={{gridTemplateColumns: `repeat(${visibleTabs.length}, minmax(0, 1fr))`}}
      >
        {visibleTabs.map((tab) => (
          <TabButton key={tab.value} tab={tab} />
        ))}
      </TabsList>
    </div>
  );
};

export default DesktopNavigation;
