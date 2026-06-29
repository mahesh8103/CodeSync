import { useState } from "react";
import { X, Copy, Check, Globe, Lock, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

const ViewSnippetModal = ({ snippet, onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(snippet.code);
        setCopied(true);
        toast.success("Code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    if (!snippet) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8"
            onClick={onClose}
        >
            <div
                className="bg-dark-card border border-dark-border rounded-xl w-full max-w-3xl max-h-full overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-dark-border">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 flex-1">
                            {snippet.isPublic ? (
                                <Globe className="w-5 h-5 text-green-400" />
                            ) : (
                                <Lock className="w-5 h-5 text-yellow-400" />
                            )}
                            <h2 className="text-2xl font-bold text-white">
                                {snippet.title}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {snippet.description && (
                        <p className="text-gray-400 mb-3">{snippet.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-400">
                            <User className="w-4 h-4" />
                            {snippet.createdBy?.fullName}
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(snippet.createdAt), "MMM dd, yyyy")}
                        </div>
                        <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">
                            {snippet.language}
                        </span>
                    </div>

                    {snippet.tags && snippet.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                            {snippet.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 text-xs bg-dark-bg text-gray-400 rounded"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="bg-dark-bg rounded-lg p-4 relative">
                        <button
                            onClick={handleCopy}
                            className="absolute top-3 right-3 p-2 bg-dark-card hover:bg-dark-border rounded-lg transition"
                            title="Copy code"
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-green-400" />
                            ) : (
                                <Copy className="w-4 h-4 text-gray-400" />
                            )}
                        </button>
                        <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap pr-12">
                            {snippet.code}
                        </pre>
                    </div>
                </div>

                <div className="p-4 border-t border-dark-border flex justify-end">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition font-medium"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Copy Code
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewSnippetModal;