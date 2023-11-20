import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, TouchableHighlight, Text } from 'react-native';
import { get_user_if_login, is_building_open } from '../utils';
import LoadingWrapper from '../components/LoadingWrapper';
import { get_buildings } from '../firebase/firebase_api';
import { useGlobal } from '../context/GlobalContext';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { router } from 'expo-router';

const USCMapView = () => {
  const { buildings, setSelectedBuilding, selectedBuilding, user, setUser, setBuildings } = useGlobal();
  const [user_loading, set_user_loading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!buildings) get_buildings().then(setBuildings);

    if (!user)
      get_user_if_login().then(u => {
        setUser(u);
        set_user_loading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <LoadingWrapper is_loading={!buildings}>
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
      </LoadingWrapper>
      {!user && !user_loading && (
        <TouchableHighlight
          underlayColor={'#990000'}
          style={[
            {
              backgroundColor: '#990000',
              height: 80,
              position: 'absolute',
              justifyContent: 'center',
              bottom: insets.bottom,
              left: 0,
              right: 0,
            },
          ]}
          onPress={() => router.push('/login')}
        >
          <Text style={{ fontSize: 16, color: 'white', fontWeight: '700', textAlign: 'center' }}>Login</Text>
        </TouchableHighlight>
      )}
    </>
  );
};

export default USCMapView;
