import { Stack } from "expo-router";

export default function JournalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Journal",
        }}
      />
      <Stack.Screen
        name="single-page"
        options={{
          title: "Journal Entry",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
