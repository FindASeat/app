import LogoutButton from '../../components/LogoutButton';
import { Tabs } from 'expo-router';

const tab_layout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="(map_screen)" options={{ tabBarLabel: 'Reserve', headerShown: false }} />
      <Tabs.Screen name="me" options={{ tabBarLabel: 'Profile', headerTitle: 'Profile', headerRight: LogoutButton }} />
    </Tabs>
  );
};

export default tab_layout;
