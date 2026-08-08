import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EditEmployee from "./pages/EditEmployee";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes wrapped inside Layout */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leaves" element={<Leaves />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          
          {/* Manager Only Routes inside Layout */}
          <Route path="/employees" element={
            <ProtectedRoute allowedRoles={["ROLE_MANAGER"]}>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute allowedRoles={["ROLE_MANAGER", "ROLE_EMPLOYEE"]}>
              <EditEmployee />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={["ROLE_MANAGER"]}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={["ROLE_MANAGER", "ROLE_EMPLOYEE"]}>
              <Settings />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;