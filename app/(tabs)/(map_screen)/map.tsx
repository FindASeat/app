import { useGlobal } from "../../../context/GlobalContext";
import { getBuildings, getUserReservations } from "../../firebaseFunctions";
import MapView, { Marker } from "react-native-maps";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { router } from "expo-router";

const map = () => {
  const { buildings, setSelectedBuilding, setBuildings, user, setUser } = useGlobal();

  useEffect(() => {
    const fetchBuildings = async () => {
      const buildingsFromDB = await getBuildings();
      setBuildings(buildingsFromDB);

      const userReservations = await getUserReservations(user?.username);
      console.log("userReservations: ", userReservations);
      setUser(prev => ({ ...prev, reservations: userReservations }));
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
              open_hours: { "Mon – Thu": ["5:30 AM", "9:30 PM"], Fri: ["5:30 AM", "8:30 PM"], "Sat – Sun": "Closed" }, // TODO
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
