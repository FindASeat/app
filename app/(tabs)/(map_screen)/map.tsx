import { get_user_if_login, is_building_open } from '../../../utils';
import { get_buildings } from '../../../firebase/firebase_api';
import { useGlobal } from '../../../context/GlobalContext';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';

const map = () => {
  const { buildings, setSelectedBuilding, setBuildings, setUser, user } = useGlobal();

  useEffect(() => {
    if (!buildings) get_buildings().then(setBuildings);
    if (!user) get_user_if_login().then(setUser);
  }, []);

  return (
    <MapView
      region={{
        latitude: 34.021,
        longitude: -118.2863,
        latitudeDelta: 0.011,
        longitudeDelta: 0.011,
      }}
      style={StyleSheet.absoluteFill}
    >
      {Object.values(buildings ?? {}).map((building, idx) => (
        <Marker
          key={idx}
          coordinate={building.coordinate}
          pinColor={
            !is_building_open(building.open_hours)
              ? '#990000'
              : building.total_availability < 0.25
              ? '#990000'
              : building.total_availability < 0.5
              ? 'orange'
              : 'green'
          }
          onPress={() => {
            setSelectedBuilding(building);
            router.push('/(tabs)/(map_screen)/building/' + building.code);
          }}
        />
      ))}
    </MapView>
  );
};

export default map;
