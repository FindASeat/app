import { ref, set, child, get } from "firebase/database";
import { FIREBASE_DB } from '../firebaseConfig';

interface User {
  uscId: string;
  name: string;
  affiliation: string;
  photo: string;
  createdAt: string;
}

interface Building {
  id: number;
  name: string;
  acronym: string;
  daysOpen: string;
  hoursOpen: string;
  rowsI: number;
  colsI: number;
  rowsO: number;
  colsO: number;
  currentTakenI: number;
  currentTakenO: number;
}

export async function writeUserData(userId: string, affiliation: string, createdAt: string, name: string, photo: string, uscId: string) {
  set(ref(FIREBASE_DB, 'users/' + userId), {
    affiliation,
    createdAt,
    name,
    photo,
    uscId
  });
};

export async function getUserById(userId: string): Promise<User | null> {
  const snapshot = await get(child(ref(FIREBASE_DB), `users/${userId}`));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
}

export async function getBuildingById(buildingId: number): Promise<Building | null> {
  const snapshot = await get(child(ref(FIREBASE_DB), `buildings/${buildingId}`));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
}

// export async function reserveSeat(userId: string, buildingId: number, seatCode: string, reservationStart: Date, reservationEnd: Date): Promise<boolean> {
//   // Check if the seat is already taken
//   const reservationSnapshot = await get(child(ref(FIREBASE_DB), 'reservations'));
//   const reservations = reservationSnapshot.val();
//   for (const reservationKey in reservations) {
//     const reservation = reservations[reservationKey];
//     if (reservation.seat_code === seatCode && reservation.building_id === buildingId) {
//       return false; // Seat is already taken
//     }
//   }

//   // Create a new reservation
//   const newReservationKey = ref(FIREBASE_DB, 'reservations').push().key;
//   set(ref(FIREBASE_DB, `reservations/${newReservationKey}`), {
//     seat_code: seatCode,
//     reservation_start: reservationStart.toISOString(),
//     reservation_end: reservationEnd.toISOString(),
//     building_id: buildingId,
//     user_id: userId
//   });

//   return true; // Seat reservation successful
// }

export async function cancelReservation(userId: string, seatCode: string): Promise<boolean> {
  const reservationSnapshot = await get(child(ref(FIREBASE_DB), 'reservations'));
  const reservations = reservationSnapshot.val();
  for (const reservationKey in reservations) {
    const reservation = reservations[reservationKey];
    if (reservation.seat_code === seatCode && reservation.user_id === userId) {
      set(ref(FIREBASE_DB, `reservations/${reservationKey}`), null);
      return true; // Reservation canceled successfully
    }
  }

  return false; // Reservation not found or user does not have permission to cancel
}