import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import MainLayout from "./MainLayout";
import Users from "./Users";

import Login from "./Login";
import News from "./News";
import Report from "./Report";
import "./App.css";
import Shipments from "./Shipments";
import { AuthContext } from "./AuthContext";
import { API_BASE_URL } from "./config"; 


import { shipments } from "./ShipmentData";
import ArchivedShipments from "./ArchivedShipments";

const App = () => {
  const [error, setError] = useState("");
  const [archivedShipments, setArchivedShipments] = useState([]);
  const [shipmentList, setShipmentList] = useState(shipments);
  const [userSettings, setUserSettings] = useState(null);

  const [mode, setMode] = useState("light");

  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });


  useEffect(() => {
    if (!auth?.user) return;

    async function loadSettings() {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/${auth.user.id}`, {
          headers: { Authorization: `Bearer ${auth.access_token}` },
        });
        const data = await res.json();
        setUserSettings(data.settings || {});
      } catch (err) {
        console.error("Failed to load user settings:", err);
      }
    }

    loadSettings();
  }, [auth]);


  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setMode(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogin = (session) => {
    setAuth(session);
    localStorage.setItem("auth", JSON.stringify(session));
  };

  const clearAuthState = () => {
    setAuth(null);
    localStorage.removeItem("auth");
  };

  const theme = useMemo(
    () => createTheme({ palette: { mode } }),
    [mode]
  );

  const requireAuth = (element) => (auth ? element : <Navigate to="/login" replace />);
  const requireAdmin = (element) =>
    auth?.user?.role === "admin"
      ? element
      : auth
        ? <Navigate to="/shipments" replace />
        : <Navigate to="/login" replace />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={mode === "dark" ? "dark-mode" : ""}>
        <AuthContext.Provider value={{ auth, setAuthState: handleLogin, clearAuthState }}>
          <Router>
            <Routes>
              <Route
                path="/"
                element={<Login error={error} setError={setError} onLogin={handleLogin} />}
              />
              <Route
                path="/login"
                element={<Login error={error} setError={setError} onLogin={handleLogin} />}
              />

              <Route
                path="/shipments"
                element={
                  requireAuth(
                    <MainLayout userSettings={userSettings}>
                      <Shipments toggleTheme={toggleTheme} mode={mode} />
                    </MainLayout>
                  )
                }
              />
              <Route
                path="/news"
                element={
                  requireAuth(
                    <MainLayout userSettings={userSettings}>
                      <News toggleTheme={toggleTheme} mode={mode} />
                    </MainLayout>
                  )
                }
              />
              <Route
                path="/report"
                element={
                  requireAuth(
                    <MainLayout userSettings={userSettings}>
                      <Report toggleTheme={toggleTheme} mode={mode} />
                    </MainLayout>
                  )
                }
              />

              <Route
                path="/ArchivedShipments"
                element={
                  <MainLayout userSettings={userSettings}>
                    <ArchivedShipments archivedShipments={archivedShipments} mode={mode} />
                  </MainLayout>
                }
              />


              <Route
                path="/users"
                element={
                  requireAdmin(
                    <MainLayout userSettings={userSettings}>
                      <Users />
                    </MainLayout>
                  )
                }
              />
            </Routes>
          </Router>
        </AuthContext.Provider>
      </div>
    </ThemeProvider>
  );
};

export default App;
