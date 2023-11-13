import type { Temporal } from '@js-temporal/polyfill';
import type { LatLng } from 'react-native-maps';

export type Building = {
  title: string; // name of building
  code: string; // building code
  description: string; // description of building (can be from usc maps website)

  coordinate: LatLng; // lat/long of building

  open_hours: [string, 'Closed' | '24 Hours' | [Temporal.PlainTime, Temporal.PlainTime]][]; // string = day/days (like 'Mon' or 'Mon – Thur')
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

export type FirebaseBuilding = {
  title: string;
  description: string;

  coordinate: LatLng;

  open_hours: [string, 'Closed' | '24 Hours' | [string, string]][];
  inside: FirebaseRoomData;
  outside: FirebaseRoomData;

  image_url: string;
};

export type FirebaseRoomData = {
  cols: number;
  rows: number;
};

export type User = {
  usc_id: string;
  name: string;
  affiliation: 'Student' | 'Faculty' | 'Staff';

  username: string;
  image_url: string;

  active_reservation: Reservation | null;
  completed_reservations: Reservation[];
};

export type FirebaseUser = {
  id: string;
  name: string;
  affiliation: 'Student' | 'Faculty' | 'Staff';

  image_url: string;
  password: string;
};

export type Reservation = {
  key: string;

  seat_id: `${number}-${number}`;
  building_code: string;
  area: 'inside' | 'outside';
  status: 'active' | 'completed' | 'canceled';

  start_time: Temporal.PlainDateTime;
  end_time: Temporal.PlainDateTime;

  created_at: Temporal.PlainDateTime;
};

export type FirebaseReservation = {
  seat: `${'inside' | 'outside'}-${number}-${number}`;
  code: string;

  type: 'valid' | 'invalid';

  start: string;
  end: string;

  user: string;

  created_at: string;
};
