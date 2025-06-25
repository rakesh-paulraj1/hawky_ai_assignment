"use client"
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CampaignContent {
  headline: string;
  subheadline: string;
  cta: string;
  description: string;
  utmParams: Record<string, string>;
}

export default function CampaignPage() {
  const searchParams = useSearchParams();
  const img = searchParams.get('img');
  const prompt = searchParams.get('prompt');
  const [content, setContent] = useState<CampaignContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Generate structured JSON for a marketing campaign page for the following product/campaign. Respond ONLY with a JSON object with keys: headline, subheadline, cta, description, utmParams.\nPrompt: ${prompt}` }),
    })
      .then(res => res.json())
      .then(data => {
        // Try to parse the response as JSON
        let parsed: CampaignContent | null = null;
        try {
          parsed = typeof data.text === 'string' ? JSON.parse(data.text) : data.text;
        } catch {
          setError('Failed to parse campaign content.');
        }
        setContent(parsed || null);
      })
      .catch(() => setError('Failed to fetch campaign content.'))
      .finally(() => setLoading(false));
  }, [prompt]);

  if (!img) {
    return <div className="text-center mt-12 text-red-500">No image selected. Please generate and select an image from the chat.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden mt-8 p-6 flex flex-col gap-6 items-center">
        <img src={img} alt="Campaign visual" className="w-full max-h-96 object-contain rounded shadow" />
        {loading && <div className="text-gray-500">Loading campaign content...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {content && (
          <>
            <h1 className="text-3xl font-bold mb-2 text-center">{content.headline}</h1>
            <p className="text-lg text-gray-600 mb-4 text-center">{content.subheadline}</p>
            <p className="mb-4 text-center">{content.description}</p>
            <a
              href={`/?${new URLSearchParams(content.utmParams).toString()}`}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition mb-6"
            >
              {content.cta}
            </a>
          </>
        )}
      </div>
    </div>
  );
} 