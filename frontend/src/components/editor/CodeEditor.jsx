import { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Loader from "../common/Loader.jsx";

const CodeEditor = ({ code, language, onChange, readOnly = false }) => {
    const editorRef = useRef(null);
    const isRemoteUpdate = useRef(false);

    
    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    const handleChange = (value) => {
        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
            return;
        }
        onChange(value || "");
    };

    
    useEffect(() => {
        if (editorRef.current && code !== editorRef.current.getValue()) {
            isRemoteUpdate.current = true;
            const position = editorRef.current.getPosition();
            editorRef.current.setValue(code);
            if (position) {
                editorRef.current.setPosition(position);
            }
        }
    }, [code]);

    return (
        <Editor
            height="100%"
            language={language}
            value={code}
            theme="vs-dark"
            onMount={handleEditorDidMount}
            onChange={handleChange}
            loading={<Loader size="lg" text="Loading editor..." />}
            options={{
                readOnly: readOnly,
                fontSize: 14,
                fontFamily: "Fira Code, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                lineNumbers: "on",
                roundedSelection: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                padding: { top: 16, bottom: 16 }
            }}
        />
    );
};

export default CodeEditor;