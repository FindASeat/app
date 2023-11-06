import { Dispatch, SetStateAction } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

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
    const adjustedHour = hour % 12 || 12; // Converts "0" hours to "12"
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
  selectedTimeButton: {
    // Styles for the selected time
    backgroundColor: "#990000", // using the loginButton color for consistency
  },
  timeText: {
    // Styles for the time text
    color: "#333", // darker color for readability
    fontSize: 16,
    fontWeight: "bold", // consistency with buttonText style
  },
  // ... Add other styles that you might need here
});
