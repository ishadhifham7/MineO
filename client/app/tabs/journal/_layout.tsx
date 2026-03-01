import { Stack } from "expo-router";
import { JournalProvider } from "../../../src/features/journal/journal.context";

export default function JournalLayout() {
  // React Navigation bottom tabs already pop nested stacks to root
  // when the active tab is tapped — no manual listener needed.

  return (
    <JournalProvider>
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
          name="[date]"
          options={{
            title: "Journal",
            animation: "slide_from_bottom",
            headerShown: false,
          }}
        />
      </Stack>
    </JournalProvider>
  );
}
