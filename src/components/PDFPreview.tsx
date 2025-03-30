
import { useState, useEffect } from "react";
import { File, Maximize2, Minimize2, X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface PDFPreviewProps {
  file: File | null;
  onClose: () => void;
}

const PDFPreview = ({ file, onClose }: PDFPreviewProps) => {
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileURL(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  if (!file || !fileURL) return null;

  return (
    <div className={`apple-card overflow-hidden transition-all duration-300 ${expanded ? "fixed inset-4 z-50 bg-background/95" : "h-[700px]"}`}>
      <div className="flex justify-between items-center p-3 bg-muted/70 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <File className="h-5 w-5" />
          <span className="text-sm font-medium truncate max-w-[200px]">
            {file.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-full hover:bg-background/20 transition-colors"
            aria-label={expanded ? "Minimize" : "Maximize"}
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-background/20 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <ScrollArea className="w-full h-[calc(100%-40px)]">
        <iframe 
          src={`${fileURL}#toolbar=0`} 
          title="PDF Preview" 
          className="w-full h-[650px]"
        />
      </ScrollArea>
    </div>
  );
};

export default PDFPreview;
