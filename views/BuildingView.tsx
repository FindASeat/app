import { View, Text, TouchableOpacity, ScrollView, Image, SafeAreaView } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import CurrentAvailableAccordion from '../components/CurrentAvailableAccordion';
import HoursAccordion from '../components/HoursAccordion';
import { router, useLocalSearchParams } from 'expo-router';
import { get_building } from '../firebase/firebase_api';
import Icon from 'react-native-vector-icons/Octicons';
import { useGlobal } from '../context/GlobalContext';
import type { Building } from '../types';
import { display_hours } from '../utils';
import { useEffect } from 'react';

const BuildingView = () => {
  const { code } = useLocalSearchParams() as { code: string | undefined };
  const { selectedBuilding, setSelectedBuilding } = useGlobal();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (code) get_building(code).then(setSelectedBuilding);
    else if (selectedBuilding) get_building(selectedBuilding?.code).then(setSelectedBuilding);
  }, []);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <View style={{ height: insets.top, backgroundColor: '#990000' }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          {selectedBuilding && <SubBuildingView building={selectedBuilding} />}
          {!selectedBuilding && <Text>Loading...</Text>}
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
};

const SubBuildingView = ({ building }: { building: Building }) => {
  const hours = display_hours(building.open_hours);

  return (
    <View style={{ flex: 1 }}>
      {/* Back Arrow */}
      <View style={{ backgroundColor: '#990000', paddingVertical: 5, paddingLeft: 10 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Image + Title */}
        <Image
          source={{ uri: building.image_url }}
          style={{
            height: 150,
          }}
        />
        <View style={{ padding: 10 }}>
          {/* Title */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: 'black',
            }}
          >
            {building.title} ({building.code})
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
            }}
          >
            {/* Open/Closed */}
            <View
              style={[
                {
                  padding: 10,
                  backgroundColor: '#DDD',
                  borderRadius: 5,
                  width: hours === 'Closed' || hours.includes('Open at') ? '100%' : '49.5%',
                  alignItems: 'center',
                },
                hours === 'Closed' && { backgroundColor: '#CB9797' },
                hours === 'Open 24 hours' && { backgroundColor: '#AEE1A9' },
                hours.includes('Open until') && { backgroundColor: '#AEE1A9' },
              ]}
            >
              <Text
                style={[
                  {
                    fontSize: 18,
                    fontWeight: '600',
                    color: 'black',
                  },
                  hours === 'Closed' && { color: '#990000' },
                  hours === 'Open 24 hours' && { color: 'green' },
                  hours.includes('Open until') && { color: 'green' },
                ]}
              >
                {hours}
              </Text>
            </View>

            {/* % Available */}
            {hours !== 'Closed' && !hours.includes('Open at') && (
              <View
                style={{
                  padding: 10,
                  backgroundColor:
                    building.total_availability < 0.25
                      ? '#CB9797'
                      : building.total_availability < 0.5
                      ? '#FFEACB'
                      : '#AEE1A9',
                  borderRadius: 5,
                  width: '49.5%',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={[
                    {
                      fontSize: 18,
                      fontWeight: '600',
                      color:
                        building.total_availability < 0.25
                          ? '#990000'
                          : building.total_availability < 0.5
                          ? 'orange'
                          : 'green',
                    },
                  ]}
                >
                  {(building.total_availability * 100).toFixed(0) + '% Available'}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={{ paddingTop: 15, fontSize: 16 }}>{building.description}</Text>
        </View>

        {/* Open Hours */}
        <HoursAccordion hours={building.open_hours} />

        {/* Availability Outside */}
        {hours !== 'Closed' && !hours.includes('Open at') && (
          <CurrentAvailableAccordion header="Outside" room_info={building.outside} />
        )}

        {/* Availability Inside */}
        {hours !== 'Closed' && !hours.includes('Open at') && (
          <CurrentAvailableAccordion header="Inside" room_info={building.inside} />
        )}
      </ScrollView>

      {/* Action Button If Not Reserved */}
      {/* User's Registration If Exists */}
      {/* {!user?.active_reservation && ( */}
      <TouchableOpacity
        style={[
          {
            backgroundColor: '#990000',
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
        // disabled={!!user?.active_reservation}
        onPress={() => {
          router.push('/(tabs)/(map_screen)/building/reserve');
        }}
      >
        <Text style={{ fontSize: 16, color: 'white', fontWeight: '700' }}>Reserve a Seat</Text>
      </TouchableOpacity>
      {/* )} */}
    </View>
  );
};

export default BuildingView;
