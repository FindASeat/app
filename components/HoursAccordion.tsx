import { View, Text, StyleSheet } from "react-native";
import Accordion from "./Accordion";

const HoursAccordion = () => {
  return (
    <Accordion headerText="Hours" iconName="clock">
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={styles.hoursText}>Mon – Thu</Text>
          <Text style={styles.hoursText}>Friday</Text>
          <Text style={styles.hoursText}>Sat – Sun</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.hoursText}>5:30 AM – 9:30 PM</Text>
          <Text style={styles.hoursText}>6:00 AM – 8:00 PM</Text>
          <Text style={styles.hoursText}>Closed</Text>
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
