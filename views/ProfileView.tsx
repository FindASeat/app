import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import ReservationBubble from '../components/ReservationBubble';
import { useGlobal } from '../context/GlobalContext';
import { get_user_if_login } from '../utils';
import { useEffect } from 'react';

const ProfileView = () => {
  const { user, setUser } = useGlobal();

  useEffect(() => {
    if (!user) get_user_if_login().then(setUser);
  }, [user]);

  if (!user)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {/* User Profile */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 15, paddingTop: 10 }}>
        <Image
          source={{ uri: user.image_url }}
          style={{ width: 100, height: 100, borderRadius: 50, marginRight: 10 }}
        />
        <View>
          <Text style={{ fontSize: 24, fontWeight: '600' }}>{user.name}</Text>
          <Text style={{ fontSize: 16, fontWeight: '500' }}>{user.affiliation}</Text>
          <Text style={{ fontSize: 16, fontWeight: '500' }}>USCID {user.usc_id}</Text>
        </View>
      </View>

      {/* Reservations */}
      {/* Next */}
      <Text style={{ paddingBottom: 5, fontSize: 18, fontWeight: 'bold' }}>Current Reservation</Text>
      <View>
        {user.active_reservation && <ReservationBubble res={user.active_reservation} user={user} />}
        {!user.active_reservation && (
          <View
            style={{
              backgroundColor: '#f0f0f0',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              flexDirection: 'column',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>No active reservation</Text>
          </View>
        )}
      </View>

      {/* Past */}
      <Text style={{ paddingBottom: 5, fontSize: 18, fontWeight: 'bold' }}>Previous Reservations</Text>
      <ScrollView style={{ flex: 1 }}>
        {user.completed_reservations.map(res => (
          <View key={res.key} style={{ marginVertical: 4 }}>
            <ReservationBubble res={res} user={user} />
          </View>
        ))}
        {user.completed_reservations.length === 0 && (
          <View
            style={{
              marginVertical: 4,
              backgroundColor: '#f0f0f0',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              flexDirection: 'column',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>No past reservations</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
  },
});
