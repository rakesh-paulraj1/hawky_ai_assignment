"use client"
import { Layout } from '@/components/layout';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Check, Download, Share2, Eye, Settings, Palette, Type } from 'lucide-react';

interface CampaignContent {
  headline: string;
  subheadline: string;
  cta: string;
  description: string;
  utmParams: Record<string, string>;
}

type TemplateType = 'modern' | 'minimal' | 'bold';

interface Template {
  id: TemplateType;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const templates: Template[] = [
  {
    id: 'modern',
    name: 'Modern & Clean',
    description: 'Professional design with ample white space and modern typography',
    preview: '🎨',
    colors: {
      primary: 'from-blue-600 to-purple-600',
      secondary: 'bg-white',
      accent: 'bg-blue-600'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal & Elegant',
    description: 'Simple, focused design with subtle accents',
    preview: '⚪',
    colors: {
      primary: 'bg-gray-900',
      secondary: 'bg-gray-50',
      accent: 'bg-gray-900'
    }
  },
  {
    id: 'bold',
    name: 'Bold & Dynamic',
    description: 'High-impact design with vibrant colors and strong visual hierarchy',
    preview: '🔥',
    colors: {
      primary: 'from-orange-500 to-red-600',
      secondary: 'bg-white',
      accent: 'bg-white'
    }
  }
];

export default function CampaignPage() {
  const searchParams = useSearchParams();
  const img = searchParams.get('img');
  const prompt = searchParams.get('prompt');
  const headline = searchParams.get('headline');
  const description = searchParams.get('description');
  const cta = searchParams.get('cta');
  
  const [content, setContent] = useState<CampaignContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [previewMode, setPreviewMode] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [customColors, setCustomColors] = useState({
    primary: '#3B82F6',
    secondary: '#FFFFFF',
    accent: '#1F2937'
  });

  useEffect(() => {
    // If we have marketing content from chat, use it directly
    if (headline && description && cta) {
      setContent({
        headline: headline,
        subheadline: description,
        cta: cta,
        description: description,
        utmParams: {
          source: 'marketing_assistant',
          medium: 'ai_generated',
          campaign: 'product_launch'
        }
      });
      return;
    }

    // Otherwise, generate content using the API
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
  }, [prompt, headline, description, cta]);

  if (!img) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full bg-zinc-900 p-4">
          <div className="text-center text-red-400 bg-zinc-800 p-6 rounded-lg border border-zinc-700 max-w-md">
            <h2 className="text-lg font-semibold mb-2">No Image Selected</h2>
            <p>Please generate and select an image from the chat to create a campaign.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const renderTemplate = (template: TemplateType) => {
    if (!content) return null;

    const templateStyles = {
      modern: {
        container: "bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden",
        header: `bg-gradient-to-r ${templates.find(t => t.id === template)?.colors.primary} text-white p-8`,
        content: "p-8 space-y-6",
        image: "rounded-lg shadow-lg",
        button: `${templates.find(t => t.id === template)?.colors.accent} hover:opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200`
      },
      minimal: {
        container: "bg-gray-50 text-gray-900 rounded-lg border border-gray-200 overflow-hidden",
        header: "bg-white p-8 border-b border-gray-200",
        content: "p-8 space-y-6",
        image: "rounded-md shadow-sm",
        button: "bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
      },
      bold: {
        container: "bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl shadow-2xl overflow-hidden",
        header: "bg-black bg-opacity-20 p-8",
        content: "p-8 space-y-6",
        image: "rounded-xl shadow-xl border-4 border-white",
        button: "bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200"
      }
    };

    const styles = templateStyles[template];

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">{content.headline}</h1>
          <p className="text-lg opacity-90">{content.subheadline}</p>
        </div>
        
        <div className={styles.content}>
          <img 
            src={img} 
            alt="Campaign visual" 
            className={`w-full max-h-80 object-cover ${styles.image}`} 
          />
          
          <div className="space-y-4">
            <p className="text-lg leading-relaxed">{content.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {content.utmParams && Object.entries(content.utmParams).map(([key, value]) => (
                <span key={key} className="bg-black bg-opacity-10 px-3 py-1 rounded-full text-sm">
                  {key}: {value}
                </span>
              ))}
            </div>
            
            <a
              href={`/?${new URLSearchParams(content.utmParams).toString()}`}
              className={`inline-block ${styles.button}`}
            >
              {content.cta}
            </a>
          </div>
        </div>
      </div>
    );
  };

  const handleExport = () => {
    // Implementation for exporting campaign
    console.log('Exporting campaign...');
  };

  const handleShare = () => {
    // Implementation for sharing campaign
    if (navigator.share) {
      navigator.share({
        title: content?.headline || 'Marketing Campaign',
        text: content?.description || 'Check out this marketing campaign',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Campaign URL copied to clipboard!');
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full bg-zinc-900">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Campaign Builder</h1>
                  <p className="text-zinc-400">Choose a template and customize your marketing campaign</p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCustomization(!showCustomization)}
                    className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Settings className="h-4 w-4" />
                    Customize
                  </button>
                  
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4" />
                    {previewMode ? 'Edit Mode' : 'Preview'}
                  </button>
                  
                  <button 
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                  
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Template Selection */}
            {!previewMode && (
              <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                <h2 className="text-xl font-semibold text-white mb-4">Choose Template</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                          : 'border-zinc-600 bg-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{template.preview}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{template.name}</h3>
                          <p className="text-sm text-zinc-400">{template.description}</p>
                        </div>
                        {selectedTemplate === template.id && (
                          <Check className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customization Panel */}
            {showCustomization && !previewMode && (
              <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Customize Design
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Primary Color</label>
                    <input
                      type="color"
                      value={customColors.primary}
                      onChange={(e) => setCustomColors(prev => ({ ...prev, primary: e.target.value }))}
                      className="w-full h-10 rounded border border-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Secondary Color</label>
                    <input
                      type="color"
                      value={customColors.secondary}
                      onChange={(e) => setCustomColors(prev => ({ ...prev, secondary: e.target.value }))}
                      className="w-full h-10 rounded border border-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Accent Color</label>
                    <input
                      type="color"
                      value={customColors.accent}
                      onChange={(e) => setCustomColors(prev => ({ ...prev, accent: e.target.value }))}
                      className="w-full h-10 rounded border border-zinc-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Campaign Preview */}
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  {previewMode ? 'Campaign Preview' : 'Template Preview'}
                </h2>
                {!previewMode && (
                  <span className="text-sm text-zinc-400">
                    Template: {templates.find(t => t.id === selectedTemplate)?.name}
                  </span>
                )}
              </div>

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-zinc-400 flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zinc-400"></div>
                    <span>Loading campaign content...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-400 bg-red-900/20 p-4 rounded border border-red-700 text-center">
                  {error}
                </div>
              )}

              {content && (
                <div className="flex justify-center">
                  <div className="w-full max-w-2xl">
                    {renderTemplate(selectedTemplate)}
                  </div>
                </div>
              )}
            </div>

            {/* Campaign Details */}
            {!previewMode && content && (
              <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Campaign Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-white mb-2">Generated Content</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-zinc-400">Headline:</span> {content.headline}</div>
                      <div><span className="text-zinc-400">Description:</span> {content.description}</div>
                      <div><span className="text-zinc-400">CTA:</span> {content.cta}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-2">UTM Parameters</h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(content.utmParams).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-zinc-400">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 