import { ref, set, child, get } from "firebase/database";
import { FIREBASE_DB } from '../firebaseConfig';

export async function validateCredentials(inputUsername, inputPassword) {
  const usernameLower = inputUsername.toLowerCase();
  const usersSnapshot = await get(child(ref(FIREBASE_DB), `users`));
  if (usersSnapshot.exists()) {
    const users = usersSnapshot.val();
    const userKey = Object.keys(users).find((key) => key.toLowerCase() === usernameLower);
    if (userKey) {
      const userData = users[userKey];
            return userData.password === inputPassword;
    }
  }
  return false;
}

export async function createUser(name, id, username, password) {
  const usernameKey = username.toLowerCase();
  const userData = {
    id,
    name,
    password: hashPassword(password),
  };
  try {
    await set(ref(FIREBASE_DB, `users/${usernameKey}`), userData);
    return true; 
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
}

function hashPassword(password) {
  return password;
}

export async function getBuildings() {
  const buildingsSnapshot = await get(child(ref(FIREBASE_DB), 'buildings'));
  if (buildingsSnapshot.exists()) {
    const buildingsObject = buildingsSnapshot.val();
    const buildingsArray = Object.keys(buildingsObject).map((code) => ({
      ...buildingsObject[code],
      code
    }));
    return buildingsArray;
  }
  return [];
}

const updateSeatsAndAvailability = (rows, cols) => {
  const seats = [];
  let availableSeats = 0;

  for (let i = 0; i < rows; i++) {
    seats[i] = [];
    for (let j = 0; j < cols; j++) {
      seats[i][j] = Math.random() >= 0.5;
      if (seats[i][j]) {
        availableSeats++;
      }
    }
  }
  const availability = availableSeats / (rows * cols);
  return { seats, availability };
};

// Currently randomly produces availability.
export async function fetchBuilding(buildingCode) {
  try {
    const buildingSnapshot = await get(child(ref(FIREBASE_DB), `buildings/${buildingCode}`));
    if (buildingSnapshot.exists()) {
      let building = buildingSnapshot.val();

      building.inside = {
        ...building.inside,
        ...updateSeatsAndAvailability(building.inside.rows, building.inside.cols),
      };
      building.outside = {
        ...building.outside,
        ...updateSeatsAndAvailability(building.outside.rows, building.outside.cols),
      };

      const totalSeats = (building.inside.rows * building.inside.cols) + (building.outside.rows * building.outside.cols);
      const totalAvailableSeats = (building.inside.availability * building.inside.rows * building.inside.cols) + (building.outside.availability * building.outside.rows * building.outside.cols);
      building.total_availability = totalAvailableSeats / totalSeats;

      return {
        ...building,
        code: buildingCode,
      };

    } else {
      console.error(`Building with code ${buildingCode} does not exist.`);
      return null;
    }
  } catch (error) {
    console.error("Error retrieving building:", error);
    return null;
  }
}

// // export async function reserveSeat(userId: string, buildingId: number, seatCode: string, reservationStart: Date, reservationEnd: Date): Promise<boolean> {
// //   // Check if the seat is already taken
// //   const reservationSnapshot = await get(child(ref(FIREBASE_DB), 'reservations'));
// //   const reservations = reservationSnapshot.val();
// //   for (const reservationKey in reservations) {
// //     const reservation = reservations[reservationKey];
// //     if (reservation.seat_code === seatCode && reservation.building_id === buildingId) {
// //       return false; // Seat is already taken
// //     }
// //   }

// //   // Create a new reservation
// //   const newReservationKey = ref(FIREBASE_DB, 'reservations').push().key;
// //   set(ref(FIREBASE_DB, `reservations/${newReservationKey}`), {
// //     seat_code: seatCode,
// //     reservation_start: reservationStart.toISOString(),
// //     reservation_end: reservationEnd.toISOString(),
// //     building_id: buildingId,
// //     user_id: userId
// //   });

// //   return true; // Seat reservation successful
// // }

// export async function cancelReservation(userId: string, seatCode: string): Promise<boolean> {
//   const reservationSnapshot = await get(child(ref(FIREBASE_DB), 'reservations'));
//   const reservations = reservationSnapshot.val();
//   for (const reservationKey in reservations) {
//     const reservation = reservations[reservationKey];
//     if (reservation.seat_code === seatCode && reservation.user_id === userId) {
//       set(ref(FIREBASE_DB, `reservations/${reservationKey}`), null);
//       return true; // Reservation canceled successfully
//     }
//   }

//   return false; // Reservation not found or user does not have permission to cancel
// }
