import React from "react";
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import { useAppTheme } from "../ThemeProvider";
import { usePressAnimation } from "../animations";
import { ThemedText } from "./ThemedText";

type AppButtonVariant = "primary" | "secondary" | "ghost";

type AppButtonProps = Omit<PressableProps, "style"> & {
  title: string;
  variant?: AppButtonVariant;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({ title, variant = "primary", style, disabled, ...props }: AppButtonProps) {
  const { theme } = useAppTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();

  const variantStyles: Record<AppButtonVariant, ViewStyle> = {
    primary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      borderWidth: 1,
    },
    secondary: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
    },
    ghost: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      borderWidth: 1,
    },
  };

  const textColor =
    variant === "primary"
      ? theme.colors.primaryForeground
      : variant === "secondary"
        ? theme.colors.text
        : theme.colors.primary;

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        {...props}
        disabled={disabled}
        onPressIn={(event) => {
          onPressIn();
          props.onPressIn?.(event);
        }}
        onPressOut={(event) => {
          onPressOut();
          props.onPressOut?.(event);
        }}
        style={[
          {
            minHeight: 48,
            borderRadius: theme.radii.md,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: theme.spacing.lg,
            opacity: disabled ? 0.6 : 1,
          },
          variantStyles[variant],
        ]}
      >
        <ThemedText variant="button" color={textColor}>
          {title}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}
