import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import UserDashboard from "./components/pages/UserDashboard";
import MyBookings from "./components/pages/MyBookings";
import BrokerDashboard from "./components/pages/BrookerDashboard";
import AddPG from "./components/pages/Addpg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
           <Route path="/login" element={<LoginPage />} />
           <Route path="/register" element={<RegisterPage />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/broker-dashboard" element={<BrokerDashboard />} />
            <Route path="/add-pg" element={<AddPG />} />
      </Routes>
    </Router>
  );
}

export default App;
