import { render, cleanup } from '@testing-library/react-native';
import { GlobalContext } from '../context/GlobalContext';
import LoginView from '../views/LoginView';

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

// import FindASeat from '../path/to/FindASeat';

// describe('FindASeat App Tests', () => {
//   // Mock data or setup as needed

//   // Test Case: Launch Default Screen
//   test('Default screen is the Map tab', () => {
//     const { getByTestId } = render(<FindASeat />);
//     const defaultTab = getByTestId('map-tab'); // Replace with the actual test ID
//     expect(defaultTab).toBeTruthy();
//   });

//   // Test Case: Verify Map Display
//   test('Map displays at least 10 buildings with available seats', () => {
//     const { getByTestId } = render(<FindASeat />);
//     fireEvent.press(getByTestId('map-tab')); // Switch to Map tab
//     const buildings = getByTestId('building-marker'); // Replace with the actual test ID
//     expect(buildings.length).toBeGreaterThanOrEqual(10);
//   });

//   // Test Case: Building Selection
//   test('Users can click on a building to view the booking page', () => {
//     const { getByTestId } = render(<FindASeat />);
//     fireEvent.press(getByTestId('building-marker')); // Replace with the actual test ID
//     const bookingPage = getByTestId('booking-page'); // Replace with the actual test ID
//     expect(bookingPage).toBeTruthy();
//   });

//   // Test Case: Verify Building Description
//   test('Building description is displayed on the booking page', () => {
//     const { getByTestId } = render(<FindASeat />);
//     fireEvent.press(getByTestId('building-marker')); // Replace with the actual test ID
//     const buildingDescription = getByTestId('building-description'); // Replace with the actual test ID
//     expect(buildingDescription).toBeTruthy();
//   });

//   // Test Case: Reservation Time Slots
//   test('Time slots are displayed in 30-minute intervals', () => {
//     const { getByTestId } = render(<FindASeat />);
//     fireEvent.press(getByTestId('building-marker')); // Replace with the actual test ID
//     const timeSlots = getByTestId('reservation-time-slot'); // Replace with the actual test ID
//     // Add assertions for 30-minute intervals
//     // e.g., expect(timeSlots[0]).toHaveTextContent('9:00 AM');
//     // and so on...
//   });

//   // Test Case: Seat Availability Update
//   test('Seat availability updates when a user makes a reservation', async () => {
//     const { getByTestId } = render(<FindASeat />);
//     fireEvent.press(getByTestId('building-marker')); // Replace with the actual test ID
//     const reserveButton = getByTestId('reserve-button'); // Replace with the actual test ID
//     fireEvent.press(reserveButton);
//     // Add assertions or queries to check seat availability update
//     await waitFor(() => expect(getByTestId('seat-availability')).toHaveTextContent('Updated availability'));
//   });

//   // Test Case: Multiple Active Reservations
//   test('Users cannot have more than one active reservation at the same time', () => {
//     const { getByTestId } = render(<FindASeat />);
//     fireEvent.press(getByTestId('building-marker')); // Replace with the actual test ID
//     const reserveButton = getByTestId('reserve-button'); // Replace with the actual test ID
//     fireEvent.press(reserveButton);
//     const reserveAnotherButton = getByTestId('reserve-another-button'); // Replace with the actual test ID
//     fireEvent.press(reserveAnotherButton);
//     // Add assertions or queries to check if the system prevents a second active reservation
//     expect(getByTestId('error-message')).toHaveTextContent('Cannot make another reservation');
//   });

//   // Test Case: Seat Reservation Conflict
//   test('A seat cannot be reserved by more than one user at the same time', async () => {
//     // Similar to the above test case, but simulate simultaneous reservations with different user accounts
//   });

//   // Test Case: Maximum Reservation Duration
//   test('Longest reservation for one seat is limited to 2 hours', async () => {
//     // Similar to the above test case, but make a reservation with a duration exceeding 2 hours
//     // Add assertions or queries to check if the system rejects or limits the reservation
//   });

//   // Test Case: View Upcoming Reservations
//   test('Upcoming reservations are displayed on the Profile tab', async () => {
//     const { getByTestId } = render(<FindASeat />);
//     fireEvent.press(getByTestId('profile-tab')); // Replace with the actual test ID
//     const upcomingReservations = getByTestId('upcoming-reservations'); // Replace with the actual test ID
//     // Add assertions or queries to check if at least one upcoming reservation is displayed
//     expect(upcomingReservations.length).toBeGreaterThanOrEqual(1);
//   });

//   // Test Case: View Reservation History
//   test('Users can view their reservation history', async () => {
//     const { getByTestId } = render(<FindASeat />);
//     fireEvent.press(getByTestId('profile-tab')); // Replace with the actual test ID
//     const reservationHistory = getByTestId('reservation-history'); // Replace with the actual test ID
//     // Add assertions or queries to check if at least 10 past reservations are displayed
//     expect(reservationHistory.length).toBeGreaterThanOrEqual(10);
//   });

//   // Test Case: Change Upcoming Reservation
//   test('Users can successfully change their upcoming reservation', async () => {
//     // Similar to the above test cases, but simulate changing a reservation and verify the update
//   });

//   // Test Case: Cancel Upcoming Reservation
//   test('Users can successfully cancel their upcoming reservation', async () => {
//     // Similar to the above test cases, but simulate canceling a reservation and verify the update
//   });

//   // Test Case: Reservation History Order
//   test('Reservation history is ordered by the time of initial creation', async () => {
//     // Similar to the above test cases, but check if the reservation history is ordered correctly
//   });

//   // Test Case: Logout Functionality
//   test('Users can successfully log out', async () => {
//     const { getByTestId } = render(<FindASeat />);
//     fireEvent.press(getByTestId('profile-tab')); // Replace with the actual test ID
//     const logoutButton = getByTestId('logout-button'); // Replace with the actual test ID
//     fireEvent.press(logoutButton);
//     // Add assertions or queries to check if the app prompts for login and hides user information
//     expect(getByTestId('login-prompt')).toBeTruthy();
//   });
// });
