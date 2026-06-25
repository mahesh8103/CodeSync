import { Routes, Route } from "react-router-dom";

const PlaceholderPage = ({ title }) => (
    <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">
                💻 CodeSync
            </h1>
            <h2 className="text-2xl">{title} Page</h2>
            <p className="text-gray-400 mt-2">Coming soon...</p>
        </div>
    </div>
);

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PlaceholderPage title="Landing" />} />
            <Route path="/login" element={<PlaceholderPage title="Login" />} />
            <Route path="/register" element={<PlaceholderPage title="Register" />} />
            <Route path="/verify-otp" element={<PlaceholderPage title="Verify OTP" />} />
            <Route path="/forgot-password" element={<PlaceholderPage title="Forgot Password" />} />
            <Route path="/reset-password/:token" element={<PlaceholderPage title="Reset Password" />} />

            {/* Protected Routes  */}
            <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
            <Route path="/room/:roomId" element={<PlaceholderPage title="Room" />} />
            <Route path="/snippets" element={<PlaceholderPage title="Snippets" />} />
            <Route path="/profile" element={<PlaceholderPage title="Profile" />} />

            {/* 404 */}
            <Route path="*" element={<PlaceholderPage title="404 Not Found" />} />
        </Routes>
    );
}

export default App;