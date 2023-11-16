import { GlobalStateProvider } from '../../context/GlobalContext';
import { Stack } from 'expo-router';

const stack_layout = () => {
  return (
    <GlobalStateProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="modify" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
    </GlobalStateProvider>
  );
};

export default stack_layout;
