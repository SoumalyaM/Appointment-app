# 📅 Appointment Scheduler - React Application

A comprehensive **appointment scheduling application** built with **React, Tailwind CSS, and Framer Motion**. It allows users to manage appointments, view them in a calendar, and search through upcoming appointments.

---

## 🚀 How to Run the Project Locally

### Prerequisites
- **Node.js**: Ensure you have Node.js installed on your machine. [Download it here](https://nodejs.org/)
- **npm or yarn**: npm comes bundled with Node.js. Alternatively, install yarn globally:
  ```sh
  npm install -g yarn
  ```

### Steps to Run the Project
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/your-repo/appointment-scheduler.git
   cd appointment-scheduler
   ```

2. **Install Dependencies:**
   ```sh
   npm install
   ```
   *or*
   ```sh
   yarn install
   ```

3. **Start the Development Server:**
   ```sh
   npm start
   ```
   *or*
   ```sh
   yarn start
   ```

4. **Open the Application:**
   - The app should automatically open in your browser at [http://localhost:3000](http://localhost:3000).
   - If it doesn't, manually navigate to the URL.

---

## 🎯 Features

### 🌗 Dark & Light Mode
- Toggle between dark and light themes using the theme switcher.
- The theme is dynamically applied across all components.

### 📅 Calendar View
- Displays appointments for the current month.
- Users can navigate between months.
- **Color-coded** appointments based on the assigned doctor.
- Multi-day appointments have **rounded corners** on the first and last days.

### ⏳ Upcoming Appointments
- A sidebar lists upcoming appointments sorted by date and time.
- Users can **search** appointments by doctor, patient, or description.

### 📋 Appointment Management
- **Create:** Users can book new appointments.
- **Edit:** Modify existing appointments.
- **Delete:** Remove appointments with a confirmation prompt.

### 🔍 Search Functionality
- Case-insensitive search.
- Real-time updates as users type.

### 🔔 Notifications
- Success and error **notifications** for appointment actions.
- Notifications **auto-dismiss** after 3 seconds.

### 📱 Responsive Design
- Works **seamlessly** on desktop and mobile devices.

### 🎬 Smooth Animations (Framer Motion)
- **Hover effects** on appointment cards.
- **Modal transitions**.
- **Calendar grid animations**.
- **Notification pop-ups**.

---

## 🔧 Tech Stack & Dependencies
- **React** – Core library for UI
- **Tailwind CSS** – Utility-first CSS framework
- **Framer Motion** – For animations & transitions
- **Lucide React** – Icon library
- **date-fns** – Date manipulation & formatting
- **React Context API** – Global state management

---

## 📂 Folder Structure
```
📦 src
 ┣ 📂 components       # Reusable UI components
 ┣ 📂 context          # AppContext for global state
 ┣ 📂 utils            # Utility functions & constants
 ┣ 📜 App.js           # Main entry file
 ┗ 📜 index.js         # Renders the app
```

---

## 📸 Screenshots
| Light Mode | Dark Mode | Appointment Form |



|----------|----------|-----------------|
| ![Opera Snapshot_2025-02-24_024451_localhost](https://github.com/user-attachments/assets/4edf1328-7798-470f-ae1a-df2603c879a8) |![Opera Snapshot_2025-02-24_024459_localhost](https://github.com/user-attachments/assets/8bca01c0-60a3-48b1-ab68-1f30c3dc81e1)  | ![Opera Snapshot_2025-02-24_024515_localhost](https://github.com/user-attachments/assets/55418484-d137-45e5-a2dc-6eacfeaf126a) |


---


