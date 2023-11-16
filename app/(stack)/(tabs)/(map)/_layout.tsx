import { Stack } from 'expo-router';

const map_layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[code]" options={{ headerShown: false }} />
      <Stack.Screen name="reserve" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
};

export default map_layout;
