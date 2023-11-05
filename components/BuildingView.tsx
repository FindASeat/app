import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Image } from "react-native";
import CurrentAvailableAccordion from "./CurrentAvailableAccordion";
import Icon from "react-native-vector-icons/Octicons";
import type { BuildingResponse } from "../types";
import HoursAccordion from "./HoursAccordion";
import { useNavigation } from "expo-router";

const BuildingView = ({ building }: { building: BuildingResponse }) => {
  const nav = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      {/* Back Arrow */}
      <View style={{ backgroundColor: "#990000", paddingVertical: 5, paddingLeft: 5 }}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Icon name="arrow-left" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }}>
        {/* Image + Title */}
        <Image
          source={{ uri: building.image_url }}
          style={{
            height: 150,
          }}
        />
        <View style={{ padding: 10 }}>
          {/* Title */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "black",
            }}
          >
            {building.title} ({building.code})
          </Text>

          {/* Open/Closed */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "500",
              color: "black",
            }}
          >
            {"Open" + " until 8:30PM"}
          </Text>

          {/* % Full */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "500",
              color: "black",
            }}
          >
            {(
              ((building.inside.current_taken + building.outside.current_taken) * 100) /
              (building.inside.num_cols +
                building.inside.num_rows +
                building.outside.num_cols +
                building.outside.num_rows)
            ).toFixed(0) + "% Full"}
          </Text>

          {/* Description */}
          <Text style={{ paddingTop: 15, fontSize: 16 }}>{building.description}</Text>
        </View>

        {/* User's Registration If Exists */}

        {/* Open Hours */}
        <HoursAccordion />

        {/* Availability Outside */}
        <CurrentAvailableAccordion header="Outside" room_info={building.outside} />

        {/* Availability Inside */}
        <CurrentAvailableAccordion header="Inside" room_info={building.inside} />
      </ScrollView>
      {/* Action Button If Not Registered */}
      <TouchableOpacity
        style={{
          backgroundColor: "#990000",
          height: 45,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, color: "white", fontWeight: "700" }}>Reserve a Seat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BuildingView;
