import { Router } from "express";
import {
    createRoom,
    getMyRooms,
    getRoomByRoomId,
    joinRoom,
    leaveRoom,
    updateRoom,
    toggleLockRoom,
    deleteRoom,
} from "../controllers/room.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();


router.use(verifyJWT);

// Room CRUD
router.route("/create").post(createRoom);
router.route("/my-rooms").get(getMyRooms);
router.route("/:roomId").get(getRoomByRoomId);
router.route("/:roomId").patch(updateRoom);
router.route("/:roomId").delete(deleteRoom);

// Room Actions
router.route("/:roomId/join").post(joinRoom);
router.route("/:roomId/leave").post(leaveRoom);
router.route("/:roomId/lock").patch(toggleLockRoom);

export default router;