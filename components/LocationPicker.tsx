import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Dispatch, SetStateAction } from 'react';

const LocationPicker = ({
  location: locationPicker,
  setLocation: setLocationPicker,
}: {
  location: 'inside' | 'outside';
  setLocation: Dispatch<SetStateAction<'inside' | 'outside'>>;
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, locationPicker === 'inside' && styles.selectedButton]}
        onPress={() => setLocationPicker('inside')}
      >
        <Text style={[styles.buttonText, locationPicker === 'inside' && { color: 'white' }]}>Indoor</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, locationPicker === 'outside' && styles.selectedButton]}
        onPress={() => setLocationPicker('outside')}
      >
        <Text style={[styles.buttonText, locationPicker === 'outside' && { color: 'white' }]}>Outdoor</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 5,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    flexGrow: 1,
  },
  selectedButton: {
    backgroundColor: '#990000',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LocationPicker;
