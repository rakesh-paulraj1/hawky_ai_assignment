"use client"
import { Layout } from '@/components/layout';
import { useRouter } from 'next/navigation';
import { useState,useEffect,useRef } from 'react';
import { ChatMessage } from '@/components/chat/chat-message';
import Image from 'next/image';
interface Campaign {
  catchyTitle: string;
  productDescription: string;
  keyFeatures: string[];
}

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'image';
  campaign?: Campaign;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastPrompt, setLastPrompt] = useState("");
  const router = useRouter();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = {
      content: input,
      isUser: true,
      timestamp: new Date(),
      type: 'text',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setImageError(null);

    setIsGeneratingImage(true);
    setLastPrompt(input);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      if (!res.ok) throw new Error('Failed to generate image');
      const data = await res.json();
      const images = data.images.slice(0, 3);
      const campaigns = data.campaigns || [];
      console.log(res);
      setMessages((prev) => [
        ...prev,
        ...images.map((img: string, index: number) => ({
          content: img,
          isUser: false,
          timestamp: new Date(),
          type: 'image',
          campaign: campaigns[index] || {
            catchyTitle: `Amazing Campaign ${index + 1}`,
            productDescription: 'Professional marketing campaign with compelling content.',
            keyFeatures: ['High Quality', 'Professional Design', 'Engaging Content']
          }
        })),
      ]);
    } catch {
      setImageError('Image generation failed. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleUseInCampaign = (img: string, campaign?: Campaign) => {
    const campaignData = {
      image: img,
      prompt: lastPrompt,
      campaign: campaign || null,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('campaignData', JSON.stringify(campaignData));
    router.push('/campaign');
  };
  
  return (
    <Layout>
      <div className="flex flex-col h-full bg-zinc-900">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="space-y-4">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">
                      Welcome to Marketing Assistant
                    </h1>
              <p className="text-xl text-zinc-300">
                      AI-Powered Image Generation for Marketing Campaigns
                    </p>
                  </div>
                  
                  <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                    <h2 className="text-lg font-semibold text-white mb-4">How It Works</h2>
                    <div className="space-y-4 text-left">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          1
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Describe Your Product</h3>
                          <p className="text-zinc-400 text-sm">Tell us about your product, service, or campaign idea in detail</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          2
                        </div>
                        <div>
                          <h3 className="font-medium text-white">AI Generates Campaigns</h3>
                          <p className="text-zinc-400 text-sm">Our AI creates multiple marketing campaigns with images, titles, and features</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          3
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Choose Your Campaign</h3>
                          <p className="text-zinc-400 text-sm">Select any campaign to create a complete marketing landing page</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            ) : (
              // Regular messages display
              messages.map((message, i) => (
                message.type === 'image' ? (
                  <div key={i} className="w-full flex flex-col items-start">
                    <div className="bg-zinc-700 rounded-lg p-4 border border-zinc-600 w-full max-w-2xl">
                      <Image src={message.content} alt="Generated" className="w-full rounded mb-4" />
                      
                      {/* Campaign Content */}
                      {message.campaign && (
                        <div className="space-y-3 mb-4">
                          <h3 className="text-xl font-semibold text-white">
                            {message.campaign.catchyTitle}
                          </h3>
                          <p className="text-zinc-300 text-sm leading-relaxed">
                            {message.campaign.productDescription}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {message.campaign.keyFeatures.map((feature, index) => (
                              <span 
                                key={index}
                                className="bg-zinc-600 text-zinc-200 px-2 py-1 rounded text-xs"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                        onClick={() => handleUseInCampaign(message.content, message.campaign)}
                      >
                        Use This Campaign
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    key={i} 
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.isUser ? 'self-end' : 'self-start'}`}> 
                      <ChatMessage
                        message={message.content}
                        isUser={message.isUser}
                        timestamp={message.timestamp}
                      />
                    </div>
                  </div>
                )
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="border-t border-zinc-700 bg-zinc-800 p-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex gap-3 w-full">
              <input
                type="text"
                className="flex-1 bg-zinc-700 border border-zinc-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 placeholder-zinc-400 transition-colors duration-200"
                placeholder="Describe your product or campaign idea..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isGeneratingImage}
              />
              <button
                type="submit"
                className="bg-zinc-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-zinc-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!input.trim() || isGeneratingImage}
              >
                {isGeneratingImage ? 'Generating...' : 'Generate Campaigns'}
              </button>
            </form>
            {imageError && (
              <div className="text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-700 text-sm text-center mt-3">
                {imageError}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}