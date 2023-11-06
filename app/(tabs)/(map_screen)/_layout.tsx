import { Stack } from "expo-router";

const stack_layout = () => {
  return (
    <Stack>
      <Stack.Screen name="map" options={{ headerShown: false }} />
      <Stack.Screen name="building/[code]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default stack_layout;
