import {
  validate_credentials,
  get_user_reservations,
  create_user,
  is_username_taken,
  get_buildings,
  get_building,
} from '../firebase/firebase_api';
import { get, set, DataSnapshot } from 'firebase/database';
import { FirebaseUser, FirebaseBuilding } from '../types';

jest.mock('firebase/database');
const mockedGet = get as jest.MockedFunction<typeof get>;
const mockedSet = set as jest.MockedFunction<typeof set>;

describe('validate_credentials() Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
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

describe('create_user() Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Successfully Create a New User', async () => {
    const newUser: FirebaseUser = {
      id: '67890',
      name: 'New User',
      password: 'newpassword',
      affiliation: 'Faculty', // Ensure this matches the expected type
      image_url: 'https://example.com/newuser.jpg',
    };

    mockedGet.mockResolvedValue({
      exists: () => false,
    } as any);

    mockedSet.mockResolvedValue(undefined);

    const createdUser = await create_user('newuser', newUser);
    expect(createdUser).not.toBeNull();
    expect(createdUser?.username).toEqual('newuser');
    expect(createdUser?.name).toEqual('New User');
    expect(createdUser?.affiliation).toEqual('Faculty');
  });

  test('Fail to Create User with Taken Username', async () => {
    const existingUsers = {
      existinguser: {
        id: '99999',
        name: 'Existing User',
        password: 'existpassword',
        affiliation: 'Staff',
        image_url: 'https://example.com/existinguser.jpg',
      },
    };

    mockedGet.mockResolvedValue({
      exists: () => true,
      val: () => existingUsers,
    } as any);

    try {
      const createdUser = await create_user('existinguser', {
        id: '99999',
        name: 'Existing User',
        password: 'existpassword',
        affiliation: 'Staff',
        image_url: 'https://example.com/existinguser.jpg',
      });
      expect(createdUser).toBeNull();
    } catch (error: any) {
      expect(error.message).toBe('Username is taken.');
    }
  });

  test('Handle Error in User Creation', async () => {
    mockedGet.mockResolvedValue({
      exists: () => false,
    } as any);

    mockedSet.mockRejectedValue(new Error('Firebase error'));

    await expect(
      create_user('newuser', {
        id: '123456',
        name: 'Test User',
        password: 'testpassword',
        affiliation: 'Student',
        image_url: 'https://example.com/testuser.jpg',
      }),
    ).rejects.toThrow('Firebase error');
  });
});

describe('is_username_taken() Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Username is taken', async () => {
    // Mock the 'get' function to return a snapshot with an existing user
    const existingUsers = {
      existinguser: {
        id: '99999',
        name: 'Existing User',
        password: 'existpassword',
        affiliation: 'Staff',
        image_url: 'https://example.com/existinguser.jpg',
      },
    };

    mockedGet.mockResolvedValue({
      exists: () => true,
      val: () => existingUsers,
      ref: null,
      priority: null,
      key: null,
      size: null,
    } as unknown as DataSnapshot);
    const usernameTaken = await is_username_taken('existinguser');
    expect(usernameTaken).toBe(true);
  });

  test('Username is not taken', async () => {
    mockedGet.mockResolvedValue({
      exists: () => false,
      ref: null,
      priority: null,
      key: null,
      size: null,
    } as unknown as DataSnapshot);

    const usernameNotTaken = await is_username_taken('newuser');
    expect(usernameNotTaken).toBe(false);
  });

  test('Firebase error when checking username', async () => {
    mockedGet.mockRejectedValue(new Error('Firebase error'));
    await expect(is_username_taken('testuser')).rejects.toThrow('Firebase error');
  });
});

describe('get_buildings() Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Buildings exist in the database', async () => {
    const mockBuildings: Record<string, FirebaseBuilding> = {
      B001: {
        title: 'Building 1',
        image_url: 'https://example.com/building1.jpg',
        coordinate: { latitude: 123.456, longitude: 789.123 },
        open_hours: [
          ['Monday', 'Closed'],
          ['Tuesday', 'Closed'],
        ],
        description: 'Description of Building 1',
        inside: { rows: 10, cols: 20 },
        outside: { rows: 5, cols: 10 },
      },
      B002: {
        title: 'Building 2',
        image_url: 'https://example.com/building2.jpg',
        coordinate: { latitude: 456.789, longitude: 987.654 },
        open_hours: [
          ['Wednesday', 'Closed'],
          ['Thursday', 'Closed'],
        ],
        description: 'Description of Building 2',
        inside: { rows: 8, cols: 15 },
        outside: { rows: 3, cols: 8 },
      },
    };

    mockedGet.mockResolvedValue({
      exists: () => true,
      val: () => mockBuildings,
    } as unknown as DataSnapshot);

    const buildings = await get_buildings();
    expect(Object.keys(buildings)).toHaveLength(2);
    expect(buildings['B001']).toHaveProperty('code', 'B001');
    expect(buildings['B002']).toHaveProperty('code', 'B002');
  });

  test('No buildings in the database', async () => {
    mockedGet.mockResolvedValue({
      exists: () => false,
      val: () => ({}),
    } as unknown as DataSnapshot);

    const buildings = await get_buildings();
    expect(Object.keys(buildings)).toHaveLength(0);
  });

  test('Error Handling', async () => {
    mockedGet.mockRejectedValue(new Error('Firebase error'));
    await expect(get_buildings()).rejects.toThrow('Firebase error');
  });
});

describe('get_building() Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Get an Existing Building', async () => {
    const mockBuildingCode = 'B001'; // Replace with an existing building code from your database

    const mockFirebaseBuilding = {
      code: mockBuildingCode,
      title: 'Mock Building',
      image_url: 'https://example.com/mockbuilding.jpg',
      coordinate: { latitude: 123.456, longitude: 789.123 },
      open_hours: [
        ['Monday', 'Closed'],
        ['Tuesday', 'Closed'],
      ],
      description: 'Description of Mock Building',
      inside: { rows: 10, cols: 20 },
      outside: { rows: 5, cols: 10 },
    };

    mockedGet.mockResolvedValue({
      exists: () => true,
      val: () => mockFirebaseBuilding,
    } as unknown as DataSnapshot);

    const building = await get_building(mockBuildingCode);

    expect(building).not.toBeNull();
    expect(building).toHaveProperty('code', mockBuildingCode);
    expect(building).toHaveProperty('title', 'Mock Building');
    // Add more assertions for other properties of the Building object as needed
  });

  test('Get a Non-Existing Building', async () => {
    const nonExistingBuildingCode = 'B002'; // Replace with a non-existing building code

    mockedGet.mockResolvedValue({
      exists: () => false,
      val: () => ({}),
    } as unknown as DataSnapshot);

    const building = await get_building(nonExistingBuildingCode);

    expect(building).toBeNull();
  });

  test('Error Handling', async () => {
    const errorBuildingCode = 'B003'; // Replace with a building code that triggers an error

    mockedGet.mockRejectedValue(new Error('Firebase error'));

    await expect(get_building(errorBuildingCode)).rejects.toThrow('Firebase error');
  });
});
