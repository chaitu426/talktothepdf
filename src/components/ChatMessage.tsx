
import { MessageCircle, Bot } from "lucide-react";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === "user";
  
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      
      <div className={`message-bubble ${isUser ? "user-message" : "ai-message"}`}>
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <div className={`text-xs mt-1 ${isUser ? "text-right text-primary-foreground/70" : "text-left text-secondary-foreground/70"}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mt-1">
          <MessageCircle className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
