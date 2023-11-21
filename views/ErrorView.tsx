import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

const ErrorView = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 32, fontWeight: '600' }}>How did you get here?</Text>
        <Text style={{ fontSize: 16 }}>It looks like something has gone wrong.</Text>

        <TouchableOpacity
          style={{
            backgroundColor: '#990000',
            borderRadius: 5,
            padding: 10,
            marginTop: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => router.replace('/')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ErrorView;
