import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="reschedule" options={{}} />
      <Stack.Screen name="menteeList" options={{}} />
    </Stack>
  );
}
