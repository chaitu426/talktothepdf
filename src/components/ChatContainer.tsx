
import { useState, useRef, useEffect } from "react";
import ChatMessage, { Message } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

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
    
    // Simulate AI response (would connect to backend in real implementation)
    setTimeout(() => {
      const aiMessage: Message = {
        id: uuidv4(),
        text: generateMockResponse(text),
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  // Mock function to simulate AI responses - this would be replaced with actual API calls
  const generateMockResponse = (query: string): string => {
    if (!pdfFile) return "Please upload a PDF first.";
    
    const responses = [
      "Based on the PDF content, I found information related to your query. The document discusses this topic on pages 3-4.",
      "According to the PDF, the answer to your question involves several factors that are outlined in section 2.1.",
      "The PDF mentions this topic briefly. It states that this is an important consideration for the overall process.",
      "I couldn't find specific information about this in the PDF. Would you like to ask something else?",
      "The document provides detailed analysis on this subject in the appendix section.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center py-2">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <p className="text-lg font-medium mb-2">No conversation yet</p>
            <p className="text-sm text-muted-foreground">
              Upload a PDF and start asking questions
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={!pdfFile || isLoading} 
        />
      </div>
    </div>
  );
};

export default ChatContainer;
