"use client";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";

export const CodePanel = ({ code }: { code: string }) => {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-b-lg border border-gray-300 bg-gray-200 pt-2 w-full h-full">
      <CodeMirror
        className="w-full h-full"
        value={code}
        theme={vscodeDark}
        extensions={[javascript({ jsx: true, typescript: true })]}
        editable={false}
      />
    </div>
  );
};
