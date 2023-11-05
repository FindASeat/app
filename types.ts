import type { LatLng } from "react-native-maps";

export type Building = {
  title: string;
  code: string;
  coordinate: LatLng;
  availability?: number;
};

export type BuildingResponse = {
  title: string;
  code: string;
  description: string;

  inside: RoomSeats;
  outside: RoomSeats;

  image_url: string;
};

export type RoomSeats = {
  num_cols: number;
  num_rows: number;
  current_taken: number;
  availability: boolean[][];
};
