import { validate_credentials, get_user_reservations } from '../firebase/firebase_api';
import { get } from 'firebase/database';

jest.mock('firebase/database');
const mockedGet = get as jest.MockedFunction<typeof get>;

describe('validate_credentials() Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Valid Credentials', async () => {
    const mockUsers = {
      rohkal: {
        id: '12345',
        name: 'Roh Kal',
        password: 'password',
        affiliation: 'Student',
        image_url: 'https://example.com/rohkal.jpg',
      },
    };

    mockedGet.mockImplementation(path => {
      if (path?.toString().includes('users')) {
        return Promise.resolve({
          exists: () => true,
          val: () => mockUsers,
        } as any);
      }
      return Promise.resolve({ exists: () => false } as any);
    });

    const validUser = await validate_credentials('rohkal', 'password');
    expect(validUser).not.toBeNull();
    expect(validUser?.username).toEqual('rohkal');
  });

  test('Invalid Credentials', async () => {
    mockedGet.mockResolvedValue({
      exists: () => true,
      val: () => ({}),
    } as any);

    const invalidUser = await validate_credentials('invalid_username', 'invalid_password');
    expect(invalidUser).toBeNull();
  });
});

describe('get_user_reservations() Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('User with Reservations', async () => {
    const mockReservations = {
      reservation1: {
        code: 'B001',
        seat: 'inside-1-1',
        start: '2023-01-01T09:00',
        end: '2023-01-01T11:00',
        type: 'valid',
        created_at: '2023-01-01T08:00',
      },
    };

    mockedGet.mockResolvedValue({
      exists: () => true,
      val: () => mockReservations,
    } as any);

    const reservations = await get_user_reservations('testuser');
    expect(reservations).toHaveLength(1);
    expect(reservations[0]).toHaveProperty('building_code', 'B001');
    expect(reservations[0]?.area).toEqual('inside');
    expect(reservations[0]?.seat_id).toEqual('1-1');
    expect(reservations[0]?.status).toEqual('completed');
  });

  test('User with No Reservations', async () => {
    mockedGet.mockResolvedValue({
      exists: () => false,
      val: () => ({}),
    } as any);

    const reservations = await get_user_reservations('emptyuser');
    expect(reservations).toHaveLength(0);
  });

  test('Error Handling', async () => {
    mockedGet.mockRejectedValue(new Error('Firebase error'));
    await expect(get_user_reservations('erroruser')).rejects.toThrow('Firebase error');
  });
});
