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
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-full bg-transparent rounded-lg shadow p-6 flex flex-col gap-4 h-full max-h-[80vh]">
        {/* Chat message list */}
        <div className="flex flex-col gap-4 flex-1 w-full px-2 overflow-y-auto">
          {messages.map((message, i) => (
            message.type === 'image' ? (
              <div key={i} className="w-full flex flex-col items-start">
                <img
                  src={message.content}
                  alt={`Generated visual ${i + 1}`}
                  className="w-full max-w-[40%] max-h-96 object-contain rounded shadow"
                  loading="lazy"
                />
                <button
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  onClick={() => handleUseInCampaign(message.content)}
                >
                  Use in Campaign
                </button>
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
        <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
          <input
            type="text"
            className="flex-1 border border-gray-700 bg-gray-900 text-white rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isGeneratingImage}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            disabled={!input.trim() || isGeneratingImage}
          >
            Send
          </button>
        </form>
        {imageError && <span className="text-red-500 text-xs text-center">{imageError}</span>}
      </div>
    </div>
  );
}