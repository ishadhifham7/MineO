import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing } from "react-native";

type EntranceType = "fade" | "fadeUp" | "scale";

type EntranceOptions = {
  duration?: number;
  delay?: number;
  distance?: number;
};

export const motionDurations = {
  fast: 160,
  normal: 260,
  slow: 420,
} as const;

export const motionEasing = {
  standard: Easing.bezier(0.2, 0, 0, 1),
  emphasized: Easing.bezier(0.2, 0.8, 0.2, 1),
} as const;

export const runFade = (
  value: Animated.Value,
  toValue = 1,
  duration = motionDurations.normal,
  delay = 0,
) => {
  return Animated.timing(value, {
    toValue,
    duration,
    delay,
    easing: motionEasing.standard,
    useNativeDriver: true,
  });
};

export function useEntranceAnimation(type: EntranceType = "fadeUp", options: EntranceOptions = {}) {
  const { duration = motionDurations.normal, delay = 0, distance = 12 } = options;

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(type === "fadeUp" ? distance : 0)).current;
  const scale = useRef(new Animated.Value(type === "scale" ? 0.96 : 1)).current;

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: motionEasing.standard,
        useNativeDriver: true,
      }),
    ];

    if (type === "fadeUp") {
      animations.push(
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          delay,
          easing: motionEasing.emphasized,
          useNativeDriver: true,
        }),
      );
    }

    if (type === "scale") {
      animations.push(
        Animated.timing(scale, {
          toValue: 1,
          duration,
          delay,
          easing: motionEasing.emphasized,
          useNativeDriver: true,
        }),
      );
    }

    Animated.parallel(animations).start();
  }, [delay, distance, duration, opacity, scale, translateY, type]);

  return useMemo(
    () => ({
      opacity,
      transform: [{ translateY }, { scale }],
    }),
    [opacity, scale, translateY],
  );
}

export function usePressAnimation() {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scale, {
      toValue: 0.97,
      duration: motionDurations.fast,
      easing: motionEasing.standard,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: motionDurations.fast,
      easing: motionEasing.standard,
      useNativeDriver: true,
    }).start();
  };

  return {
    animatedStyle: { transform: [{ scale }] },
    onPressIn,
    onPressOut,
  };
}
