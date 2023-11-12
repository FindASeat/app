import { TouchableWithoutFeedback, Keyboard, SafeAreaView } from "react-native";
import LoginView from "../components/LoginView";
import React from "react";
import { router } from "expo-router";

const index = () => {
  // use local storage to check if user is logged in
  const logged_in = false;
  if (logged_in) router.replace("/map");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <LoginView />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default index;
