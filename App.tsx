// App.js
import React from "react";
import { Keyboard, SafeAreaView, TouchableWithoutFeedback, View } from "react-native";
import LoginView from "./components/LoginView";

const App = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <LoginView />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default App;
