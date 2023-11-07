import { addReservation, cancelReservation, getUserInfo, getUserReservations } from "../firebaseFunctions";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import { useGlobal } from "../../context/GlobalContext";
import React, { useEffect, useState } from "react";

const me = () => {
  const { user, setUser } = useGlobal();

  const testFunction = async () => {
    await addReservation("rohkal", "LVL", "4-6", "today", "haha");
    // await cancelReservation("JFF", "rohkal", "-NiaEL5nThaMp4hoL6d8");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const name = await getUserInfo(user.username);
      const userReservations = await getUserReservations(user.username);
      // TODO setUser(prev => ({ ...prev, name: name }));
      setUser(prev => ({ ...prev, reservations: userReservations }));
    };
    fetchUserData();
  }, [user.username]);

  return (
    <View>
      <Text>profile</Text>

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.title}>Active Reservations</Text>
      <ScrollView>
        {user.reservations.map((reservation, index) => (
          <View key={index} style={styles.bubble}>
            <Text>{reservation.seat}</Text>
          </View>
        ))}
      </ScrollView>
      <Button onPress={() => testFunction()} title="Test" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  bubble: {
    margin: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
});

export default me;
