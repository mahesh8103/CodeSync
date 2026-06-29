import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Code2, Eye, EyeOff, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

import { authAPI } from "../api/authAPI.js";
import { loginSuccess } from "../store/authSlice.js";
import { initSocket } from "../socket/socket.js";
import Loader from "../components/common/Loader.jsx";

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required")
});

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await authAPI.login(data);
            const { user, accessToken } = response.data;

            dispatch(loginSuccess({ user, accessToken }));

            initSocket();

            toast.success("Login successful!");
            navigate("/dashboard");

        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <Code2 className="w-10 h-10 text-primary" />
                        <span className="text-3xl font-bold">CodeSync</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-dark-card border border-dark-border rounded-xl p-8">
                    <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-gray-400 mb-6">Sign in to continue coding</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    {...register("email")}
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium">Password</label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-primary hover:text-primary-light"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? <Loader size="sm" /> : "Sign In"}
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="text-center text-gray-400 mt-6">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary hover:text-primary-light">
                            Sign up
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;