import { useState } from "react";
import { Copy, Check, Eye, Trash2, Globe, Lock, Code2, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

const SnippetCard = ({ snippet, isOwner, onView, onDelete }) => {
    const [copied, setCopied] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(snippet.code);
        setCopied(true);
        toast.success("Code copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm("Delete this snippet?")) return;
        setDeleting(true);
        await onDelete(snippet._id);
        setDeleting(false);
    };

    const getLangColor = (lang) => {
        const colors = {
            javascript: "bg-yellow-500/20 text-yellow-400",
            python:     "bg-blue-500/20 text-blue-400",
            java:       "bg-orange-500/20 text-orange-400",
            cpp:        "bg-purple-500/20 text-purple-400",
            c:          "bg-gray-500/20 text-gray-400",
            typescript: "bg-blue-600/20 text-blue-300",
            go:         "bg-cyan-500/20 text-cyan-400",
            rust:       "bg-red-500/20 text-red-400",
            php:        "bg-indigo-500/20 text-indigo-400",
            ruby:       "bg-pink-500/20 text-pink-400",
        };
        return colors[lang] || "bg-gray-500/20 text-gray-400";
    };

    return (
        <div
            onClick={() => onView(snippet)}
            className="bg-dark-card border border-dark-border rounded-xl p-5 cursor-pointer hover:border-primary transition group"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {snippet.isPublic ? (
                        <Globe className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : (
                        <Lock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    )}
                    <h3 className="font-semibold text-white truncate">
                        {snippet.title}
                    </h3>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handleCopy}
                        className="p-1.5 text-gray-500 hover:text-white transition"
                        title="Copy code"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-400" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>

                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="p-1.5 text-gray-500 hover:text-red-400 transition"
                            title="Delete snippet"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {snippet.description && (
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {snippet.description}
                </p>
            )}

            <div className="bg-dark-bg rounded-lg p-3 mb-3 overflow-hidden">
                <pre className="text-xs text-gray-300 font-mono line-clamp-3">
                    {snippet.code}
                </pre>
            </div>

            <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getLangColor(snippet.language)}`}>
                    {snippet.language}
                </span>

                {snippet.tags && snippet.tags.length > 0 && (
                    <div className="flex gap-1">
                        {snippet.tags.slice(0, 2).map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-0.5 text-xs bg-dark-bg text-gray-400 rounded"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {snippet.createdBy?.fullName || "Unknown"}
                </div>
                <span>
                    {formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}
                </span>
            </div>
        </div>
    );
};

export default SnippetCard;