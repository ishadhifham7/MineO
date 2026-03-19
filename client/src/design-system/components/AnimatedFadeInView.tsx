import React from "react";
import { Animated, ViewStyle, StyleProp } from "react-native";
import { useEntranceAnimation } from "../animations";

type AnimatedFadeInViewProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
};

export function AnimatedFadeInView({
  children,
  delay,
  duration,
  style,
}: AnimatedFadeInViewProps) {
  const animatedStyle = useEntranceAnimation("fadeUp", {
    delay,
    duration,
  });

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}
