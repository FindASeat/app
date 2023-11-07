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
    password: password,
  };
  try {
    await set(ref(FIREBASE_DB, `users/${usernameKey}`), userData);
    return true; 
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
}

// async function hashPassword(password) {
//   return password;
// }


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

export async function fetchBuilding(buildingCode) {
  try {
    const buildingSnapshot = await get(child(ref(FIREBASE_DB), `buildings/${buildingCode}`));
    const reservationsSnapshot = await get(child(ref(FIREBASE_DB), `reservations/${buildingCode}`));
    if (buildingSnapshot.exists()) {
      let building = buildingSnapshot.val();
      let reservations = reservationsSnapshot.exists() ? reservationsSnapshot.val() : {};
      building.inside.seats = Array(building.inside.rows).fill(undefined).map(() => Array(building.inside.cols).fill(true));
      building.outside.seats = Array(building.outside.rows).fill(undefined).map(() => Array(building.outside.cols).fill(true));
      for (let reservationId in reservations) {
        let reservation = reservations[reservationId];
        let [type, row, col] = reservation.seat.split('-');
        row = parseInt(row);
        col = parseInt(col);
        console.log(row, col)
        if (type === 'inside') {
          building.inside.seats[row][col] = false;
        } else if (type === 'outside') {
          building.outside.seats[row][col] = false;
        }
      }
      building.inside.availability = building.inside.seats.reduce((acc, val) => acc.concat(val), []).filter(seat => seat).length / (building.inside.rows * building.inside.cols);
      building.outside.availability = building.outside.seats.reduce((acc, val) => acc.concat(val), []).filter(seat => seat).length / (building.outside.rows * building.outside.cols);const totalSeats = (building.inside.rows * building.inside.cols) + (building.outside.rows * building.outside.cols);
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
    for (const reservationId in reservations) {
      const reservation = reservations[reservationId];
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
    code,
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
  const userLower = user.toLowerCase();
  try {
    const reservationCodeRef = ref(FIREBASE_DB, `reservations/${buildingCode}/${reservationId}`);
    const reservationUserRef = ref(FIREBASE_DB, `reservations/${userLower}/${reservationId}`);
    await remove(reservationCodeRef);
    await remove(reservationUserRef);
    console.log(`Reservation ${reservationId} has been cancelled.`);
  } catch (error) {
    console.error(`Error cancelling reservation: ${error}`);
  }
}


export async function getUserInfo(username) {
  const usernameLower = username.toLowerCase();
  const userSnapshot = await get(child(ref(FIREBASE_DB), `users/${usernameLower}`));
  if (userSnapshot.exists()) {
    return userSnapshot.val();
  } else {
    console.error(`User with username ${username} does not exist.`);
    return null;
  }
}

export async function getUserReservations(username) {
  const usernameLower = username.toLowerCase();
  const reservationsSnapshot = await get(child(ref(FIREBASE_DB), `reservations/${usernameLower}`));
  if (reservationsSnapshot.exists()) {
    const reservationsObject = reservationsSnapshot.val();
    const reservationsArray = Object.keys(reservationsObject).map((id) => ({
      ...reservationsObject[id],
      id
    }));
    return reservationsArray;
  } else {
    console.log(`No reservations found for user ${username}.`);
    return [];
  }
}