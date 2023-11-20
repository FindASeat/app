import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Temporal } from '@js-temporal/polyfill';
import { format_time } from '../utils';

const TimePicker = ({
  times,
  setPickedTime,
  pickedTime,
}: {
  times: Temporal.PlainDateTime[];
  setPickedTime: Dispatch<SetStateAction<Temporal.PlainDateTime>>;
  pickedTime: Temporal.PlainDateTime;
}) => {
  useEffect(() => {
    if (times.length === 0) return;
    if (Temporal.PlainDateTime.compare(pickedTime, times[0]!) < 0) setPickedTime(times[0]!);
    if (Temporal.PlainDateTime.compare(pickedTime, times[times.length - 1]!) > 0)
      setPickedTime(times[times.length - 1]!);
  }, [times]);

  return (
    <View style={styles.container}>
      {times.length === 0 && (
        <View style={[styles.timeButton]}>
          <Text style={[styles.timeText]}>No Available Times</Text>
        </View>
      )}

      {times.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {times.map((time, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.timeButton, pickedTime.equals(time) && styles.selectedTimeButton]}
              onPress={() => setPickedTime(time)}
            >
              <Text style={[styles.timeText, pickedTime.equals(time) && styles.selectedTimeText]}>
                {format_time(time)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#BBB',
  },
  timeButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 10,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTimeButton: {
    backgroundColor: '#990000',
  },
  selectedTimeText: {
    color: 'white',
  },
  timeText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
