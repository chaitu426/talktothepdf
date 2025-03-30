
import { useState, useCallback } from "react";
import { FileUp, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PDFUploaderProps {
  onFileUpload: (file: File) => void;
}

const PDFUploader = ({ onFileUpload }: PDFUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
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

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }
    
    onFileUpload(file);
    toast({
      title: "PDF uploaded",
      description: `${file.name} has been successfully uploaded.`,
    });
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
      />
      <label htmlFor="pdf-upload" className="cursor-pointer">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <FileUp className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1 text-center">
            <h3 className="text-lg font-medium">Upload your PDF</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF files up to 10MB
            </p>
          </div>
        </div>
      </label>
    </div>
  );
};

export default PDFUploader;
