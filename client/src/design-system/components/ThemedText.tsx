import React from "react";
import { Text, TextProps, TextStyle, StyleProp } from "react-native";
import { useAppTheme } from "../ThemeProvider";

type TextVariant = "h1" | "h2" | "h3" | "body" | "bodyMuted" | "caption" | "button";

type ThemedTextProps = TextProps & {
  variant?: TextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function ThemedText({ variant = "body", color, style, ...props }: ThemedTextProps) {
  const { theme } = useAppTheme();
  return (
    <Text
      {...props}
      style={[
        theme.typography[variant],
        color ? { color } : null,
        style,
      ]}
    />
  );
}
