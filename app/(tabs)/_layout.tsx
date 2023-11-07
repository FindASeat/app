import { Tabs } from "expo-router";
import React from "react";

const tab_layout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="(map_screen)" options={{ tabBarLabel: "reserve", headerShown: false }} />
      <Tabs.Screen name="me" />
    </Tabs>
  );
};

export default tab_layout;
