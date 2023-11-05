import { Keyboard, SafeAreaView, TouchableWithoutFeedback, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

const building = () => {
  const { code } = useLocalSearchParams<{ code: string }>();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Text>Building {code}!!</Text>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default building;
