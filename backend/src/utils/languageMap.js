export const SUPPORTED_LANGUAGES = [
    {
        label: "JavaScript",
        value: "javascript",
        judge0Id: 63,
        fileExtension: "js"
    },
    {
        label: "Python",
        value: "python",
        judge0Id: 71,
        fileExtension: "py"
    },
    {
        label: "Java",
        value: "java",
        judge0Id: 62,
        fileExtension: "java"
    },
    {
        label: "C++",
        value: "cpp",
        judge0Id: 54,
        fileExtension: "cpp"
    },
    {
        label: "C",
        value: "c",
        judge0Id: 50,
        fileExtension: "c"
    },
    {
        label: "TypeScript",
        value: "typescript",
        judge0Id: 74,
        fileExtension: "ts"
    },
    {
        label: "Go",
        value: "go",
        judge0Id: 60,
        fileExtension: "go"
    },
    {
        label: "Rust",
        value: "rust",
        judge0Id: 73,
        fileExtension: "rs"
    },
    {
        label: "PHP",
        value: "php",
        judge0Id: 68,
        fileExtension: "php"
    },
    {
        label: "Ruby",
        value: "ruby",
        judge0Id: 72,
        fileExtension: "rb"
    }
];

export const getJudge0LanguageId = (language) => {
    const foundLanguage = SUPPORTED_LANGUAGES.find(
        (lang) => lang.value === language
    );

    return foundLanguage ? foundLanguage.judge0Id : null;
};