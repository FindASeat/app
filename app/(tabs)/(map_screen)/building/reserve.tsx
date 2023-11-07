import SeatingChartView from "../../../../components/SeatingChartView";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import TimePicker from "../../../../components/TimePicker";
import Icon from "react-native-vector-icons/Octicons";
import { router } from "expo-router";
import { useState } from "react";
import React from "react";
import { useGlobal } from "../../../../context/GlobalContext";

const reserve = () => {
  const [area, setArea] = useState<"indoor" | "outdoor">("indoor");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [pickedTime, setPickedTime] = useState("");

  const mock_seats = [
    [true, false, true, true],
    [true, true, true, true],
    [true, false, true, false],
  ];

  const { selectedBuilding } = useGlobal();
  console.log("trying to reserve", selectedBuilding?.code)

  return (
    <View style={styles.container}>
      {/* Cancel Button */}
      <View style={{ backgroundColor: "#990000", paddingVertical: 5, paddingRight: 15, alignItems: "flex-end" }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="x" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* The title */}
      <Text style={styles.title}>Reserve A Seat!</Text>

      {/* Indoor or Outdoor */}

      {/* Time picker */}
      <Text style={{ fontSize: 18, fontWeight: "400", color: "#333", paddingBottom: 1, paddingHorizontal: 5 }}>
        Start Time
      </Text>
      <TimePicker openTime={"08:00"} closeTime={"20:30"} setPickedTime={setPickedTime} pickedTime={pickedTime} />

      {/* The grid */}
      <Text
        style={[
          {
            fontSize: 18,
            fontWeight: "400",
            color: "#333",
            paddingHorizontal: 5,
            paddingTop: 20,
            paddingBottom: 1,
          },
          pickedTime == "" && { opacity: 0.25 },
        ]}
      >
        Pick a Seat
      </Text>
      <View style={[{ backgroundColor: "#CCC", paddingVertical: 30 }, pickedTime == "" && { opacity: 0.25 }]}>
        <SeatingChartView
          constant={pickedTime == null}
          seats={mock_seats}
          selectedSeat={selectedSeat}
          setSelectedSeat={setSelectedSeat}
        />
      </View>

      {/* Reserve button */}
      <TouchableOpacity style={styles.reserveButton}>
        <Text style={styles.buttonText}>Reserve</Text>
      </TouchableOpacity>
    </View>
  );
};

export default reserve;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF", // assuming a light theme
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    paddingVertical: 10,
    textAlign: "center",
  },
  reserveButton: {
    backgroundColor: "#990000", // dark red color from your previous styles
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20, // space above the button
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  // You can continue styling other components like SeatingChartView as needed
  // ...
});