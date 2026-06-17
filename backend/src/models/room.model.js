import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema(
    {
        roomId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        code: {
            type: String,
            default: "// Start coding here...\n"
        },
        language: {
            type: String,
            default: "javascript",
            enum: [
                "javascript",
                "python",
                "java",
                "cpp",
                "c",
                "typescript",
                "go",
                "rust",
                "php",
                "ruby"
            ]
        },
        isPrivate: {
            type: Boolean,
            default: false
        },
        password: {
            type: String,
            default: null
        },
        isLocked: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        maxParticipants: {
            type: Number,
            default: 10
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
    },
    {
        timestamps: true
    }
);

roomSchema.statics.generateRoomId = function () {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let roomId = "";
    for (let i = 0; i < 6; i++) {
        roomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return roomId;
};

roomSchema.methods.isFull = function () {
    return this.participants.length >= this.maxParticipants;
};

roomSchema.methods.isParticipant = function (userId) {
    return this.participants.some(
        (participant) => participant.toString() === userId.toString()
    );
};

roomSchema.methods.isOwner = function (userId) {
    return this.createdBy.toString() === userId.toString();
};

export const Room = mongoose.model("Room", roomSchema);