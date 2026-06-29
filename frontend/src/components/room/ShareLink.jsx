import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

const ShareLink = ({ roomId }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const shareUrl = `${window.location.origin}/room/${roomId}`;

    return (
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
                <Share2 className="w-4 h-4 text-primary" />
                <h3 className="text-white font-semibold text-sm">
                    Share Room
                </h3>
            </div>

            {/* Room ID */}
            <div className="mb-3">
                <label className="text-xs text-gray-400 mb-1 block">Room ID</label>
                <div className="flex gap-2">
                    <input
                        readOnly
                        value={roomId}
                        className="flex-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm font-mono"
                    />
                    <button
                        onClick={() => handleCopy(roomId)}
                        className="p-2 bg-dark-bg border border-dark-border hover:border-primary rounded-lg text-gray-400 hover:text-white transition"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-400" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Share Link */}
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Share Link</label>
                <button
                    onClick={() => handleCopy(shareUrl)}
                    className="w-full px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                >
                    <Copy className="w-4 h-4" />
                    Copy Invite Link
                </button>
            </div>
        </div>
    );
};

export default ShareLink;