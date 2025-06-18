
import { useState, useEffect } from "react";
import { DesignSystemSettings, defaultSettings } from "@/types/designSystem";
import { hexToHsl, rgbToHsl } from "@/utils/colorUtils";

export const useDesignSystem = () => {
  const [settings, setSettings] = useState<DesignSystemSettings>(defaultSettings);

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

  return {
    settings,
    updateTypography,
    updateColor,
    updateColorFromInput,
    updateSpacing,
    updateBorderRadius,
    resetToDefaults,
    exportSettings,
    importSettings,
  };
};
