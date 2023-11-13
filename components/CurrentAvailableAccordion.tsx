import SeatingChartView from './SeatingChartView';
import type { RoomData } from '../types';
import Accordion from './Accordion';

const CurrentAvailableAccordion = ({ room_info, header }: { header: 'Inside' | 'Outside'; room_info: RoomData }) => {
  return (
    <Accordion headerText={`Current ${header} – ${(room_info.availability * 100).toFixed(0)}% Available`} iconName="">
      <SeatingChartView seats={room_info.seats} readonly />
    </Accordion>
  );
};

export default CurrentAvailableAccordion;
