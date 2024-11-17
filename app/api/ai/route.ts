import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const cleanDescription = (text: string): string => {
  return text
    // Remove numbered points at start
    .replace(/^\d+\.\s*/, '')
    // Remove "Technical Explanation:" or similar headers
    .replace(/\*\*.*?:\*\*\s*/, '')
    // Remove all markdown bold markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // Remove backticks
    .replace(/`([^`]+)`/g, '$1')
    // Remove any "Component Code:" section
    .replace(/\d+\.\s*\*\*Component Code:\*\*.*$/, '')
    // Trim whitespace
    .trim();
};

const extractContent = (input: string) => {
  // Extract everything before the first code block
  const descriptionMatch = input.split('```')[0];
  
  // Extract code block
  const pattern = /```(\w+)?\n([\s\S]+?)\n```/g;
  let matches;
  while ((matches = pattern.exec(input)) !== null) {
    const language = matches[1];
    const codeBlock = matches[2];
    if (language === undefined || language === "tsx" || language === "jsx" || language === "typescript") {
      return {
        description: cleanDescription(descriptionMatch),
        code: codeBlock
      };
    }
  }
  throw new Error("No code block found in input");
};

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
      "You are a senior React developer explaining your component design decisions.",
      "For each component, you first provide a detailed technical explanation, then the implementation.",
      "In your explanation, cover:",
      "- The component's purpose and key features",
      "- Your chosen layout structure and why",
      "- Key styling decisions and Tailwind class choices",
      "- Any accessibility considerations",
      "- Potential areas for enhancement or customization",
      "Make your explanation detailed but concise, focusing on technical decisions.",
    ].join("\n");
  
    const userPrompt = [
      `- Component Name: Section`,
      `- Component Description: ${message}\n`,
      `Response Format:`,
      `1. First, provide a technical explanation (4-6 sentences) covering:`,
      `   - Component architecture and structure`,
      `   - Layout and styling approach`,
      `   - Key Tailwind design decisions`,
      `   - Technical considerations`,
      `2. Then provide the component code wrapped in a code block with tsx syntax highlighting\n`,
      `Requirements:`,
      `- Do not use libraries or imports other than React`,
      `- Do not have any dynamic data. Use placeholders as data. Do not use props`,
      `- Write only a single component`,
    ].join("\n");
    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    })

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
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
    const { description, code } = extractContent(response)
    
    return NextResponse.json({
      description,
      code
    })

  } catch (error) {
    console.error('Error in AI route:', error)
    return NextResponse.json(
      { error: 'Failed to process the request' },
      { status: 500 }
    )
  }
}