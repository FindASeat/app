import { generate_end_times, generate_start_times, is_building_open } from '../utils';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { make_reservation, get_availability } from '../firebase/firebase_api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SeatingChartView from '../components/SeatingChart';
import LocationPicker from '../components/LocationPicker';
import Icon from 'react-native-vector-icons/Octicons';
import { useEffect, useMemo, useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import TimePicker from '../components/TimePicker';
import DatePicker from '../components/DatePicker';
import { Temporal } from '@js-temporal/polyfill';
import { router } from 'expo-router';
import ErrorView from './ErrorView';

const ReserveView = () => {
  const { selectedBuilding, user, setUser } = useGlobal();
  const insets = useSafeAreaInsets();

  const [pickedStart, setPickedStart] = useState(
    Temporal.Now.plainDateTimeISO().round({ smallestUnit: 'minutes', roundingIncrement: 30, roundingMode: 'ceil' }),
  );
  const [pickedEnd, setPickedEnd] = useState(pickedStart.add({ minutes: 30 }));

  const [area, setArea] = useState<'inside' | 'outside'>('inside');
  const [selectedSeat, setSelectedSeat] = useState('');
  const [loading, setLoading] = useState(true);

  const [validDT, setValidDT] = useState(false);
  const [seats, setSeats] = useState<boolean[][]>([]);

  const times = useMemo(
    () => generate_start_times(selectedBuilding?.open_hours ?? [], pickedStart),
    [selectedBuilding, pickedStart],
  );
  const end_times = useMemo(() => generate_end_times(times, pickedStart), [times, pickedStart]);

  useEffect(() => {
    if (selectedBuilding) {
      setLoading(true);
      get_availability(
        {
          code: selectedBuilding.code,
          inside: selectedBuilding.inside,
          outside: selectedBuilding.outside,
        },
        pickedStart,
        pickedEnd,
      )
        .then(building => {
          setSeats(area === 'inside' ? building.inside.seats : building.outside.seats);
          setSelectedSeat('');
          setLoading(false);
        })
        .catch(error => console.error(error));
    }
  }, [area, selectedBuilding, pickedStart, pickedEnd]);

  useEffect(() => {
    setValidDT(selectedBuilding ? is_building_open(selectedBuilding.open_hours, pickedStart) : false);
  }, [selectedBuilding, pickedStart]);

  if (!selectedBuilding || !user) return <ErrorView />;
  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'relative',
          backgroundColor: '#990000',
          paddingVertical: 10,
          alignItems: 'center',
        }}
      >
        {/* Title */}
        <Text style={styles.title}>Reserve a Seat</Text>

        {/* Cancel Button */}
        <TouchableOpacity
          hitSlop={20}
          style={{ position: 'absolute', right: 15, top: 10 }}
          onPress={() => router.back()}
        >
          <Icon name="x" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ paddingTop: 10 }}>
        {/* Date Picker */}
        <Text style={{ fontSize: 18, fontWeight: '400', color: '#333', paddingBottom: 1, paddingHorizontal: 5 }}>
          Start Date
        </Text>
        <DatePicker setPickedDate={setPickedStart} pickedDate={pickedStart} />

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
        <TimePicker times={times} setPickedTime={setPickedStart} pickedTime={pickedStart} />

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
          <TimePicker times={end_times} setPickedTime={setPickedEnd} pickedTime={pickedEnd} />
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
              start_time: pickedStart,
              end_time: pickedEnd,
              seat_id: selectedSeat as `${number}-${number}`,
              status: 'active',
            });

            if (res) {
              setUser({ ...user, active_reservation: res });
              router.push('/');
            }
          }}
        >
          <Text style={styles.buttonText}>Reserve</Text>
        </TouchableOpacity>

        <View style={{ marginBottom: insets.bottom }} />
      </ScrollView>
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
