import React, { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import FacultyLayout from "./layouts/FacultyLayout";
import StudentLayout from "./layouts/StudentLayout";
import Login from "./Screens/Auth/Login";
import Register from "./Screens/Auth/Register";
import ForgotPassword from "./Screens/Auth/ForgotPassword";
import ResetPassword from "./Screens/Auth/ResetPassword";
import Dashboard from "./Screens/Dashboard";
import Student from "./Screens/Admin/Student";
import Faculty from "./Screens/Admin/Faculty";
import Subject from "./Screens/Admin/Subject";
import Branch from "./Screens/Admin/Branch";
import Profile from "./Screens/Profile";
import UploadMarks from "./Screens/Faculty/UploadMarks";

// Protected route wrapper for cleaner code
const ProtectedLayoutRoute = ({ Layout, children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const App = () => {
  // Memoize routes configuration to prevent unnecessary re-renders
  const adminRoutes = useMemo(
    () => [
      { path: "/admin", element: <Dashboard /> },
      { path: "/admin/student", element: <Student /> },
      { path: "/admin/faculty", element: <Faculty /> },
      { path: "/admin/subject", element: <Subject /> },
      { path: "/admin/branch", element: <Branch /> },
    ],
    []
  );

  const facultyRoutes = useMemo(
    () => [
      { path: "/faculty", element: <Dashboard /> },
      { path: "/faculty/upload-marks", element: <UploadMarks /> },
    ],
    []
  );

  const studentRoutes = useMemo(
    () => [{ path: "/student", element: <Dashboard /> }],
    []
  );

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin Routes */}
        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedLayoutRoute Layout={AdminLayout}>
                {route.element}
              </ProtectedLayoutRoute>
            }
          />
        ))}

        {/* Faculty Routes */}
        {facultyRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedLayoutRoute Layout={FacultyLayout}>
                {route.element}
              </ProtectedLayoutRoute>
            }
          />
        ))}

        {/* Student Routes */}
        {studentRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedLayoutRoute Layout={StudentLayout}>
                {route.element}
              </ProtectedLayoutRoute>
            }
          />
        ))}

        {/* Common Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
