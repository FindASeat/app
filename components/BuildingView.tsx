import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import CurrentAvailableAccordion from "./CurrentAvailableAccordion";
import Icon from "react-native-vector-icons/Octicons";
import { useGlobal } from "../context/GlobalContext";
import HoursAccordion from "./HoursAccordion";
import type { Building } from "../types";
import { router } from "expo-router";
import React from "react";

const BuildingView = ({ building }: { building: Building }) => {
  const { user } = useGlobal();
  console.log(user);

  return (
    <View style={{ flex: 1 }}>
      {/* Back Arrow */}
      <View style={{ backgroundColor: "#990000", paddingVertical: 5, paddingLeft: 5 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Image + Title */}
        <Image
          source={{ uri: building.image_url || "" }}
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
            {/* TODO ^ */}
          </Text>

          {/* % Full */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "500",
              color: "black",
            }}
          >
            {(building.total_availability * 100).toFixed(0) + "% Available"}
          </Text>

          {/* Description */}
          <Text style={{ paddingTop: 15, fontSize: 16 }}>{building.description}</Text>
        </View>

        {/* User's Registration If Exists */}
        {/* TODO */}

        {/* Open Hours */}
        <HoursAccordion hours={building.open_hours} />

        {/* Availability Outside */}
        <CurrentAvailableAccordion header="Outside" room_info={building.outside} />

        {/* Availability Inside */}
        <CurrentAvailableAccordion header="Inside" room_info={building.inside} />
      </ScrollView>

      {/* Action Button If Not Registered */}
      <TouchableOpacity
        style={[
          {
            backgroundColor: "#990000",
            height: 45,
            justifyContent: "center",
            alignItems: "center",
          },
          // user!.reservations.filter(r => r.type === "valid" && r.end_time.getTime() > Date.now()).length > 0 && {
          //   opacity: 0.25,
          // },
        ]}
        // disabled={user!.reservations.filter(r => r.type === "valid" && r.end_time.getTime() > Date.now()).length > 0}
        onPress={() => {
          router.push("/(tabs)/(map_screen)/building/reserve");
        }}
      >
        {/* {user!.reservations.filter(r => r.type === "valid" && r.end_time.getTime() > Date.now()).length > 0 ? ( */}
        {/* <Text style={{ fontSize: 16, color: "white", fontWeight: "500" }}>You already have a reservation</Text> */}
        {/* ) : ( */}
        <Text style={{ fontSize: 16, color: "white", fontWeight: "700" }}>Reserve a Seat</Text>
        {/* )} */}
      </TouchableOpacity>
    </View>
  );
};

export default BuildingView;
