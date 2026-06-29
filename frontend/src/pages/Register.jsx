import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Code2, Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import toast from "react-hot-toast";

import { authAPI } from "../api/authAPI.js";
import Loader from "../components/common/Loader.jsx";

const registerSchema = z.object({
    fullName: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(registerSchema)
    });

    //  Form submission
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await authAPI.register(data);
            
            toast.success(response.message || "Registration successful! Check your email for OTP");
            
            navigate("/verify-otp", { state: { email: data.email } });

        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";
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
                    <h2 className="text-2xl font-bold mb-2">Create Account</h2>
                    <p className="text-gray-400 mb-6">Start coding with your team today</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    {...register("fullName")}
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none"
                                />
                            </div>
                            {errors.fullName && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Email
                            </label>
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
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Password
                            </label>
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
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? <Loader size="sm" /> : "Create Account"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-gray-400 mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:text-primary-light">
                            Sign in
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Register;