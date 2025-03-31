import { useState, useCallback } from "react";
import { FileUp, Loader2 } from "lucide-react"; // Import Loader2 for spinner icon
import { useToast } from "@/hooks/use-toast";

interface PDFUploaderProps {
  onFileUpload: (file: File) => void;
}

const PDFUploader = ({ onFileUpload }: PDFUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const { toast } = useToast();
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true)
  
    // Prepare FormData for backend
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/pdf/upload`, {
        method: "POST",
        body: formData,
      });
      
  
      if (!response.ok) throw new Error("Upload failed");
  
      const result = await response.json();
  
      toast({
        title: "PDF uploaded",
        description: "Successfully uploaded.",
      });
  
      onFileUpload(file); // Call only once after successful upload
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading the PDF.",
        variant: "destructive",
      });
    }
    setIsLoading(false)
  };
  

  return (
    <div 
      className={`pdf-dropzone ${isDragging ? "pdf-dropzone-active" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        id="pdf-upload" 
        accept=".pdf" 
        className="hidden" 
        onChange={handleFileInput}
        disabled={isLoading} // Disable input when loading
      />
      <label htmlFor="pdf-upload" className={`cursor-pointer ${isLoading ? "opacity-50" : ""}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            {isLoading ? <Loader2 className="h-8 w-8 text-primary animate-spin" /> : <FileUp className="h-8 w-8 text-primary" />}
          </div>
          <div className="space-y-1 text-center">
            <h3 className="text-lg font-medium">
              {isLoading ? "Uploading..." : "Upload your PDF"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF files up to 100MB
            </p>
          </div>
        </div>
      </label>
    </div>
  );
};

export default PDFUploader;
