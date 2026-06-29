import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Code2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import { authAPI } from "../api/authAPI.js";
import Loader from "../components/common/Loader.jsx";

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate("/register");
        }
    }, [email, navigate]);

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [timer, setTimer] = useState(60);

   
    const inputRefs = useRef([]);

    
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

   
    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    //  Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = pastedData.split("").concat(["", "", "", "", "", ""]).slice(0, 6);
        setOtp(newOtp);
        inputRefs.current[5]?.focus();
    };

    const handleVerify = async () => {
        const otpString = otp.join("");

        if (otpString.length !== 6) {
            toast.error("Please enter complete OTP");
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.verifyOTP({
                email,
                otp: otpString
            });

            toast.success(response.message || "Email verified successfully!");
            navigate("/login");

        } catch (error) {
            const message = error.response?.data?.message || "Verification failed";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    //  Resend OTP
    const handleResend = async () => {
        setResending(true);
        try {
            const response = await authAPI.resendOTP({ email });
            toast.success(response.message || "New OTP sent!");
            setTimer(60);
            setOtp(["", "", "", "", "", ""]);
        } catch (error) {
            const message = error.response?.data?.message || "Failed to resend";
            toast.error(message);
        } finally {
            setResending(false);
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

                    {/* Back button */}
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Register
                    </Link>

                    <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
                    <p className="text-gray-400 mb-6">
                        We sent a 6-digit code to <br />
                        <span className="text-white font-medium">{email}</span>
                    </p>

                    {/* OTP Inputs */}
                    <div className="flex gap-2 justify-center mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className="w-12 h-14 text-center text-2xl font-bold bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none"
                            />
                        ))}
                    </div>

                    {/* Verify Button */}
                    <button
                        onClick={handleVerify}
                        disabled={loading}
                        className="w-full py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center mb-4"
                    >
                        {loading ? <Loader size="sm" /> : "Verify Email"}
                    </button>

                    {/* Resend */}
                    <div className="text-center">
                        {timer > 0 ? (
                            <p className="text-gray-400">
                                Resend OTP in <span className="text-primary font-medium">{timer}s</span>
                            </p>
                        ) : (
                            <button
                                onClick={handleResend}
                                disabled={resending}
                                className="text-primary hover:text-primary-light font-medium"
                            >
                                {resending ? "Sending..." : "Resend OTP"}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;