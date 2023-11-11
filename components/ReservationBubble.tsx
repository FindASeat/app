import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { cancelReservation } from '../app/firebaseFunctions';
import { useGlobal } from '../context/GlobalContext';

const ReservationBubble = ({ reservation, onCancel, showCancel }) => {
  const { user } = useGlobal();

  const handleModification = (reservation) => {
    // Add your logic here to handle the modification action
  };

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
          <Text style={styles.value}>
            {reservation.start} - {reservation.end}
          </Text>
        </View>
      </View>
      {showCancel && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() =>
              user &&
              user.username &&
              onCancel(reservation.code, user.username, reservation.id)
            }
          >
            <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modificationButton}
            onPress={() => handleModification(reservation)}
          >
            <Text style={styles.modificationButtonText}>
              Modify Reservation
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#990000',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modificationButton: {
    backgroundColor: '#ffa500',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
  },
  modificationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ReservationBubble;
