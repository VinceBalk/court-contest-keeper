
export interface DesignSystemSettings {
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

export const defaultSettings: DesignSystemSettings = {
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
