import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import CGPA from "./pages/CGPA";
import ExamPlanner from "./pages/ExamPlanner";
import Notes from "./pages/Notes";
import Reminders from "./pages/Reminders";
import Holidays from "./pages/Holidays";
import ClassTopics from "./pages/ClassTopics";
import Internships from "./pages/Internships";
import Resume from "./pages/Resume";
import PodAI from "./pages/PodAI";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";

function isLoggedIn() {
  const token = localStorage.getItem("token");
  return Boolean(token);
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
}

function PrivateRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

function PublicRoute({ children }) {
  if (isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <PrivateRoute>
              <Attendance />
            </PrivateRoute>
          }
        />

        <Route
          path="/cgpa"
          element={
            <PrivateRoute>
              <CGPA />
            </PrivateRoute>
          }
        />

        <Route
          path="/exams"
          element={
            <PrivateRoute>
              <ExamPlanner />
            </PrivateRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <PrivateRoute>
              <Notes />
            </PrivateRoute>
          }
        />

        <Route
          path="/reminders"
          element={
            <PrivateRoute>
              <Reminders />
            </PrivateRoute>
          }
        />

        <Route
          path="/holidays"
          element={
            <PrivateRoute>
              <Holidays />
            </PrivateRoute>
          }
        />

        <Route
          path="/class-topics"
          element={
            <PrivateRoute>
              <ClassTopics />
            </PrivateRoute>
          }
        />

        <Route
          path="/internships"
          element={
            <PrivateRoute>
              <Internships />
            </PrivateRoute>
          }
        />

        <Route
          path="/resume"
          element={
            <PrivateRoute>
              <Resume />
            </PrivateRoute>
          }
        />

        <Route
          path="/pod-ai"
          element={
            <PrivateRoute>
              <PodAI />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;