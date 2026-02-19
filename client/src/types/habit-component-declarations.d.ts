declare module "*HabitCalendar" {
  import * as React from "react";
  const HabitCalendar: React.ComponentType<{ category: string; data: Record<string, number> }>;
  export default HabitCalendar;
}

declare module "*HabitStatusCard" {
  import * as React from "react";
  const HabitStatusCard: React.ComponentType<{ title: string; onSelect: (value: number) => void }>;
  export default HabitStatusCard;
}

declare module "*HabitRadarChart" {
  import * as React from "react";
  const HabitRadarChart: React.ComponentType<{ data: any }>;
  export default HabitRadarChart;
}
