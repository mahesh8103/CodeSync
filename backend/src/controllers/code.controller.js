import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { SUPPORTED_LANGUAGES, getJudge0LanguageId } from "../utils/languageMap.js";


const getSupportedLanguages = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            SUPPORTED_LANGUAGES,
            "Supported languages fetched successfully"
        )
    );
});

const runCode = asyncHandler(async (req, res) => {
    const { sourceCode, language, stdin } = req.body;
    if (!sourceCode || sourceCode.trim() === "") {
        throw new ApiError(400, "Source code is required");
    }
    if (!language) {
        throw new ApiError(400, "Programming language is required");
    }
    const languageId = getJudge0LanguageId(language);

    if (!languageId) {
        throw new ApiError(400, "Unsupported programming language");
    }

    const response = await fetch(process.env.JUDGE0_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-rapidapi-key": process.env.RAPIDAPI_KEY,
            "x-rapidapi-host": process.env.RAPIDAPI_HOST
        },
        body: JSON.stringify({
            source_code: sourceCode,
            language_id: languageId,
            stdin: stdin || ""
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(500, `Judge0 API error: ${errorText}`);
    }

    const result = await response.json();
// format the result for frontend
    let output = "";
    let outputType = "success";

    if (result.compile_output) {
        output = result.compile_output;
        outputType = "compile_error";
    } else if (result.stderr) {
        output = result.stderr;
        outputType = "runtime_error";
    } else if (result.message) {
        output = result.message;
        outputType = "system_error";
    } else if (result.stdout) {
        output = result.stdout;
        outputType = "success";
    } else {
        output = "Program executed successfully with no output.";
        outputType = "success";
    }

    const formattedResult = {
        output,
        outputType,
        status: result.status?.description || "Unknown",
        time: result.time || null,
        memory: result.memory || null,
        language
    };

    return res.status(200).json(
        new ApiResponse(200, formattedResult, "Code executed successfully")
    );
});

export {
    getSupportedLanguages,
    runCode
};