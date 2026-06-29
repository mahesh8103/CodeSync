import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare } from "lucide-react";
import { format } from "date-fns";

const ChatPanel = ({ messages, onSendMessage, currentUserId }) => {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(input.trim());
        setInput("");
    };

    return (
        <div className="bg-dark-card border border-dark-border rounded-lg flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2 p-3 border-b border-dark-border">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h3 className="text-white font-semibold text-sm">
                    Chat
                </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">
                        No messages yet. Start chatting!
                    </p>
                ) : (
                    messages.map((msg, idx) => {
                        const isOwn = msg.userId === currentUserId;
                        return (
                            <div
                                key={idx}
                                className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                            >
                                <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                                    isOwn
                                        ? "bg-primary text-white"
                                        : "bg-dark-bg text-gray-200"
                                }`}>
                                    {!isOwn && (
                                        <p className="text-xs font-semibold text-primary mb-1">
                                            {msg.userName}
                                        </p>
                                    )}
                                    <p className="text-sm break-words">{msg.message}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {format(new Date(msg.timestamp), "HH:mm")}
                                </p>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-dark-border">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="p-2 bg-primary hover:bg-primary-dark rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatPanel;