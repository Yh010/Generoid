"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { availablePresets, registerPreset, transform } from "@babel/standalone";
import {
  type TailwindConfig,
  createTailwindcss,
} from "@mhsdesign/jit-browser-tailwindcss";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronsRight } from "lucide-react";

//TODO: REALLY UNDERSTAND WHATS HAPPENING HERE ????
// Register TSX preset
registerPreset("tsx", {
  presets: [
    [availablePresets["typescript"], { allExtensions: true, isTSX: true }],
  ],
});

interface CodeSandboxProps {
  code: string;
  type: "react" | "html" | "javascript";
}

const CodeSandbox = ({ code, type }: CodeSandboxProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  const babelCompile = (code: string, filename: string) =>
    transform(code, {
      filename: filename,
      plugins: [
        [
          "transform-modules-umd",
          {
            globals: { react: "React", "react-dom": "ReactDOM" },
          },
        ],
      ],
      presets: ["tsx", "react"],
    });

  const compileTypescript = async (code: string) => {
    try {
      const compiledComponent = babelCompile(code, `Section.tsx`);
      const app = `
        import React, { useEffect } from 'react';
        import { createRoot } from 'react-dom';
        import Section from './Section.tsx';
        const App = () => {
          return (
            <>
              <Section />
            </>
          )
        }
        createRoot(document.querySelector("#root")).render(<App />)
      `;

      const output = babelCompile(app, "index.tsx");

      const tailwindConfig: TailwindConfig = {
        theme: {
          extend: {
            colors: {},
          },
        },
      };

      const tailwindCss = createTailwindcss({ tailwindConfig });
      const css = await tailwindCss.generateStylesFromContent(
        `
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
        `,
        [compiledComponent.code || "", output.code || ""]
      );

      return `<!DOCTYPE html>
        <html lang="en">
          <head>
            <style>${css}</style>
          </head>
          <body style="background-color:#fff">
            <div id="root"></div>
            <script crossorigin defer src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
            <script crossorigin defer src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
            <script defer>window.addEventListener("DOMContentLoaded", () => {${[
              compiledComponent.code,
              output.code,
            ].join("\n")}});</script>
          </body>
        </html>
      `;
    } catch (err) {
      console.error("Compilation error:", err);
      throw err;
    }
  };

  const getHTMLContent = async (code: string, type: string) => {
    if (type === "html") {
      return code;
    }

    if (type === "react") {
      return await compileTypescript(code);
    }

    if (type === "javascript") {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
          </head>
          <body>
            <div id="output"></div>
            <script>
              const console = {
                log: (...args) => {
                  const output = document.getElementById('output');
                  output.innerHTML += args.join(' ') + '<br>';
                }
              };
              ${code}
            </script>
          </body>
        </html>
      `;
    }

    return "";
  };

  useEffect(() => {
    const updateIframe = async () => {
      if (!iframeRef.current) return;

      try {
        const htmlContent = await getHTMLContent(code, type);
        const iframe = iframeRef.current;
        iframe.srcdoc = htmlContent;
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    updateIframe();
  }, [code, type]);

  return (
    <Card className="w-full h-full">
      <div className="h-full">
        <div className="bg-gray-50 rounded-lg h-full">
          <div className="flex justify-between items-center border-b p-2">
            <div className="flex justify-center items-center space-x-2">
              {" "}
              <ChevronsRight /> Component Name
            </div>
            <Tabs defaultValue="code" className="">
              <TabsList>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              {/* <TabsContent value="account">
                Make changes to your account here.
              </TabsContent>
              <TabsContent value="password">
                Change your password here.
              </TabsContent> */}
            </Tabs>
          </div>
          <iframe
            ref={iframeRef}
            className="w-full h-full px-4 object-contain"
            sandbox="allow-scripts"
            title="code-preview"
          />
        </div>
        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
      </div>
    </Card>
  );
};

export default CodeSandbox;
