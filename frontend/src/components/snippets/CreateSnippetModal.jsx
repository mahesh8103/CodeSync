import { useState } from "react";
import { X, Globe, Lock } from "lucide-react";
import toast from "react-hot-toast";

import { snippetAPI } from "../../api/snippetAPI.js";
import Loader from "../common/Loader.jsx";

const LANGUAGES = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python",     value: "python"     },
    { label: "Java",       value: "java"       },
    { label: "C++",        value: "cpp"        },
    { label: "C",          value: "c"          },
    { label: "TypeScript", value: "typescript" },
    { label: "Go",         value: "go"         },
    { label: "Rust",       value: "rust"       },
    { label: "PHP",        value: "php"        },
    { label: "Ruby",       value: "ruby"       },
];

const CreateSnippetModal = ({ onClose, onCreated, initialCode = "", initialLanguage = "javascript" }) => {
    const [loading, setLoading] = useState(false);
    const [isPublic, setIsPublic] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        code: initialCode,
        language: initialLanguage,
        tagsInput: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title.trim()) {
            toast.error("Title is required");
            return;
        }
        if (!form.code.trim()) {
            toast.error("Code is required");
            return;
        }

        const tags = form.tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        setLoading(true);
        try {
            const response = await snippetAPI.createSnippet({
                title: form.title.trim(),
                description: form.description.trim(),
                code: form.code,
                language: form.language,
                isPublic,
                tags
            });
            toast.success("Snippet saved!");
            onCreated(response.data);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8"
            onClick={onClose}
        >
            <div
                className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-2xl max-h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Save Snippet</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            placeholder="My Awesome Snippet"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description (optional)
                        </label>
                        <textarea
                            placeholder="What does this code do?"
                            rows={2}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Language
                            </label>
                            <select
                                value={form.language}
                                onChange={(e) => setForm({ ...form, language: e.target.value })}
                                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                            >
                                {LANGUAGES.map((l) => (
                                    <option key={l.value} value={l.value}>{l.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                placeholder="algorithm, sorting, dp"
                                value={form.tagsInput}
                                onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
                                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Code *
                        </label>
                        <textarea
                            placeholder="Paste your code here..."
                            rows={10}
                            value={form.code}
                            onChange={(e) => setForm({ ...form, code: e.target.value })}
                            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white font-mono text-sm resize-none"
                        />
                    </div>

                   <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
    <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
            {isPublic ? (
                <Globe className="w-5 h-5 text-green-400" />
            ) : (
                <Lock className="w-5 h-5 text-yellow-400" />
            )}
            <span className="text-white font-semibold">
                {isPublic ? "Public Snippet" : "Private Snippet"}
            </span>
        </div>

       <button
    type="button"
    onClick={() => setIsPublic(!isPublic)}
    className={`w-14 h-7 rounded-full transition-colors relative ${
        isPublic ? "bg-green-500" : "bg-gray-600"
    }`}
>
    <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${
        isPublic ? "translate-x-7" : "translate-x-0"
    }`} />
</button>
    </div>

    <p className={`text-xs ${isPublic ? "text-green-400" : "text-yellow-400"}`}>
        {isPublic
            ? "✓ Anyone can view this snippet in Public Feed"
            : "🔒 Only you can see this snippet in My Snippets"}
    </p>
</div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-dark-border rounded-lg text-gray-400 hover:text-white transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold text-white transition disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? <Loader size="sm" /> : "Save Snippet"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSnippetModal;