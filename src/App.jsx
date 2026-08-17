import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Coupons from "./pages/Coupons";
import Settings from "./pages/Settings";
import { PATHS } from "./utils/paths";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  if (!auth) return <Navigate to={PATHS.login} replace />;
  return children;
};

const PathGuard = ({ children }) => {
  const location = useLocation();
  if (!location.pathname.startsWith("/coupon")) {
    return <Navigate to={PATHS.dashboard} replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <PathGuard>
          <Routes>
            {/* Redirect root to /coupon */}
            <Route
              path="/"
              element={<Navigate to={PATHS.dashboard} replace />}
            />

            <Route path={PATHS.login} element={<Login />} />
            <Route
              path="/coupon"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="apps" element={<Applications />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch-all for non-/coupon paths */}
            <Route
              path="*"
              element={<Navigate to={PATHS.dashboard} replace />}
            />
          </Routes>
        </PathGuard>
      </Router>
    </AuthProvider>
  );
}

export default App;
