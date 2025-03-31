import { useState, useRef, useEffect } from "react";
import ChatMessage, { Message } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { ScrollArea } from "./ui/scroll-area";

interface ChatContainerProps {
  pdfFile: File | null;
}

const ChatContainer = ({ pdfFile }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (pdfFile) {
      setMessages([
        {
          id: uuidv4(),
          text: `I've loaded your PDF: "${pdfFile.name}". What would you like to know about it?`,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [pdfFile]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/msg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: text }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: uuidv4(),
        text: data.response || "No response received.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error fetching response:", error);
      
      setMessages((prev) => [
        ...prev,
        { id: uuidv4(), text: "Error processing request.", sender: "ai", timestamp: new Date() },
      ]);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4 h-[550px]">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center py-2">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <p className="text-lg font-medium mb-2">No conversation yet</p>
            <p className="text-sm text-muted-foreground">
              Upload a PDF and start asking questions
            </p>
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t mt-auto">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={!pdfFile || isLoading} 
        />
      </div>
    </div>
  );
};

export default ChatContainer;
