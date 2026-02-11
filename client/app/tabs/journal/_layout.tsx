import { Stack } from "expo-router";
import { JournalProvider } from "../../../src/features/journal/journal.context";

export default function JournalLayout() {
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
          name="single-page"
          options={{
            title: "Journal Entry",
            presentation: "modal",
          }}
        />
      </Stack>
    </JournalProvider>
  );
}
