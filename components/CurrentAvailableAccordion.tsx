import React from "react";
import type { RoomData } from "../types";
import Accordion from "./Accordion";
import SeatingChartView from "./SeatingChartView";

const CurrentAvailableAccordion = ({ room_info, header }: { header: "Inside" | "Outside"; room_info: RoomData }) => {
  return (
    <Accordion headerText={`Current ${header} – ${(room_info.availability * 100).toFixed(0)}% Available`} iconName="">
      <SeatingChartView seats={room_info.seats} constant />
    </Accordion>
  );
};

export default CurrentAvailableAccordion;
