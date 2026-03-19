import { View, Text } from "react-native";
import Svg, { Polygon, Line, Circle, Text as SvgText } from "react-native-svg";

export default function HabitRadarChart({
  values,
}: {
  values: number[];
}) {
  const [spiritual = 0, mental = 0, physical = 0] = values;

  const size = 280;
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = 74;

  const angleToPoint = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY - radius * Math.sin(rad),
    };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const gridTriangles = gridLevels.map((level) => {
    const radius = maxRadius * level;
    const top = angleToPoint(90, radius);
    const right = angleToPoint(-30, radius);
    const left = angleToPoint(210, radius);
    return `${top.x},${top.y} ${right.x},${right.y} ${left.x},${left.y}`;
  });

  const mentalRadius = Math.max((mental / 100) * maxRadius, 3); // Minimum 3px radius
  const physicalRadius = Math.max((physical / 100) * maxRadius, 3);
  const spiritualRadius = Math.max((spiritual / 100) * maxRadius, 3);

  const dataTop = angleToPoint(90, mentalRadius);
  const dataRight = angleToPoint(-30, physicalRadius);
  const dataLeft = angleToPoint(210, spiritualRadius);
  const dataPoints = `${dataTop.x},${dataTop.y} ${dataRight.x},${dataRight.y} ${dataLeft.x},${dataLeft.y}`;

  const labelOffset = maxRadius + 24;
  const mentalLabel = angleToPoint(90, labelOffset);
  const physicalLabel = angleToPoint(-30, labelOffset);
  const spiritualLabel = angleToPoint(210, labelOffset);

  return (
    <View
      className="bg-white rounded-[20px] px-4 py-4 border border-[#E5DFD3]"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Text className="text-[#2E2A26] text-[16px] font-semibold text-center">Weekly Growth Tracker</Text>

      <View className="flex-row justify-between mt-3 mb-3">
        <View className="items-center flex-1">
          <Text className="text-[12px] text-[#8C7F6A] font-semibold">Spiritual</Text>
          <Text className="text-[18px] text-[#2E2A26] font-bold">{spiritual}%</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-[12px] text-[#8C7F6A] font-semibold">Mental</Text>
          <Text className="text-[18px] text-[#2E2A26] font-bold">{mental}%</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-[12px] text-[#8C7F6A] font-semibold">Physical</Text>
          <Text className="text-[18px] text-[#2E2A26] font-bold">{physical}%</Text>
        </View>
      </View>

      <View className="items-center justify-center w-full">
        <Svg width={size} height={size - 32} viewBox={`0 16 ${size} ${size - 32}`}>
          {gridTriangles.map((points, index) => (
            <Polygon
              key={index}
              points={points}
              fill="none"
              stroke="#DDD6CA"
              strokeWidth="1"
            />
          ))}

          <Polygon
            points={dataPoints}
            fill="rgba(181, 169, 147, 0.26)"
            stroke="#8C7F6A"
            strokeWidth="3"
          />

          <Circle cx={dataTop.x} cy={dataTop.y} r="4.5" fill="#2196F3" stroke="#FFFFFF" strokeWidth="2" />
          <Circle cx={dataRight.x} cy={dataRight.y} r="4.5" fill="#4CAF50" stroke="#FFFFFF" strokeWidth="2" />
          <Circle cx={dataLeft.x} cy={dataLeft.y} r="4.5" fill="#B5A993" stroke="#FFFFFF" strokeWidth="2" />

          <Line x1={centerX} y1={centerY} x2={angleToPoint(90, maxRadius).x} y2={angleToPoint(90, maxRadius).y} stroke="#DDD6CA" strokeWidth="1" />
          <Line x1={centerX} y1={centerY} x2={angleToPoint(-30, maxRadius).x} y2={angleToPoint(-30, maxRadius).y} stroke="#DDD6CA" strokeWidth="1" />
          <Line x1={centerX} y1={centerY} x2={angleToPoint(210, maxRadius).x} y2={angleToPoint(210, maxRadius).y} stroke="#DDD6CA" strokeWidth="1" />

          <SvgText
            x={mentalLabel.x}
            y={mentalLabel.y - 5}
            fontSize="11"
            fontWeight="700"
            fill="#8C7F6A"
            textAnchor="middle"
          >
            MENTAL
          </SvgText>
          <SvgText
            x={physicalLabel.x + 8}
            y={physicalLabel.y + 4}
            fontSize="11"
            fontWeight="700"
            fill="#8C7F6A"
            textAnchor="start"
          >
            PHYSICAL
          </SvgText>
          <SvgText
            x={spiritualLabel.x - 8}
            y={spiritualLabel.y + 4}
            fontSize="11"
            fontWeight="700"
            fill="#8C7F6A"
            textAnchor="end"
          >
            SPIRITUAL
          </SvgText>
        </Svg>
      </View>

      <Text className="text-[12px] text-[#8C7F6A] mt-2 text-center">
        Based on your rolling 7-day habit scores
      </Text>

      {spiritual === 0 && mental === 0 && physical === 0 && (
        <View className="bg-[#F6F1E7] border border-[#E5DFD3] rounded-[14px] p-3 mt-3">
          <Text className="text-[12px] text-[#6B645C] text-center font-medium">
            No data yet. Start tracking daily to unlock your weekly trend.
          </Text>
        </View>
      )}
    </View>
  );
}