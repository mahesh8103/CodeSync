import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Code2, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import { authAPI } from "../api/authAPI.js";
import Loader from "../components/common/Loader.jsx";

const resetSchema = z.object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(resetSchema)
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await authAPI.resetPassword(token, {
                newPassword: data.newPassword
            });
            toast.success(response.message || "Password reset successful!");
            navigate("/login");
        } catch (error) {
            const message = error.response?.data?.message || "Reset failed";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <Code2 className="w-10 h-10 text-primary" />
                        <span className="text-3xl font-bold">CodeSync</span>
                    </Link>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-xl p-8">
                    <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                    <p className="text-gray-400 mb-6">Enter your new password below</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    {...register("newPassword")}
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
                            {errors.newPassword && (
                                <p className="text-red-400 text-sm mt-1">{errors.newPassword.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    {...register("confirmPassword")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? <Loader size="sm" /> : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;