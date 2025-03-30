
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import PDFUploader from "@/components/PDFUploader";
import PDFPreview from "@/components/PDFPreview";
import ChatContainer from "@/components/ChatContainer";
import { FileText } from "lucide-react";

const Index = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleFileUpload = (file: File) => {
    setPdfFile(file);
  };

  const clearPdf = () => {
    setPdfFile(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FileText className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold">TalkToPDF</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container py-8">
        {!pdfFile ? (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Chat with Your PDF Document
            </h2>
            <PDFUploader onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-8rem)]">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <PDFPreview file={pdfFile} onClose={clearPdf} />
              <div className="mt-auto">
                <button
                  onClick={clearPdf}
                  className="w-full py-2.5 px-4 border border-input rounded-lg hover:bg-accent transition-colors font-medium"
                >
                  Upload a Different PDF
                </button>
              </div>
            </div>
            <div className="lg:col-span-3 border rounded-lg overflow-hidden shadow-sm bg-card h-full">
              <ChatContainer pdfFile={pdfFile} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t py-4 bg-background/80 backdrop-blur-sm">
        <div className="container text-center text-sm text-muted-foreground">
          <p>TalkToPDF - Chat with your PDF documents with AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
