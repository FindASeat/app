import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import type { BuildingResponse } from "../types";
import { useNavigation } from "expo-router";

const BuildingView = ({ building }: { building: BuildingResponse }) => {
  const nav = useNavigation();

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Back Arrow */}
      <View style={{ backgroundColor: "#990000", paddingVertical: 5, paddingLeft: 5 }}>
        <TouchableOpacity
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,

            elevation: 8,
          }}
          onPress={() => nav.goBack()}
        >
          <Icon name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Image + Title */}
      <ImageBackground
        source={{ uri: building.imageUrl }}
        style={{
          height: 150,
          justifyContent: "center", // Align the title to the bottom of the image
        }}
      >
        <View style={{ padding: 10 }}>
          {/* Code */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "500",
              color: "white",

              textShadowColor: "rgba(0, 0, 0, 0.75)",
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 10,
            }}
          >
            {building.code}
          </Text>

          {/* Title */}
          <Text
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color: "white",

              textShadowColor: "rgba(0, 0, 0, 0.75)",
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 10,
            }}
          >
            {building.title}
          </Text>
        </View>
      </ImageBackground>

      {/* User's Registration If Exists */}

      {/* Description */}
      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 16 }}>
          <Text style={{ fontStyle: "italic", fontWeight: "500" }}>About:</Text> {building.description}
        </Text>
      </View>

      {/* Open Hours */}
      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 16 }}>
          <Text style={{ fontStyle: "italic", fontWeight: "500" }}>Open:</Text> {building.description}
        </Text>
      </View>

      {/* Availability Outside */}
      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 16 }}>
          <Text style={{ fontStyle: "italic", fontWeight: "500" }}>Availability Outside:</Text> {building.description}
        </Text>
      </View>

      {/* Availability Inside */}
      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 16 }}>
          <Text style={{ fontStyle: "italic", fontWeight: "500" }}>Availability Inside:</Text> {building.description}
        </Text>
      </View>

      {/* Action Button If Not Registered */}
      <TouchableOpacity
        style={{
          backgroundColor: "#990000",
          height: 45,
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 15,
        }}
      >
        <Text style={{ fontSize: 16, color: "white", fontWeight: "700" }}>Reserve a Seat</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BuildingView;
