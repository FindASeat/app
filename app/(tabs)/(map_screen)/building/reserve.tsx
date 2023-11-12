import { addReservation, getSeatAvailability } from "../../../firebaseFunctions";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import SeatingChartView from "../../../../components/SeatingChartView";
import DateTimePicker from "@react-native-community/datetimepicker";
import LocationPicker from "../../../../components/LocationPicker";
import { in_day_range } from "../../../../components/BuildingView";
import { useGlobal } from "../../../../context/GlobalContext";
import TimePicker from "../../../../components/TimePicker";
import Icon from "react-native-vector-icons/Octicons";
import React, { useEffect, useMemo, useState } from "react";
import type { Building } from "../../../../types";
import { Temporal } from "@js-temporal/polyfill";
import { router } from "expo-router";
import DatePicker from "../../../../components/DatePicker";

function is_building_open(open_hours: Building["open_hours"], dt: Temporal.PlainDateTime): boolean {
  const day_of_week = dt.toLocaleString("en-US", { weekday: "short" });
  const today_info = open_hours.find(([days]) => in_day_range(day_of_week, days)) ?? [day_of_week, "Closed"];

  if (today_info[1] === "Closed") return false;
  if (today_info[1] === "24 Hours") return true;

  const [opening_time, closing_time] = today_info[1];
  const opening = Temporal.PlainTime.from(opening_time);
  const closing = Temporal.PlainTime.from(closing_time);

  const t = dt.toPlainTime();
  if (Temporal.PlainTime.compare(t, opening) >= 0 && Temporal.PlainTime.compare(t, closing) < 0) return true;
  return false;
}

const generate_start_times = (hours: Building["open_hours"], picked_date: Temporal.PlainDate): Temporal.PlainTime[] => {
  const weekday = picked_date.toLocaleString("en-US", { weekday: "short" });
  const [_, range] = hours.find(([days]) => in_day_range(weekday, days)) ?? ["", "Closed"];

  if (range === "Closed") return [];

  const same_day = picked_date.equals(Temporal.Now.plainDateISO()) ?? true;
  const now = same_day
    ? Temporal.Now.plainTimeISO().round({
        smallestUnit: "minutes",
        roundingIncrement: 30,
        roundingMode: "ceil",
      })
    : Temporal.PlainTime.from("00:00:00");

  if (range === "24 Hours") return create_times(now, Temporal.PlainTime.from("23:59:59"));

  let [start, end] = range;
  if (Temporal.PlainTime.compare(now, start) > 0 && same_day) start = now;

  return create_times(start, end);
};

const generate_end_times = (
  times: Temporal.PlainTime[],
  picked_start_time: Temporal.PlainTime
): Temporal.PlainTime[] => {
  return times.reduce((acc, time) => {
    if (
      Temporal.PlainTime.compare(time, picked_start_time) >= 0 &&
      Temporal.PlainTime.compare(time, picked_start_time.add({ hours: 1, minutes: 30 })) <= 0
    )
      acc.push(time.add({ minutes: 30 }));
    return acc;
  }, [] as Temporal.PlainTime[]);
};

const create_times = (start: Temporal.PlainTime, end: Temporal.PlainTime) => {
  const length = end.since(start).total({ unit: "minute" }) / 30;
  return Array.from({ length }, (_, i) => start.add({ minutes: i * 30 }));
};

