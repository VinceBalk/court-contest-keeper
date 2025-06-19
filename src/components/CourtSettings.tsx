
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCourtSettings, useUpdateCourtSetting, CourtSetting } from "@/hooks/useCourtSettings";
import { useToast } from "@/hooks/use-toast";
import { Save, Palette } from "lucide-react";

interface CourtSettingsProps {
  tournamentId: string;
}

const CourtSettings = ({ tournamentId }: CourtSettingsProps) => {
  const { data: courtSettings = [] } = useCourtSettings(tournamentId);
  const updateCourtSetting = useUpdateCourtSetting();
  const { toast } = useToast();
  
  const [editingCourt, setEditingCourt] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ name: string; color: string }>({ name: '', color: '' });

  const predefinedColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Orange
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Dark Orange
    '#84CC16', // Lime
  ];

  const handleEditCourt = (court: CourtSetting) => {
    setEditingCourt(court.id);
    setEditValues({ name: court.court_name, color: court.court_color });
  };

  const handleSaveCourt = async (courtId: string) => {
    try {
      await updateCourtSetting.mutateAsync({
        id: courtId,
        court_name: editValues.name,
        court_color: editValues.color,
      });
      
      setEditingCourt(null);
      toast({
        title: "Court Updated",
        description: "Court settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update court settings.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingCourt(null);
    setEditValues({ name: '', color: '' });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Court Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courtSettings.map((court) => (
          <Card key={court.id} className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Court {court.court_number}</span>
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm" 
                  style={{ backgroundColor: court.court_color }}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingCourt === court.id ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`name-${court.id}`}>Court Name</Label>
                    <Input
                      id={`name-${court.id}`}
                      value={editValues.name}
                      onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter court name"
                    />
                  </div>
                  
                  <div>
                    <Label>Court Color</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 ${
                            editValues.color === color ? 'border-gray-800' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setEditValues(prev => ({ ...prev, color }))}
                        />
                      ))}
                    </div>
                    <Input
                      type="color"
                      value={editValues.color}
                      onChange={(e) => setEditValues(prev => ({ ...prev, color: e.target.value }))}
                      className="mt-2 w-full h-10"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveCourt(court.id)}
                      disabled={updateCourtSetting.isPending}
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">{court.court_name}</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEditCourt(court)}
                    className="w-full"
                  >
                    <Palette className="w-4 h-4 mr-1" />
                    Customize
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourtSettings;
