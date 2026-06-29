import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Code2, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

import { authAPI } from "../api/authAPI.js";
import Loader from "../components/common/Loader.jsx";

const forgotSchema = z.object({
    email: z.string().email("Invalid email format")
});

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(forgotSchema)
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await authAPI.forgotPassword(data);
            toast.success(response.message || "Reset link sent to your email!");
            setEmailSent(true);
        } catch (error) {
            const message = error.response?.data?.message || "Failed to send reset link";
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

                <div className="bg-dark-card border border-dark-border rounded-xl p-8">

                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>

                    {emailSent ? (
                        // Success State
                        <div className="text-center py-4">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
                            <p className="text-gray-400 mb-6">
                                We've sent a password reset link to your email address.
                                Please check your inbox.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block px-6 py-2 bg-primary hover:bg-primary-dark rounded-lg transition"
                            >
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        // Form State
                        <>
                            <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
                            <p className="text-gray-400 mb-6">
                                Enter your email and we'll send you a reset link
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center"
                                >
                                    {loading ? <Loader size="sm" /> : "Send Reset Link"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;