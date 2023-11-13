import AsyncStorage from '@react-native-async-storage/async-storage';
import { get_user_data } from './firebase/firebase_api';
import { Temporal } from '@js-temporal/polyfill';
import type { Building } from './types';

// for persistent login

export const get_username = async () => {
  return (await AsyncStorage.getItem('username')) as string | null;
};

export const get_user_if_login = async () => {
  const username = await get_username();
  if (username) return await get_user_data(username);
  return null;
};

export const logout_user = async () => {
  await AsyncStorage.removeItem('username');
};

// for buildings

export const format_time = (time: Temporal.PlainTime): string => {
  // Convert the time to AM/PM format and return as string
  const hour = time.hour % 12 === 0 ? 12 : time.hour % 12;
  const minute = time.minute.toString().padStart(2, '0');
  const ampm = time.hour < 12 ? 'AM' : 'PM';
  return `${hour}:${minute} ${ampm}`;
};

export const in_day_range = (today: string, range: string): boolean => {
  // Range is one day fully written or multiday separted by '–'
  const res = range.split(' – ') as [string, string] | [string];
  if (res.length === 1) return range.includes(today);

  // Check if a day is in a range of days
  const [start, end] = res;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const start_idx = days.indexOf(start);
  const end_idx = days.indexOf(end);
  const today_idx = days.indexOf(today);
  return start_idx <= today_idx && today_idx <= end_idx;
};

export const display_hours = (
  hours: Building['open_hours'],
): 'Closed' | 'Open 24 hours' | `Open at ${string}` | `Open until ${string}` => {
  const now = Temporal.Now.plainTimeISO();
  const today = Temporal.Now.plainDateISO().toLocaleString('en-US', { weekday: 'short' });
  const today_info = hours.find(([days]) => in_day_range(today, days)) ?? [today, 'Closed'];

  if (today_info[1] === 'Closed') return 'Closed';
  if (today_info[1] === '24 Hours') return 'Open 24 hours';

  const [opening, closing] = today_info[1];

  if (Temporal.PlainTime.compare(now, opening) >= 0 && Temporal.PlainTime.compare(now, closing) < 0)
    return `Open until ${format_time(closing)}`;
  if (Temporal.PlainTime.compare(now, opening) < 0) return `Open at ${format_time(opening)}`;

  return 'Closed';
};

export const is_building_open = (
  hours: Building['open_hours'],
  dt: Temporal.PlainDateTime = Temporal.Now.plainDateTimeISO(),
): boolean => {
  const today = dt.toLocaleString('en-US', { weekday: 'short' });
  const today_info = hours.find(([days]) => in_day_range(today, days)) ?? [today, 'Closed'];

  if (today_info[1] === 'Closed') return false;
  if (today_info[1] === '24 Hours') return true;

  const t = dt.toPlainTime();
  if (Temporal.PlainTime.compare(t, today_info[1][0]) >= 0 && Temporal.PlainTime.compare(t, today_info[1][1]) < 0)
    return true;
  return false;
};

// for reservations

export const generate_start_times = (
  hours: Building['open_hours'],
  picked_date: Temporal.PlainDate,
): Temporal.PlainTime[] => {
  const weekday = picked_date.toLocaleString('en-US', { weekday: 'short' });
  const [_, range] = hours.find(([days]) => in_day_range(weekday, days)) ?? ['', 'Closed'];

  if (range === 'Closed') return [];

  const same_day = picked_date.equals(Temporal.Now.plainDateISO()) ?? true;
  const now = same_day
    ? Temporal.Now.plainTimeISO().round({
        smallestUnit: 'minutes',
        roundingIncrement: 30,
        roundingMode: 'ceil',
      })
    : Temporal.PlainTime.from('00:00:00');

  if (range === '24 Hours') return create_times(now, Temporal.PlainTime.from('23:59:59'));

  let [start, end] = range;
  if (Temporal.PlainTime.compare(now, start) > 0 && same_day) start = now;

  return create_times(start, end);
};

export const generate_end_times = (
  times: Temporal.PlainTime[],
  picked_start_time: Temporal.PlainTime,
): Temporal.PlainTime[] => {
  const start_idx = times.findIndex(t => t.equals(picked_start_time));
  return times.map(t => t.add({ minutes: 30 })).slice(start_idx, start_idx + 4);
};

export const create_times = (start: Temporal.PlainTime, end: Temporal.PlainTime) => {
  const length = (end.since(start).total({ unit: 'minute' }) + 1) / 30;
  return Array.from({ length }, (_, i) => start.add({ minutes: i * 30 }));
};
