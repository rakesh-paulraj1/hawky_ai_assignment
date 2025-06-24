import { z } from 'zod';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GeminiResponseSchema = z.object({
  candidates: z.array(
    z.object({
      content: z.object({
        parts: z.array(z.object({ text: z.string() }))
      })
    })
  )
});

export async function fetchGeminiResponse(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('Missing Gemini API key');
  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  if (!res.ok) throw new Error('Gemini API error');
  const data = await res.json();
  const parsed = GeminiResponseSchema.safeParse(data);
  if (!parsed.success) throw new Error('Invalid Gemini response');
  const text = parsed.data.candidates[0]?.content.parts[0]?.text;
  if (!text) throw new Error('No response from Gemini');
  return text;
} 