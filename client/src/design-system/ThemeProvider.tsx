import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { AppTheme, ThemeMode, buildTheme } from "./theme";

type ThemePreference = ThemeMode | "system";

type ThemeContextValue = {
  theme: AppTheme;
  mode: ThemeMode;
  preference: ThemePreference;
  setPreference: (next: ThemePreference) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const resolveMode = (
  preference: ThemePreference,
  system: ReturnType<typeof useColorScheme>,
): ThemeMode => {
  if (preference === "system") {
    return system === "dark" ? "dark" : "light";
  }

  return preference;
};

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("light");

  const mode = resolveMode(preference, system);
  const theme = useMemo(() => buildTheme(mode), [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      preference,
      setPreference,
      toggleMode: () => {
        setPreference((prev) => {
          const activeMode = resolveMode(prev, system);
          return activeMode === "dark" ? "light" : "dark";
        });
      },
    }),
    [mode, preference, system, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used inside AppThemeProvider");
  }

  return context;
}
