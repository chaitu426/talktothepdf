import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage?: (response: string) => void; // ✅ Optional prop
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = async () => {
    if (!message.trim() || disabled || loading) return;

    setLoading(true);

    if (onSendMessage) {
       onSendMessage(message); // Only call if defined
    }

    setMessage("");
    setLoading(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative border rounded-lg focus-within:ring-1 focus-within:ring-ring focus-within:border-input">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about your PDF..."
        disabled={disabled || loading}
        className="w-full resize-none bg-transparent px-4 py-3 max-h-32 focus:outline-none disabled:opacity-50"
        rows={1}
      />
      <button
        onClick={handleSendMessage}
        disabled={!message.trim() || disabled || loading}
        className="absolute right-2 bottom-2 p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "..." : <Send className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default ChatInput;
