import { z } from 'zod';

const GEMINI_IMAGE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GeminiImageResponseSchema = z.object({
  candidates: z.array(
    z.object({
      content: z.object({
        parts: z.array(
          z.object({
            text: z.string().optional(),
            inlineData: z.object({ data: z.string() }).optional(),
          })
        ),
      }),
    })
  ),
});

export async function generateGeminiImages(prompt: string): Promise<{ images: string[]; text: string }> {
  if (!GEMINI_API_KEY) throw new Error('Missing Gemini API key');
  const res = await fetch(`${GEMINI_IMAGE_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      // config: { responseModalities: ["TEXT", "IMAGE"] },
    }),
  });
  if (!res.ok) throw new Error('Gemini API error');
  const data = await res.json();
  const parsed = GeminiImageResponseSchema.safeParse(data);
  if (!parsed.success) throw new Error('Invalid Gemini image response');
  const parts = parsed.data.candidates[0]?.content.parts || [];
  const images = parts
    .filter((p) => p.inlineData?.data)
    .map((p) => `data:image/png;base64,${p.inlineData!.data}`);
  const text = parts.find((p) => p.text)?.text || '';
  if (!images.length) throw new Error('No images generated');
  return { images, text };
} 