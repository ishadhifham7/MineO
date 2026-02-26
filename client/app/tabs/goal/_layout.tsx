import { Stack } from "expo-router";
import { GoalProvider } from "../../../src/features/goal/goal.context";

export default function GoalLayout() {
  return (
    <GoalProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </GoalProvider>
  );
}
