import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/loginpage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard"; 
import StudentDetails from "./components/StudentDetails";
import Project from "./dashboard/project";
import ActiveCollaborations from "./dashboard/activecollabrations";
import StudyGroup from "./dashboard/studygroup";
import QueriesWritten from "./dashboard/QueriesWritten";
import ProfileSettings from "./dashboard/profilesettings";
import AccountManagement from "./dashboard/accountmanagement";
import EventManagement from "./dashboard/EventManagement"; // Ensure this path is correct
import Chat from "./components/Chat"; 
import { AuthProvider } from "./components/authContext"; 
import './App.css';

function App() {
  return (
<React.Fragment>
  <AuthProvider> 
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project" element={<Project />} />
        <Route path="/collaborations" element={<ActiveCollaborations />} />
        <Route path="/studygroup" element={<StudyGroup />} />
        <Route path="/queries-written" element={<QueriesWritten />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/account-management" element={<AccountManagement />} />
        <Route path="/signout" element={<LandingPage />} />
        <Route path="/event" element={<EventManagement />} /> 
        <Route path="/chat" element={<Chat />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/student-details" element={<StudentDetails />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  </AuthProvider>
  
</React.Fragment>

  );
}

export default App;