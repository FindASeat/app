import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { cancelReservation, getUserInfo, getUserReservations } from "../firebaseFunctions";
import ReservationBubble from "../../components/ReservationBubble";
import { useFocusEffect } from "expo-router";
import { useGlobal } from "../../context/GlobalContext";


const Me = () => {

  const { user } = useGlobal();
  const username = user?.username
  const [name, setName] = useState('');
  const [validReservations, setValidReservations] = useState([]);
  const [invalidReservations, setInvalidReservations] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

  const cancelAndFetchReservations = async (buildingCode, username, reservationId) => {
    await cancelReservation(buildingCode, username, reservationId);
    const updatedReservations = await getUserReservations(username);
    const invalidRes = updatedReservations.filter(reservation => reservation.type === "invalid");
    const validRes = updatedReservations.filter(reservation => reservation.type === "valid");
    setValidReservations(validRes);
    setInvalidReservations(invalidRes);
  }

  const pastReservations = [
  {
    code: "LVL",
    seat: "inside-4-6",
    start: "11/5",
    end: "10:00 AM",
  },
  {
    code: "JFF",
    seat: "outside-2-3",
    start: "10/31",
    end: "12:00 AM",
  },
    {
    code: "VCE",
    seat: "inside-4-6",
    start: "10/23",
    end: "5:00 PM",
  },
  {
    code: "JFF",
    seat: "inside-2-5",
    start: "10/14",
    end: "4:00 PM",
  },
    {
    code: "THH",
    seat: "outside-2-1",
    start: "10/5",
    end: "5:00 PM",
  },
  {
    code: "LVL",
    seat: "outside-2-3",
    start: "9/28",
    end: "3:00 PM",
  },
  {
    code: "LVL",
    seat: "inside-2-1",
    start: "9/14",
    end: "10:00 AM",
  },
  {
    code: "LVL",
    seat: "outside-2-3",
    start: "9/6",
    end: "4:00 PM",
  },
  {
    code: "LVL",
    seat: "outside-0-0",
    start: "8/29",
    end: "3:30 PM",
  },
  {
    code: "LVL",
    seat: "inside-2-1",
    start: "8/15",
    end: "2:00 PM",
  },
];

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const user = await getUserInfo(username);
        setName(user.name);
        setImageUrl(user.image_url)
        const updatedReservations = await getUserReservations(username);
        const invalidRes = updatedReservations.filter(reservation => reservation.type === "invalid");
        const validRes = updatedReservations.filter(reservation => reservation.type === "valid");
        setValidReservations(validRes);
        setInvalidReservations(invalidRes);
      }
      fetchUserData();
    }, [username])
  );

  return (
    <View style={styles.container}>
    <View style={styles.userInfo}>
    {imageUrl && (
      <Image 
        source={{uri: imageUrl}} 
        style={styles.profilePicture} 
      />
    )}
          <View>
            <Text style={styles.title}>User Information:</Text>
            <Text style={styles.name}>Name: {name}</Text>
          </View>
        </View>
      <Text style={styles.title}>Active Reservations:</Text>
      <ScrollView>
        {validReservations.map((reservation, index) => (
          <ReservationBubble
            key={index}
            reservation={reservation}
            onCancel={cancelAndFetchReservations}
            showCancel={true}
          />
        ))}
      <Text style={styles.title}>Canceled Reservations:</Text>
      {invalidReservations.map((reservation, index) => (
          <ReservationBubble
            key={index}
            reservation={reservation}
            onCancel={cancelAndFetchReservations}
            showCancel={false}
          />
        ))}  
      <Text style={styles.title}>Past Reservations:</Text>
      {/* <Button title="Test Button" onPress={() => testFunction()} /> */}
        {pastReservations.map((reservation, index) => (
          <ReservationBubble
            key={index}
            reservation={reservation}
            onCancel={cancelAndFetchReservations}
            showCancel={false}
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});

export default Me;
