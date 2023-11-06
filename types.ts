import type { LatLng } from "react-native-maps";

export type MapMarker = {
  code: string; // building code
  coordinate: LatLng; // lat/long of building

  total_availability: number; // percentage (0 to 1) of availability of inside & outside
};

export type Building = {
  title: string; // name of building
  code: string; // building code
  description: string; // description of building (can be from usc maps website)

  inside: RoomData;
  outside: RoomData;

  total_availability: number; // percentage (0 to 1) of availability of inside & outside

  image_url: string; // url to image of building
};

export type RoomData = {
  cols: number; // number of columns
  rows: number; // number of rows

  availability: number; // percentage (0 to 1)

  seats: boolean[][]; // array[row][col] of seats (true = available, false = taken)
};

export type User = {
  usc_id: string;
  name: string;

  username: string;
  image_url: string | null;

  reservation: Reservation | null;
};

export type Reservation = {
  seat_id: string; // should be `${row}-${col}`
  building_code: string;

  start_time: string; // datetime
  end_time: string; // datetime
};
