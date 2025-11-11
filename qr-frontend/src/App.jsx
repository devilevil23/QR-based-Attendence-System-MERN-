import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentForm from './Admin/StudentForm';
import ParentComponent from './components/ParentComponent'; 
import GenerateQRPage from './Admin/GenerateQRPage';
import AdminPage from './Admin/Admin'; 
import SignInPage from './Admin/SignInPage'; 
import SignUpPage from './pages/SignUpPage'; 
import Staff from './staff/Staff';
import StaffSignup from './Admin/StaffSignup';
import StudentList from './Admin/StudentList';
import StaffList from './Admin/StaffList';
import StaffSignin from './staff/StafSignin';
import StudentDetails from "./staff/StudentDetails";
import StaffAddStudent from './staff/AddStudent'
import StudentInfo from './Admin/StudentInfo';
import Studentlogin from './Student/Studentlogin';
import Studentlogininfo from './Student/Studentlogininfo';
import Department from './Admin/Department'
import Chat from "./components/chat"
import StaffInfo from "./Admin/staffinfo";
const apiUrl = import.meta.env.VITE_API_URL;
const App = () => {
  return (
    <Router>
      <div className="container-fluid mt-4"> 
        <Routes>
          <Route path="/" element={<ParentComponent/>} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/adminstudentform" element={<StudentForm />} />
          <Route path="/generate-qr/:rollNumber" element={<GenerateQRPage />} />
          <Route path="/admin" element={<AdminPage />} /> 
          <Route path="/staff" element={<Staff />} /> 
          <Route path="/newstaffform" element={<StaffSignup />} /> 
          <Route path="/adminstudentlist" element={<StudentList />} /> 
          <Route path="/stafflist" element={<StaffList />} /> 
          <Route path="/staffsignin" element={<StaffSignin />} /> 
          <Route path="/staff/:email" element={<Staff />} />
          <Route path="/studentdetails/:id" element={<StudentDetails />} />
          <Route path="/addstudent/:stafffirstName"   element={<StaffAddStudent />} />
          <Route path="/studentInfo/:id" element={<StudentInfo />} />
          <Route path="/staffinfo/:id" element={<StaffInfo />} />
          <Route path="/studentlogin" element={<Studentlogin />} />
          <Route path="/department" element={<Department />} />
          <Route path="/studentlogininfo/:id" element={<Studentlogininfo />} />
          <Route path="/chat" element={<Chat />} />

        </Routes>
      </div>
    </Router>
  );
};
export default App;
