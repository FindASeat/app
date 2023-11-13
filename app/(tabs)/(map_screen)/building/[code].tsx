import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { get_building } from '../../../../firebase/firebase_api';
import BuildingView from '../../../../components/BuildingView';
import { useGlobal } from '../../../../context/GlobalContext';
import { SafeAreaView, View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

const building = () => {
  const { code } = useLocalSearchParams() as { code: string | undefined };
  const { selectedBuilding, setSelectedBuilding } = useGlobal();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (code) get_building(code).then(setSelectedBuilding);
    else if (selectedBuilding) get_building(selectedBuilding?.code).then(setSelectedBuilding);
  }, []);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <View style={{ height: insets.top, backgroundColor: '#990000' }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          {selectedBuilding && <BuildingView building={selectedBuilding} />}
          {!selectedBuilding && <Text>Loading...</Text>}
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
};

export default building;
