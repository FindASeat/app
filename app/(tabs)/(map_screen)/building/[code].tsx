import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView, View, StyleSheet, Text } from "react-native";
import BuildingView from "../../../../components/BuildingView";
import { useGlobal } from "../../../../context/GlobalContext";
import type { Building } from "../../../../types";
import React from "react";

const building = () => {
  // const { code } = useLocalSearchParams<{ code: string }>();
  const insets = useSafeAreaInsets();
  const { selectedBuilding } = useGlobal();

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
      "Mon – Fri": ["8:00AM", "8:30PM"],
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

  if (!building) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default building;
