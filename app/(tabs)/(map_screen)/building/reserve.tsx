import SeatingChartView from "../../../../components/SeatingChartView";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import TimePicker from "../../../../components/TimePicker";
import Icon from "react-native-vector-icons/Octicons";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import React from "react";
import { useGlobal } from "../../../../context/GlobalContext";
import { addReservation, fetchBuilding } from "../../../firebaseFunctions";
import LocationSelect from "../../../../components/LocationSelect";

const reserve = () => {
  const [area, setArea] = useState(1);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [pickedTime, setPickedTime] = useState("");

  const [mock_seats, setMockSeats] = useState([]);

  const { selectedBuilding, user } = useGlobal();

  useEffect(() => {
  fetchBuilding(selectedBuilding.code)
    .then((building) => {
      if (building) {
        const seats = area === 1 ? building.inside.seats : building.outside.seats;
        if (seats) {
          setMockSeats(seats);
        }
      }
    })
    .catch((error) => console.error(error));
}, [area, selectedBuilding]);

  const reserveSeat = async () => {
    if (selectedSeat === "" || pickedTime === "" || area === 0) {
      console.log(selectedSeat, pickedTime, area)
      alert("Please select both a time and a seat.")
      return;
    }
    const username = user.username.toLowerCase();
    const buildingCode = selectedBuilding?.code;
    const seat = (area === 1 ? "inside-" : "outside-") + selectedSeat;
    const currentDate = new Date();
    const date = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
    const time = pickedTime;
    await addReservation(username, buildingCode, seat, date, time);
  };

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

      {/* Indoor or Outdoor */}
      <Text style={{ fontSize: 18, paddingTop: 20, fontWeight: "400", color: "#333", paddingBottom: 1, paddingHorizontal: 5 }}>
        Location
      </Text>
      <View style={styles.loccontainer}>
        {/* Render the LocationSelect component */}
      <LocationSelect location={area} onLocationChange={setArea}  />
      </View>

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
    <TouchableOpacity style={styles.reserveButton} onPress={reserveSeat}>
      <Text style={styles.buttonText}>Reserve</Text>
    </TouchableOpacity>
    </View>
  );
};

export default reserve;

const styles = StyleSheet.create({
   loccontainer: {
    paddingVertical: 10,
    backgroundColor: "#BBB",
  },
  locButton: {
    // Styles for the time buttons
    backgroundColor: "#F0F0F0", // a soft color that's easy on the eyes
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 10, // rounded corners
    elevation: 2, // slight shadow for a "lifted" effect
    justifyContent: "center",
    alignItems: "center",
  },

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
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});