import React from "react";
import { ScrollView, View, ViewStyle, StyleProp } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../ThemeProvider";
import { useResponsive } from "../responsive";

type ThemedScreenProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function ThemedScreen({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
}: ThemedScreenProps) {
  const { theme } = useAppTheme();
  const { horizontalPadding, contentMaxWidth } = useResponsive();

  const baseContainer: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
  };

  const innerContainer: ViewStyle = {
    width: "100%",
    maxWidth: contentMaxWidth,
    alignSelf: "center",
    paddingHorizontal: horizontalPadding,
  };

  if (scrollable) {
    return (
      <SafeAreaView style={[baseContainer, style]}>
        <ScrollView
          contentContainerStyle={[{ paddingVertical: theme.spacing.md }, innerContainer, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[baseContainer, style]}>
      <View style={[{ flex: 1, paddingVertical: theme.spacing.md }, innerContainer, contentContainerStyle]}>
        {children}
      </View>
    </SafeAreaView>
  );
}
