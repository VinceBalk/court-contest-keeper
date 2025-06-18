
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DesignSystemSettings } from "@/types/designSystem";

interface BorderSettingsProps {
  borderRadius: DesignSystemSettings['borderRadius'];
  onUpdate: (key: keyof DesignSystemSettings['borderRadius'], value: number) => void;
}

const BorderSettings = ({ borderRadius, onUpdate }: BorderSettingsProps) => {
  return (
    <div className="grid gap-6">
      <h3 className="text-lg font-semibold">Border Radius</h3>
      {Object.entries(borderRadius).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="capitalize">{key}</Label>
            <Badge variant="outline">{value}rem</Badge>
          </div>
          <Slider
            value={[value]}
            onValueChange={([newValue]) => onUpdate(key as keyof DesignSystemSettings['borderRadius'], newValue)}
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
  );
};

export default BorderSettings;
