import SeatingChartView from "../../../../components/SeatingChartView";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LocationPicker from "../../../../components/LocationPicker";
import { useGlobal } from "../../../../context/GlobalContext";
import TimePicker from "../../../../components/TimePicker";
import Icon from "react-native-vector-icons/Octicons";
import { router } from "expo-router";
import { useState } from "react";

const reserve = () => {
  const { selectedBuilding } = useGlobal();

  const [area, setArea] = useState<"indoor" | "outdoor">("indoor");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [pickedTime, setPickedTime] = useState("");

  const mock_seats = [
    [true, false, true, true],
    [true, true, true, true],
    [true, false, true, false],
  ];

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "relative",
          backgroundColor: "#990000",
          paddingVertical: 10,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        {/* Title */}
        <Text style={styles.title}>Reserve a Seat</Text>

        {/* Cancel Button */}
        <TouchableOpacity style={{ position: "absolute", right: 15, top: 10 }} onPress={() => router.back()}>
          <Icon name="x" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Time picker */}
      <Text style={{ fontSize: 18, fontWeight: "400", color: "#333", paddingBottom: 1, paddingHorizontal: 5 }}>
        Start Time
      </Text>
      <TimePicker openTime={"08:00"} closeTime={"20:30"} setPickedTime={setPickedTime} pickedTime={pickedTime} />

      {/* Location Picker */}
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
        Location
      </Text>
      <View style={[styles.locContainer, pickedTime == "" && { opacity: 0.25 }]}>
        <LocationPicker location={area} setLocation={setArea} />
      </View>

      {/* Seat Grid */}
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

      {/* TODO: If we have time do a seat confirmation with day and time */}

      {/* Reserve button */}
      <TouchableOpacity
        disabled={pickedTime === "" || selectedSeat === ""}
        style={[styles.reserveButton, selectedSeat === "" && { opacity: 0.25 }]}
      >
        <Text style={styles.buttonText}>Reserve</Text>
      </TouchableOpacity>
    </View>
  );
};

export default reserve;

const styles = StyleSheet.create({
  locContainer: {
    paddingVertical: 10,
    backgroundColor: "#BBB",
  },
  locButton: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    backgroundColor: "#990000",
    flexGrow: 1,
  },
  reserveButton: {
    backgroundColor: "#990000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
