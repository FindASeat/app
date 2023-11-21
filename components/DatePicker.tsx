import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Dispatch, SetStateAction } from 'react';
import { Temporal } from '@js-temporal/polyfill';

const DatePicker = ({
  setPickedDate,
  pickedDate,
}: {
  setPickedDate: Dispatch<SetStateAction<Temporal.PlainDateTime>>;
  pickedDate: Temporal.PlainDateTime;
}) => {
  const today = Temporal.Now.plainDateISO();
  const the_week = Array.from({ length: 7 }, (_, i) => today.add({ days: i }));

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {the_week.map((time, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dateButton, pickedDate.toPlainDate().equals(time) && styles.selectedDateButton]}
            onPress={() => setPickedDate(time.toPlainDateTime())}
          >
            <View style={{ alignItems: 'center' }}>
              <Text
                style={[
                  styles.dateText,
                  { fontWeight: '500' },
                  pickedDate.toPlainDate().equals(time) && styles.selectedDateText,
                ]}
              >
                {time.toLocaleString('en-US', { month: 'long' })}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  { fontWeight: 'bold', fontSize: 32 },
                  pickedDate.toPlainDate().equals(time) && styles.selectedDateText,
                ]}
              >
                {time.toLocaleString('en-US', { day: 'numeric' })}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  { fontWeight: '500' },
                  pickedDate.toPlainDate().equals(time) && styles.selectedDateText,
                ]}
              >
                {time.toLocaleString('en-US', { weekday: 'short' })}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#BBB',
  },
  dateButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDateButton: {
    backgroundColor: '#990000',
  },
  selectedDateText: {
    color: 'white',
  },
  dateText: {
    color: '#333',
    fontSize: 16,
  },
});
