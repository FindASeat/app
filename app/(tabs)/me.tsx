import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import { addReservation, cancelReservation, getUserInfo, getUserReservations } from "../firebaseFunctions";
import ReservationBubble from "../../components/ReservationBubble";

import { useGlobal } from "../../context/GlobalContext";


const Me = () => {

  const { user } = useGlobal();
  const username = user?.username
  const [name, setName] = useState('');
  const [reservations, setReservations] = useState([]);

  const testFunction = async () => {
    await addReservation("rohkal", "LVL", "inside-2-2", "today", "haha")
    // await cancelReservation("LVL", "ania", "-NiabmyjqG6qnsflELjb");
  } 

  const cancelAndFetchReservations = async (buildingCode, username, reservationId) => {
    console.log("user: ", username)
    await cancelReservation(buildingCode, username, reservationId);
    const updatedReservations = await getUserReservations(username);
    setReservations(updatedReservations);
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUserInfo(username);
      const userReservations = await getUserReservations(username);
      setName(user.name);
      setReservations(userReservations);
    }
    fetchUserData();
  }, [username]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Information:</Text>
      <Text style={styles.name}>Name: {name}</Text>
      <Text style={styles.title}>Active Reservations:</Text>
      <Button title="Test Button" onPress={() => testFunction()} />
      <ScrollView>
        {reservations.map((reservation, index) => (
          <ReservationBubble
            key={index}
            reservation={reservation}
            onCancel={cancelAndFetchReservations}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  name: {
    marginLeft: 20,
  },
  aroundname: {
    backgroundColor: '#990000',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    margin: 20,
  },
  buttonWrapper: {
    backgroundColor: '#990000',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#990000',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Me;
