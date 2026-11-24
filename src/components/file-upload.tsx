"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2 } from "lucide-react";

type Props = {
  onTextExtracted: (text: string, filename: string) => void;
};

export function FileUpload({ onTextExtracted }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setLoading(true);
    setFilename(file.name);

    try {
      const ext = file.name.split(".").pop()?.toLowerCase();

      if (ext === "txt" || ext === "md" || ext === "markdown") {
        const text = await file.text();
        onTextExtracted(text, file.name);
      } else if (ext === "pdf") {
        // Dynamic import pdfjs to keep bundle lean
        const pdfjs = await import("pdfjs-dist");
        // Use CDN worker for simplicity in browser
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item: any) => ("str" in item ? item.str : ""))
            .join(" ");
          fullText += pageText + "\n\n";
        }

        if (!fullText.trim()) {
          throw new Error("Could not extract text from this PDF (it may be scanned/image-only).");
        }
        onTextExtracted(fullText.trim(), file.name);
      } else {
        throw new Error("Supported formats: .txt, .md, .pdf");
      }
    } catch (err: any) {
      setError(err.message || "Failed to read file");
      setFilename(null);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function clear() {
    setFilename(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.md,.markdown,.pdf"
          className="hidden"
          onChange={onChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Upload file
        </Button>
        <span className="text-xs text-muted-foreground">
          .txt · .md · .pdf
        </span>
        {filename && (
          <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md">
            <FileText className="h-3 w-3" />
            <span className="max-w-[160px] truncate">{filename}</span>
            <button
              type="button"
              onClick={clear}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
