
import React from "react";
import { TabsTrigger } from "@/components/ui/tabs";
import { TabDefinition } from "./TabDefinition";

interface TabButtonProps {
  tab: TabDefinition;
}

const getActiveColor = (color: string) => {
  return `data-[state=active]:bg-${color}-100`;
};

const TabButton = ({ tab }: TabButtonProps) => (
  <TabsTrigger 
    value={tab.value} 
    className={`${getActiveColor(tab.color)} text-xs sm:text-sm px-2 py-2 min-h-[44px] font-medium`}
  >
    <span className="hidden sm:inline">{tab.label}</span>
    <span className="sm:hidden">{tab.shortLabel}</span>
  </TabsTrigger>
);

export default TabButton;
