import { ref, set, child, get, push, remove, update } from "firebase/database";
import { Temporal } from "@js-temporal/polyfill";
import { FIREBASE_DB } from "../firebaseConfig";
import type {
  Building,
  FirebaseBuilding,
  FirebaseReservation,
  FirebaseRoomData,
  FirebaseUser,
  Reservation,
  RoomData,
  User,
} from "../types";

const db_ref = ref(FIREBASE_DB);

export async function validateCredentials(input_username: string, input_password: string): Promise<User | null> {
  input_username = input_username.toLowerCase();

  const usersSnapshot = await get(child(db_ref, `users`));
  if (usersSnapshot.exists()) {
    const users = usersSnapshot.val() as Record<User["username"], FirebaseUser>;

    const user = users[input_username];
    if (user && input_password === user.password) {
      console.log("User Found: ", user);

      const reservatons = await getUserReservations(input_username);

      return {
        username: input_username,
        name: user.name,
        affiliation: user.affiliation,
        active_reservation: reservatons.find(r => r.status === "active") ?? null,
        completed_reservations: reservatons.filter(r => r.status === "completed"),
        cancelled_reservations: reservatons.filter(r => r.status === "cancelled"),
        image_url: user.image_url,
        usc_id: user.id,
      };
    }
  }

  console.log("User Not Found");
  return null;
}

export async function getUserReservations(username: string): Promise<Reservation[]> {
  const user_reservations = await get(child(db_ref, `reservations/${username}`));
  if (user_reservations.exists())
    return Object.entries(user_reservations.val() as Record<string, FirebaseReservation>).map(([key, r]) => ({
      key,
      building_code: r.code,
      start_time: Temporal.PlainDateTime.from(r.start),
      end_time: Temporal.PlainDateTime.from(r.end),
      area: r.seat.split("-")[0] as "inside" | "outside",
      seat_id: r.seat.split("-").slice(1).join("-") as `${number}-${number}`,
      status: r.type === "invalid" ? "cancelled" : new Date(r.end).getTime() < Date.now() ? "completed" : "active",
    }));

  return [];
}

export async function createUser(username: string, user: FirebaseUser): Promise<User | null> {
  username = username.toLowerCase();

  if (await isUsernameTaken(username)) {
    alert("Username is taken.");
    return null;
  }

  await set(child(db_ref, `users/${username}`), user).catch(err => console.error("Error creating user: ", err));
  console.log("User Created: ", user);

  return {
    username,
    active_reservation: null,
    completed_reservations: [],
    cancelled_reservations: [],
    usc_id: user.id,
    name: user.name,
    image_url: user.image_url,
    affiliation: user.affiliation,
  };
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const snapshot = await get(child(db_ref, `users`));

  if (snapshot.exists()) {
    const users = snapshot.val() as Record<User["username"], FirebaseUser>;
    if (users[username] !== undefined) return true; // Username is taken
  }

  return false; // Username is not taken
}

export async function getBuildings(): Promise<Record<Building["code"], Building>> {
  const snapshot = await get(child(db_ref, "buildings"));

  if (snapshot.exists()) {
    const buildings = snapshot.val() as Record<string, FirebaseBuilding>;
    const to_return: Record<Building["code"], Building> = {};

    for (const [code, b] of Object.entries(buildings)) {
      const { inside, outside, total } = await getSeatAvailability(
        { code, inside: b.inside, outside: b.outside },
        Temporal.Now.plainDateTimeISO()
      );

      const hours = b.open_hours.map(([days, time]) => {
        if (time === "Closed" || time === "24 Hours") return [days, time];
        return [days, [Temporal.PlainTime.from(time[0]), Temporal.PlainTime.from(time[1])]];
      }) as [string, "Closed" | [Temporal.PlainTime, Temporal.PlainTime]][];

      to_return[code] = {
        code,
        inside,
        outside,
        title: b.title,
        image_url: b.image_url,
        coordinate: b.coordinate,
        open_hours: hours,
        total_availability: total,
        description: b.description,
      };
    }

    return to_return;
  }

  return {};
}

