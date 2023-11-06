import { Keyboard, SafeAreaView, TouchableWithoutFeedback, View, StyleSheet, Text } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import BuildingView from "../../../../components/BuildingView";
import { useLocalSearchParams } from "expo-router";
import type { Building } from "../../../../types";
import React, { useEffect, useState } from "react";
import { fetchBuilding } from "../../../firebaseFunctions";

const building = () => {
  const { code } = useLocalSearchParams<{ code: string }>();
  console.log(code)
  const insets = useSafeAreaInsets();
  
  const [currentBuilding, setBuilding] = useState<Building | null>(null);

  useEffect(() => {
    fetchBuilding(code).then(fetchedBuilding => {
      setBuilding(fetchedBuilding);
    });
  }, [code]);

  if (!building) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <View style={{ height: insets.top, backgroundColor: '#990000' }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <BuildingView building={currentBuilding} />
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default building;
