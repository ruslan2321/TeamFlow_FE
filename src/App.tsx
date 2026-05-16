import "./App.css";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/LoginPage";
import CardTaskPage from "./pages/CardTaskPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import Register from "./pages/RegisterPage";
import ProfilePage from "./pages/Profile";
import DetailtaskPage from "./pages/DetailtaskPage";
import { MyCommand } from "./pages/MyCommand";
import AnalyticsPage from "./pages/AnalytickPage";





function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/task" element={<CardTaskPage />} />
        <Route path="/resetpass" element={<PasswordResetPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/task/:task_id" element={<DetailtaskPage />} />
        <Route path="/command" element={<MyCommand />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
{/*         <Route path="/settings" element={<SettingsPage />}/> */}
      </Routes>
    </>
  );
}

export default App;
