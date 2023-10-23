import { Tabs } from "expo-router";

const tab_layout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="map" options={{ tabBarLabel: "reserve", headerShown: false }} />
      <Tabs.Screen name="me" />
    </Tabs>
  );
};

export default tab_layout;
