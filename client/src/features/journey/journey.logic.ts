import { Dimensions } from "react-native";
import { JourneyNodePosition } from "./journey.types";

const SCREEN_WIDTH = Dimensions.get("window").width;

const NODE_SIZE = 70;
const VERTICAL_SPACING = 180;
const SIDE_PADDING = 40;
const MAX_SHIFT = 120;

export function generateJourneyPositions(
  count: number
): JourneyNodePosition[] {
  const positions: JourneyNodePosition[] = [];

  let currentX = SCREEN_WIDTH / 2;

  for (let i = 0; i < count; i++) {
    const y = count * VERTICAL_SPACING - i * VERTICAL_SPACING;

    const shift = (Math.random() - 0.5) * 2 * MAX_SHIFT;
    currentX += shift;

    currentX = Math.max(
      SIDE_PADDING,
      Math.min(SCREEN_WIDTH - SIDE_PADDING - NODE_SIZE, currentX)
    );

    positions.push({
      id: `node-${i}`,
      x: currentX,
      y,
    });
  }

  return positions;
}