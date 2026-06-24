import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
    return res.status(200).json({
        status: "OK",
        message: "CodeSync server is running",
        timestamp: new Date().toISOString(),
        uptime: process.uptime() + " seconds"
    });
});

export default router;