
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DesignSystemSettings } from "@/types/designSystem";
import { hslToRgb, hslToHex } from "@/utils/colorUtils";

interface ColorSettingsProps {
  colors: DesignSystemSettings['colors'];
  onUpdateColor: (colorName: keyof DesignSystemSettings['colors'], property: 'h' | 's' | 'l', value: number) => void;
  onUpdateColorFromInput: (colorName: keyof DesignSystemSettings['colors'], value: string, format: 'hex' | 'rgb') => void;
}

const ColorSettings = ({ colors, onUpdateColor, onUpdateColorFromInput }: ColorSettingsProps) => {
  const [colorFormat, setColorFormat] = useState<'hsl' | 'rgb' | 'hex'>('hsl');

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

  return (
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
      {Object.entries(colors).map(([colorName, color]) => (
        <Card key={colorName} className="p-4">
          <h4 className="text-md font-medium mb-4 capitalize">{colorName}</h4>
          <div className="grid gap-4">
            {colorFormat === 'hsl' && (
              <>
                <div className="space-y-2">
                  <Label>Hue: {color.h}</Label>
                  <Slider
                    value={[color.h]}
                    onValueChange={([value]) => onUpdateColor(colorName as keyof DesignSystemSettings['colors'], 'h', value)}
                    min={0}
                    max={360}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Saturation: {color.s}%</Label>
                  <Slider
                    value={[color.s]}
                    onValueChange={([value]) => onUpdateColor(colorName as keyof DesignSystemSettings['colors'], 's', value)}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lightness: {color.l}%</Label>
                  <Slider
                    value={[color.l]}
                    onValueChange={([value]) => onUpdateColor(colorName as keyof DesignSystemSettings['colors'], 'l', value)}
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
                  onChange={(e) => onUpdateColorFromInput(colorName as keyof DesignSystemSettings['colors'], e.target.value, 'rgb')}
                  placeholder="rgb(255, 255, 255)"
                />
              </div>
            )}
            
            {colorFormat === 'hex' && (
              <div className="space-y-2">
                <Label>Hex Value</Label>
                <Input
                  value={getColorValue(color, 'hex')}
                  onChange={(e) => onUpdateColorFromInput(colorName as keyof DesignSystemSettings['colors'], e.target.value, 'hex')}
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
  );
};

export default ColorSettings;
