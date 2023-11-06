import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import type { RoomData } from "../types";
import { useState } from "react";

const SeatingChartView = ({ seats, constant }: { constant?: boolean; seats: RoomData["seats"] }) => {
  const [selectedSeat, setSelectedSeat] = useState("");

  const handleSeatSelect = (row: number, col: number) => {
    if (constant) return;

    const seatId = `${row}-${col}`;
    setSelectedSeat(seatId);
  };

  return (
    <View style={styles.container}>
      {seats.map((cols, row) => (
        <View key={row} style={styles.seatRow}>
          {cols.map((a, col) => {
            const seatId = `${row}-${col}`;

            return (
              <TouchableOpacity
                key={seatId}
                style={[
                  styles.seat,
                  a && styles.open,
                  !a && styles.taken,
                  selectedSeat === seatId && styles.selectedSeat,
                  {
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
                onPress={() => handleSeatSelect(row, col)}
                disabled={!a}
              >
                {!a && <Icon name={"x"} size={24} color="white" style={styles.icon} />}
                {selectedSeat == seatId && <Icon name={"check"} size={24} color="white" style={styles.icon} />}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default SeatingChartView;

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  icon: {
    marginHorizontal: 5,
  },
  seatRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  seat: {
    width: 30,
    height: 30,
    marginHorizontal: 3,
    borderRadius: 4,
  },
  taken: {
    backgroundColor: "gray",
  },
  open: {
    backgroundColor: "#FFFFFFE8",
  },
  selectedSeat: {
    backgroundColor: "#990000",
  },
});
