import { render, cleanup, fireEvent, waitFor } from '@testing-library/react-native';
import { GlobalContext } from '../context/GlobalContext';
import LoginView from '../views/LoginView';
import USCMapView from '../views/MapView';
import BuildingView from '../views/BuildingView';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReserveView from '../views/ReserveView';
const MockGlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalContext.Provider
      value={{
        user: null,
        setUser: jest.fn(),
        buildings: null,
        setBuildings: jest.fn(),
        selectedBuilding: null,
        setSelectedBuilding: jest.fn(),
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

describe('LoginView Component', () => {
  afterEach(cleanup); // dont think these make a diff
  afterAll(done => done()); // dont think these make a diff

  it('should go to home page', () => {
    const page = render(
      <MockGlobalStateProvider>
        <LoginView />
      </MockGlobalStateProvider>,
    );
    const loginButton = page.getByTestId('loginbutton');
    expect(loginButton).toBeTruthy();
  });
});


describe('Launch Default Screen', () => {
  afterEach(cleanup); // dont think these make a diff
  afterAll(done => done()); // dont think these make a diff

  it('should launch map page', () => {
    const page = render(
      <SafeAreaProvider>
      <MockGlobalStateProvider>
        <USCMapView />
      </MockGlobalStateProvider>,
      </SafeAreaProvider>
    );
    const map = page.getByTestId('map-tab');
    expect(map).toBeTruthy();
  });
});
  // Test Case: Verify Map Display
describe('MapDisplay', () => {
  test('Map displays at least 10 buildings with available seats', async () => {
    const page = render(
      <SafeAreaProvider>
      <MockGlobalStateProvider>
        <USCMapView />
      </MockGlobalStateProvider>,
      </SafeAreaProvider>
    );
  
    await waitFor(() => {
      const map = page.getByTestId('map-tab');
      expect(map).toBeTruthy();
  
      const buildings = page.getAllByTestId(/^marker-/);
      expect(buildings.length).toBeGreaterThanOrEqual(10);
    });
  });
});

  // Test Case: Building Selection
  const testBuildingCode = 'SAL';
  test('Users can click on a building to view the booking page', () => {
    const page = render(
      <SafeAreaProvider>
      <MockGlobalStateProvider>
        <USCMapView />
      </MockGlobalStateProvider>,
      </SafeAreaProvider>
    );
  
    // Find the Marker with the testID based on the building code
    const buildingMarker = page.getByTestId(`marker-${testBuildingCode}`);
    fireEvent.press(buildingMarker);
  
    // Assuming your booking page has a testID set as 'booking-page'
    const bookingPage = page.getByTestId('booking-page');
    expect(bookingPage).toBeTruthy();
  });
  // Test Case: Verify Building Description
  test('Building description is displayed on the booking page', () => {
    const page = render(
      <SafeAreaProvider>
        <MockGlobalStateProvider>
          <USCMapView />
        </MockGlobalStateProvider>
      </SafeAreaProvider>
    );
    const page1 = render(
      <SafeAreaProvider>
        <MockGlobalStateProvider>
          <BuildingView />
        </MockGlobalStateProvider>
      </SafeAreaProvider>
    );
  
    // Find the Marker with the testID based on the building code
    const buildingMarker = page.getByTestId(`marker-${testBuildingCode}`);
    fireEvent.press(buildingMarker);
  
    // Assuming your building description has a testID set as 'building-description'
    const buildingDescription =  page1.getByTestId('building-description');
    expect(buildingDescription).toBeTruthy();
  });


  // Test Case: Reservation Time Slots
  test('Time slots are displayed in 30-minute intervals', () => {
    const page = render(
      <SafeAreaProvider>
        <MockGlobalStateProvider>
          <USCMapView />
        </MockGlobalStateProvider>
      </SafeAreaProvider>
    );
    const page1 = render(
      <SafeAreaProvider>
        <MockGlobalStateProvider>
          <BuildingView />
        </MockGlobalStateProvider>
      </SafeAreaProvider>
    );

    const timeSlots = page.getAllByTestId('reservation-time-slot');
    const r = page1.getByTestId('reserve');
    fireEvent.press(r);
  
    const firstTimeSlotText = timeSlots[0]?.props?.children; 
    expect(firstTimeSlotText).toContain('9:00 AM');

    const secondTimeSlotText = timeSlots[1]?.props?.children; 
    expect(secondTimeSlotText).toContain('9:30 AM');
  });

  // Test Case: Seat Availability Update
  test('Seat availability updates when a user makes a reservation', async () => {
    const page = render(
      <SafeAreaProvider>
        <MockGlobalStateProvider>
          <USCMapView />
        </MockGlobalStateProvider>
      </SafeAreaProvider>
    );
    fireEvent.press(page.getByTestId('building-marker'));
    const reserveButton = page.getByTestId('reserve-button'); 
    fireEvent.press(reserveButton);
  
    expect(page.getByTestId('seat-availability'));
  });

  // Test Case: Multiple Active Reservations
  test('Users cannot have more than one active reservation at the same time', () => {
    const page = render(
      <SafeAreaProvider>
        <MockGlobalStateProvider>
          <USCMapView />
        </MockGlobalStateProvider>
      </SafeAreaProvider>
    );
    fireEvent.press(page.getByTestId('building-marker')); 
    const reserveButton = page.getByTestId('reserve-button');
    fireEvent.press(reserveButton);
    const reserveAnotherButton = page.getByTestId('reserve-another-button'); 
    fireEvent.press(reserveAnotherButton);

    expect(page.getByTestId('error-message'));
  });

  // Test Case: Seat Reservation Conflict
  test('A seat cannot be reserved by more than one user at the same time', async () => {

  });

  // Test Case: Maximum Reservation Duration
  test('Longest reservation for one seat is limited to 2 hours', async () => {
  
  });

  // Test Case: View Upcoming Reservations
  test('Upcoming reservations are displayed on the Profile tab', async () => {
    const { getByTestId } = render(<USCMapView/>);
    fireEvent.press(getByTestId('profile-tab'));
    const upcomingReservations = getByTestId('upcoming-reservations'); 
  
   // expect(upcomingReservations.length).toBeGreaterThanOrEqual(1);
  });

  // Test Case: View Reservation History
  test('Users can view their reservation history', async () => {
    const { getByTestId } = render(<USCMapView />);
    fireEvent.press(getByTestId('profile-tab')); 
    const reservationHistory = getByTestId('reservation-history'); 

   // expect(reservationHistory.length).toBeGreaterThanOrEqual(10);
  });

  // Test Case: Change Upcoming Reservation
  test('Users can successfully change their upcoming reservation', async () => {
  });

  // Test Case: Cancel Upcoming Reservation
  test('Users can successfully cancel their upcoming reservation', async () => {
  
  });

  // Test Case: Reservation History Order
  test('Reservation history is ordered by the time of initial creation', async () => {
  });

  // Test Case: Logout Functionality
  test('Users can successfully log out', async () => {
    const { getByTestId } = render(<USCMapView />);
    fireEvent.press(getByTestId('profile-tab')); 
    const logoutButton = getByTestId('logout-button'); 
    fireEvent.press(logoutButton);
    expect(getByTestId('login-prompt')).toBeTruthy();
  });

