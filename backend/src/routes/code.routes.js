import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { perUserCodeLimiter, globalDailyLimiter,
    getDailyUsage  } from "../middleware/codeExecutionLimiter.middleware.js";
import { getSupportedLanguages, runCode } from "../controllers/code.controller.js";

const router = Router();

// All code routes protected
router.use(verifyJWT);

router.route("/languages").get(getSupportedLanguages);
router.route("/usage").get(getDailyUsage);

router.route("/run").post(
    globalDailyLimiter,
    perUserCodeLimiter,
    runCode
);

export default router;