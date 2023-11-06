import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import { addReservation, cancelReservation, getUserInfo, getUserReservations } from "../firebaseFunctions";
import ReservationBubble from "../../components/ReservationBubble"; // Import the custom component
const sampleReservations = [
  {
    buildingCode: "LVL",
    seat: "4-6",
    date: "11/6/23",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    indoor: true,
  },
  {
    buildingCode: "ABC",
    seat: "2-3",
    date: "11/6/23",
    startTime: "2:00 PM",
    endTime: "4:00 PM",
    indoor: false,
  },
  {
    buildingCode: "XYZ",
    seat: "5-8",
    date: "11/6/23",
    startTime: "3:30 PM",
    endTime: "5:30 PM",
    indoor: true,
  },
];

const Me = ({ username }) => {
  const [name, setName] = useState('');
  const [reservations, setReservations] = useState([]);

  const testFunction = async () => {
    await addReservation(username, "LVL", "4-6", "today", "haha");
    // await manageReservation("JFF", username, "-NiaEL5nThaMp4hoL6d8");
    // await cancelReservation("JFF", username, "-NiaEL5nThaMp4hoL6d8");
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
      <ScrollView>
        {sampleReservations.map((reservation, index) => (
          <ReservationBubble
            key={index}
            reservation={reservation}
            onCancel={() => console.log("Cancel Clicked")}
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
    backgroundColor: '#990000', // Button background color
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
