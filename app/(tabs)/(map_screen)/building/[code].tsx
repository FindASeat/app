import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import BuildingView from "../../../../components/BuildingView";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, View } from "react-native";
import type { Building } from "../../../../types";

const building = () => {
  const { code } = useLocalSearchParams<{ code: string }>();
  const insets = useSafeAreaInsets();

  const building: Building = {
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

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <View style={{ height: insets.top, backgroundColor: "#990000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <BuildingView building={building} />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
};

export default building;
