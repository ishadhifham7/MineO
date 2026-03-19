import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

export const breakpoints = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const getBreakpoint = (width: number): Breakpoint => {
  if (width >= breakpoints.desktop) return "desktop";
  if (width >= breakpoints.tablet) return "tablet";
  return "phone";
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const scale = (size: number, screenWidth: number) => {
  const baseWidth = 390;
  const scaled = size * (screenWidth / baseWidth);
  return Math.round(clamp(scaled, size * 0.85, size * 1.2));
};

export const verticalScale = (size: number, screenHeight: number) => {
  const baseHeight = 844;
  const scaled = size * (screenHeight / baseHeight);
  return Math.round(clamp(scaled, size * 0.85, size * 1.2));
};

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const breakpoint = getBreakpoint(width);

    return {
      width,
      height,
      breakpoint,
      isPhone: breakpoint === "phone",
      isTablet: breakpoint === "tablet",
      isDesktop: breakpoint === "desktop",
      scale: (size: number) => scale(size, width),
      verticalScale: (size: number) => verticalScale(size, height),
      contentMaxWidth: breakpoint === "desktop" ? 960 : breakpoint === "tablet" ? 720 : width,
      horizontalPadding: breakpoint === "desktop" ? 28 : breakpoint === "tablet" ? 20 : 14,
    };
  }, [height, width]);
}
