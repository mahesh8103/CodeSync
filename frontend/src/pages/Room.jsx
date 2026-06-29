import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { roomAPI } from "../api/roomAPI.js";
import { codeAPI } from "../api/codeAPI.js";
import useSocket from "../hooks/useSocket.js";
import { Lock, Save } from "lucide-react";
import CreateSnippetModal from "../components/snippets/CreateSnippetModal.jsx";

import RoomHeader from "../components/room/RoomHeader.jsx";
import ParticipantList from "../components/room/ParticipantList.jsx";
import ChatPanel from "../components/room/ChatPanel.jsx";
import ShareLink from "../components/room/ShareLink.jsx";
import CodeEditor from "../components/editor/CodeEditor.jsx";
import LanguageSelect from "../components/editor/LanguageSelect.jsx";
import RunButton from "../components/editor/RunButton.jsx";
import OutputPanel from "../components/editor/OutputPanel.jsx";
import Loader from "../components/common/Loader.jsx";


const PasswordModal = ({ roomName, onSubmit, onCancel, loading }) => {
    const [password, setPassword] = useState("");
    

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!password.trim()) {
            toast.error("Password is required");
            return;
        }
        onSubmit(password);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md">
                <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-xl font-bold text-white">Private Room</h2>
                </div>

                <p className="text-gray-400 mb-4">
                    <span className="text-white font-semibold">{roomName}</span> is a private room.
                    Enter the password to join.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        autoFocus
                        placeholder="Enter room password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                    />

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 border border-dark-border rounded-lg text-gray-400 hover:text-white transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold text-white transition disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? <Loader size="sm" /> : "Join Room"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const Room = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { socket, isConnected } = useSocket();

    const [room, setRoom] = useState(null);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joined, setJoined] = useState(false);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [privateRoomName, setPrivateRoomName] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [output, setOutput] = useState(null);
    const [running, setRunning] = useState(false);

    const [messages, setMessages] = useState([]);

    const [showSnippetModal, setShowSnippetModal] = useState(false);

    const setRoomData = useCallback((roomData) => {
        setRoom(roomData);
        setCode(roomData.code || "");
        setLanguage(roomData.language || "javascript");
        setParticipants(roomData.participants || []);
        setJoined(true);
        setLoading(false);
    }, []);

    const joinRoomFlow = useCallback(async (password = null) => {
        try {
            const payload = password ? { password } : {};
            const response = await roomAPI.joinRoom(roomId, payload);

            if (response.data?.requiresPassword === true) {
                setPrivateRoomName(response.data.name);
                setShowPasswordModal(true);
                setLoading(false);
                return;
            }

            setRoomData(response.data);
            setShowPasswordModal(false);
            toast.success("Joined room successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to join");
            navigate("/dashboard");
        } finally {
            setPasswordLoading(false);
        }
    }, [roomId, navigate, setRoomData]);

    const checkAndJoinRoom = useCallback(async () => {
        try {
            const response = await roomAPI.getRoomById(roomId);
            const roomData = response.data;

            if (roomData.requiresPassword === true) {
                setPrivateRoomName(roomData.name);
                setShowPasswordModal(true);
                setLoading(false);
                return;
            }

            const userIdStr = user._id.toString();
            const isOwner = roomData.createdBy?._id?.toString() === userIdStr;
            const isParticipant = roomData.participants?.some(
                (p) => p._id?.toString() === userIdStr
            );

            if (isOwner || isParticipant) {
                setRoomData(roomData);
                return;
            }

            await joinRoomFlow();
        } catch (error) {
            toast.error(error.response?.data?.message || "Room not found");
            navigate("/dashboard");
        }
    }, [roomId, user, navigate, setRoomData, joinRoomFlow]);

    const refetchParticipants = useCallback(async () => {
        try {
            const response = await roomAPI.getRoomById(roomId);
            if (response.data?.participants) {
                setParticipants(response.data.participants);
            }
        } catch (error) {
            //
        }
    }, [roomId]);

    useEffect(() => {
        if (user && user._id) {
            checkAndJoinRoom();
        }
    }, [roomId, user, checkAndJoinRoom]);

    useEffect(() => {
        if (!socket || !isConnected || !user || !joined) return;

        socket.emit("join-room", {
            roomId,
            userId: user._id,
            userName: user.fullName
        });

        socket.on("room-joined", (data) => {
            if (data.code !== undefined) setCode(data.code);
            if (data.language) setLanguage(data.language);
        });

        socket.on("code-updated", (data) => {
            setCode(data.code);
        });

        socket.on("language-updated", (data) => {
            setLanguage(data.language);
            toast.success(`${data.userName} changed language to ${data.language}`);
        });

        socket.on("user-joined", (data) => {
            toast.success(data.message);
            refetchParticipants();
        });

        socket.on("user-left", (data) => {
            toast(data.message, { icon: "👋" });
            refetchParticipants();
        });

        socket.on("receive-message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on("room-deleted", (data) => {
            toast.error(data.message || "Room has been deleted by owner");
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
        });

        socket.on("error", (data) => {
            toast.error(data.message);
        });

        return () => {
            socket.off("room-joined");
            socket.off("code-updated");
            socket.off("language-updated");
            socket.off("user-joined");
            socket.off("user-left");
            socket.off("receive-message");
            socket.off("room-deleted");
            socket.off("error");
        };
    }, [socket, isConnected, user, roomId, joined, navigate, refetchParticipants]);

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        if (socket && isConnected) {
            socket.emit("code-change", { roomId, code: newCode });
        }
    };

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        if (socket && isConnected) {
            socket.emit("language-change", { roomId, language: newLang });
        }
    };

    const handleRunCode = async () => {
        if (!code.trim()) {
            toast.error("Code is empty");
            return;
        }

        setRunning(true);
        setOutput(null);

        try {
            const response = await codeAPI.runCode({
                sourceCode: code,
                language: language,
                stdin: ""
            });
            setOutput(response.data);
            toast.success("Code executed!");
        } catch (error) {
            const message = error.response?.data?.message || "Execution failed";
            toast.error(message);
            setOutput({
                output: message,
                outputType: "system_error",
                status: "Error"
            });
        } finally {
            setRunning(false);
        }
    };

    const handleSendMessage = (message) => {
        if (socket && isConnected) {
            socket.emit("send-message", { roomId, message });
        }
    };

    const handlePasswordSubmit = async (password) => {
        setPasswordLoading(true);
        await joinRoomFlow(password);
    };

    const handlePasswordCancel = () => {
        navigate("/dashboard");
    };

    const handleBackToDashboard = () => {
        if (socket) {
            socket.emit("leave-room", { roomId });
        }
        navigate("/dashboard");
    };

    const handleLeave = async () => {
        const isOwner = room?.createdBy?._id === user?._id;

        const message = isOwner
            ? "You are the owner. Leaving will DELETE the room for everyone. Continue?"
            : "Are you sure you want to leave this room?";

        if (!window.confirm(message)) return;

        try {
            if (isOwner && socket) {
                socket.emit("delete-room", { roomId });
            }
            if (socket) socket.emit("leave-room", { roomId });
            await roomAPI.leaveRoom(roomId);
            toast.success(isOwner ? "Room deleted" : "Left room");
            navigate("/dashboard");
        } catch (error) {
            toast.error("Failed to leave");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <Loader size="lg" text="Loading room..." />
            </div>
        );
    }

    if (showPasswordModal) {
        return (
            <>
                <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                    <Loader size="lg" text="Waiting for password..." />
                </div>
                <PasswordModal
                    roomName={privateRoomName}
                    onSubmit={handlePasswordSubmit}
                    onCancel={handlePasswordCancel}
                    loading={passwordLoading}
                />
            </>
        );
    }

    if (!joined) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <Loader size="lg" text="Joining room..." />
            </div>
        );
    }

    return (
        <div className="h-screen bg-dark-bg flex flex-col overflow-hidden">

            <RoomHeader
                room={room}
                isConnected={isConnected}
                isOwner={room?.createdBy?._id === user?._id}
                onBack={handleBackToDashboard}
                onLeave={handleLeave}
            />

            <div className="flex-1 flex overflow-hidden">

                <aside className="w-64 bg-dark-bg border-r border-dark-border p-3 space-y-3 overflow-y-auto hidden lg:block">
                    <ShareLink roomId={roomId} />
                    <ParticipantList
                        participants={participants}
                        ownerId={room?.createdBy?._id}
                        currentUserId={user?._id}
                    />
                </aside>

                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-2 bg-dark-card border-b border-dark-border">
    <LanguageSelect
        language={language}
        onChange={handleLanguageChange}
        disabled={running}
    />
    <div className="flex items-center gap-2">
        <button
            onClick={() => setShowSnippetModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-dark-bg border border-dark-border hover:border-primary text-gray-300 hover:text-white rounded-lg font-medium transition"
        >
            <Save className="w-4 h-4" />
            <span className="hidden sm:block">Save Snippet</span>
        </button>
        <RunButton onClick={handleRunCode} loading={running} />
    </div>
</div>

                    <div className="flex-1 overflow-hidden">
                        <CodeEditor
                            code={code}
                            language={language}
                            onChange={handleCodeChange}
                        />
                    </div>

                    <div className="h-64">
                        <OutputPanel output={output} />
                    </div>
                </main>

                <aside className="w-80 border-l border-dark-border hidden xl:block">
                    <ChatPanel
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        currentUserId={user?._id}
                    />
                </aside>
                {showSnippetModal && (
    <CreateSnippetModal
        onClose={() => setShowSnippetModal(false)}
        onCreated={() => toast.success("Snippet saved! View in Snippets page")}
        initialCode={code}
        initialLanguage={language}
    />
)}
            </div>
        </div>
    );
};

export default Room;