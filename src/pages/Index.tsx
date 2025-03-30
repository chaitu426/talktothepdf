
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
      <header className="border-b">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">TalkToPDF</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container py-6">
        {!pdfFile ? (
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">
              Chat with Your PDF Document
            </h2>
            <PDFUploader onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
            <div className="lg:col-span-1 flex flex-col gap-4">
              <PDFPreview file={pdfFile} onClose={clearPdf} />
              <div className="mt-auto">
                <button
                  onClick={clearPdf}
                  className="w-full py-2 px-4 border border-input rounded-lg hover:bg-accent transition-colors"
                >
                  Upload a Different PDF
                </button>
              </div>
            </div>
            <div className="lg:col-span-2 border rounded-lg overflow-hidden shadow-sm bg-card h-full">
              <ChatContainer pdfFile={pdfFile} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          <p>TalkToPDF - Chat with your PDF documents with AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
