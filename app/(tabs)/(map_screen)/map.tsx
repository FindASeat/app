import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import { MapMarker } from "../../../types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { getBuildings } from "../../firebaseFunctions";
import React from "react";

const map = () => {

  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    const fetchBuildings = async () => {
      const buildingsFromDB = await getBuildings();
      setBuildings(buildingsFromDB);
    };

    fetchBuildings().catch(console.error);
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
      {buildings.map((building, idx) => (
        <Marker
          key={idx}
          coordinate={building.coordinate}
          pinColor={building.availability < 0.25 ? "red" : building.availability < 0.5 ? "orange" : "green"}
          onPress={() => router.push("/(tabs)/(map_screen)/building/" + building.code)}
        />
      ))}
    </MapView>
  );
};

export default map;
