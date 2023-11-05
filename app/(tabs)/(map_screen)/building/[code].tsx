import { Keyboard, SafeAreaView, TouchableWithoutFeedback, View, StyleSheet } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import BuildingView from "../../../../components/BuildingView";
import type { BuildingResponse } from "../../../../types";
import { useLocalSearchParams } from "expo-router";

const building = () => {
  const { code } = useLocalSearchParams<{ code: string }>();
  const insets = useSafeAreaInsets();

  const building: BuildingResponse = {
    code: "TES",
    title: "Test Building Hall",

    inside: {
      num_rows: 3,
      num_cols: 4,
      availability: [
        [true, false, true, true],
        [true, true, true, true],
        [true, false, true, false],
      ],
      current_taken: 9,
    },

    outside: {
      num_rows: 3,
      num_cols: 4,
      availability: [
        [false, false, true, true],
        [false, true, true, false],
        [false, false, false, false],
      ],
      current_taken: 4,
    },

    description: "This is a test building who was created for testing purposes during the development of the app.",
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
