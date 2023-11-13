import { TouchableOpacity, Text } from 'react-native';
import { logout_user } from '../utils';
import { router } from 'expo-router';

const LogoutButton = () => (
  <TouchableOpacity
    style={{ marginRight: 15 }}
    onPress={async () => {
      await logout_user();
      router.replace('/');
    }}
  >
    <Text style={{ color: '#990000', fontSize: 16, fontWeight: '500' }}>Sign Out</Text>
  </TouchableOpacity>
);

export default LogoutButton;
