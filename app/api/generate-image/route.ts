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
    
    // Enhanced prompt for better marketing content
    const prompt = `Generate 3 different high-quality marketing campaign images based on the following description. Each image should be unique and visually engaging.

Description: ${userPrompt}

Additionally, provide marketing content for each image including:
- A compelling headline
- A brief product description
- A call-to-action
- Target audience
- Key benefits

Make the content professional, engaging, and suitable for marketing campaigns.`;

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

    // Parse and structure the marketing content
    const marketingContent = parseMarketingContent(text, images.length);
    
    return NextResponse.json({ 
      images: images.slice(0, 3), 
      text,
      marketingContent 
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Helper function to parse marketing content from Gemini's text response
function parseMarketingContent(text: string, imageCount: number) {
  try {
    // Try to extract structured content from the text response
    const lines = text.split('\n').filter(line => line.trim());
    const content: Array<{
      headline: string;
      description: string;
      callToAction: string;
      targetAudience: string;
      benefits: string[];
    }> = [];
    
    let currentItem: {
      headline: string;
      description: string;
      callToAction: string;
      targetAudience: string;
      benefits: string[];
    } | null = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Look for patterns that indicate new content items
      if (trimmedLine.match(/^(Image|Campaign|Option)\s*\d+/i) || 
          trimmedLine.match(/^[A-Z][^:]*:$/) ||
          trimmedLine.includes('Headline:') ||
          trimmedLine.includes('Description:')) {
        
        if (currentItem) {
          content.push(currentItem);
        }
        
        currentItem = {
          headline: '',
          description: '',
          callToAction: '',
          targetAudience: '',
          benefits: []
        };
      }
      
      if (currentItem) {
        if (trimmedLine.includes('Headline:') || trimmedLine.includes('Title:')) {
          currentItem.headline = trimmedLine.split(':')[1]?.trim() || '';
        } else if (trimmedLine.includes('Description:') || trimmedLine.includes('About:')) {
          currentItem.description = trimmedLine.split(':')[1]?.trim() || '';
        } else if (trimmedLine.includes('Call-to-action:') || trimmedLine.includes('CTA:')) {
          currentItem.callToAction = trimmedLine.split(':')[1]?.trim() || '';
        } else if (trimmedLine.includes('Target:') || trimmedLine.includes('Audience:')) {
          currentItem.targetAudience = trimmedLine.split(':')[1]?.trim() || '';
        } else if (trimmedLine.includes('Benefits:') || trimmedLine.includes('Features:')) {
          // Extract benefits from the line
          const benefitsText = trimmedLine.split(':')[1]?.trim() || '';
          currentItem.benefits = benefitsText.split(',').map(b => b.trim()).filter(b => b);
        }
      }
    }
    
    // Add the last item
    if (currentItem) {
      content.push(currentItem);
    }
    
    // If we couldn't parse structured content, create a generic one
    if (content.length === 0) {
      for (let i = 0; i < imageCount; i++) {
        content.push({
          headline: `Marketing Campaign ${i + 1}`,
          description: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
          callToAction: 'Learn More',
          targetAudience: 'General Audience',
          benefits: ['High Quality', 'Professional Design', 'Engaging Content']
        });
      }
    }
    
    return content.slice(0, imageCount);
  } catch {
    // Fallback: create generic content
    const fallbackContent: Array<{
      headline: string;
      description: string;
      callToAction: string;
      targetAudience: string;
      benefits: string[];
    }> = [];
    for (let i = 0; i < imageCount; i++) {
      fallbackContent.push({
        headline: `Marketing Campaign ${i + 1}`,
        description: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
        callToAction: 'Learn More',
        targetAudience: 'General Audience',
        benefits: ['High Quality', 'Professional Design', 'Engaging Content']
      });
    }
    return fallbackContent;
  }
} 