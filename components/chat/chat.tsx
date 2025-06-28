"use client"
import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./chat-message";
import { useRouter } from 'next/navigation';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'image';
}

export function Chat() {
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
      setMessages((prev) => [
        ...prev,
        ...images.map((img: string) => ({
          content: img,
          isUser: false,
          timestamp: new Date(),
          type: 'image',
        })),
      ]);
    } catch {
      setImageError('Image generation failed. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleUseInCampaign = (img: string) => {
    router.push(`/campaign?img=${encodeURIComponent(img)}&prompt=${encodeURIComponent(lastPrompt)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black-800">
      <div className="w-full  p-6 flex flex-col gap-4 h-full max-h-[80vh]">
        {/* Chat message list */}
        <div className="flex flex-col gap-4 flex-1 w-full px-2 overflow-y-auto">
          {messages.map((message, i) => (
            message.type === 'image' ? (
              <div key={i} className="w-full flex flex-col items-start">
                <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                  <img
                    src={message.content}
                    alt={`Generated visual ${i + 1}`}
                    className="w-full max-w-[40%] max-h-96 object-contain rounded shadow-lg"
                    loading="lazy"
                  />
                  <button
                    className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-700"
                    onClick={() => handleUseInCampaign(message.content)}
                  >
                    Use in Campaign
                  </button>
                </div>
              </div>
            ) : (
              <div 
                key={i} 
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[40%] ${message.isUser ? 'self-end' : 'self-start'}`}> 
                  <ChatMessage
                    message={message.content}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                  />
                </div>
              </div>
            )
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Chat input */}
        <form onSubmit={handleSendMessage} className="flex gap-3 w-full">
          <input
            type="text"
            className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-colors duration-200"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isGeneratingImage}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!input.trim() || isGeneratingImage}
          >
            {isGeneratingImage ? 'Generating...' : 'Send'}
          </button>
        </form>
        {imageError && (
          <div className="text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-700 text-sm text-center">
            {imageError}
          </div>
        )}
      </div>
    </div>
  );
}