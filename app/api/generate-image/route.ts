import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenAI, Modality } from '@google/genai';

const PromptSchema = z.object({
  prompt: z.string().min(5).max(1000)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PromptSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const userPrompt = parsed.data.prompt;
    const prompt = `Generate 3 different high-quality marketing campaign images based on the following description. Each image should be unique and visually engaging. Description: ${userPrompt}`;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Gemini API key' }, { status: 500 });
    }
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });
    if (!response || !response.candidates || !response.candidates[0]?.content?.parts) {
      return NextResponse.json({ error: 'Invalid Gemini response' }, { status: 500 });
    }
    const images: string[] = [];
    let text = '';
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        text = part.text;
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        images.push(`data:image/png;base64,${imageData}`);
      }
    }
   
    if (!images.length) {
      return NextResponse.json({ error: 'No images generated' }, { status: 500 });
    }
    return NextResponse.json({ images: images.slice(0, 3), text });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 