export const getSeatAvailability = async (
  {
    code,
    inside,
    outside,
  }: { code: string; inside: { rows: number; cols: number }; outside: { rows: number; cols: number } },
  at_time: Temporal.PlainDateTime,
  end_time?: Temporal.PlainDateTime
): Promise<{ inside: RoomData; outside: RoomData; total: number }> => {
  const snapshot = await get(child(db_ref, `reservations/${code}`));
  if (!snapshot.exists()) {
    return {
      inside: {
        ...inside,
        availability: 1,
        seats: Array(inside.rows).fill(Array(inside.cols).fill(true)),
      },
      outside: {
        ...outside,
        availability: 1,
        seats: Array(outside.rows).fill(Array(outside.cols).fill(true)),
      },
      total: 1,
    };
  }

  const reservations = snapshot.val() as Record<string, FirebaseReservation>;

  const inside_capacity = inside.rows * inside.cols;
  const outside_capacity = outside.rows * outside.cols;
  const total_capacity = inside_capacity + outside_capacity;

  const inside_seats: boolean[][] = Array.from({ length: inside.rows }, () => Array(inside.cols).fill(true));
  const outside_seats: boolean[][] = Array.from({ length: outside.rows }, () => Array(outside.cols).fill(true));

  let inside_count = 0;
  let outside_count = 0;

  end_time = end_time ?? at_time;
  for (const r of Object.values(reservations)) {
    const r_start = Temporal.PlainDateTime.from(r.start);
    const r_end = Temporal.PlainDateTime.from(r.end);

    if (r.type !== "valid") continue;

    const isOverlapping =
      Temporal.PlainDateTime.compare(r_start, end_time) < 0 && Temporal.PlainDateTime.compare(r_end, at_time) > 0;
    if (!isOverlapping) continue;

    const [area, row, col] = r.seat.split("-");
    if (area === "inside" && inside_seats[row][col]) {
      inside_count++;
      inside_seats[row][col] = false;
    }
    if (area === "outside" && outside_seats[row][col]) {
      outside_count++;
      outside_seats[row][col] = false;
    }
  }

  return {
    inside: {
      ...inside,
      availability: 1 - inside_count / inside_capacity,
      seats: inside_seats,
    },
    outside: {
      ...outside,
      availability: 1 - outside_count / outside_capacity,
      seats: outside_seats,
    },
    total: 1 - (inside_count + outside_count) / total_capacity,
  };
};

export async function getBuilding(code: Building["code"]): Promise<Building | null> {
  const snapshot = await get(child(db_ref, `buildings/${code}`));

  if (snapshot.exists()) {
    const b = snapshot.val() as FirebaseBuilding;

    const { inside, outside, total } = await getSeatAvailability(
      { code, inside: b.inside, outside: b.outside },
      Temporal.Now.plainDateTimeISO()
    );

    const hours = b.open_hours.map(([days, time]) => {
      if (time === "Closed" || time === "24 Hours") return [days, time];
      return [days, [Temporal.PlainTime.from(time[0]), Temporal.PlainTime.from(time[1])]];
    }) as [string, "Closed" | [Temporal.PlainTime, Temporal.PlainTime]][];

    return {
      code,
      inside,
      outside,
      title: b.title,
      image_url: b.image_url,
      coordinate: b.coordinate,
      open_hours: hours,
      total_availability: total,
      description: b.description,
    };
  }

  return null;
}

export async function addReservation(username: string, res: Omit<Reservation, "key">): Promise<Reservation | null> {
  const f_res: FirebaseReservation = {
    code: res.building_code,
    seat: `${res.area}-${res.seat_id}`,
    start: res.start_time.toString(),
    end: res.end_time.toString(),
    type: "valid",
    user: username,
  };

  const res_ref = push(child(db_ref, "reservations")).key.replace(/[.#$\/\[\]]/g, "_");

  return await update(db_ref, {
    [`reservations/${f_res.code}/${res_ref}`]: f_res,
    [`reservations/${username}/${res_ref}`]: f_res,
  })
    .then(() => {
      alert("Reservation added successfully!");
      return { ...res, key: res_ref };
    })
    .catch(err => {
      alert("Error adding reservation! Please try again!");
      return null;
    });
}

export async function cancelReservation(code: Building["code"], username: string, res_id: Reservation["key"]) {
  username = username.toLowerCase();

  const r_code_ref = child(db_ref, `reservations/${code}/${res_id}`);
  const r_user_ref = child(db_ref, `reservations/${username}/${res_id}`);
  await remove(r_code_ref).catch(err => console.error("Error cancelling reservation: ", err));
  await update(r_user_ref, { type: "invalid" }).catch(err => console.error("Error cancelling reservation: ", err));

  console.log(`Reservation ${res_id} has been marked as invalid.`);
}

export async function getUserInfo(username: string): Promise<User | null> {
  username = username.toLowerCase();

  const snapshot = await get(child(db_ref, `users/${username}`));
  if (snapshot.exists()) {
    const user = snapshot.val();

    const reservatons = await getUserReservations(username);

    return {
      username: username,
      name: user.name,
      affiliation: user.affiliation,
      active_reservation: reservatons.find(r => r.status === "active") ?? null,
      completed_reservations: reservatons.filter(r => r.status === "completed"),
      cancelled_reservations: reservatons.filter(r => r.status === "cancelled"),
      image_url: user.image_url,
      usc_id: user.id,
    };
  }

  console.error(`User with username ${username} does not exist.`);
  return null;
}
