import { Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing.jsx";
import Register from "./pages/Register.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

const PlaceholderPage = ({ title }) => (
    <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">💻 CodeSync</h1>
            <h2 className="text-2xl">{title} Page</h2>
            <p className="text-gray-400 mt-2">Coming in next step...</p>
        </div>
    </div>
);

function App() {
    return (
        <Routes>
            {/*  Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/*  Protected Routes */}
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/room/:roomId" 
                element={
                    <ProtectedRoute>
                        <PlaceholderPage title="Room" />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/snippets" 
                element={
                    <ProtectedRoute>
                        <PlaceholderPage title="Snippets" />
                    </ProtectedRoute>
                } 
            />

            {/* 404 */}
            <Route path="*" element={<PlaceholderPage title="404 - Not Found" />} />
        </Routes>
    );
}

export default App;