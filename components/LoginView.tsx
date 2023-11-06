import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useGlobal } from "../context/GlobalContext";

const LoginView = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [uscId, setUscId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useGlobal();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.container}>
        {/* Logo or App Name */}
        <View>
          <Text style={styles.logo}>FindASeat</Text>
        </View>

        {/* Sign Up Input Fields */}
        {mode == "signup" && (
          <>
            <TextInput style={styles.inputField} placeholder="Name" value={name} onChangeText={text => setName(text)} />
            <TextInput
              style={styles.inputField}
              placeholder="USC ID"
              value={uscId}
              keyboardType="number-pad"
              onChangeText={text => setUscId(text)}
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
          onPress={() => {
            setUser({ username, name, usc_id: uscId, reservation: null, affiliation: "student", image_url: "" });
            router.replace("/map");
          }}
        >
          {mode == "login" ? (
            <Text style={styles.buttonText}>Log in</Text>
          ) : (
            <Text style={styles.buttonText}>Sign up</Text>
          )}
        </TouchableOpacity>

        {/* OR Text */}
        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* Switch to Signup  */}
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => setMode(prev => (prev == "login" ? "signup" : "login"))}
        >
          {mode == "login" ? (
            <Text style={styles.signupText}>Sign up</Text>
          ) : (
            <Text style={styles.signupText}>Log in</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    fontSize: 40,
    alignSelf: "center",
    marginBottom: 20,
  },
  inputField: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
  },
  loginButton: {
    backgroundColor: "#990000",
    height: 45,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  divider: {
    height: 1,
    flex: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: 10,
  },
  signupButton: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  signupText: {
    color: "#990000",
    fontSize: 16,
  },
});

export default LoginView;
