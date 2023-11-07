import { useGlobal } from "../../../context/GlobalContext";
import { getBuildings } from "../../firebaseFunctions";
import MapView, { Marker } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { MapMarker } from "../../../types";
import { StyleSheet } from "react-native";
import { router } from "expo-router";

const map = () => {
  const { buildings, setSelectedBuilding, setBuildings } = useGlobal();

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
          // pinColor={building.total_availability < 0.25 ? "red" : building.total_availability < 0.5 ? "orange" : "green"}
          pinColor={"#990000"}
          onPress={() => {
            setSelectedBuilding({
              title: building.title,
              code: building.code,
              description: building.description,
              open_hours: null,
              inside: building.inside,
              outside: building.outside,
              total_availability: null,
              image_url: null,
            });
            router.push("/(tabs)/(map_screen)/building/" + building.code);
          }}
        />
      ))}
    </MapView>
  );
};

export default map;
