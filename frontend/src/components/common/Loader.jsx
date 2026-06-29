const Loader = ({ size = "md", text = "" }) => {

    const sizes = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-3",
        lg: "w-12 h-12 border-4"
    };

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div
                className={`
                    ${sizes[size]}
                    border-gray-600 border-t-primary
                    rounded-full animate-spin
                `}
            />
            {text && (
                <p className="text-gray-400 text-sm">{text}</p>
            )}
        </div>
    );
};

export default Loader;