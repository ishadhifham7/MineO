import type { TextStyle, ViewStyle } from "react-native";

export type ThemeMode = "light" | "dark";

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryForeground: string;
  success: string;
  warning: string;
  danger: string;
  overlay: string;
};

export type ThemeSpacing = {
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
};

export type ThemeRadii = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
};

export type ThemeTypography = {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  body: TextStyle;
  bodyMuted: TextStyle;
  caption: TextStyle;
  button: TextStyle;
};

export type ThemeShadows = {
  sm: ViewStyle;
  md: ViewStyle;
};

export type AppTheme = {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radii: ThemeRadii;
  typography: ThemeTypography;
  shadows: ThemeShadows;
};

const spacing: ThemeSpacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

const radii: ThemeRadii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

const typography = (colors: ThemeColors): ThemeTypography => ({
  h1: {
    fontFamily: "Roboto_500Medium",
    fontSize: 30,
    lineHeight: 36,
    color: colors.text,
  },
  h2: {
    fontFamily: "Roboto_500Medium",
    fontSize: 24,
    lineHeight: 30,
    color: colors.text,
  },
  h3: {
    fontFamily: "Roboto_500Medium",
    fontSize: 18,
    lineHeight: 24,
    color: colors.text,
  },
  body: {
    fontFamily: "Roboto_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  bodyMuted: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  caption: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
  button: {
    fontFamily: "Roboto_500Medium",
    fontSize: 15,
    lineHeight: 20,
    color: colors.primaryForeground,
  },
});

const shadows = (mode: ThemeMode): ThemeShadows => ({
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: mode === "dark" ? 0.35 : 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: mode === "dark" ? 0.45 : 0.14,
    shadowRadius: 12,
    elevation: 6,
  },
});

export const lightColors: ThemeColors = {
  background: "#F4F6FA",
  surface: "#FFFFFF",
  surfaceAlt: "#F8FAFC",
  border: "#DCE4F0",
  text: "#1E293B",
  textMuted: "#64748B",
  primary: "#4E6FA3",
  primaryForeground: "#FFFFFF",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  overlay: "rgba(2, 6, 23, 0.45)",
};

export const darkColors: ThemeColors = {
  background: "#0B1220",
  surface: "#111A2E",
  surfaceAlt: "#162033",
  border: "#23324D",
  text: "#F3F7FF",
  textMuted: "#B8C4DA",
  primary: "#63D1E6",
  primaryForeground: "#04101A",
  success: "#8DD7A1",
  warning: "#F8DABE",
  danger: "#FF8A80",
  overlay: "rgba(1, 8, 20, 0.65)",
};

export const buildTheme = (mode: ThemeMode): AppTheme => {
  const colors = mode === "dark" ? darkColors : lightColors;

  return {
    mode,
    colors,
    spacing,
    radii,
    typography: typography(colors),
    shadows: shadows(mode),
  };
};
