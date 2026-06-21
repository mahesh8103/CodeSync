import { Router } from "express";
import {
    createSnippet,
    getMySnippets,
    getPublicSnippets,
    getSnippetById,
    updateSnippet,
    deleteSnippet
} from "../controllers/snippet.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// CRUD Routes
router.route("/").post(createSnippet);
router.route("/my").get(getMySnippets);
router.route("/public").get(getPublicSnippets);
router.route("/:id").get(getSnippetById);
router.route("/:id").patch(updateSnippet);
router.route("/:id").delete(deleteSnippet);

export default router;