import { Link, router } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import MapView, { type LatLng, Marker } from "react-native-maps";

const buildings: {
  title: string;
  code: string;
  coordinate: LatLng;
  availability?: number;
}[] = [
  {
    title: "Fertitta Hall",
    code: "JFF",
    coordinate: { latitude: 34.01873, longitude: -118.28266 },
    availability: 0.2,
  },
  {
    title: "Center for Public Affairs",
    code: "DMC",
    coordinate: { latitude: 34.02121, longitude: -118.28405 },
    availability: 0.2,
  },
  {
    title: "Tutor Hall",
    code: "THH",
    coordinate: { latitude: 34.02242, longitude: -118.28441 },
    availability: 0.3,
  },
  {
    title: "Zumbridge Hall",
    code: "ZHS",
    coordinate: { latitude: 34.01921, longitude: -118.2864 },
    availability: 0.3,
  },
  {
    title: "Tutor Campus Center",
    code: "TCC",
    coordinate: { latitude: 34.02028, longitude: -118.28612 },
    availability: 0.2,
  },
  {
    title: "Salvatori Computer Science Center",
    code: "SAL",
    coordinate: { latitude: 34.01951, longitude: -118.28946 },
    availability: 0.1,
  },
  {
    title: "Seeley G. Mudd Building",
    code: "SGM",
    coordinate: { latitude: 34.02133, longitude: -118.28894 },
    availability: 0.45,
  },
  {
    title: "Vivian Hall of Engineering",
    code: "VHE",
    coordinate: { latitude: 34.02016, longitude: -118.28825 },
    availability: 0.7,
  },
  {
    title: "Kaprielian Hall",
    code: "KAP",
    coordinate: { latitude: 34.02239, longitude: -118.291 },
    availability: 0.5,
  },
  {
    title: "Gloria Kaufman International Dance Center",
    code: "KDC",
    coordinate: { latitude: 34.0238, longitude: -118.28505 },
    availability: 0.6,
  },
  {
    title: "Doheny Memorial Library",
    code: "DML",
    coordinate: { latitude: 34.02014, longitude: -118.28373 },
    availability: 0.25,
  },
  {
    title: "Leavey Library",
    code: "LVL",
    coordinate: { latitude: 34.02178, longitude: -118.28282 },
    availability: 0.15,
  },
];

const map = () => {
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

const styles = StyleSheet.create({
  calloutView: {
    flexDirection: "column",
    alignSelf: "flex-start",
    padding: 10,
    backgroundColor: "blue",
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  // ... add more styles if needed
});

export default map;