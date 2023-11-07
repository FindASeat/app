import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView, View, StyleSheet, Text } from "react-native";
import BuildingView from "../../../../components/BuildingView";
import { useGlobal } from "../../../../context/GlobalContext";
import { fetchBuilding } from "../../../firebaseFunctions";
import type { Building } from "../../../../types";
import React, { useEffect } from "react";

const building = () => {
  const insets = useSafeAreaInsets();
  const { selectedBuilding, setSelectedBuilding } = useGlobal();

  useEffect(() => {
    fetchBuilding(selectedBuilding?.code).then(fetchedBuilding => {
      setSelectedBuilding(prev => ({
        ...prev,
        total_availability: fetchedBuilding.total_availability,
        inside: fetchedBuilding.inside,
        outside: fetchedBuilding.outside,
      }));
    });
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
