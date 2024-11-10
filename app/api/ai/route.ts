import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const extractFirstCodeBlock = (input: string) => {
  const pattern = /```(\w+)?\n([\s\S]+?)\n```/g;
  let matches;
  while ((matches = pattern.exec(input)) !== null) {
    const language = matches[1];
    const codeBlock = matches[2];
    if (language === undefined || language === "tsx" || language === "jsx" || language === "typescript") {
      return codeBlock as string;
    }
  }
  throw new Error("No code block found in input");
};

// async function generateNewComponent(prompt: string) {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
//   const systemPrompt = [
//     "You are a helpful assistant.",
//     "You're tasked with writing a react component using typescript and tailwind for a website.",
//     "Only import React as a dependency.",
//     "Be concise and only reply with code.",
//   ].join("\n");
  
//   const userPrompt = [
//     `- Component Name: Section`,
//     `- Component Description: ${prompt}\n`,
//     `- Do not use libraries or imports other than React.`,
//     `- Do not have any dynamic data. Use placeholders as data. Do not use props.`,
//     `- Write only a single component.`,
//     `- Wrap your response in a code block with tsx syntax highlighting.`,
//   ].join("\n");

//   const result = await model.generateContent({
//     contents: [
//       { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
//     ],
//     generationConfig: {
//       temperature: 0,
//       topP: 1,
//       topK: 1,
//       maxOutputTokens: 2000,
//     }
//   });

//   const response = await result.response.text();
//   return extractFirstCodeBlock(response);
// }

export interface GeminiMessage {
  role: 'user' | 'model'
  parts: { text: string }[]
}

export interface GeminiApiResponse {
    response: {
        text: () => Promise<string>
        candidates: Array<{
            content: {
                parts: Array<{ text: string }>
                role: string
            }
            finishReason: string
            index: number
            safetyRatings: Array<{
                category: string
                probability: string
            }>
        }>
    }
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();
    const systemPrompt = [
      "You are a helpful assistant.",
      "You're tasked with writing a react component using typescript and tailwind for a website.",
      "Only import React as a dependency.",
      "Be concise and only reply with code.",
    ].join("\n");
  
  const userPrompt = [
    `- Component Name: Section`,
    `- Component Description: ${message}\n`,
    `- Do not use libraries or imports other than React.`,
    `- Do not have any dynamic data. Use placeholders as data. Do not use props.`,
    `- Write only a single component.`,
    `- Wrap your response in a code block with tsx syntax highlighting.`,
  ].join("\n");
    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    })

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
     // responseMimeType: "text/plain",
    }

    const contents: GeminiMessage[] = history.map((msg: { role: string, content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    contents.push({
      role: 'user',
      parts: [ { text: systemPrompt + "\n\n" + userPrompt }]
    })

    const result: GenerateContentResult = await model.generateContent({
      contents,
      generationConfig,
    })

    const response = await result.response.text()

    return NextResponse.json({
      message: extractFirstCodeBlock(response)
    })

  } catch (error) {
    console.error('Error in AI route:', error)
    return NextResponse.json(
      { error: 'Failed to process the request' },
      { status: 500 }
    )
  }
}