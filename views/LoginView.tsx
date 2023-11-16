import { validate_credentials, create_user, is_username_taken, get_buildings } from '../firebase/firebase_api';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { GlobalProps, useGlobal } from '../context/GlobalContext';
import { useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
} from 'react-native';

const LoginView = ({ routeTo }: { routeTo: string }) => {
  console.log('login view');

  const { setUser } = useGlobal();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <SubLoginView setUser={setUser} routeTo={routeTo} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LoginView;

const SubLoginView = ({ setUser, routeTo }: Pick<GlobalProps, 'setUser'> & { routeTo: string }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [uscId, setUscId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const affiliation = ['Student', 'Faculty', 'Staff'] as const;
  const [affiliationIndex, setAffiliationIndex] = useState<0 | 1 | 2>(0);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        {/* Logo or App Name */}
        <View>
          <Text style={styles.logo}>FindASeat</Text>
        </View>

        {/* Sign Up Input Fields */}
        {mode == 'signup' && (
          <>
            <TextInput style={styles.inputField} placeholder="Name" value={name} onChangeText={text => setName(text)} />
            <TextInput
              style={styles.inputField}
              placeholder="USC ID"
              value={uscId}
              keyboardType="number-pad"
              onChangeText={text => setUscId(text)}
            />
            <SegmentedControl
              values={affiliation as unknown as string[]}
              selectedIndex={affiliationIndex}
              style={{ marginBottom: 15, height: 40 }}
              onChange={event => setAffiliationIndex(event.nativeEvent.selectedSegmentIndex as 0 | 1 | 2)}
            />
          </>
        )}

        {/* Input Fields */}
        <TextInput
          style={styles.inputField}
          placeholder="Username"
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={async () => {
            if (mode === 'login') {
              const user = await validate_credentials(username, password);

              if (user) {
                setUser(user);
                router.replace('/');
              } else alert('Invalid username or password!');
            }

            if (mode == 'signup') {
              if (username === '' || password === '' || name === '' || uscId === '')
                return alert('Please fill out all fields.');
              if (await is_username_taken(username)) return alert('Username is already taken.');

              const user = await create_user(username, {
                affiliation: affiliation[affiliationIndex],
                id: uscId,
                name,
                password,
                image_url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', // TODO maybe allow upload photo
              });

              if (user) {
                alert('Account created successfully!');
                setUser(user);
                router.push(routeTo);
              } else alert('Failed to create account. Please try again.');
            }
          }}
        >
          <Text style={styles.buttonText}>{mode === 'login' ? 'Log in' : 'Sign up'}</Text>
        </TouchableOpacity>

        {/* OR Text */}
        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* Switch to Signup */}
        <TouchableOpacity
          style={styles.signupButton}
          onPress={async () => {
            if (mode === 'login') setMode('signup');
            else if (mode === 'signup') setMode('login');
          }}
        >
          <Text style={styles.signupText}>{mode == 'login' ? 'Sign up' : 'Log in'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 40,
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputField: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
  },
  loginButton: {
    backgroundColor: '#990000',
    height: 45,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  divider: {
    height: 1,
    flex: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
  },
  signupButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  signupText: {
    color: '#990000',
    fontSize: 16,
  },
});
