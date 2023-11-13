import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import BuildingView from "../../../../components/BuildingView";
import { useGlobal } from "../../../../context/GlobalContext";
import { getBuilding } from "../../../firebaseFunctions";
import { SafeAreaView, View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

const building = () => {
  const { code } = useLocalSearchParams() as { code: string | undefined };
  const { selectedBuilding, setSelectedBuilding } = useGlobal();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (code) getBuilding(code).then(setSelectedBuilding);
    else if (selectedBuilding) getBuilding(selectedBuilding?.code).then(setSelectedBuilding);
  }, []);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <View style={{ height: insets.top, backgroundColor: "#990000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          {selectedBuilding && <BuildingView building={selectedBuilding} />}
          {!selectedBuilding && <Text>Loading...</Text>}
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
};

export default building;
