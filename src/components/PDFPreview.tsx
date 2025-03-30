
import { useState, useEffect } from "react";
import { File, Maximize2, Minimize2, X } from "lucide-react";

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
    <div className={`bg-card rounded-lg overflow-hidden shadow-md border transition-all duration-300 ${expanded ? "fixed inset-4 z-50" : "h-[420px]"}`}>
      <div className="flex justify-between items-center p-3 bg-muted">
        <div className="flex items-center gap-2">
          <File className="h-5 w-5" />
          <span className="text-sm font-medium truncate max-w-[200px]">
            {file.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded hover:bg-background/50"
          >
            {expanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 rounded hover:bg-background/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className={`w-full ${expanded ? "h-[calc(100%-40px)]" : "h-[calc(100%-40px)]"}`}>
        <iframe 
          src={`${fileURL}#toolbar=0`} 
          title="PDF Preview" 
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default PDFPreview;
