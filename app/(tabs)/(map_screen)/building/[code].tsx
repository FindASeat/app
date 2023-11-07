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

  const mock_build: Building = {
    title: "Test Building Hall",
    code: "TES",
    description: "This is a test building who was created for testing purposes during the development of the app.",
    inside: {
      rows: 3,
      cols: 4,
      seats: [
        [true, false, true, true],
        [true, true, true, true],
        [true, false, true, false],
      ],
      availability: 9 / 12, // calculated on server
    },

    open_hours: {
      "Mon – Fri": ["8:00 AM", "8:30 PM"],
    },

    outside: {
      rows: 3,
      cols: 4,
      seats: [
        [false, false, true, true],
        [false, true, true, false],
        [false, false, false, false],
      ],
      availability: 4 / 12, // calculated on server
    },

    total_availability: 13 / 24, // calculated on server

    image_url: "https://dailytrojan.com/wp-content/uploads/2022/01/gfsstock_celinevazquez_e-3192-scaled.jpg",
  };

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
