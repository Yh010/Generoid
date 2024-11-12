import { CodePanel } from "@/components/Editor/Editor";
import * as prettier from "prettier/standalone";
import * as babel from "prettier/parser-babel";

const reactExample = `
  import React from 'react'; const Section = () => { return ( <div className="bg-white shadow-md rounded-lg p-4"> <h2 className="text-xl font-bold mb-2">Section Title</h2> <p className="text-gray-700"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, lectus non commodo suscipit, dolor lectus bibendum nulla, at fermentum justo purus sit amet lacus. </p> </div> ); }; export default Section;
`;

async function formatCode(): Promise<string> {
  try {
    const formatted = await prettier.format(reactExample, {
      parser: "babel",
      plugins: [babel],
      semi: true,
      singleQuote: false,
      printWidth: 80,
      tabWidth: 2,
      trailingComma: "es5",
    });
    return formatted;
  } catch (error) {
    console.error("Prettier formatting error:", error);
    return reactExample;
  }
}

export default async function About() {
  const code = await formatCode();

  return (
    <div className="h-screen w-full mt-2">
      <CodePanel code={code} />
    </div>
  );
}
