import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Dimensions, StyleSheet, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get("window").width;

type Node = {
  centerX: number;
  centerY: number;
};

export const TimelinePath = ({ nodes, height }: { nodes: Node[], height: number }) => {
  if (nodes.length < 2) return null;

  const generatePath = () => {
    // Catmull-Rom spline → cubic bezier conversion.
    // This guarantees C1-smooth passage through EVERY node, including any newly added ones.
    const tension = 0.42;

    // Duplicate endpoints so the curve passes cleanly through the first and last node
    const pts = [nodes[0], ...nodes, nodes[nodes.length - 1]];

    let d = `M ${nodes[0].centerX} ${nodes[0].centerY}`;

    for (let i = 1; i < pts.length - 2; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2];

      // Catmull-Rom control points mapped to cubic bezier handles
      const cp1x = p1.centerX + (p2.centerX - p0.centerX) * tension;
      const cp1y = p1.centerY + (p2.centerY - p0.centerY) * tension;
      const cp2x = p2.centerX - (p3.centerX - p1.centerX) * tension;
      const cp2y = p2.centerY - (p3.centerY - p1.centerY) * tension;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.centerX} ${p2.centerY}`;
    }
    return d;
  };

  const pathData = generatePath();

  return (
    <View style={[StyleSheet.absoluteFill, { height, zIndex: 2 }]} pointerEvents="none">
      <Svg width={SCREEN_WIDTH} height={height}>
        <Defs>
          <LinearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%"   stopColor="#8B8970" stopOpacity="1"   />
            <Stop offset="50%"  stopColor="#ABA890" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#8B8970" stopOpacity="0.7" />
          </LinearGradient>
        </Defs>

        {/* Soft shadow for depth */}
        <Path
          d={pathData}
          stroke="#00000018"
          strokeWidth={10}
          strokeDasharray="16, 12"
          strokeLinecap="round"
          fill="none"
        />

        {/* Main dashed path with gradient */}
        <Path
          d={pathData}
          stroke="url(#pathGradient)"
          strokeWidth={5}
          strokeDasharray="16, 12"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};