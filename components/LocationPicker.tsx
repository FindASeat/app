import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { Dispatch, SetStateAction } from "react";

const LocationPicker = ({
  location: locationPicker,
  setLocation: setLocationPicker,
}: {
  location: "indoor" | "outdoor";
  setLocation: Dispatch<SetStateAction<"indoor" | "outdoor">>;
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, locationPicker === "indoor" && styles.selectedButton]}
        onPress={() => setLocationPicker("indoor")}
      >
        <Text style={[styles.buttonText, locationPicker === "indoor" && { color: "white" }]}>Indoor</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, locationPicker === "outdoor" && styles.selectedButton]}
        onPress={() => setLocationPicker("outdoor")}
      >
        <Text style={[styles.buttonText, locationPicker === "outdoor" && { color: "white" }]}>Outdoor</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 5,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    flexGrow: 1,
  },
  selectedButton: {
    backgroundColor: "#990000",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LocationPicker;
