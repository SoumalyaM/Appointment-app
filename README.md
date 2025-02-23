Appointment Scheduler - React Application
This is a comprehensive appointment scheduling application built with React, Tailwind CSS, and Framer Motion. It allows users to manage appointments, view them in a calendar, and filter/search through upcoming appointments. Below is a guide to running the project locally, an overview of its features, and additional notes.

How to Run the Project Locally
Prerequisites
Node.js: Ensure you have Node.js installed on your machine. You can download it from nodejs.org.

npm or yarn: npm comes bundled with Node.js. Alternatively, you can use yarn by installing it globally via npm install -g yarn.

Steps to Run the Project
Clone the Repository:

bash
Copy
git clone https://github.com/your-repo/appointment-scheduler.git
cd appointment-scheduler
Install Dependencies:

bash
Copy
npm install
# or
yarn install
Start the Development Server:

bash
Copy
npm start
# or
yarn start
Open the Application:
The application should automatically open in your default browser at http://localhost:3000. If it doesn't, manually navigate to the URL.

Features Implemented
1. Dark and Light Mode
The application supports both dark and light themes, which can be toggled using the theme switcher button in the top-right corner.

The theme is dynamically applied to all components, ensuring a consistent look and feel.

2. Calendar View
A responsive calendar view displays appointments for the current month.

Users can navigate between months using the previous and next buttons.

Appointments are color-coded based on the doctor assigned to them.

Multi-day appointments are visually represented with rounded corners on the first and last days.

3. Upcoming Appointments
A sidebar displays a list of upcoming appointments.

Appointments are sorted by date and time.

Users can search for appointments by doctor name, patient name, or description.

4. Appointment Management
Create Appointment: Users can book new appointments by specifying the doctor, patient, date, time, and description.

Edit Appointment: Existing appointments can be edited to update details.

Delete Appointment: Appointments can be deleted with a confirmation prompt.

5. Search Functionality
A search bar allows users to filter appointments by doctor, patient, or description.

The search is case-insensitive and updates results in real-time.

6. Notifications
Success and error notifications are displayed for actions like creating, editing, or deleting appointments.

Notifications automatically disappear after 3 seconds.

7. Responsive Design
The application is fully responsive and works seamlessly on desktop and mobile devices.

8. Animations
Framer Motion is used to add smooth animations for:

Hover effects on appointment cards.

Modal transitions.

Calendar grid animations.

Notification pop-ups.

Additional Notes
Dependencies Used
React: Core library for building the UI.

Tailwind CSS: Utility-first CSS framework for styling.

Framer Motion: Library for animations and transitions.

Lucide React: Icon library for consistent and scalable icons.

date-fns: Library for date manipulation and formatting.

React Context API: Used for global state management (e.g., dark mode, appointments).

Folder Structure
src/components: Contains reusable components like AppointmentCard, AppointmentForm, and Sidebar.

src/context: Contains the AppContext for global state management.

src/utils: Contains utility functions and constants (e.g., color palettes, mock data).

Customization
Themes: You can customize the light and dark themes by modifying the colorPalette object in the code.

Mock Data: Replace the doctors and patients arrays with real data from an API or database.

Future Enhancements
Integration with Backend: Connect the application to a backend service for persistent data storage.

User Authentication: Add login and user roles (e.g., admin, doctor, patient).

Calendar Export: Allow users to export appointments to Google Calendar or Outlook.

Advanced Filtering: Add filters for appointment status (e.g., completed, canceled).

Screenshots
Light Mode:
![Opera Snapshot_2025-02-24_024451_localhost](https://github.com/user-attachments/assets/023ad2fe-5398-4578-8213-48ffb3c496c8)



Dark Mode:
![Opera Snapshot_2025-02-24_024459_localhost](https://github.com/user-attachments/assets/77ff885d-aa62-48ff-958a-88bd5c20a4ff)


Appointment Form:
![Opera Snapshot_2025-02-24_024515_localhost](https://github.com/user-attachments/assets/ea7b9ac4-3210-4698-90aa-4469674295fb)
