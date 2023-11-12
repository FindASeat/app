import { useGlobal } from "../../../context/GlobalContext";
import { getBuildings } from "../../firebaseFunctions";
import MapView, { Marker } from "react-native-maps";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { router } from "expo-router";

const map = () => {
  const { buildings, setSelectedBuilding, setBuildings, user, setUser } = useGlobal();

  useEffect(() => {
    const get = async () => {
      const buildings = await getBuildings();
      setBuildings(buildings);
    };

    get().catch(console.error);
  }, []);

  return (
    <MapView
      region={{
        latitude: 34.021,
        longitude: -118.2863,
        latitudeDelta: 0.011,
        longitudeDelta: 0.011,
      }}
      style={StyleSheet.absoluteFill}
    >
      {Object.values(buildings).map((building, idx) => (
        <Marker
          key={idx}
          coordinate={building.coordinate}
          pinColor={building.total_availability < 0.25 ? "red" : building.total_availability < 0.5 ? "orange" : "green"}
          onPress={() => {
            setSelectedBuilding(building);
            router.push("/(tabs)/(map_screen)/building/" + building.code);
          }}
        />
      ))}
    </MapView>
  );
};

export default map;
