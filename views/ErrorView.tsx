import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const ErrorView = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>How did you get here?</Text>
      <Text>It looks like something has gone wrong</Text>
      <TouchableOpacity onPress={() => router.replace('/')}>
        <Text>Go Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ErrorView;
