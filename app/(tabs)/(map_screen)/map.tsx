import { useGlobal } from "../../../context/GlobalContext";
import { getBuildings } from "../../firebaseFunctions";
import MapView, { Marker } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { router } from "expo-router";

const map = () => {
  const { buildings, setSelectedBuilding, setBuildings } = useGlobal();

  useEffect(() => {
    const fetchBuildings = async () => {
      const buildingsFromDB = await getBuildings();
      // console.log(JSON.stringify(buildingsFromDB, null, 2));
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
      {Object.values(buildings).map((building, idx) => (
        <Marker
          key={idx}
          coordinate={building.coordinate}
          // pinColor={building.total_availability < 0.25 ? "red" : building.total_availability < 0.5 ? "orange" : "green"}
          pinColor={"#990000"}
          onPress={() => {
            setSelectedBuilding({
              ...building,
              open_hours: { "Mon – Fri": ["8:00AM", "8:30PM"] }, // TODO
              total_availability: 9 / 13, // TODO
            });
            router.push("/(tabs)/(map_screen)/building/" + building.code);
          }}
        />
      ))}
    </MapView>
  );
};

export default map;
