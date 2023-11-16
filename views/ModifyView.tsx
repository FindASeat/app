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
import ErrorView from './ErrorView';

const ReserveView = () => {
  // get avail for exact seat just before and after time to see if seat is taken by another person
  // only when current reservation time is overlapping any bit into new times, requires different seat selection logic

  const { selectedBuilding, user, setUser, setSelectedBuilding, buildings } = useGlobal();

  useEffect(() => {
    if (user && user.active_reservation && buildings)
      setSelectedBuilding(buildings[user.active_reservation.building_code]!);
  }, [user?.active_reservation, buildings]);

  const [pickedDate, setPickedDate] = useState(
    user?.active_reservation?.start_time.toPlainDate() ?? Temporal.Now.plainDateISO(),
  );
  const [pickedStartTime, setPickedStartTime] = useState(
    user?.active_reservation?.start_time.toPlainTime() ??
      Temporal.Now.plainTimeISO().round({ smallestUnit: 'minutes', roundingIncrement: 30, roundingMode: 'ceil' }),
  );
  const [pickedEndTime, setPickedEndTime] = useState(
    user?.active_reservation?.end_time.toPlainTime() ?? pickedStartTime.add({ minutes: 30 }),
  );

  const [area, setArea] = useState<'inside' | 'outside'>(user?.active_reservation?.area ?? 'inside');
  const [selectedSeat, setSelectedSeat] = useState(user?.active_reservation?.seat_id ?? '');
  const [loading, setLoading] = useState(true);

  const [validDT, setValidDT] = useState(false);
  const [seats, setSeats] = useState<boolean[][]>([]);

  const times = useMemo(
    () => generate_start_times(selectedBuilding?.open_hours ?? [], pickedDate),
    [selectedBuilding, pickedDate],
  );
  const end_times = useMemo(() => generate_end_times(times, pickedStartTime), [times, pickedStartTime]);

  useEffect(() => {
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
    setValidDT(
      selectedBuilding
        ? is_building_open(selectedBuilding.open_hours, pickedDate.toPlainDateTime(pickedStartTime))
        : false,
    );
  }, [selectedBuilding, pickedDate, pickedStartTime]);

  if (!selectedBuilding || !user || !user.active_reservation) return <ErrorView />;
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
        <Text style={styles.title}>Modify a Seat</Text>

        {/* Cancel Button */}
        <TouchableOpacity
          hitSlop={20}
          style={{ position: 'absolute', right: 15, top: 10 }}
          onPress={() => router.back()}
        >
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
          if (selectedSeat === '' && !validDT) return alert('Please modify your reservation or cancel.');

          const res = await modify_reservation(user.username, user.active_reservation!.key, {
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
            router.push('/profile');
          }
        }}
      >
        <Text style={styles.buttonText}>Modify Reservation</Text>
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
