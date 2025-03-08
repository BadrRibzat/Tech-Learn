"use client";
import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";

export default function HtmlEditor({ onSubmit }: { onSubmit: (code: string) => void }) {
  const [code, setCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <title>My HTML Task</title>
</head>
<body>
  <h1>My HTML Task</h1>
  <p>This is a simple HTML document.</p>
  <div>
    <p>This paragraph is inside a div.</p>
  </div>
</body>
</html>`);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    setPreview(code);
  }, [code]);

  return (
    <div className="flex flex-col gap-4 w-96 h-96 border border-tech-muted rounded p-2 bg-tech-bg text-tech-fg">
      <h2 className="text-lg font-bold">HTML Editor</h2>
      <CodeMirror
        value={code}
        height="200px"
        extensions={[html()]}
        onChange={(value) => setCode(value)}
        theme="dark"
        className="border border-tech-muted rounded"
      />
      <div className="border-t border-tech-muted pt-2">
        <h3 className="text-sm font-semibold text-tech-muted">Preview</h3>
        <div dangerouslySetInnerHTML={{ __html: preview }} className="text-sm" />
      </div>
      <button
        onClick={() => onSubmit(code)}
        className="bg-tech-primary text-tech-fg p-2 rounded hover:bg-tech-secondary transition-colors"
      >
        Submit Task
      </button>
    </div>
  );
}
