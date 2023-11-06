import React from "react";
import { View, Text, Button } from "react-native";
import { addReservation, cancelReservation } from "../firebaseFunctions";

const me = () => {

  const testFunction = async () => {
    // await addReservation("rohkal", "JFF", "4-6", "today", "haha")
    await cancelReservation("JFF", "rohkal", "-NiXx_PBocyqp_CPrppS");
  } 

  return (
    <View>
      <Text>profile</Text>
      <Button onPress={() => testFunction()} title="Test"/>
    </View>
  );
};

export default me;
