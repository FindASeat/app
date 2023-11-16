import LogoutButton from '../../../components/LogoutButton';
import { useGlobal } from '../../../context/GlobalContext';
import { Tabs } from 'expo-router';

const tab_layout = () => {
  // const { user } = useGlobal();

  console.log('tab layout');

  // change icons
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#990000', tabBarStyle: { display: 'flex' } }}>
      <Tabs.Screen name="(map)" options={{ headerShown: false, tabBarLabel: 'Reserve' }} />
      <Tabs.Screen
        name="profile"
        options={{ tabBarLabel: 'Profile', headerTitle: 'Profile', headerRight: LogoutButton }}
      />
    </Tabs>
  );
};

export default tab_layout;
