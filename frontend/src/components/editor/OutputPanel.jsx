import { Terminal, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

const OutputPanel = ({ output }) => {

    const getColor = () => {
        if (!output) return "text-gray-400";
        switch (output.outputType) {
            case "success":          return "text-green-400";
            case "compile_error":    return "text-red-400";
            case "runtime_error":    return "text-orange-400";
            case "system_error":     return "text-yellow-400";
            default:                 return "text-gray-300";
        }
    };

    // Icon based on output type
    const getIcon = () => {
        if (!output) return <Terminal className="w-5 h-5 text-gray-400" />;
        switch (output.outputType) {
            case "success":          return <CheckCircle className="w-5 h-5 text-green-400" />;
            case "compile_error":    return <XCircle className="w-5 h-5 text-red-400" />;
            case "runtime_error":    return <XCircle className="w-5 h-5 text-orange-400" />;
            case "system_error":     return <AlertCircle className="w-5 h-5 text-yellow-400" />;
            default:                 return <Terminal className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="bg-dark-bg border-t border-dark-border h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-dark-border bg-dark-card">
                <div className="flex items-center gap-2">
                    {getIcon()}
                    <span className="text-sm font-medium text-white">Output</span>
                </div>

                {/* Stats */}
                {output && (
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        {output.time && (
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {output.time}s
                            </div>
                        )}
                        {output.memory && (
                            <div>{output.memory} KB</div>
                        )}
                        <span className={getColor()}>
                            {output.status}
                        </span>
                    </div>
                )}
            </div>

            {/* Output body */}
            <div className="flex-1 overflow-auto p-4">
                {output ? (
                    <pre className={`text-sm font-mono whitespace-pre-wrap ${getColor()}`}>
                        {output.output}
                    </pre>
                ) : (
                    <p className="text-gray-500 text-sm">
                        Click "Run Code" to see output here...
                    </p>
                )}
            </div>
        </div>
    );
};

export default OutputPanel;