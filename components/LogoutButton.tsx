import { TouchableOpacity, Text } from 'react-native';
import { useGlobal } from '../context/GlobalContext';
import { logout_user } from '../utils';
import { router } from 'expo-router';

const LogoutButton = () => {
  const { setUser } = useGlobal();

  return (
    <TouchableOpacity
      style={{ marginRight: 15 }}
      onPress={async () => {
        await logout_user();
        setUser(null);
        router.replace('/');
      }}
    >
      <Text style={{ color: '#990000', fontSize: 16, fontWeight: '500' }}>Sign Out</Text>
    </TouchableOpacity>
  );
};
export default LogoutButton;
