import type { RoomSeats } from "../types";
import Accordion from "./Accordion";
import SeatingChartView from "./SeatingChartView";

const CurrentAvailableAccordion = ({ room_info, header }: { header: "Inside" | "Outside"; room_info: RoomSeats }) => {
  return (
    <Accordion
      headerText={`Current ${header} – ${(
        (room_info.current_taken * 100) /
        (room_info.num_cols * room_info.num_rows)
      ).toFixed(0)}% Available`}
      iconName=""
    >
      <SeatingChartView availability={room_info.availability} constant />
    </Accordion>
  );
};

export default CurrentAvailableAccordion;
