import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 👈 removes the default header globally
      }}
    />
  );
}
