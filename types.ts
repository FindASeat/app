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

  open_hours: Record<string, [string, string]>; // key = day/days (like 'Mon' or 'Mon – Thur'), value = [time (like '8:00 AM'), time (like '5:00 PM'))]
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
  affiliation: "student" | "faculty" | "staff";

  username: string;
  image_url: string | null;

  reservation: Reservation | null;
};

export type Reservation = {
  seat_id: string; // should be `${row}-${col}`
  building_code: string;
  area: "inside" | "outside";
  start_time: string; // datetime
  end_time: string; // datetime
};