const reserve = () => {
  const { selectedBuilding, user, setUser } = useGlobal();

  const [pickedDate, setPickedDate] = useState(Temporal.Now.plainDateISO());
  const [pickedStartTime, setPickedStartTime] = useState(
    Temporal.Now.plainTimeISO().round({ smallestUnit: "minutes", roundingIncrement: 30, roundingMode: "ceil" })
  );
  const [pickedEndTime, setPickedEndTime] = useState(pickedStartTime.add({ minutes: 30 }));

  const [area, setArea] = useState<"inside" | "outside">("inside");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [loading, setLoading] = useState(true);

  const [validDT, setValidDT] = useState(false);
  const [seats, setSeats] = useState<boolean[][]>([]);

  const times = useMemo(
    () => generate_start_times(selectedBuilding.open_hours, pickedDate),
    [selectedBuilding, pickedDate]
  );

  const end_times = useMemo(() => generate_end_times(times, pickedStartTime), [times, pickedStartTime]);

  useEffect(() => {
    setLoading(true);
    getSeatAvailability(
      {
        code: selectedBuilding?.code,
        inside: selectedBuilding?.inside,
        outside: selectedBuilding?.outside,
      },
      pickedDate.toPlainDateTime(pickedStartTime),
      pickedDate.toPlainDateTime(pickedEndTime)
    )
      .then(building => {
        setSeats(area === "inside" ? building.inside.seats : building.outside.seats);
        setSelectedSeat("");
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, [area, selectedBuilding, pickedDate, pickedStartTime, pickedEndTime]);

  useEffect(() => {
    setValidDT(is_building_open(selectedBuilding?.open_hours, pickedDate.toPlainDateTime(pickedStartTime)));
  }, [selectedBuilding, pickedDate, pickedStartTime]);

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "relative",
          backgroundColor: "#990000",
          paddingVertical: 10,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        {/* Title */}
        <Text style={styles.title}>Reserve a Seat</Text>

        {/* Cancel Button */}
        <TouchableOpacity style={{ position: "absolute", right: 15, top: 10 }} onPress={() => router.back()}>
          <Icon name="x" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      <Text style={{ fontSize: 18, fontWeight: "400", color: "#333", paddingBottom: 1, paddingHorizontal: 5 }}>
        Start Date
      </Text>
      <DatePicker setPickedDate={setPickedDate} pickedDate={pickedDate} />

      {/* Start Time picker */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "400",
          color: "#333",
          paddingBottom: 1,
          paddingHorizontal: 5,
          paddingTop: 20,
        }}
      >
        Start Time
      </Text>
      <TimePicker times={times} setPickedTime={setPickedStartTime} pickedTime={pickedStartTime} />

      {/* End Time picker */}
      <Text
        style={[
          {
            fontSize: 18,
            fontWeight: "400",
            color: "#333",
            paddingBottom: 1,
            paddingHorizontal: 5,
            paddingTop: 20,
          },
          !validDT && { opacity: 0.25 },
        ]}
      >
        End Time
      </Text>
      <View style={[!validDT && { opacity: 0.25 }]}>
        <TimePicker times={end_times} setPickedTime={setPickedEndTime} pickedTime={pickedEndTime} />
      </View>

      {/* Location Picker */}
      <Text
        style={[
          {
            fontSize: 18,
            fontWeight: "400",
            color: "#333",
            paddingHorizontal: 5,
            paddingTop: 20,
            paddingBottom: 1,
          },
          !validDT && { opacity: 0.25 },
        ]}
      >
        Location
      </Text>
      <View style={[styles.locContainer, !validDT && { opacity: 0.25 }]}>
        <LocationPicker location={area} setLocation={setArea} />
      </View>

      {/* Seat Grid */}
      <Text
        style={[
          {
            fontSize: 18,
            fontWeight: "400",
            color: "#333",
            paddingHorizontal: 5,
            paddingTop: 20,
            paddingBottom: 1,
          },
          !validDT && { opacity: 0.25 },
        ]}
      >
        Pick a Seat
      </Text>
      <View style={[{ backgroundColor: "#CCC", paddingVertical: 30 }, (!validDT || loading) && { opacity: 0.25 }]}>
        <SeatingChartView
          readonly={!validDT || loading}
          seats={seats}
          selectedSeat={selectedSeat}
          setSelectedSeat={setSelectedSeat}
        />
      </View>

      {/* TODO: If we have time do a seat confirmation with day and time */}

      {/* Reserve button */}
      <TouchableOpacity
        disabled={!validDT || selectedSeat === ""}
        style={[styles.reserveButton, selectedSeat === "" && { opacity: 0.25 }]}
        onPress={async () => {
          if (selectedSeat === "" || !validDT) {
            alert("Please select a valid time and seat.");
            return;
          }

          const res = await addReservation(user.username, {
            area,
            building_code: selectedBuilding.code,
            start_time: pickedDate.toPlainDateTime(pickedStartTime),
            end_time: pickedDate.toPlainDateTime(pickedEndTime),
            seat_id: selectedSeat as `${number}-${number}`,
            status: "active",
          });

          if (res) {
            setUser(user => ({ ...user, active_reservation: res }));
            router.push("/(tabs)/(map_screen)/map");
          }
        }}
      >
        <Text style={styles.buttonText}>Reserve</Text>
      </TouchableOpacity>
    </View>
  );
};

export default reserve;

const styles = StyleSheet.create({
  locContainer: {
    paddingVertical: 10,
    backgroundColor: "#BBB",
  },
  locButton: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    backgroundColor: "#990000",
    flexGrow: 1,
  },
  reserveButton: {
    backgroundColor: "#990000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
