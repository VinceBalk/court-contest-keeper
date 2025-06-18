
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DesignSystemSettings } from "@/types/designSystem";

interface SpacingSettingsProps {
  spacing: DesignSystemSettings['spacing'];
  onUpdate: (key: keyof DesignSystemSettings['spacing'], value: number) => void;
}

const SpacingSettings = ({ spacing, onUpdate }: SpacingSettingsProps) => {
  return (
    <div className="grid gap-6">
      <h3 className="text-lg font-semibold">Spacing Scale</h3>
      {Object.entries(spacing).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="capitalize">{key}</Label>
            <Badge variant="outline">{value}rem</Badge>
          </div>
          <Slider
            value={[value]}
            onValueChange={([newValue]) => onUpdate(key as keyof DesignSystemSettings['spacing'], newValue)}
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
  );
};

export default SpacingSettings;
