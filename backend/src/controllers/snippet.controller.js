import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Snippet } from "../models/snippet.model.js";
import { User } from "../models/user.model.js";

const createSnippet = asyncHandler(async (req, res) => {

    const { title, code, language, isPublic, tags, description } = req.body;

    if (!title || title.trim() === "") {
        throw new ApiError(400, "Snippet title is required");
    }

    if (!code || code.trim() === "") {
        throw new ApiError(400, "Code is required");
    }

    if (!language) {
        throw new ApiError(400, "Programming language is required");
    }

    const snippet = await Snippet.create({
        title: title.trim(),
        code,
        language,
        createdBy: req.user._id,
        isPublic: isPublic || false,
        tags: tags || [],
        description: description || ""
    });
    await User.findByIdAndUpdate(req.user._id, {
        $push: { savedSnippets: snippet._id }
    });
    const populatedSnippet = await Snippet.findById(snippet._id)
        .populate("createdBy", "fullName email avatar");

    return res.status(201).json(
        new ApiResponse(201, populatedSnippet, "Snippet saved successfully")
    );
});

const getMySnippets = asyncHandler(async (req, res) => {

    const snippets = await Snippet.find({ createdBy: req.user._id })
        .populate("createdBy", "fullName email avatar")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, snippets, "Snippets fetched successfully")
    );
});

const getPublicSnippets = asyncHandler(async (req, res) => {

    const { language } = req.query;

    const filter = { isPublic: true };
    if (language) {
        filter.language = language;
    }

    const snippets = await Snippet.find(filter)
        .populate("createdBy", "fullName email avatar")
        .sort({ createdAt: -1 })
        .limit(25); 
        
    return res.status(200).json(
        new ApiResponse(200, snippets, "Public snippets fetched")
    );
});

const getSnippetById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const snippet = await Snippet.findById(id)
        .populate("createdBy", "fullName email avatar");

    if (!snippet) {
        throw new ApiError(404, "Snippet not found");
    }
    if (!snippet.isPublic &&
        snippet.createdBy._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "This snippet is private");
    }

    return res.status(200).json(
        new ApiResponse(200, snippet, "Snippet fetched")
    );
});

const updateSnippet = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { title, code, language, isPublic, tags, description } = req.body;

    const snippet = await Snippet.findById(id);

    if (!snippet) {
        throw new ApiError(404, "Snippet not found");
    }

    if (snippet.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update your own snippets");
    }

    // Update fields
    if (title) snippet.title = title.trim();
    if (code) snippet.code = code;
    if (language) snippet.language = language;
    if (typeof isPublic === "boolean") snippet.isPublic = isPublic;
    if (tags) snippet.tags = tags;
    if (description !== undefined) snippet.description = description;

    await snippet.save();

    const updatedSnippet = await Snippet.findById(id)
        .populate("createdBy", "fullName email avatar");

    return res.status(200).json(
        new ApiResponse(200, updatedSnippet, "Snippet updated successfully")
    );
});

const deleteSnippet = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const snippet = await Snippet.findById(id);

    if (!snippet) {
        throw new ApiError(404, "Snippet not found");
    }

    if (snippet.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only delete your own snippets");
    }

    await Snippet.findByIdAndDelete(id);

    await User.findByIdAndUpdate(req.user._id, {
        $pull: { savedSnippets: id }
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Snippet deleted successfully")
    );
});


export {
    createSnippet,
    getMySnippets,
    getPublicSnippets,
    getSnippetById,
    updateSnippet,
    deleteSnippet
};