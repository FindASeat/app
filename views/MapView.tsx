import { useGlobal } from '../context/GlobalContext';
import MapView, { Marker } from 'react-native-maps';
import { is_building_open } from '../utils';
import { StyleSheet } from 'react-native';
import LoadingView from './LoadingView';
import { router } from 'expo-router';

const USCMapView = () => {
  const { buildings, setSelectedBuilding, selectedBuilding, user } = useGlobal();

  console.log('map view', buildings === null, selectedBuilding === null, user === null);

  return (
    <MapView
      region={{
        latitude: 34.021,
        longitude: -118.2863,
        latitudeDelta: 0.011,
        longitudeDelta: 0.011,
      }}
      style={[StyleSheet.absoluteFill]}
    >
      {Object.values(buildings ?? {}).map((building, idx) => (
        <Marker
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
            router.push(building.code);
          }}
        />
      ))}
    </MapView>
  );
};

export default USCMapView;
