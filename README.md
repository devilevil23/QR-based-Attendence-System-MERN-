# QR-Based Attendance System

## Overview
This project is a **QR-Based Attendance System** that allows students to scan QR codes for attendance tracking. The system includes an admin dashboard, staff management, student profiles, and attendance reports.

## Features
### Admin Panel
- Add, edit, and remove **students**, **staff**, and **departments**.
- View and manage **attendance records**.
- Generate **attendance reports**.

### Staff Panel
- Manage students in their assigned class.
- Edit and remove student information.
- View attendance records.

### Student Panel
- View personal attendance records.
- Access student profiles.

### Attendance Scanning
- QR code scanning for student check-ins.
- Secure verification to prevent proxy attendance.

## Technologies Used
- **Frontend:** React (Vite)
- **Backend:** Node.js (Express)
- **Database:** Mongodb
- **Authentication:** JWT
- **QR Code Generation & Scanning:** qrcode.react, jsQR


## Installation
### Prerequisites
- Node.js & npm
- mongodb database
- Environment variables configured (.env file)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/Dharaneesh8688/QR-Based-Attendance-System-MERN.git
   cd qr-attendance-system
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up the environment variables in a `.env` file:
   ```sh
   DATABASE_URL=your_database_url
   JWT_SECRET=your_secret_key
   ```
4. Run database migrations:
   ```sh
   npm run migrate
   ```
5. Start the backend server:
   ```sh
   npm run dev
   ```
6. Start the frontend:
   ```sh
   cd client
   npm install
   npm run dev
   ```



## Future Enhancements
- **Analytics Dashboard** for attendance trends.

## License
This project is open-source under the MIT License.

## Contributors
### We welcome contributions from the community!
- [Dharaneesh8688](https://github.com/Dharaneesh8688)





