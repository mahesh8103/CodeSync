import mongoose, { Schema } from "mongoose";
const snippetSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        code: {
            type: String,
            required: true
        },
        language: {
            type: String,
            required: true,
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
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        isPublic: {
            type: Boolean,
            default: false
        },
        tags: [
            {
                type: String,
                trim: true,
                lowercase: true
            }
        ],
        description: {
            type: String,
            default: "",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

export const Snippet = mongoose.model("Snippet", snippetSchema);