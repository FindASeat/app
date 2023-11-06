import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import { addReservation, cancelReservation, getUserInfo, getUserReservations } from "../firebaseFunctions";

const me = ( {username} ) => {

  username = 'rohkal'
  const [name, setName] = useState('');
  const [reservations, setReservations] = useState([]);

  const testFunction = async () => {
    // await addReservation("ania", "LVL", "inside-2-2", "today", "haha")
    await cancelReservation("LVL", "ania", "-NiabmyjqG6qnsflELjb");
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
    <View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.title}>Active Reservations</Text>
       <ScrollView>
        {reservations.map((reservation, index) => (
          <View key={index} style={styles.bubble}>
            <Text>{reservation.seat}</Text>
          </View>
        ))}
      </ScrollView>
      <Button onPress={() => testFunction()} title="Test"/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
   title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  bubble: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
});

export default me;
