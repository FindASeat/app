import { ref, set, child, get, push, remove } from "firebase/database";
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

async function hashPassword(password) {
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

// TODO: Currently randomly produces availability. Need to check reservations for true availability of building.
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

export async function isSeatAvailable(buildingCode, seat, startTime, endTime) {
  const reservationsSnapshot = await get(child(ref(FIREBASE_DB), `reservations/${buildingCode}`));
  if (reservationsSnapshot.exists()) {
    const reservations = reservationsSnapshot.val();
    const start = new Date(startTime);
    const end = new Date(endTime);
    for (const reservation of reservations) {
      const reservationStart = new Date(reservation.start);
      const reservationEnd = new Date(reservation.end);
      if (reservation.seat === seat && start < reservationEnd && end > reservationStart) {
        return false;
      }
    }
  }
  return true;
}

export async function addReservation(username, code, seat, start, end) {
  const reservation = {
    user: username.toLowerCase(),
    seat,
    start,
    end,
  };
  try {
    const seatAvailable = await isSeatAvailable(code, seat, start, end);
    if (!seatAvailable) {
      console.error('This seat is already reserved for the given time period.');
      return;
    }

    const newReservationRef = push(child(ref(FIREBASE_DB), 'reservations'));
    const reservationId = newReservationRef.key;

    await set(ref(FIREBASE_DB, `reservations/${code}/${reservationId}`), reservation);
    await set(ref(FIREBASE_DB, `reservations/${username}/${reservationId}`), reservation);

    alert("Successfully added reservation!");
    return true;
  } catch (error) {
    console.error("ERROR: ", error);
    alert("Error adding reservation! Please try again!");
    return false;
  }
}

export async function cancelReservation(buildingCode, user, reservationId) {
  try {
    const reservationCodeRef = ref(FIREBASE_DB, `reservations/${buildingCode}/${reservationId}`);
    const reservationUserRef = ref(FIREBASE_DB, `reservations/${user}/${reservationId}`);
    await remove(reservationCodeRef);
    await remove(reservationUserRef)
    console.log(`Reservation ${reservationId} has been cancelled.`);
  } catch (error) {
    console.error(`Error cancelling reservation: ${error}`);
  }
}