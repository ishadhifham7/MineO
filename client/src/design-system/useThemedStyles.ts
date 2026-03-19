import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "./ThemeProvider";
import type { AppTheme } from "./theme";

export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: AppTheme) => T,
) {
  const { theme } = useAppTheme();
  return useMemo(() => StyleSheet.create(factory(theme)), [factory, theme]);
}
