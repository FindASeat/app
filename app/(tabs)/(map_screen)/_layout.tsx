import { Stack } from 'expo-router';

const stack_layout = () => {
  console.log('map_screen _layout.tsx');
  return (
    <Stack>
      <Stack.Screen name="map" options={{ headerShown: false }} />
      <Stack.Screen name="building/[code]" options={{ headerShown: false }} />
      <Stack.Screen name="building/reserve" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
};

export default stack_layout;
