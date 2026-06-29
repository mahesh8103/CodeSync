import { Users, Crown } from "lucide-react";

const ParticipantList = ({ participants, ownerId, currentUserId }) => {
    return (
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="text-white font-semibold text-sm">
                    Participants ({participants?.length || 0})
                </h3>
            </div>

            <div className="space-y-2">
                {participants?.map((p) => {
                    const isOwner = p._id === ownerId;
                    const isYou = p._id === currentUserId;

                    return (
                        <div
                            key={p._id}
                            className="flex items-center gap-2 p-2 hover:bg-dark-bg rounded-lg transition"
                        >
                            {/* Avatar */}
                            {p.avatar ? (
                                <img
                                    src={p.avatar}
                                    alt={p.fullName}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                                    {p.fullName?.charAt(0)?.toUpperCase()}
                                </div>
                            )}

                            {/* Name */}
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm truncate flex items-center gap-1">
                                    {p.fullName}
                                    {isOwner && (
                                        <Crown className="w-3 h-3 text-yellow-400" />
                                    )}
                                </p>
                                {isYou && (
                                    <p className="text-xs text-primary">(you)</p>
                                )}
                            </div>

                            {/* Online indicator */}
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ParticipantList;