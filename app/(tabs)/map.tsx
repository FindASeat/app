import { View, Text } from "react-native";
import MapView from "react-native-maps";

const map = () => {
  return (
    <MapView
      region={{
        latitude: 34.021,
        longitude: -118.2863,
        latitudeDelta: 0.011,
        longitudeDelta: 0.011,
      }}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default map;
