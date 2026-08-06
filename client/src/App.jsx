import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import FarmerLandsPage from "./pages/FarmerLandsPage";
import FarmerEquipmentPage from "./pages/FarmerEquipmentPage";
import BuyerLandsPage from "./pages/BuyerLandsPage.jsx";
import FarmerContractRequestsPage from "./pages/FarmerContractRequestsPage.jsx";
import BuyerSentContractsPage from "./pages/BuyerSentContractsPage.jsx";
import FarmerRentalRequestsPage from "./pages/FarmerRentalRequestsPage.jsx";
import BrowseEquipmentPage from "./pages/BrowseEquipmentPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/farmer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["FARMER"]}>
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/lands"
        element={
          <ProtectedRoute allowedRoles={["FARMER"]}>
            <FarmerLandsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/equipment"
        element={
          <ProtectedRoute allowedRoles={["FARMER"]}>
            <FarmerEquipmentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/equipment/browse"
        element={
          <ProtectedRoute allowedRoles={["FARMER"]}>
            <BrowseEquipmentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/contracts"
        element={
          <ProtectedRoute allowedRoles={["FARMER"]}>
            <FarmerContractRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/rentals"
        element={
          <ProtectedRoute allowedRoles={["FARMER"]}>
            <FarmerRentalRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buyer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["BUYER"]}>
            <BuyerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/buyer/lands"
        element={
          <ProtectedRoute allowedRoles={["BUYER"]}>
            <BuyerLandsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buyer/contracts"
        element={
          <ProtectedRoute allowedRoles={["BUYER"]}>
            <BuyerSentContractsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
