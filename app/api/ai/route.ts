import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

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
    const { message, history = [] } = await req.json()
    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    })

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    }

    // Convert our chat history to Gemini's format
    const contents: GeminiMessage[] = history.map((msg: { role: string, content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    // Add the new message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    })

    // Make the API call
    const result: GenerateContentResult = await model.generateContent({
      contents,
      generationConfig,
    })

    // Safely extract the response text
    const response = await result.response.text()

    return NextResponse.json({
      message: response
    })

  } catch (error) {
    console.error('Error in AI route:', error)
    return NextResponse.json(
      { error: 'Failed to process the request' },
      { status: 500 }
    )
  }
}