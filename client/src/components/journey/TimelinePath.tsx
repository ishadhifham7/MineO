import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Dimensions, StyleSheet, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get("window").width;

type Node = {
  centerX: number;
  centerY: number;
};

export const TimelinePath = ({ nodes, height }: { nodes: Node[], height: number }) => {
  if (nodes.length < 2) return null;

  const generatePath = () => {
    // Start at the center of the first node (Stage 01)
    let d = `M ${nodes[0].centerX} ${nodes[0].centerY}`;

    for (let i = 1; i < nodes.length; i++) {
      const prev = nodes[i - 1];
      const curr = nodes[i];
      const dy = curr.centerY - prev.centerY;

      // Cubic Bezier: cp1 and cp2 pull the line vertically 50% 
      // of the distance to ensure a smooth "S" curve
      const cp1x = prev.centerX;
      const cp1y = prev.centerY + dy * 0.5;
      const cp2x = curr.centerX;
      const cp2y = curr.centerY - dy * 0.5;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.centerX} ${curr.centerY}`;
    }
    return d;
  };

  return (
    <View style={[StyleSheet.absoluteFill, { height }]} pointerEvents="none">
      <Svg width={SCREEN_WIDTH} height={height}>
        <Path
          d={generatePath()}
          stroke="#9CA3AF" // Grey color
          strokeWidth={2.5}
          strokeDasharray="12, 12" // Dashed line style
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};