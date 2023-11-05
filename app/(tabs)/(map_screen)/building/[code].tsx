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
    availability_inside: [
      [1, 0, 1, 1],
      [1, 1, 1, 1],
      [1, 0, 1, 0],
    ],
    availability_outside: [
      [0, 0, 1, 1],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    description: "This is a test building who was created for testing purposes during the development of the app.",
    imageUrl: "https://dailytrojan.com/wp-content/uploads/2022/01/gfsstock_celinevazquez_e-3192-scaled.jpg",
  };

  return (
    <SafeAreaProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View style={{ height: insets.top, backgroundColor: "#990000" }} />
          <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <BuildingView building={building} />
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
};

export default building;
