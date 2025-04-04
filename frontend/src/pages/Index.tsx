import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import PDFUploader from "@/components/PDFUploader";
import PDFPreview from "@/components/PDFPreview";
import ChatContainer from "@/components/ChatContainer";
import { FileText, Loader2 } from "lucide-react";

const Index = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Track upload state

  const handleFileUpload = (file: File) => {
    setIsLoading(true); // Start loading
  
    // Simulating actual upload process
    setTimeout(() => {
      setPdfFile(file);
      setIsLoading(false); // Stop loading after upload
    }, 2000); 
  };
  

  const clearPdf = () => {
    setPdfFile(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/40 sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="container max-w-7xl py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-medium">TalkToPDF</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container max-w-7xl py-6 md:py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="ml-3 text-lg font-medium">Uploading...</p>
          </div>
        ) : !pdfFile ? (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-4xl font-medium text-center mb-4">
              Chat with Your PDF
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Upload a PDF document and start asking questions about its content
            </p>
            <p className="text-center text-muted-foreground mb-8">
              The PDF should not be scanned
            </p>
            <PDFUploader onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[750px]">
            <div className="lg:col-span-5 flex flex-col">
              <PDFPreview file={pdfFile} onClose={clearPdf} />
              <div className="mt-4">
                <button
                  onClick={clearPdf}
                  className="apple-button bg-secondary text-secondary-foreground w-full hover:bg-secondary/80 transition-colors"
                >
                  Upload Different PDF
                </button>
              </div>
            </div>
            <div className="lg:col-span-7 apple-card h-full overflow-hidden">
              <ChatContainer pdfFile={pdfFile} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border/40 py-6 bg-background/80 backdrop-blur-sm mt-auto">
        <div className="container max-w-7xl text-center text-sm text-muted-foreground">
          <p>TalkToPDF — Chat with your PDF documents using AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

