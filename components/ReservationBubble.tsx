import { cancel_reservation, get_user_data } from '../firebase/firebase_api';
import { cancelAllScheduledNotificationsAsync } from 'expo-notifications';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useGlobal } from '../context/GlobalContext';
import { Temporal } from '@js-temporal/polyfill';
import { Reservation, User } from '../types';
import { router } from 'expo-router';
import { useState } from 'react';

const ReservationBubble = ({
  res,
  user,
  readonly,
}:
  | { res: Reservation; user: User; readonly: false }
  | { res: Partial<Omit<Reservation, 'created_at'>>; user?: User; readonly: true }) => {
  const { setUser } = useGlobal();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCancel = async () => {
    setShowConfirmation(true);
  };

  const handleConfirmCancel = async () => {
    // Add your cancel reservation logic here
    await cancelAllScheduledNotificationsAsync();
    await cancel_reservation(res.building_code!, user?.username!, res.key!);
    await get_user_data(user?.username!).then(setUser);
    setShowConfirmation(false);
  };

  const handleCancelCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <View style={styles.container}>
      {/* First Row */}
      <View style={{ marginBottom: 10, flexDirection: 'row' }}>
        {/* Date + Time */}
        <View style={styles.item}>
          <Text style={styles.label}>When</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[styles.value]}>
              {res.start_time
                ? res.start_time.toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                  })
                : '???'}
              {' – '}
              {res.end_time
                ? res.end_time.toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                  })
                : '???'}
            </Text>
          </View>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Date</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.value}>
              {res.start_time
                ? res.start_time.toLocaleString('en-US', {
                    day: 'numeric',
                    month: 'long',
                  })
                : '???'}
            </Text>
          </View>
        </View>
      </View>

      {/* Second Row */}
      <View style={styles.infoContainer}>
        {/* Building Location */}
        <View style={styles.item}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{res.building_code ?? '???'}</Text>
        </View>

        {/* Seat ID */}
        <View style={styles.item}>
          <Text style={styles.label}>Seat</Text>
          <Text style={styles.value}>
            <Text style={{ fontSize: 15 }}>R</Text>
            {res.seat_id ? +res.seat_id.split('-')[0]! + 1 : '?'}
            <Text style={{ fontSize: 15 }}> C</Text>
            {res.seat_id ? +res.seat_id.split('-')[1]! + 1 : '?'}
          </Text>
        </View>

        {/* Seat Area */}
        <View style={styles.item}>
          <Text style={styles.label}>Area</Text>
          <Text style={styles.value}>{res.area ? (res.area === 'inside' ? 'Inside' : 'Outside') : '???'}</Text>
        </View>

        {/* Status */}
        <View style={styles.item}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>
            {res.status
              ? res.status === 'completed'
                ? 'Finished'
                : res.status === 'active'
                ? 'Active'
                : 'Canceled'
              : 'Pending'}
          </Text>
        </View>
      </View>

      {!readonly && res.status === 'active' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel Reservation</Text>
          </TouchableOpacity>
          {!(Temporal.PlainDateTime.compare(Temporal.Now.plainDateTimeISO(), res.start_time) >= 0) && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                router.push('/modify');
              }}
            >
              <Text style={styles.buttonText}>Modify Reservation</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <Modal visible={showConfirmation} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to cancel this reservation?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleConfirmCancel}>
                <Text style={styles.modalButtonText}>I wish to confirm.</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancelCancel}>
                <Text style={styles.modalButtonText}>Changed my mind.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    rowGap: 5,
  },
  item: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  button: {
    backgroundColor: '#990000',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
  },
  modalButtonText: {
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: 'green',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
});

export default ReservationBubble;
