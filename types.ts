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

  availability_inside: number[][];
  availability_outside: number[][];

  imageUrl: string;
};
