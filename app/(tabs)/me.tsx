import React from "react";
import { View, Text, Button } from "react-native";
import { writeUserData, getUserById } from "../firebaseFunctions";

const me = () => {

  const testFunction = async () => {
    await writeUserData("0", "Student", "now", "Rohan", "something.png", "24351342");
  } 

  return (
    <View>
      <Text>profile</Text>
      <Button onPress={() => testFunction()} title="Test"/>
    </View>
  );
};



export default me;
