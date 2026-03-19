import React from "react";
import { View, ViewProps, ViewStyle, StyleProp } from "react-native";
import { useAppTheme } from "../ThemeProvider";

type ThemedCardProps = ViewProps & {
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ThemedCard({ elevated = true, style, ...props }: ThemedCardProps) {
  const { theme } = useAppTheme();

  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.md,
        },
        elevated ? theme.shadows.sm : null,
        style,
      ]}
    />
  );
}
