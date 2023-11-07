import { cancelReservation, getUserInfo, getUserReservations } from "../firebaseFunctions";
import ReservationBubble from "../../components/ReservationBubble";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useGlobal } from "../../context/GlobalContext";
import { useFocusEffect } from "expo-router";
import React from "react";

const me = () => {
  const { user, setUser } = useGlobal();

  const cancelAndFetchReservations = async (buildingCode, username, reservationId) => {
    console.log("user: ", username);
    await cancelReservation(buildingCode, username, reservationId);
    const updatedReservations = await getUserReservations(username);
    setUser(prev => ({ ...prev, reservations: updatedReservations }));
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const user_res = await getUserInfo(user?.username);
        const userReservations = await getUserReservations(user?.username);
        setUser(prev => ({ ...prev, reservations: userReservations, name: user_res.name }));
      };
      fetchUserData();
    }, [user?.username])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Information:</Text>
      <Text style={styles.name}>Name: {user?.name}</Text>
      <Text style={styles.title}>Active Reservations:</Text>

      <ScrollView>
        {user?.reservations.map((reservation, index) => (
          <ReservationBubble key={index} reservation={reservation} onCancel={cancelAndFetchReservations} />
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
});
