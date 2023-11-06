import { Stack } from "expo-router";
import React from 'react';

const stack_layout = () => {
  return (
    <Stack>
      <Stack.Screen name="map" options={{ headerShown: false }} />
      <Stack.Screen name="building/[code]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default stack_layout;
