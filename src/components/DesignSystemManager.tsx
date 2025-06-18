import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Type, Layout, RotateCcw, Download, Upload } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";
import { hexToHsl, hslToHex, rgbToHsl, hslToRgb, hexToRgb } from "@/utils/colorUtils";

interface DesignSystemSettings {
  typography: {
    fontSizeXs: number;
    fontSizeSm: number;
    fontSizeBase: number;
    fontSizeLg: number;
    fontSizeXl: number;
    fontSize2xl: number;
    fontSize3xl: number;
    fontSize4xl: number;
    fontSize5xl: number;
    fontSize6xl: number;
  };
  colors: {
    primary: { h: number; s: number; l: number };
    success: { h: number; s: number; l: number };
    warning: { h: number; s: number; l: number };
    error: { h: number; s: number; l: number };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
  };
}

const defaultSettings: DesignSystemSettings = {
  typography: {
    fontSizeXs: 0.75,
    fontSizeSm: 0.875,
    fontSizeBase: 1,
    fontSizeLg: 1.125,
    fontSizeXl: 1.25,
    fontSize2xl: 1.5,
    fontSize3xl: 1.875,
    fontSize4xl: 2.25,
    fontSize5xl: 3,
    fontSize6xl: 3.75,
  },
  colors: {
    primary: { h: 217, s: 91, l: 60 },
    success: { h: 142, s: 71, l: 45 },
    warning: { h: 38, s: 92, l: 50 },
    error: { h: 0, s: 84, l: 60 },
  },
  spacing: {
    xs: 0.25,
    sm: 0.5,
    md: 1,
    lg: 1.5,
    xl: 2,
    '2xl': 3,
    '3xl': 4,
  },
  borderRadius: {
    sm: 0.125,
    md: 0.375,
    lg: 0.5,
    xl: 0.75,
    '2xl': 1,
  },
};

