import { Chat } from 'components/chat/chat'; 

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <header className="w-full py-4 px-6 bg-gray-900 text-white text-xl font-bold shadow flex items-center justify-center fixed top-0 left-0 z-50">
        Performance Marketer AI
      </header>
      <main className="flex-1 w-full flex  pt-20 pb-4 px-4">
        <div className="w-full  h-[calc(100vh-7rem)] bg-gray-800 rounded-lg overflow-hidden flex flex-col">
          <Chat />
        </div>
      </main>
    </div>
  );
}