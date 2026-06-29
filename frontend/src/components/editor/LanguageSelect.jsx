import { Languages } from "lucide-react";

const LANGUAGES = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python",     value: "python"     },
    { label: "Java",       value: "java"       },
    { label: "C++",        value: "cpp"        },
    { label: "C",          value: "c"          },
    { label: "TypeScript", value: "typescript" },
    { label: "Go",         value: "go"         },
    { label: "Rust",       value: "rust"       },
    { label: "PHP",        value: "php"        },
    { label: "Ruby",       value: "ruby"       },
];

const LanguageSelect = ({ language, onChange, disabled }) => {
    return (
        <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-400" />
            <select
                value={language}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="bg-dark-bg border border-dark-border text-white text-sm px-3 py-2 rounded-lg focus:border-primary focus:outline-none disabled:opacity-50"
            >
                {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                        {lang.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelect;