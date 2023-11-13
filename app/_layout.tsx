import { GlobalStateProvider } from '../context/GlobalContext';
import { Stack } from 'expo-router';

const stack_layout = () => {
  return (
    <GlobalStateProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GlobalStateProvider>
  );
};

export default stack_layout;
