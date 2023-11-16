import LogoutButton from '../../components/LogoutButton';
import { Tabs } from 'expo-router';

const tab_layout = () => {
  console.log('tab_layout.tsx');

  // TODO: Change Tab Icons
  return (
    <Tabs backBehavior="initialRoute">
      <Tabs.Screen name="(map_screen)" options={{ tabBarLabel: 'Reserve', headerShown: false }} />
      <Tabs.Screen
        name="profile"
        options={{ tabBarLabel: 'Profile', headerTitle: 'Profile', headerRight: LogoutButton }}
      />
    </Tabs>
  );
};

export default tab_layout;
