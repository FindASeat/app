import LogoutButton from '../../../components/LogoutButton';
import { useGlobal } from '../../../context/GlobalContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

const tab_layout = () => {
  const { user } = useGlobal();

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#990000', tabBarStyle: { display: user ? 'flex' : 'none' } }}>
      <Tabs.Screen
        name="(map)"
        options={{
          headerShown: false,
          tabBarLabel: 'Reserve',
          tabBarIcon: ({ color, size }) => <Icon name="office-building-marker" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          headerTitle: 'Profile',
          headerRight: LogoutButton,
          tabBarIcon: ({ color, size }) => <Icon name="account" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
};

export default tab_layout;
