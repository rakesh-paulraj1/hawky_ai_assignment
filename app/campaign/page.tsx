"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Campaign1 } from '@/components/campaigns/campaign1';
import { Campaign2 } from '@/components/campaigns/campaign2';
import { Campaign3 } from '@/components/campaigns/campaign3';

interface CampaignData {
  image: string;
  prompt: string;
  campaign: {
    catchyTitle: string;
    productDescription: string;
    keyFeatures: string[];
    companyName: string;
    productName: string;
  } | null;
  timestamp: string;
}

export default function CampaignPage() {
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    const storedData = sessionStorage.getItem('campaignData');
    console.log(storedData);
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setCampaignData(data);
      } catch (error) {
        console.error('Error parsing campaign data:', error);
        router.push('/chat');
      }
    } else {
      router.push('/chat');
    }
  }, [router]);

  if (!campaignData) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading campaign...</p>
        </div>
      </div>
    );
  }

  const { image, campaign } = campaignData;

  if (!campaign) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p>No campaign data available.</p>
          <button 
            onClick={() => router.push('/chat')}
            className="mt-4 bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-600"
          >
            Go Back to Chat
          </button>
        </div>
      </div>
    );
  }

  // Template selector component
  const TemplateSelector = () => (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <div className="flex items-center space-x-4">
        <span className="text-black font-medium text-sm">Template:</span>
        <div className="flex space-x-2">
          {[1, 2, 3].map((template) => (
            <button
              key={template}
              onClick={() => setSelectedTemplate(template)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedTemplate === template
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'bg-white/20 text-gray-900 hover:bg-white/30'
              }`}
            >
              {template === 1 && 'Template 1'}
              {template === 2 && 'Template 2'}
              {template === 3 && 'Template 3'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Render the selected campaign template
  const renderCampaign = () => {
    const props = {
      image,
      catchyTitle: campaign.catchyTitle,
      productDescription: campaign.productDescription,
      keyFeatures: campaign.keyFeatures,
      companyName: campaign.companyName,
      productName: campaign.productName,
    };

    switch (selectedTemplate) {
      case 1:
        return <Campaign1 {...props} />;
      case 2:
        return <Campaign2 {...props}  />;
      case 3:
        return <Campaign3 {...props} />;
      default:
        return <Campaign1 {...props} />;
    }
  };

  return (
    <div className="relative">
      <TemplateSelector />
      {renderCampaign()}
    </div>
  );
} 