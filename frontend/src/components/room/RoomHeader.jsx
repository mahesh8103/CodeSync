import { Link } from "react-router-dom";
import {Code2, LogOut, Lock, Globe,Wifi, WifiOff, ArrowLeft} from "lucide-react";

const RoomHeader = ({ room, isConnected, isOwner, onBack, onLeave }) => {
    return (
        <header className="bg-dark-card border-b border-dark-border px-4 py-3">
            <div className="flex justify-between items-center">

                {/* Left: Logo + Room Info */}
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <Code2 className="w-6 h-6 text-primary" />
                        <span className="text-lg font-bold text-white hidden sm:block">
                            CodeSync
                        </span>
                    </Link>

                    <div className="h-6 w-px bg-dark-border" />

                    <div className="flex items-center gap-2">
                        {room?.isPrivate ? (
                            <Lock className="w-4 h-4 text-yellow-400" />
                        ) : (
                            <Globe className="w-4 h-4 text-green-400" />
                        )}
                        <div>
                            <h1 className="text-white font-semibold text-sm">
                                {room?.name}
                            </h1>
                            <p className="text-xs text-gray-400 font-mono">
                                ID: {room?.roomId}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">

                    {/* Connection Status */}
                    <div className="flex items-center gap-1.5">
                        {isConnected ? (
                            <>
                                <Wifi className="w-4 h-4 text-green-400" />
                                <span className="text-xs text-green-400 hidden md:block">
                                    Connected
                                </span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-4 h-4 text-red-400" />
                                <span className="text-xs text-red-400 hidden md:block">
                                    Disconnected
                                </span>
                            </>
                        )}
                    </div>

                    {/*  Back to Dashboard */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-3 py-1.5 bg-dark-bg border border-dark-border hover:border-primary text-gray-300 hover:text-white rounded-lg text-sm transition"
                        title="Back to dashboard (room stays active)"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:block">Dashboard</span>
                    </button>

                    {/* Leave Button */}
                    <button
                        onClick={onLeave}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
                        title={isOwner ? "Delete room (you are owner)" : "Leave room"}
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:block">
                            {isOwner ? "Delete" : "Leave"}
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default RoomHeader;