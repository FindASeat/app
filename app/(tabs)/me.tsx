import { cancelReservation, getUserInfo, getUserReservations } from "../firebaseFunctions";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import ReservationBubble from "../../components/ReservationBubble";
import { useGlobal } from "../../context/GlobalContext";
import { useFocusEffect } from "expo-router";
import { useEffect, useState } from "react";

const me = () => {
  const { user, setUser } = useGlobal();
  const [res, setRes] = useState([]);

  const cancelAndFetchReservations = async (buildingCode, username, reservationId) => {
    // await cancelReservation(buildingCode, username, reservationId);
    // const updatedReservations = await getUserReservations(username);
    // const invalidRes = updatedReservations.filter(reservation => reservation.type === "invalid");
    // const validRes = updatedReservations.filter(reservation => reservation.type === "valid");
    // setValidReservations(validRes);
    // setInvalidReservations(invalidRes);
  };

  useEffect(() => {
    getUserInfo(user.username).then(user => setUser(user));
    getUserReservations(user.username).then(setRes);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image source={{ uri: user.image_url }} style={styles.profilePicture} />
        <View>
          <Text style={styles.title}>User Information:</Text>
          <Text style={styles.name}>Name: {user.name}</Text>
          <Text style={styles.name}>Affiliation: {user.affiliation}</Text>
          <Text style={styles.name}>USC ID: {user.usc_id}</Text>
        </View>
      </View>

      <Text style={styles.title}>Upcoming Reservation:</Text>
      <ScrollView>
        {res.map(r => (
          <ReservationBubble
            key={r.key}
            reservation={r}
            // onCancel={cancelAndFetchReservations}
            showCancel={true}
          />
        ))}
      </ScrollView>

      <Text style={styles.title}>Canceled Reservations:</Text>
      <ScrollView>
        {user.cancelled_reservations.map(r => (
          <ReservationBubble key={r.key} reservation={r} showCancel={false} />
        ))}
      </ScrollView>

      <Text style={styles.title}>Past Reservations:</Text>
      <ScrollView>
        {user.completed_reservations.map((reservation, index) => (
          <ReservationBubble
            key={index}
            reservation={reservation}
            // onCancel={cancelAndFetchReservations}
            showCancel={false}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default me;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  name: {
    marginLeft: 20,
  },
  aroundname: {
    backgroundColor: "#990000",
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    margin: 20,
  },
  buttonWrapper: {
    backgroundColor: "#990000",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#990000",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});
