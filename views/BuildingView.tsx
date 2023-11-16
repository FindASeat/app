import CurrentAvailableAccordion from '../components/CurrentAvailableAccordion';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import HoursAccordion from '../components/HoursAccordion';
import { get_building } from '../firebase/firebase_api';
import Icon from 'react-native-vector-icons/Octicons';
import { useGlobal } from '../context/GlobalContext';
import type { Building, User } from '../types';
import { display_hours } from '../utils';
import { useEffect } from 'react';
import ErrorView from './ErrorView';

const BuildingView = () => {
  const { code } = useLocalSearchParams() as { code: string | undefined };
  const { selectedBuilding, setSelectedBuilding, user } = useGlobal();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (code) get_building(code).then(setSelectedBuilding);
    else if (selectedBuilding) get_building(selectedBuilding?.code).then(setSelectedBuilding);
  }, []);

  if (!code && !selectedBuilding?.code) return <ErrorView />;

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          paddingTop: insets.top,
          backgroundColor: '#990000',
          alignItems: 'center',
          position: 'relative',
          paddingBottom: 43.5,
          flexDirection: 'row',
        }}
      >
        {/* Back Arrow */}
        <TouchableOpacity
          hitSlop={40}
          style={{ left: 10, position: 'absolute', paddingTop: insets.top, zIndex: 1 }}
          onPress={() => router.back()}
        >
          <Icon name="arrow-left" size={30} color="#fff" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            color: 'white',
            fontWeight: '600',
            width: '100%',
            textAlign: 'center',
            position: 'absolute',
            paddingTop: insets.top,
          }}
        >
          Building Details
        </Text>
      </View>

      <View style={{ flex: 1, backgroundColor: '#fff', paddingBottom: user ? 0 : insets.bottom }}>
        {selectedBuilding && <SubBuildingView building={selectedBuilding} user={user} />}
        {!selectedBuilding && <Text>Loading...</Text>}
      </View>
    </View>
  );
};

const SubBuildingView = ({ building, user }: { building: Building; user: User | null }) => {
  const hours = display_hours(building.open_hours);

  const is_guest = !user;
  const has_reservation = !!user?.active_reservation;

  return (
    <>
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

      {/* Action Button */}
      <TouchableOpacity
        style={[
          { backgroundColor: '#990000', height: is_guest ? 80 : 45, justifyContent: 'center', alignItems: 'center' },
          (is_guest || has_reservation) && { opacity: 0.5 },
        ]}
        disabled={is_guest || has_reservation}
        onPress={() => router.push('/reserve')}
      >
        <Text style={{ fontSize: 16, color: 'white', fontWeight: '700' }}>
          {is_guest
            ? 'Login to reserve a seat'
            : has_reservation
            ? 'You already have an active reservation'
            : 'Reserve a Seat'}
        </Text>
      </TouchableOpacity>
      {/* )} */}
    </>
  );
};

export default BuildingView;
