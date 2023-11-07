import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { validateCredentials, createUser } from "../app/firebaseFunctions";
import { useGlobal } from "../context/GlobalContext";
import React, { useState } from "react";
import { router } from "expo-router";

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
          onPress={async () => {
            if (mode == "login") {
              const isValid = await validateCredentials(username, password);
              if (isValid) {
                setUser({
                  username,
                  name: name,
                  usc_id: uscId,
                  reservations: [],
                  affiliation: "student",
                  image_url: "",
                });

                router.replace("/map");
              } else {
                alert("Invalid username or password!");
              }
            }

            if (mode == "signup") {
              const isCreated = await createUser(name, uscId, username, password);
              if (isCreated) {
                alert("Account created successfully! Please login!");
                setMode("login");
              } else {
                alert("Failed to create account. Please try again.");
              }
            }
          }}
        >
          <Text style={styles.buttonText}>{mode == "login" ? "Log in" : "Sign up"}</Text>
        </TouchableOpacity>

        {/* OR Text */}
        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* Signup */}
        <TouchableOpacity
          style={styles.signupButton}
          onPress={async () => {
            if (mode === "login") {
              setMode("signup");
            } else {
              const isCreated = await createUser(name, uscId, username, password);
              if (isCreated) {
                alert("Account created successfully! Please login!");
                setMode("login");
              } else {
                alert("Failed to create account. Please try again.");
              }
            }
          }}
        >
          {mode === "login" ? (
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
