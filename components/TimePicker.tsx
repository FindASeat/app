import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Dispatch, SetStateAction } from "react";
import React from "react";

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
  const formatTime = hour => {
    const isPM = hour >= 12;
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:00${isPM ? " PM" : " AM"}`;
  };

  const generateTimes = (open, close) => {
    let startTime = parseInt(open.split(":")[0], 10);
    const endTime = parseInt(close.split(":")[0], 10);
    const times = [];
    while (startTime <= endTime) {
      times.push(formatTime(startTime));
      startTime++;
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
            <Text style={[styles.timeText, pickedTime === time && { color: "white" }]}>{time}</Text>
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
  timeText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});
