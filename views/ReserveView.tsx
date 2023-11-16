import { generate_end_times, generate_start_times, is_building_open } from '../utils';
import { make_reservation, get_availability } from '../firebase/firebase_api';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SeatingChartView from '../components/SeatingChart';
import LocationPicker from '../components/LocationPicker';
import Icon from 'react-native-vector-icons/Octicons';
import { useEffect, useMemo, useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import TimePicker from '../components/TimePicker';
import DatePicker from '../components/DatePicker';
import { Temporal } from '@js-temporal/polyfill';
import { router } from 'expo-router';

const ReserveView = () => {
  console.log('ReserveView.tsx');
  const { selectedBuilding, user, setUser } = useGlobal();

  const [pickedDate, setPickedDate] = useState(Temporal.Now.plainDateISO());
  const [pickedStartTime, setPickedStartTime] = useState(
    Temporal.Now.plainTimeISO().round({ smallestUnit: 'minutes', roundingIncrement: 30, roundingMode: 'ceil' }),
  );
  const [pickedEndTime, setPickedEndTime] = useState(pickedStartTime.add({ minutes: 30 }));

  const [area, setArea] = useState<'inside' | 'outside'>('inside');
  const [selectedSeat, setSelectedSeat] = useState('');
  const [loading, setLoading] = useState(true);

  const [validDT, setValidDT] = useState(false);
  const [seats, setSeats] = useState<boolean[][]>([]);

  const times = useMemo(
    () => generate_start_times(selectedBuilding?.open_hours ?? [], pickedDate),
    [selectedBuilding, pickedDate],
  );
  const end_times = useMemo(() => generate_end_times(times, pickedStartTime), [times, pickedStartTime]);

  useEffect(() => {
    console.log('ReserveView.tsx useEffect 1');

    if (selectedBuilding) {
      setLoading(true);
      get_availability(
        {
          code: selectedBuilding.code,
          inside: selectedBuilding.inside,
          outside: selectedBuilding.outside,
        },
        pickedDate.toPlainDateTime(pickedStartTime),
        Temporal.PlainTime.compare(pickedEndTime, pickedStartTime) < 0
          ? pickedDate.toPlainDateTime(pickedEndTime).add({ days: 1 })
          : pickedDate.toPlainDateTime(pickedEndTime),
      )
        .then(building => {
          setSeats(area === 'inside' ? building.inside.seats : building.outside.seats);
          setSelectedSeat('');
          setLoading(false);
        })
        .catch(error => console.error(error));
    }
  }, [area, selectedBuilding, pickedDate, pickedStartTime, pickedEndTime]);

  useEffect(() => {
    console.log('ReserveView.tsx useEffect 2');
    setValidDT(
      selectedBuilding
        ? is_building_open(selectedBuilding.open_hours, pickedDate.toPlainDateTime(pickedStartTime))
        : false,
    );
  }, [selectedBuilding, pickedDate, pickedStartTime]);

  if (!selectedBuilding)
    return (
      <View>
        <Text>Well this is weird...</Text>
        <Text>We've encountered an issue</Text>
        <Text>Please try again.</Text>
      </View>
    );

  if (!user)
    return (
      <View>
        <Text>Please login to reserve a seat.</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'relative',
          backgroundColor: '#990000',
          paddingVertical: 10,
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        {/* Title */}
        <Text style={styles.title}>Reserve a Seat</Text>

        {/* Cancel Button */}
        <TouchableOpacity style={{ position: 'absolute', right: 15, top: 10 }} onPress={() => router.back()}>
          <Icon name="x" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      <Text style={{ fontSize: 18, fontWeight: '400', color: '#333', paddingBottom: 1, paddingHorizontal: 5 }}>
        Start Date
      </Text>
      <DatePicker setPickedDate={setPickedDate} pickedDate={pickedDate} />

      {/* Start Time picker */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: '400',
          color: '#333',
          paddingBottom: 1,
          paddingHorizontal: 5,
          paddingTop: 20,
        }}
      >
        Start Time
      </Text>
      <TimePicker times={times} setPickedTime={setPickedStartTime} pickedTime={pickedStartTime} />

      {/* End Time picker */}
      <Text
        style={[
          {
            fontSize: 18,
            fontWeight: '400',
            color: '#333',
            paddingBottom: 1,
            paddingHorizontal: 5,
            paddingTop: 20,
          },
          !validDT && { opacity: 0.25 },
        ]}
      >
        End Time
      </Text>
      <View style={[!validDT && { opacity: 0.25 }]}>
        <TimePicker times={end_times} setPickedTime={setPickedEndTime} pickedTime={pickedEndTime} />
      </View>

      {/* Location Picker */}
      <Text
        style={[
          {
            fontSize: 18,
            fontWeight: '400',
            color: '#333',
            paddingHorizontal: 5,
            paddingTop: 20,
            paddingBottom: 1,
          },
          !validDT && { opacity: 0.25 },
        ]}
      >
        Location
      </Text>
      <View style={[styles.locContainer, !validDT && { opacity: 0.25 }]}>
        <LocationPicker location={area} setLocation={setArea} />
      </View>

      {/* Seat Grid */}
      <Text
        style={[
          {
            fontSize: 18,
            fontWeight: '400',
            color: '#333',
            paddingHorizontal: 5,
            paddingTop: 20,
            paddingBottom: 1,
          },
          !validDT && { opacity: 0.25 },
        ]}
      >
        Pick a Seat
      </Text>
      <View style={[{ backgroundColor: '#CCC', paddingVertical: 30 }, (!validDT || loading) && { opacity: 0.25 }]}>
        <SeatingChartView
          readonly={!validDT || loading}
          seats={seats}
          selectedSeat={selectedSeat}
          setSelectedSeat={setSelectedSeat}
        />
      </View>

      {/* TODO: If we have time do a seat confirmation with day and time */}

      {/* Reserve button */}
      <TouchableOpacity
        disabled={!validDT || selectedSeat === ''}
        style={[styles.reserveButton, selectedSeat === '' && { opacity: 0.25 }]}
        onPress={async () => {
          if (!user) return alert('Please login to reserve a seat.');
          if (selectedSeat === '' || !validDT) return alert('Please select a valid time and seat.');

          const res = await make_reservation(user.username, {
            area,
            building_code: selectedBuilding.code,
            start_time: pickedDate.toPlainDateTime(pickedStartTime),
            end_time:
              Temporal.PlainTime.compare(pickedEndTime, pickedStartTime) < 0
                ? pickedDate.toPlainDateTime(pickedEndTime).add({ days: 1 })
                : pickedDate.toPlainDateTime(pickedEndTime),
            seat_id: selectedSeat as `${number}-${number}`,
            status: 'active',
          });

          if (res) {
            setUser({ ...user, active_reservation: res });
            router.push('/(tabs)/(map_screen)/map');
          }
        }}
      >
        <Text style={styles.buttonText}>Reserve</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReserveView;

const styles = StyleSheet.create({
  locContainer: {
    paddingVertical: 10,
    backgroundColor: '#BBB',
  },
  locButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#990000',
    flexGrow: 1,
  },
  reserveButton: {
    backgroundColor: '#990000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
