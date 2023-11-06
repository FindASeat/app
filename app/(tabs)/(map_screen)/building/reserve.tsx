import { View, Text } from "react-native";
import SeatingChartView from "../../../../components/SeatingChartView";

const reserve = () => {
  const test_seats = [
    [true, false, true, true],
    [true, true, true, true],
    [true, false, true, false],
  ];

  return (
    <View>
      {/* The title */}
      <Text>Make a reservation</Text>

      {/* Pick a time */}
      {/* Date picker, pick a day from today to the next 1 week */}

      {/* Time picker */}
      {/* Pick a time  */}

      {/* The grid */}
      <SeatingChartView seats={test_seats} />
    </View>
  );
};

export default reserve;
