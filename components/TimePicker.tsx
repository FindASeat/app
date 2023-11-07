import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import React, { Dispatch, SetStateAction } from "react";

const TimePicker = ({
  openTime,
  closeTime,
  setPickedTime,
  pickedTime,
}: {
  openTime: string;
  closeTime: string;
  setPickedTime: Dispatch<SetStateAction<string>>;
  pickedTime: string;
}) => {
  // Function to format the time in 12-hour format with AM/PM
  const formatTime = (hour, minute) => {
    const isPM = hour >= 12;
    const adjustedHour = hour % 12 || 12;
    // Ensure minutes are formatted as two digits
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    return `${adjustedHour}:${formattedMinute}${isPM ? " PM" : " AM"}`;
  };

  // Function to generate an array of time intervals
  const generateTimes = (open, close) => {
    let [startHour, startMinute] = open.split(":").map(Number);
    const [endHour, endMinute] = close.split(":").map(Number);
    let currentTime = new Date(0, 0, 0, startHour, startMinute);
    const endTime = new Date(0, 0, 0, endHour, endMinute);
    const times = [];

    while (currentTime <= endTime) {
      times.push(formatTime(currentTime.getHours(), currentTime.getMinutes()));
      // Increment by 30 minutes
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    return times;
  };

  const times = generateTimes(openTime, closeTime);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {times.map((time, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.timeButton, pickedTime === time && styles.selectedTimeButton]}
            onPress={() => setPickedTime(time)}
          >
            <Text style={[styles.timeText, pickedTime === time && styles.selectedTimeText]}>{time}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: "#BBB",
  },
  timeButton: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 10,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTimeButton: {
    backgroundColor: "#990000",
  },
  selectedTimeText: {
    color: "white",
  },
  timeText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});
