
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Type, Layout, RotateCcw, Download, Upload } from "lucide-react";
import { useDesignSystem } from "@/hooks/useDesignSystem";
import TypographySettings from "./TypographySettings";
import ColorSettings from "./ColorSettings";
import SpacingSettings from "./SpacingSettings";
import BorderSettings from "./BorderSettings";

const DesignSystemManager = () => {
  const {
    settings,
    updateTypography,
    updateColor,
    updateColorFromInput,
    updateSpacing,
    updateBorderRadius,
    resetToDefaults,
    exportSettings,
    importSettings,
  } = useDesignSystem();

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-600" />
            Design System Manager
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={resetToDefaults} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button onClick={exportSettings} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Settings
            </Button>
            <Label htmlFor="import-settings" className="cursor-pointer">
              <Button asChild variant="outline" size="sm">
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Settings
                </span>
              </Button>
              <Input
                id="import-settings"
                type="file"
                accept=".json"
                onChange={importSettings}
                className="hidden"
              />
            </Label>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="typography" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="typography">
                <Type className="h-4 w-4 mr-2" />
                Typography
              </TabsTrigger>
              <TabsTrigger value="colors">
                <Palette className="h-4 w-4 mr-2" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="spacing">
                <Layout className="h-4 w-4 mr-2" />
                Spacing
              </TabsTrigger>
              <TabsTrigger value="borders">Borders</TabsTrigger>
            </TabsList>

            <TabsContent value="typography" className="space-y-6">
              <TypographySettings 
                typography={settings.typography} 
                onUpdate={updateTypography} 
              />
            </TabsContent>

            <TabsContent value="colors" className="space-y-6">
              <ColorSettings
                colors={settings.colors}
                onUpdateColor={updateColor}
                onUpdateColorFromInput={updateColorFromInput}
              />
            </TabsContent>

            <TabsContent value="spacing" className="space-y-6">
              <SpacingSettings 
                spacing={settings.spacing} 
                onUpdate={updateSpacing} 
              />
            </TabsContent>

            <TabsContent value="borders" className="space-y-6">
              <BorderSettings 
                borderRadius={settings.borderRadius} 
                onUpdate={updateBorderRadius} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignSystemManager;
