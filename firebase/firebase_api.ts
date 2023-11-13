import { ref, set, child, get, push, remove, update } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Temporal } from "@js-temporal/polyfill";
import { FIREBASE_DB } from "./firebase_config";
import type {
  Building,
  FirebaseBuilding,
  FirebaseReservation,
  FirebaseUser,
  Reservation,
  RoomData,
  User,
} from "../types";

const db_ref = ref(FIREBASE_DB);

export async function validate_credentials(input_username: string, input_password: string): Promise<User | null> {
  input_username = input_username.toLowerCase();

  const snapshot = await get(child(db_ref, `users`));
  if (snapshot.exists()) {
    const users = snapshot.val() as Record<User["username"], FirebaseUser>;

    const user = users[input_username];
    if (user && input_password === user.password) {
      await AsyncStorage.setItem("username", input_username);
      const reservatons = await get_user_reservations(input_username);

      return {
        username: input_username,
        name: user.name,
        affiliation: user.affiliation,
        active_reservation: reservatons.find(r => r.status === "active") ?? null,
        completed_reservations: reservatons.filter(r => r.status !== "active"),
        image_url: user.image_url,
        usc_id: user.id,
      };
    }
  }

  console.log("User Not Found");
  return null;
}

export async function get_user_reservations(username: string): Promise<Reservation[]> {
  const snapshot = await get(child(db_ref, `reservations/${username}`));
  if (snapshot.exists())
    return Object.entries(snapshot.val() as Record<string, FirebaseReservation>)
      .map(([key, r]) => ({
        key,
        building_code: r.code,
        created_at: Temporal.PlainDateTime.from(r.created_at),
        start_time: Temporal.PlainDateTime.from(r.start),
        end_time: Temporal.PlainDateTime.from(r.end),
        area: r.seat.split("-")[0] as "inside" | "outside",
        seat_id: r.seat.split("-").slice(1).join("-") as `${number}-${number}`,
        status:
          r.type === "invalid"
            ? "canceled"
            : new Date(r.end).getTime() < Date.now()
            ? "completed"
            : ("active" as "active" | "completed" | "canceled"),
      }))
      .sort((a, b) => Temporal.PlainDateTime.compare(b.created_at, a.created_at))
      .slice(0, 10);

  return [];
}

export async function create_user(username: string, user: FirebaseUser): Promise<User | null> {
  username = username.toLowerCase();

  if (await is_username_taken(username)) {
    console.error("Username is taken.");
    return null;
  }

  await set(child(db_ref, `users/${username}`), user).catch(err => console.error("Error creating user: ", err));

  return {
    username,
    active_reservation: null,
    completed_reservations: [],
    usc_id: user.id,
    name: user.name,
    image_url: user.image_url,
    affiliation: user.affiliation,
  };
}

export async function is_username_taken(username: string): Promise<boolean> {
  const snapshot = await get(child(db_ref, `users`));

  if (snapshot.exists()) {
    const users = snapshot.val() as Record<User["username"], FirebaseUser>;
    if (users[username] !== undefined) return true; // Username is taken
  }

  return false; // Username is not taken
}

export async function get_buildings(): Promise<Record<Building["code"], Building>> {
  const snapshot = await get(child(db_ref, "buildings"));

  if (snapshot.exists()) {
    const buildings = snapshot.val() as Record<string, FirebaseBuilding>;
    const to_return: Record<Building["code"], Building> = {};

    for (const [code, b] of Object.entries(buildings)) {
      const { inside, outside, total } = await get_availability(
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

export async function get_availability(
  {
    code,
    inside,
    outside,
  }: { code: string; inside: { rows: number; cols: number }; outside: { rows: number; cols: number } },
  at_time: Temporal.PlainDateTime,
  end_time?: Temporal.PlainDateTime
): Promise<{ inside: RoomData; outside: RoomData; total: number }> {
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

  const inside_seats = Array.from({ length: inside.rows }, () => Array(inside.cols).fill(true)) as boolean[][];
  const outside_seats = Array.from({ length: outside.rows }, () => Array(outside.cols).fill(true)) as boolean[][];

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

    const [area, row, col] = r.seat.split("-") as ["inside" | "outside", number, number];
    if (area === "inside" && inside_seats[row]![col]) {
      inside_count++;
      inside_seats[row]![col] = false;
    }
    if (area === "outside" && outside_seats[row]![col]) {
      outside_count++;
      outside_seats[row]![col] = false;
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
}

export async function get_building(code: Building["code"]): Promise<Building | null> {
  const snapshot = await get(child(db_ref, `buildings/${code}`));

  if (snapshot.exists()) {
    const b = snapshot.val() as FirebaseBuilding;

    const { inside, outside, total } = await get_availability(
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

export async function make_reservation(
  username: string,
  res: Omit<Reservation, "key" | "created_at">
): Promise<Reservation | null> {
  const created_at = Temporal.Now.plainDateTimeISO();
  const f_res: FirebaseReservation = {
    code: res.building_code,
    seat: `${res.area}-${res.seat_id}`,
    start: res.start_time.toString(),
    end: res.end_time.toString(),
    type: "valid",
    user: username,
    created_at: created_at.toString(),
  };

  const res_ref = push(child(db_ref, "reservations")).key!.replace(/[.#$\/\[\]]/g, "_");

  return await update(db_ref, {
    [`reservations/${f_res.code}/${res_ref}`]: f_res,
    [`reservations/${username}/${res_ref}`]: f_res,
  })
    .then(() => {
      alert("Reservation added successfully!");
      return { ...res, key: res_ref, created_at };
    })
    .catch(err => {
      alert("Error adding reservation! Please try again!");
      return null;
    });
}

export async function cancel_reservation(code: Building["code"], username: string, res_id: Reservation["key"]) {
  username = username.toLowerCase();

  const r_code_ref = child(db_ref, `reservations/${code}/${res_id}`);
  const r_user_ref = child(db_ref, `reservations/${username}/${res_id}`);
  await update(r_user_ref, { type: "invalid" })
    .catch(err => console.error("Error cancelling reservation: ", err))
    .then(async () => await remove(r_code_ref).catch(err => alert("Error cancelling reservation. Please try again!")));
}

export async function get_user_data(username: string): Promise<User | null> {
  username = username.toLowerCase();

  const snapshot = await get(child(db_ref, `users/${username}`));
  if (snapshot.exists()) {
    const user = snapshot.val();

    const reservatons = await get_user_reservations(username);

    return {
      username: username,
      name: user.name,
      affiliation: user.affiliation,
      active_reservation: reservatons.find(r => r.status === "active") ?? null,
      completed_reservations: reservatons.filter(r => r.status !== "active"),
      image_url: user.image_url,
      usc_id: user.id,
    };
  }

  console.error(`User with username ${username} does not exist.`);
  return null;
}
