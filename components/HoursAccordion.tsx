import { View, Text, StyleSheet } from "react-native";
import type { Building } from "../types";
import Accordion from "./Accordion";

const HoursAccordion = ({ hours }: { hours: Building["open_hours"] }) => {
  return (
    <Accordion headerText="Hours" iconName="clock">
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          {Object.entries(hours).map(([day]) => (
            <Text style={styles.hoursText}>{day}</Text>
          ))}
        </View>
        <View style={{ alignItems: "flex-end" }}>
          {Object.entries(hours).map(([_, time]) => (
            <Text style={styles.hoursText}>{typeof time === "string" ? time : `${time[0]} – ${time[1]}`}</Text>
          ))}
        </View>
      </View>
    </Accordion>
  );
};

export default HoursAccordion;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    borderRadius: 5,
    margin: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  headerText: {
    color: "white",
    fontSize: 18,
  },
  statusText: {
    color: "green",
    fontSize: 18,
  },
  content: {
    padding: 10,
    backgroundColor: "#444",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  hoursText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
});
