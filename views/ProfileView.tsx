import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import ReservationBubble from '../components/ReservationBubble';
import { useGlobal } from '../context/GlobalContext';
import { get_user_if_login } from '../utils';
import { useEffect } from 'react';

const ProfileView = () => {
  console.log('ProfileView.tsx');

  const { user, setUser } = useGlobal();

  useEffect(() => {
    console.log('ProfileView.tsx useEffect');
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
      <View style={styles.userInfo}>
        <Image source={{ uri: user.image_url }} style={styles.profilePicture} />
        <View>
          <Text style={styles.title}>User Information:</Text>
          <Text>Name: {user.name}</Text>
          <Text>Affiliation: {user.affiliation}</Text>
          <Text>USC ID: {user.usc_id}</Text>
        </View>
      </View>

      {/* Reservations */}
      <Text style={{ fontSize: 20 }}>Reservations</Text>

      {/* Next */}
      <Text style={styles.title}>Current</Text>
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
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
              No reservation booked. Go to the map!
            </Text>
          </View>
        )}
      </View>

      {/* Past */}
      <Text style={styles.title}>Previous</Text>
      <ScrollView style={{ flex: 1 }}>
        {user.completed_reservations.map(res => (
          <View key={res.key} style={{ marginVertical: 4 }}>
            <ReservationBubble res={res} user={user} />
          </View>
        ))}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    margin: 20,
  },
  buttonWrapper: {
    backgroundColor: '#990000',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#990000',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});
