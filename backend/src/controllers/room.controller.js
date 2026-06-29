import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Room } from "../models/room.model.js";
import { User } from "../models/user.model.js";

const createRoom = asyncHandler(async (req, res) => {

    const { name, language, isPrivate, password, maxParticipants } = req.body;

    if (!name || name.trim() === "") {
        throw new ApiError(400, "Room name is required");
    }

    if (isPrivate && (!password || password.trim() === "")) {
        throw new ApiError(400, "Password is required for private rooms");
    }

    let roomId;
    let isUnique = false;

    while (!isUnique) {
        roomId = Room.generateRoomId();
        const existingRoom = await Room.findOne({ roomId });
        if (!existingRoom) {
            isUnique = true;
        }
    }

    const room = await Room.create({
        roomId,
        name: name.trim(),
        createdBy: req.user._id,
        language: language || "javascript",
        isPrivate: isPrivate || false,
        password: isPrivate ? password : null,
        maxParticipants: maxParticipants || 10,
        participants: [req.user._id] 
    });

    await User.findByIdAndUpdate(req.user._id, {
        $push: { roomsCreated: room._id }
    });

    const populatedRoom = await Room.findById(room._id)
        .populate("createdBy", "fullName email avatar")
        .populate("participants", "fullName email avatar")
        .select("-password");

    return res.status(201).json(
        new ApiResponse(201, populatedRoom, "Room created successfully")
    );
});


const getMyRooms = asyncHandler(async (req, res) => {

    const rooms = await Room.find({
        $or: [
            { createdBy: req.user._id },
            { participants: req.user._id }
        ],
        isActive: true
    })
        .populate("createdBy", "fullName email avatar")
        .populate("participants", "fullName email avatar")
        .select("-password")
        .sort({ updatedAt: -1 }); // Latest first

    return res.status(200).json(
        new ApiResponse(200, rooms, "Rooms fetched successfully")
    );
});

const getRoomByRoomId = asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId, isActive: true })
        .populate("createdBy", "fullName email avatar")
        .populate("participants", "fullName email avatar");

    if (!room) {
        throw new ApiError(404, "Room not found or expired");
    }

    const userId = req.user._id.toString();
    const isOwner = room.createdBy._id.toString() === userId;
    const isParticipant = room.participants.some(
        (p) => p._id.toString() === userId
    );

    if (isOwner || isParticipant) {
        const roomData = room.toObject();
        delete roomData.password;
        return res.status(200).json(
            new ApiResponse(200, roomData, "Room fetched successfully")
        );
    }

    if (room.isPrivate) {
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    roomId: room.roomId,
                    name: room.name,
                    isPrivate: true,
                    isLocked: room.isLocked,
                    requiresPassword: true
                },
                "Room requires password to join"
            )
        );
    }

    const roomData = room.toObject();
    delete roomData.password;
    return res.status(200).json(
        new ApiResponse(200, roomData, "Room fetched successfully")
    );
});

const joinRoom = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const { password } = req.body;

    const room = await Room.findOne({ roomId, isActive: true });

    if (!room) {
        throw new ApiError(404, "Room not found or expired");
    }

    if (room.isLocked) {
        throw new ApiError(403, "Room is locked. No new participants allowed");
    }

    if (room.isParticipant(req.user._id)) {
        const populatedRoom = await Room.findOne({ roomId })
            .populate("createdBy", "fullName email avatar")
            .populate("participants", "fullName email avatar")
            .select("-password");

        return res.status(200).json(
            new ApiResponse(200, populatedRoom, "Already in room")
        );
    }
    if (room.isFull()) {
        throw new ApiError(403, "Room is full");
    }

    if (room.isPrivate) {
        if (!password) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        requiresPassword: true,
                        roomId: room.roomId,
                        name: room.name,
                        isPrivate: true
                    },
                    "Password required for this private room"
                )
            );
        }
        if (password !== room.password) {
            throw new ApiError(401, "Incorrect room password");
        }
    }

    room.participants.push(req.user._id);
    await room.save({ validateBeforeSave: false });

    const populatedRoom = await Room.findOne({ roomId })
        .populate("createdBy", "fullName email avatar")
        .populate("participants", "fullName email avatar")
        .select("-password");

    return res.status(200).json(
        new ApiResponse(200, populatedRoom, "Joined room successfully")
    );
});


const leaveRoom = asyncHandler(async (req, res) => {

    const { roomId } = req.params;

    const room = await Room.findOne({ roomId, isActive: true });

    if (!room) {
        throw new ApiError(404, "Room not found");
    }
    if (!room.isParticipant(req.user._id)) {
        throw new ApiError(400, "You are not in this room");
    }

    if (room.isOwner(req.user._id)) {
        room.isActive = false;
        await room.save({ validateBeforeSave: false });

        return res.status(200).json(
            new ApiResponse(200, {}, "Room closed as owner left")
        );
    }

    room.participants = room.participants.filter(
        (participant) => participant.toString() !== req.user._id.toString()
    );
    await room.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, {}, "Left room successfully")
    );
});

const updateRoom = asyncHandler(async (req, res) => {

    const { roomId } = req.params;
    const { name, language, isPrivate, password, maxParticipants } = req.body;

    const room = await Room.findOne({ roomId, isActive: true });

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    if (!room.isOwner(req.user._id)) {
        throw new ApiError(403, "Only room owner can update room settings");
    }

    if (name) room.name = name.trim();
    if (language) room.language = language;
    if (typeof isPrivate === "boolean") {
        room.isPrivate = isPrivate;
        if (isPrivate && password) {
            room.password = password;
        }
        if (!isPrivate) {
            room.password = null;
        }
    }
    if (maxParticipants) room.maxParticipants = maxParticipants;

    await room.save({ validateBeforeSave: false });

    const updatedRoom = await Room.findOne({ roomId })
        .populate("createdBy", "fullName email avatar")
        .populate("participants", "fullName email avatar")
        .select("-password");

    return res.status(200).json(
        new ApiResponse(200, updatedRoom, "Room updated successfully")
    );
});

const toggleLockRoom = asyncHandler(async (req, res) => {

    const { roomId } = req.params;

    const room = await Room.findOne({ roomId, isActive: true });

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    if (!room.isOwner(req.user._id)) {
        throw new ApiError(403, "Only room owner can lock/unlock room");
    }

    room.isLocked = !room.isLocked;
    await room.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            { isLocked: room.isLocked },
            room.isLocked ? "Room locked" : "Room unlocked"
        )
    );
});

const deleteRoom = asyncHandler(async (req, res) => {

    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    if (!room.isOwner(req.user._id)) {
        throw new ApiError(403, "Only room owner can delete room");
    }

    room.isActive = false;
    await room.save({ validateBeforeSave: false });

    await User.findByIdAndUpdate(req.user._id, {
        $pull: { roomsCreated: room._id }
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Room deleted successfully")
    );
});


export {
    createRoom,
    getMyRooms,
    getRoomByRoomId,
    joinRoom,
    leaveRoom,
    updateRoom,
    toggleLockRoom,
    deleteRoom,
};