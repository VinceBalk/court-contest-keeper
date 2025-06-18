
import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { TabDefinition } from "./TabDefinition";

interface MobileNavigationProps {
  visibleTabs: TabDefinition[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileNavigation = ({ visibleTabs, activeTab, setActiveTab }: MobileNavigationProps) => {
  return (
    <div className="sm:hidden">
      <div className="flex items-center gap-2 mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
              <Menu className="h-4 w-4" />
              <span className="ml-2">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-white">
            <div className="flex flex-col space-y-2 mt-6">
              {visibleTabs.map((tab) => (
                <Button
                  key={tab.value}
                  variant={activeTab === tab.value ? "default" : "ghost"}
                  className={`justify-start ${activeTab === tab.value ? `bg-${tab.color}-100 text-${tab.color}-700` : ''}`}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Current tab indicator */}
        <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-md text-sm font-medium">
          {visibleTabs.find(tab => tab.value === activeTab)?.label}
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