const DesignSystemManager = () => {
  const { t } = useT();
  const [settings, setSettings] = useState<DesignSystemSettings>(defaultSettings);
  const [colorFormat, setColorFormat] = useState<'hsl' | 'rgb' | 'hex'>('hsl');

  useEffect(() => {
    const savedSettings = localStorage.getItem('design-system-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    applySettingsToCSS(settings);
    localStorage.setItem('design-system-settings', JSON.stringify(settings));
  }, [settings]);

  const applySettingsToCSS = (newSettings: DesignSystemSettings) => {
    const root = document.documentElement;
    
    // Apply typography
    Object.entries(newSettings.typography).forEach(([key, value]) => {
      const cssVar = `--font-size-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, `${value}rem`);
    });

    // Apply colors
    Object.entries(newSettings.colors).forEach(([colorName, color]) => {
      ['50', '100', '500', '600', '700'].forEach((shade) => {
        const lightness = shade === '50' ? Math.min(color.l + 45, 95) :
                         shade === '100' ? Math.min(color.l + 35, 90) :
                         shade === '500' ? color.l :
                         shade === '600' ? Math.max(color.l - 10, 10) :
                         Math.max(color.l - 20, 5);
        
        const saturation = shade === '50' || shade === '100' ? Math.max(color.s - 20, 20) : color.s;
        
        root.style.setProperty(
          `--color-${colorName}-${shade}`,
          `${color.h} ${saturation}% ${lightness}%`
        );
      });
    });

    // Apply spacing
    Object.entries(newSettings.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, `${value}rem`);
    });

    // Apply border radius
    Object.entries(newSettings.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, `${value}rem`);
    });
  };

  const updateTypography = (key: keyof typeof settings.typography, value: number) => {
    setSettings(prev => ({
      ...prev,
      typography: { ...prev.typography, [key]: value }
    }));
  };

  const updateColor = (colorName: keyof typeof settings.colors, property: 'h' | 's' | 'l', value: number) => {
    setSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorName]: { ...prev.colors[colorName], [property]: value }
      }
    }));
  };

  const updateColorFromInput = (colorName: keyof typeof settings.colors, value: string, format: 'hex' | 'rgb') => {
    if (format === 'hex') {
      const hsl = hexToHsl(value);
      if (hsl) {
        setSettings(prev => ({
          ...prev,
          colors: {
            ...prev.colors,
            [colorName]: hsl
          }
        }));
      }
    } else if (format === 'rgb') {
      const rgbMatch = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        const hsl = rgbToHsl(r, g, b);
        setSettings(prev => ({
          ...prev,
          colors: {
            ...prev.colors,
            [colorName]: hsl
          }
        }));
      }
    }
  };

  const getColorValue = (color: { h: number; s: number; l: number }, format: 'hsl' | 'rgb' | 'hex') => {
    switch (format) {
      case 'hsl':
        return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
      case 'rgb':
        const rgb = hslToRgb(color.h, color.s, color.l);
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case 'hex':
        return hslToHex(color.h, color.s, color.l);
      default:
        return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
    }
  };

  const updateSpacing = (key: keyof typeof settings.spacing, value: number) => {
    setSettings(prev => ({
      ...prev,
      spacing: { ...prev.spacing, [key]: value }
    }));
  };

  const updateBorderRadius = (key: keyof typeof settings.borderRadius, value: number) => {
    setSettings(prev => ({
      ...prev,
      borderRadius: { ...prev.borderRadius, [key]: value }
    }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'design-system-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings(imported);
        } catch (error) {
          console.error('Failed to import settings:', error);
        }
      };
      reader.readAsText(file);
    }
  };

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
              <div className="grid gap-6">
                <h3 className="text-lg font-semibold">Font Sizes</h3>
                {Object.entries(settings.typography).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                      <Badge variant="outline">{value}rem</Badge>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => updateTypography(key as keyof typeof settings.typography, newValue)}
                      min={0.5}
                      max={5}
                      step={0.125}
                      className="w-full"
                    />
                    <div className={`p-2 border rounded`} style={{ fontSize: `${value}rem` }}>
                      Sample text for {key}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="colors" className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Color Palette</h3>
                  <div className="flex items-center gap-2">
                    <Label>Format:</Label>
                    <Select value={colorFormat} onValueChange={(value: 'hsl' | 'rgb' | 'hex') => setColorFormat(value)}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hsl">HSL</SelectItem>
                        <SelectItem value="rgb">RGB</SelectItem>
                        <SelectItem value="hex">HEX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {Object.entries(settings.colors).map(([colorName, color]) => (
                  <Card key={colorName} className="p-4">
                    <h4 className="text-md font-medium mb-4 capitalize">{colorName}</h4>
                    <div className="grid gap-4">
                      {colorFormat === 'hsl' && (
                        <>
                          <div className="space-y-2">
                            <Label>Hue: {color.h}</Label>
                            <Slider
                              value={[color.h]}
                              onValueChange={([value]) => updateColor(colorName as keyof typeof settings.colors, 'h', value)}
                              min={0}
                              max={360}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Saturation: {color.s}%</Label>
                            <Slider
                              value={[color.s]}
                              onValueChange={([value]) => updateColor(colorName as keyof typeof settings.colors, 's', value)}
                              min={0}
                              max={100}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Lightness: {color.l}%</Label>
                            <Slider
                              value={[color.l]}
                              onValueChange={([value]) => updateColor(colorName as keyof typeof settings.colors, 'l', value)}
                              min={0}
                              max={100}
                              step={1}
                            />
                          </div>
                        </>
                      )}
                      
                      {colorFormat === 'rgb' && (
                        <div className="space-y-2">
                          <Label>RGB Value</Label>
                          <Input
                            value={getColorValue(color, 'rgb')}
                            onChange={(e) => updateColorFromInput(colorName as keyof typeof settings.colors, e.target.value, 'rgb')}
                            placeholder="rgb(255, 255, 255)"
                          />
                        </div>
                      )}
                      
                      {colorFormat === 'hex' && (
                        <div className="space-y-2">
                          <Label>Hex Value</Label>
                          <Input
                            value={getColorValue(color, 'hex')}
                            onChange={(e) => updateColorFromInput(colorName as keyof typeof settings.colors, e.target.value, 'hex')}
                            placeholder="#ffffff"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Current Value</Label>
                        <div className="p-2 bg-gray-100 rounded text-sm font-mono">
                          {getColorValue(color, colorFormat)}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {['50', '100', '500', '600', '700'].map((shade) => {
                          const lightness = shade === '50' ? Math.min(color.l + 45, 95) :
                                          shade === '100' ? Math.min(color.l + 35, 90) :
                                          shade === '500' ? color.l :
                                          shade === '600' ? Math.max(color.l - 10, 10) :
                                          Math.max(color.l - 20, 5);
                          const saturation = shade === '50' || shade === '100' ? Math.max(color.s - 20, 20) : color.s;
                          
                          return (
                            <div
                              key={shade}
                              className="w-12 h-12 rounded border flex items-center justify-center text-xs font-medium"
                              style={{
                                backgroundColor: `hsl(${color.h}, ${saturation}%, ${lightness}%)`,
                                color: lightness > 50 ? '#000' : '#fff'
                              }}
                            >
                              {shade}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="spacing" className="space-y-6">
              <div className="grid gap-6">
                <h3 className="text-lg font-semibold">Spacing Scale</h3>
                {Object.entries(settings.spacing).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="capitalize">{key}</Label>
                      <Badge variant="outline">{value}rem</Badge>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => updateSpacing(key as keyof typeof settings.spacing, newValue)}
                      min={0.125}
                      max={6}
                      step={0.125}
                      className="w-full"
                    />
                    <div className="flex items-center gap-2">
                      <div
                        className="bg-blue-500 h-4"
                        style={{ width: `${value}rem` }}
                      />
                      <span className="text-sm text-gray-600">{value}rem</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="borders" className="space-y-6">
              <div className="grid gap-6">
                <h3 className="text-lg font-semibold">Border Radius</h3>
                {Object.entries(settings.borderRadius).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="capitalize">{key}</Label>
                      <Badge variant="outline">{value}rem</Badge>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => updateBorderRadius(key as keyof typeof settings.borderRadius, newValue)}
                      min={0}
                      max={2}
                      step={0.125}
                      className="w-full"
                    />
                    <div
                      className="w-16 h-16 bg-blue-500 border"
                      style={{ borderRadius: `${value}rem` }}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignSystemManager;
