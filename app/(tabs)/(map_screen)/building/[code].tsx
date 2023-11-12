import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView, View, StyleSheet, Text } from "react-native";
import BuildingView from "../../../../components/BuildingView";
import { useGlobal } from "../../../../context/GlobalContext";
import { getBuilding } from "../../../firebaseFunctions";
import type { Building } from "../../../../types";
import React, { useEffect } from "react";

const building = () => {
  const insets = useSafeAreaInsets();
  const { selectedBuilding, setSelectedBuilding } = useGlobal();

  useEffect(() => {
    getBuilding(selectedBuilding!.code).then(b => setSelectedBuilding(b));
    console.log(selectedBuilding);
  }, []);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <View style={{ height: insets.top, backgroundColor: "#990000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <BuildingView building={selectedBuilding} />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
};

export default building;
