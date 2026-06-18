import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";


export const perUserCodeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // max 30 code runs per 15 min per IP
    message: {
        success: false,
        message: "Too many code execution requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});
let dailyRequestCount = 0;
let lastResetDate = new Date().toDateString();

export const globalDailyLimiter = (req, res, next) => {
    const today = new Date().toDateString();

    if (today !== lastResetDate) {
        dailyRequestCount = 0;
        lastResetDate = today;
        console.log("✅ Daily code execution counter reset");
    }

    if (dailyRequestCount >= 100) {
        throw new ApiError(
            429,
            "Daily code execution limit reached (100/day). Try again tomorrow. This limit protects your API budget."
        );
    }

    dailyRequestCount++;
    console.log(` Daily code executions: ${dailyRequestCount}/100`);

    next();
};

export const getDailyUsage = (req, res) => {
    const today = new Date().toDateString();

    if (today !== lastResetDate) {
        dailyRequestCount = 0;
        lastResetDate = today;
    }

    return res.status(200).json({
        success: true,
        data: {
            used: dailyRequestCount,
            limit: 100,
            remaining: 100 - dailyRequestCount,
            resetsAt: "midnight"
        },
        message: "Daily usage fetched"
    });
};