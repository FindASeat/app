import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';

const Header = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: '#990000', paddingTop: insets.top, paddingBottom: 10 }}>
      <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600', fontSize: 28, paddingTop: 0 }}>
        FindASeat
      </Text>
    </View>
  );
};

export default Header;
