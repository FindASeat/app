import { GlobalStateProvider } from '../context/GlobalContext';
import { Stack } from 'expo-router';

const stack_layout = () => {
  console.log('root _layout.tsx');

  return (
    <GlobalStateProvider>
      <Stack>
        <Stack.Screen name="index" options={{}} />
        <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GlobalStateProvider>
  );
};

export default stack_layout;
