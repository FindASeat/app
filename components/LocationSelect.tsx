import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LocationSelect = ({ location, onLocationChange }) => {
  const [selectedValue, setSelectedValue] = useState(location);

  useEffect(() => {
    setSelectedValue(location);
  }, [location]);

  const handleOptionSelect = (value) => {
    setSelectedValue(value);
    onLocationChange(value);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          selectedValue === 1 ? styles.selectedButton : null,
        ]}
        onPress={() => handleOptionSelect(1)}
      >
        <Text style={styles.buttonText}>Indoor</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          selectedValue === 2 ? styles.selectedButton : null,
        ]}
        onPress={() => handleOptionSelect(2)}
      >
        <Text style={styles.buttonText}>Outdoor</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  selectedButton: {
    backgroundColor: '#00CC00', // Green color when selected
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocationSelect;