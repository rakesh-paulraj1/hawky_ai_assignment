import { cn } from "@/lib/utils";


interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}



export function ChatMessage({ message, isUser,  }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full items-start gap-2.5 p-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-1 rounded-lg px-4 py-3 max-w-[90%] shadow-sm border",
          isUser
            ? "bg-zinc-900 text-white border-blue-500"
            : "bg-gray-700 text-gray-100 border-gray-600"
        )}
      >
        <p className="text-sm leading-relaxed">{message}</p>
        <span className={cn(
          "text-xs",
          isUser ? "text-blue-100" : "text-gray-400"
        )}>
        
        </span>
      </div>
    </div>
  );
} 