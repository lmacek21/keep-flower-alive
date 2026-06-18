import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HousePage from "./pages/HousePage.jsx";
import FlowersPage from "./pages/FlowersPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";

function PrivateRoute({ children }) {
  return localStorage.getItem("token") ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HousePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/house/:id"
            element={
              <PrivateRoute>
                <HousePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/flowers"
            element={
              <PrivateRoute>
                <FlowersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/stats/:roomId"
            element={
              <PrivateRoute>
                <StatsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </App>
    </BrowserRouter>
  </StrictMode>,
);
