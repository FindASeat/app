import { get_buildings } from '../../../../firebase/firebase_api';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGlobal } from '../../../../context/GlobalContext';
import { Text, TouchableHighlight } from 'react-native';
import { get_user_if_login } from '../../../../utils';
import USCMapView from '../../../../views/MapView';
import Header from '../../../../components/Header';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

const map = () => {
  console.log('map');

  const { buildings, setBuildings, user, setUser } = useGlobal();
  const [user_loading, set_user_loading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!buildings) get_buildings().then(setBuildings);

    if (!user)
      get_user_if_login().then(u => {
        setUser(u);
        set_user_loading(false);
      });

    console.log('map useEffect');
  }, []);

  return (
    <>
      <Header />
      <SafeAreaView style={{ flex: 1 }}>
        <USCMapView />
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
      </SafeAreaView>
    </>
  );
};

export default map;
