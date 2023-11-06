import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { useState } from "react";

const Accordion = ({
  headerText,
  iconName,
  children,
}: {
  headerText: string;
  iconName: string;
  children: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpanded} style={styles.header}>
        <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
          <Icon name={iconName} size={20} color="white" style={styles.icon} />
          <Text style={styles.headerText}>{headerText}</Text>
        </View>
        <Icon name={expanded ? "chevron-up" : "chevron-down"} size={24} color="white" style={styles.icon} />
      </TouchableOpacity>

      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

export default Accordion;

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
  },
  hoursText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
});
