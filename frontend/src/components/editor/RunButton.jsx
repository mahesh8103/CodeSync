import { Play } from "lucide-react";
import Loader from "../common/Loader.jsx";

const RunButton = ({ onClick, loading }) => {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? (
                <>
                    <Loader size="sm" />
                    <span>Running...</span>
                </>
            ) : (
                <>
                    <Play className="w-4 h-4" />
                    <span>Run Code</span>
                </>
            )}
        </button>
    );
};

export default RunButton;