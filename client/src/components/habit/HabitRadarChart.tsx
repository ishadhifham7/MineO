import { View, Text } from "react-native";
import Svg, { Polygon, Line, Circle, Text as SvgText } from "react-native-svg";

export default function HabitRadarChart({
  values,
}: {
  values: number[];
}) {
  const [spiritual = 0, mental = 0, physical = 0] = values;
  
  // Debug log
  console.log('🔵 Radar Chart Rendering:', { 
    values, 
    spiritual, 
    mental, 
    physical,
    rawValues: values 
  });

  // Adjusted dimensions to prevent overflow
  const size = 300; 
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = 75; // Slightly reduced to keep labels inside the card boundaries

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
  
  console.log('🎯 Radar Radii:', { 
    mentalRadius, 
    physicalRadius, 
    spiritualRadius, 
    maxRadius,
    mental: `${mental}%`,
    physical: `${physical}%`,
    spiritual: `${spiritual}%`
  });

  const dataTop = angleToPoint(90, mentalRadius);
  const dataRight = angleToPoint(-30, physicalRadius);
  const dataLeft = angleToPoint(210, spiritualRadius);
  const dataPoints = `${dataTop.x},${dataTop.y} ${dataRight.x},${dataRight.y} ${dataLeft.x},${dataLeft.y}`;

  // Label offsets adjusted to fit inside the rounded card
  const labelOffset = maxRadius + 25;
  const mentalLabel = angleToPoint(90, labelOffset);
  const physicalLabel = angleToPoint(-30, labelOffset);
  const spiritualLabel = angleToPoint(210, labelOffset);

  return (
    <View className="mx-2 mt-6 mb-4">
      {/* Increased padding and ensured width is sufficient for the chart */}
      <View 
        className="bg-white rounded-[35px] py-6 px-2 border border-black/5 items-center" 
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 5,
          width: '100%' // Ensure card takes full width of its margin
        }}
      >
        <View className="bg-[#2E2A26] px-6 py-2 rounded-full mb-4">
          <Text className="text-white text-[10px] font-black uppercase tracking-widest">
            Weekly Growth Tracker
          </Text>
        </View>
        
        {/* Debug: Show current values prominently */}
        <View className="flex-row justify-around w-full mb-3 px-4">
          <View className="items-center bg-purple-50 px-3 py-1.5 rounded-lg">
            <Text className="text-[8px] font-bold text-purple-600">SPIRITUAL</Text>
            <Text className="text-lg font-black text-purple-900">{spiritual}%</Text>
          </View>
          <View className="items-center bg-blue-50 px-3 py-1.5 rounded-lg">
            <Text className="text-[8px] font-bold text-blue-600">MENTAL</Text>
            <Text className="text-lg font-black text-blue-900">{mental}%</Text>
          </View>
          <View className="items-center bg-orange-50 px-3 py-1.5 rounded-lg">
            <Text className="text-[8px] font-bold text-orange-600">PHYSICAL</Text>
            <Text className="text-lg font-black text-orange-900">{physical}%</Text>
          </View>
        </View>

        {/* SVG Container now scaled to fit the card */}
        <View className="items-center justify-center w-full overflow-visible">
          <Svg width={size} height={size - 40} viewBox={`0 20 ${size} ${size - 40}`}>
            {gridTriangles.map((points, index) => (
              <Polygon
                key={index}
                points={points}
                fill="none"
                stroke="#D1D1D1"
                strokeWidth="1"
              />
            ))}

            <Polygon
              points={dataPoints}
              fill="rgba(75, 86, 255, 0.3)"
              stroke="#4B56FF"
              strokeWidth="3"
            />
            
            {/* Data point circles for visibility */}
            <Circle cx={dataTop.x} cy={dataTop.y} r="5" fill="#4B56FF" stroke="#fff" strokeWidth="2" />
            <Circle cx={dataRight.x} cy={dataRight.y} r="5" fill="#FF8E6E" stroke="#fff" strokeWidth="2" />
            <Circle cx={dataLeft.x} cy={dataLeft.y} r="5" fill="#9C88FF" stroke="#fff" strokeWidth="2" />

            <Line x1={centerX} y1={centerY} x2={angleToPoint(90, maxRadius).x} y2={angleToPoint(90, maxRadius).y} stroke="#D1D1D1" strokeWidth="1" />
            <Line x1={centerX} y1={centerY} x2={angleToPoint(-30, maxRadius).x} y2={angleToPoint(-30, maxRadius).y} stroke="#D1D1D1" strokeWidth="1" />
            <Line x1={centerX} y1={centerY} x2={angleToPoint(210, maxRadius).x} y2={angleToPoint(210, maxRadius).y} stroke="#D1D1D1" strokeWidth="1" />

            <SvgText 
              x={mentalLabel.x} 
              y={mentalLabel.y - 5} 
              fontSize="10" 
              fontWeight="bold" 
              fill="#999" 
              textAnchor="middle"
            >
              MENTAL
            </SvgText>
            <SvgText 
              x={physicalLabel.x + 8} 
              y={physicalLabel.y + 4} 
              fontSize="10" 
              fontWeight="bold" 
              fill="#999" 
              textAnchor="start"
            >
              PHYSICAL
            </SvgText>
            <SvgText 
              x={spiritualLabel.x - 8} 
              y={spiritualLabel.y + 4} 
              fontSize="10" 
              fontWeight="bold" 
              fill="#999" 
              textAnchor="end"
            >
              SPIRITUAL
            </SvgText>
          </Svg>
        </View>

        <Text className="text-[7px] text-gray-400 mt-2 text-center italic">
          Based on 7-day average • Green: 1pt • Blue: 0.5pt
        </Text>
        
        {spiritual === 0 && mental === 0 && physical === 0 && (
          <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
            <Text className="text-[9px] text-yellow-800 text-center font-semibold">
              📊 No data yet! Start tracking your habits to see your progress here.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}