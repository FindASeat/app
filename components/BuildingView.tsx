import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import CurrentAvailableAccordion from "./CurrentAvailableAccordion";
import HoursAccordion, { format_time } from "./HoursAccordion";
import Icon from "react-native-vector-icons/Octicons";
import { useGlobal } from "../context/GlobalContext";
import { Temporal } from "@js-temporal/polyfill";
import type { Building } from "../types";
import { router } from "expo-router";
import React from "react";

export function in_day_range(today: string, range: string): boolean {
  // Range is one day fully written or multiday separted by '–'
  const res = range.split(" – ");
  if (res.length === 1) return range.includes(today);

  // Check if a day is in a range of days
  const [start, end] = res;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const start_idx = days.indexOf(start);
  const end_idx = days.indexOf(end);
  const today_idx = days.indexOf(today);
  return start_idx <= today_idx && today_idx <= end_idx;
}

const BuildingView = ({ building }: { building: Building }) => {
  const { user } = useGlobal();

  const display_hours = (): string => {
    const now = Temporal.Now.plainTimeISO();
    const today = Temporal.Now.plainDateISO().toLocaleString("en-US", { weekday: "short" });

    // Find the opening hours for today
    const today_info = building.open_hours.find(([days]) => in_day_range(today, days)) ?? [today, "Closed"];

    if (today_info[1] === "Closed") return "Closed";
    if (today_info[1] === "24 Hours") return "Open 24 hours";

    const [opening_time, closing_time] = today_info[1];
    const opening = Temporal.PlainTime.from(opening_time);
    const closing = Temporal.PlainTime.from(closing_time);

    if (Temporal.PlainTime.compare(now, opening) >= 0 && Temporal.PlainTime.compare(now, closing) < 0)
      return `Open until ${format_time(closing)}`;
    if (Temporal.PlainTime.compare(now, opening) < 0) return `Open at ${format_time(opening)}`;

    return "Closed";
  };

  const hours = display_hours();

  return (
    <View style={{ flex: 1 }}>
      {/* Back Arrow */}
      <View style={{ backgroundColor: "#990000", paddingVertical: 5, paddingLeft: 10 }}>
        <TouchableOpacity onPress={() => router.back()}>
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

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            {/* Open/Closed */}
            <View
              style={[
                {
                  padding: 10,
                  backgroundColor: "#DDD",
                  borderRadius: 5,
                  width: hours === "Closed" || hours.includes("Open at") ? "100%" : "49.5%",
                  alignItems: "center",
                },
                hours === "Closed" && { backgroundColor: "#CB9797" },
                hours === "Open 24 hours" && { backgroundColor: "#AEE1A9" },
                hours.includes("Open until") && { backgroundColor: "#AEE1A9" },
              ]}
            >
              <Text
                style={[
                  {
                    fontSize: 18,
                    fontWeight: "600",
                    color: "black",
                  },
                  hours === "Closed" && { color: "#990000" },
                  hours === "Open 24 hours" && { color: "green" },
                  hours.includes("Open until") && { color: "green" },
                ]}
              >
                {hours}
              </Text>
            </View>

            {/* % Available */}
            {hours !== "Closed" && !hours.includes("Open at") && (
              <View
                style={{
                  padding: 10,
                  backgroundColor:
                    building.total_availability < 0.25
                      ? "#CB9797"
                      : building.total_availability < 0.5
                      ? "#FFEACB"
                      : "#AEE1A9",
                  borderRadius: 5,
                  width: "49.5%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={[
                    {
                      fontSize: 18,
                      fontWeight: "600",
                      color:
                        building.total_availability < 0.25
                          ? "#990000"
                          : building.total_availability < 0.5
                          ? "orange"
                          : "green",
                    },
                  ]}
                >
                  {(building.total_availability * 100).toFixed(0) + "% Available"}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={{ paddingTop: 15, fontSize: 16 }}>{building.description}</Text>
        </View>

        {/* Open Hours */}
        <HoursAccordion hours={building.open_hours} />

        {/* Availability Outside */}
        {hours !== "Closed" && !hours.includes("Open at") && (
          <CurrentAvailableAccordion header="Outside" room_info={building.outside} />
        )}

        {/* Availability Inside */}
        {hours !== "Closed" && !hours.includes("Open at") && (
          <CurrentAvailableAccordion header="Inside" room_info={building.inside} />
        )}
      </ScrollView>

      {/* Action Button If Not Reserved */}
      {/* User's Registration If Exists */}
      {/* {!user?.active_reservation && ( */}
      <TouchableOpacity
        style={[
          {
            backgroundColor: "#990000",
            height: 45,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
        // disabled={!!user?.active_reservation}
        onPress={() => {
          router.push("/(tabs)/(map_screen)/building/reserve");
        }}
      >
        <Text style={{ fontSize: 16, color: "white", fontWeight: "700" }}>Reserve a Seat</Text>
      </TouchableOpacity>
      {/* )} */}
    </View>
  );
};

export default BuildingView;
