import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { cancelReservation } from '../app/firebaseFunctions';

const ReservationBubble = ({ reservation, username, onCancel }) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.verticalInfo}>
          <Text style={styles.label}>Building Code:</Text>
          <Text style={styles.value}>{reservation.code}</Text>
        </View>
        <View style={styles.verticalInfo}>
          <Text style={styles.label}>Seat:</Text>
          <Text style={styles.value}>{reservation.seat}</Text>
        </View>
        <View style={styles.verticalInfo}>
          <Text style={styles.label}>Date/Time:</Text>
          {/* <Text style={styles.value}>{reservation.date} {reservation.startTime} - {reservation.endTime}</Text> */}
           <Text style={styles.value}>{reservation.start} - {reservation.end}</Text>
        </View>
        {/* <View style={styles.verticalInfo}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{reservation.indoor ? 'Indoor' : 'Outdoor'}</Text>
        </View> */}
      </View>
    <TouchableOpacity 
      style={styles.cancelButton} 
      onPress={() => onCancel(reservation.code, username, reservation.id)}
    >
      <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    flexDirection: 'column',
    marginBottom: 10,
  },
  
  infoContainer: {
    flexDirection: 'row',
  },
  verticalInfo: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#990000', // Button background color
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    
    color: '#fff', // Button text color
    fontWeight: 'bold',
  },
});

export default ReservationBubble;
