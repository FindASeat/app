import { View, StyleSheet } from "react-native";
import PinSVG from "./PinSVG";

const Pin = ({ availability }: { availability: number }) => {
  return (
    <View style={styles.container}>
      <PinSVG color={availability < 0.25 ? "red" : availability < 0.5 ? "orange" : "green"} />
      <View style={{ height: "55%" }}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Pin;
