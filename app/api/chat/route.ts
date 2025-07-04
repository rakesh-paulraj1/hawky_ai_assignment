import { NextResponse } from "next/server";
import { GoogleGenAI, Chat } from "@google/genai";


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Store chat sessions in memory (in production, you'd want to use a database)
const chatSessions = new Map<string, Chat>();

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // If the message requests structured campaign content, use a system prompt
    if (message.startsWith('Generate structured JSON for a marketing campaign page')) {
      const systemPrompt = message;
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: systemPrompt,
      });
      // Try to parse the response as JSON
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return NextResponse.json({ text });
    }

    // Get or create chat session
    let chat = chatSessions.get(sessionId);
    if (!chat) {
      chat = await ai.chats.create({
        model: "gemini-2.0-flash",
        history: [],
      });
      chatSessions.set(sessionId, chat);
    }

    // Send message and get response
    const response = await chat.sendMessage({
      message,
    });

    // Get the full chat history
    const history = await chat.getHistory();

    return NextResponse.json({
      text: response.text,
      history: history
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 