import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenAI, Modality } from '@google/genai';

const CampaignSchema = z.object({
  companyName: z.string(),
  productName: z.string(),
  catchyTitle: z.string(),
  productDescription: z.string(),
  keyFeatures: z.array(z.string()),
  image: z.string()
});

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

    const prompt = `Generate 3 unique and visually appealing **marketing campaign images** based on the following product description: ${parsed.data.prompt}

For each campaign, provide:
- Company Name: [name]
- Product Name: [name] 
- Catchy Title: [title]
- Product Description: [description]
- Key Features: [comma separated features]
- Image

Return only this data in the exact specified format. No additional text or explanations.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    if (!response?.candidates?.[0]?.content?.parts) {
      return NextResponse.json({ error: 'Invalid API response' }, { status: 500 });
    }

// console.log(response?.candidates?.[0]?.content?.parts);
const textParts: string[] = [];
const images: string[] = [];

    response.candidates[0].content.parts.forEach(part => {
      if (part.text) {
        textParts.push(part.text);
      } else if (part.inlineData) {
        images.push(`data:image/png;base64,${part.inlineData.data}`);
      }
    });

    if (images.length < 3) {
      return NextResponse.json({ error: 'Not enough images generated' }, { status: 500 });
    }

    const combinedText = textParts.join('\n');
    const campaigns = parseCampaignContent(combinedText, images);

    // Validate and pair campaigns with images
    const validatedCampaigns = campaigns.map((campaign, index) => {
      return {
        ...campaign,
        image: images[index] || ''
      };
    });

    const result = z.array(CampaignSchema).parse(validatedCampaigns.slice(0, 3));

    return NextResponse.json({
      success: true,
      images: images.slice(0, 3),
      campaigns: result
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Server error', details: String(error) },
      { status: 500 }
    );
  }
}

function parseCampaignContent(text: string, images: string[]) {
  const campaigns: Array<{
    companyName: string;
    productName: string;
    catchyTitle: string;
    productDescription: string;
    keyFeatures: string[];
  }> = [];

  // Split by campaign indicators
  const campaignBlocks = text.split(/(?=Company Name:)/g);

  campaignBlocks.forEach(block => {
    const campaign: {
      companyName: string;
      productName: string;
      catchyTitle: string;
      productDescription: string;
      keyFeatures: string[];
    } = {
      companyName: '',
      productName: '',
      catchyTitle: '',
      productDescription: '',
      keyFeatures: []
    };

    // Extract company name
    const companyMatch = block.match(/Company Name:\s*(.+)/);
    if (companyMatch) campaign.companyName = companyMatch[1].trim();

    // Extract product name
    const productMatch = block.match(/Product Name:\s*(.+)/);
    if (productMatch) campaign.productName = productMatch[1].trim();

    // Extract catchy title
    const titleMatch = block.match(/Catchy Title:\s*(.+)/);
    if (titleMatch) campaign.catchyTitle = titleMatch[1].trim();

    // Extract product description
    const descMatch = block.match(/Product Description:\s*(.+?)(?=\n\w|$)/s);
    if (descMatch) campaign.productDescription = descMatch[1].trim();

    // Extract key features
    const featuresMatch = block.match(/Key Features:\s*(.+?)(?=\n\w|$)/s);
    if (featuresMatch) {
      campaign.keyFeatures = featuresMatch[1]
        .split(',')
        .map((f: string) => f.trim())
        .filter((f: string) => f);
    }

    if (campaign.companyName) {
      campaigns.push(campaign);
    }
  });

  return campaigns.slice(0, images.length);
}