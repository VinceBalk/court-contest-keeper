
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DesignSystemSettings } from "@/types/designSystem";

interface TypographySettingsProps {
  typography: DesignSystemSettings['typography'];
  onUpdate: (key: keyof DesignSystemSettings['typography'], value: number) => void;
}

const TypographySettings = ({ typography, onUpdate }: TypographySettingsProps) => {
  return (
    <div className="grid gap-6">
      <h3 className="text-lg font-semibold">Font Sizes</h3>
      {Object.entries(typography).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
            <Badge variant="outline">{value}rem</Badge>
          </div>
          <Slider
            value={[value]}
            onValueChange={([newValue]) => onUpdate(key as keyof DesignSystemSettings['typography'], newValue)}
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
  );
};

export default TypographySettings;
