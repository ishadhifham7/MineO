# Design System

This folder contains the app's centralized UI styling system.

## What is included

- Theme tokens: colors, spacing, radius, typography, and shadows.
- Theme provider: light/dark/system-ready context and hooks.
- Responsive helpers: breakpoints, scaling, and adaptive layout helpers.
- Animation helpers: entrance and press animations.
- Reusable primitives: screen, text, card, button, and animated wrapper.

## Quick usage

```tsx
import {
  ThemedScreen,
  ThemedCard,
  ThemedText,
  AppButton,
  AnimatedFadeInView,
  useAppTheme,
  useResponsive,
} from "../design-system";

export default function ExampleScreen() {
  const { theme, toggleMode } = useAppTheme();
  const { isTablet } = useResponsive();

  return (
    <ThemedScreen scrollable>
      <AnimatedFadeInView>
        <ThemedText variant="h2">Settings</ThemedText>
      </AnimatedFadeInView>

      <ThemedCard style={{ marginTop: theme.spacing.md }}>
        <ThemedText variant="bodyMuted">
          Current layout: {isTablet ? "Tablet" : "Phone"}
        </ThemedText>
      </ThemedCard>

      <AppButton
        title="Toggle Theme"
        onPress={toggleMode}
        style={{ marginTop: theme.spacing.lg }}
      />
    </ThemedScreen>
  );
}
```
