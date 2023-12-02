# FindASeat

This is a React Native application that allows users to make seat reservations around the USC campus. The backend services are implemented using FireBase SDK and Realtime Database.

## Prerequisites

Before you begin, ensure you have installed Node.js and npm.

## Running the Application

To run the Building View Application, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Install the project dependencies by running the following command: 'npm install'
4. Start the application by running the following command: 'npm start'
5. Once the application starts, you can run it in the iOS emulator by pressing `i` in the terminal.
6. Alternatively, you can run the application on your physical device by downloading the Expo Go app from the app store. Once downloaded, open the Expo Go app and scan the QR code displayed in your terminal.

## Improvements Since 2.4

Notifications:
- Users of FindASeat will be notified when their reservations begin.
Modifying Reservations:
- Fixed a bug with reservation times — implemented a block so that reservations in progress can no longer be modified by comparing the reservation time with the current time.

Confirmation View on Reserve and Modify Pages:
- Added a confirmation modal when cancelling reservations.
- Added a summary of the options the user has selected at the bottom of the reservation and modification pages, so that the user may verify that they have inputted the correct information.

Tab Bar Icons:
- Created a better UI design with icons for the Tab Bar and the label.
- Added a “building with a pin” icon to indicate our map and a “person” icon for our profile page.

## Authors

Rohan Kalra, Brendon Zimmer, Ania Ahsan (CSCI 310 Students - Fall 2023)
