import React from "react";
import Svg, { Path, Line } from "react-native-svg";
import { Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

type NodePosition = {
  id: number;
  stageNumber: number;
  x: number;
  y: number;
  centerX: number;
  centerY: number;
  isLeftSide: boolean;
};

type Props = {
  nodes: NodePosition[];
  height: number;
};

export const TimelinePath: React.FC<Props> = ({ nodes, height }) => {
  if (nodes.length < 2) return null;

  const createSCurvePath = () => {
    // Start at the center-point of the first node (bottom)
    let d = `M ${nodes[0].centerX} ${nodes[0].centerY}`;

    for (let i = 1; i < nodes.length; i++) {
      const prev = nodes[i - 1];
      const curr = nodes[i];

      const prevX = prev.centerX;
      const prevY = prev.centerY;
      const currX = curr.centerX;
      const currY = curr.centerY;

      // Calculate distances
      const verticalDist = Math.abs(currY - prevY);
      const horizontalDist = Math.abs(currX - prevX);
      
      // Determine direction of movement
      const isMovingRight = currX > prevX;

      // Create smooth serpentine Bezier curve through center-points
      // Control points positioned to create smooth S-curve that flows through centers
      
      // First control point: curves inward toward screen center
      const cp1x = prevX + (isMovingRight ? horizontalDist * 0.35 : -horizontalDist * 0.35);
      const cp1y = prevY + verticalDist * 0.5;

      // Second control point: smooth approach to next node center
      const cp2x = currX + (isMovingRight ? -horizontalDist * 0.35 : horizontalDist * 0.35);
      const cp2y = currY - verticalDist * 0.5;

      // Smooth cubic Bezier creates serpentine flow through node centers
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currX} ${currY}`;
    }

    return d;
  };

  return (
    <Svg
      width={SCREEN_WIDTH}
      height={height}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {/* Vertical serpentine dashed-line path with rounded stroke caps */}
      <Path
        d={createSCurvePath()}
        stroke="#9CA3AF"
        strokeWidth={2.5}
        strokeDasharray="10,7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.7}
      />
      
      {/* Horizontal milestone line between Stage 01 and 02 */}
      {nodes.length >= 2 && (
        <Line
          x1={nodes[0].centerX}
          y1={(nodes[0].centerY + nodes[1].centerY) / 2}
          x2={nodes[1].centerX}
          y2={(nodes[0].centerY + nodes[1].centerY) / 2}
          stroke="#D1D5DB"
          strokeWidth={2}
          strokeDasharray="6,6"
          opacity={0.5}
        />
      )}
    </Svg>
  );
};