import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import { MapMarker } from "../../../types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { getBuildings } from "../../firebaseFunctions";
import React from "react";

import { useGlobal } from "../../../context/GlobalContext";


const map = () => {

  const { buildings: not_used, setSelectedBuilding } = useGlobal();

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
          // pinColor={building.total_availability < 0.25 ? "red" : building.total_availability < 0.5 ? "orange" : "green"}
          pinColor={"red"}
          onPress={() => {
            setSelectedBuilding({
              title: building.title,
              code: building.code,
              description: building.description,
              open_hours: null,
              inside: building.inside,
              outside: building.outside,
              total_availability: null,
              image_url: null
            });
            router.push("/(tabs)/(map_screen)/building/" + building.code);
          }}
       />
      ))}
    </MapView>
  );
};

export default map;
