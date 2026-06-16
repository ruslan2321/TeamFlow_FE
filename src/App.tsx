import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PageLoader from "./components/ui/PageLoader";
import "./App.css";

const Login = lazy(() => import("./pages/LoginPage"));
const CardTaskPage = lazy(() => import("./pages/CardTaskPage"));
const PasswordResetPage = lazy(() => import("./pages/PasswordResetPage"));
const Register = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const DetailtaskPage = lazy(() => import("./pages/DetailtaskPage"));
const MyCommand = lazy(() =>
  import("./pages/MyCommand").then((module) => ({ default: module.MyCommand })),
);
const AnalyticsPage = lazy(() => import("./pages/AnalytickPage"));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/task" element={<CardTaskPage />} />
        <Route path="/resetpass" element={<PasswordResetPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/task/:task_id" element={<DetailtaskPage />} />
        <Route path="/command" element={<MyCommand />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
