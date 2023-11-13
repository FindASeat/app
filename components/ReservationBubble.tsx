import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { cancelReservation, getUserInfo } from "../app/firebaseFunctions";
import { useGlobal } from "../context/GlobalContext";
import { Reservation, User } from "../types";

const ReservationBubble = ({ res, user }: { res: Reservation; user: User }) => {
  const { setUser } = useGlobal();

  return (
    <View style={styles.container}>
      {/* First Row */}
      <View style={{ marginBottom: 10, flexDirection: "row" }}>
        {/* Date + Time */}
        <View style={styles.item}>
          <Text style={styles.label}>When</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={[styles.value]}>
              {res.start_time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" })}
              {" – "}
              {res.end_time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" })}
            </Text>
          </View>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Date</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.value}>{res.end_time.toLocaleString("en-US", { day: "numeric", month: "long" })}</Text>
          </View>
        </View>
      </View>

      {/* Second Row */}
      <View style={styles.infoContainer}>
        {/* Building Location */}
        <View style={styles.item}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{res.building_code}</Text>
        </View>

        {/* Seat ID */}
        <View style={styles.item}>
          <Text style={styles.label}>Seat</Text>
          <Text style={styles.value}>
            <Text style={{ fontSize: 15 }}>R</Text>
            {res.seat_id.split("-")[0]}
            <Text style={{ fontSize: 15 }}> C</Text>
            {res.seat_id.split("-")[1]}
          </Text>
        </View>

        {/* Seat Area */}
        <View style={styles.item}>
          <Text style={styles.label}>Area</Text>
          <Text style={styles.value}>{res.area === "inside" ? "Inside" : "Outside"}</Text>
        </View>

        {/* Status */}
        <View style={styles.item}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>
            {res.status === "completed" ? "Finished" : res.status === "active" ? "Active" : "Canceled"}
          </Text>
        </View>
      </View>

      {/* Button Actions */}
      {res.status === "active" && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={async () => {
            await cancelReservation(res.building_code, user.username, res.key);
            await getUserInfo(user.username).then(setUser);
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    flexDirection: "column",
  },
  infoContainer: {
    flexDirection: "row",
    rowGap: 5,
  },
  item: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cancelButton: {
    backgroundColor: "#990000",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ReservationBubble;
