import { Redirect } from "expo-router";
import { View, Text, TouchableWithoutFeedback, Keyboard, SafeAreaView } from "react-native";
import LoginView from "../components/LoginView";

const index = () => {
  // is user logged in?

  const logged_in = false;

  if (!logged_in)
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <LoginView />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
};

export default index;
