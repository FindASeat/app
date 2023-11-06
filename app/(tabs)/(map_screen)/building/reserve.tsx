import SeatingChartView from "../../../../components/SeatingChartView";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";

const reserve = () => {
  const [selectedSeat, setSelectedSeat] = useState("");
  const test_seats = [
    [true, false, true, true],
    [true, true, true, true],
    [true, false, true, false],
  ];

  return (
    <View>
      {/* The title */}
      <Text>Make a reservation</Text>

      {/* Pick a time */}
      {/* Date picker, pick a day from today to the next 1 week */}

      {/* Time picker */}
      {/* Pick a time  */}

      {/* The grid */}
      <SeatingChartView seats={test_seats} selectedSeat={selectedSeat} setSelectedSeat={setSelectedSeat} />

      <TouchableOpacity>
        <Text>Reserve</Text>
      </TouchableOpacity>
    </View>
  );
};

export default reserve;

const styles = StyleSheet.create({});
