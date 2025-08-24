import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  onUrlChange: (url: string) => void;
  currentUrl?: string;
  currentFile?: File | null;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({
  onFileSelect,
  onUrlChange,
  currentUrl,
  currentFile,
  accept = "image/*",
  maxSize = 5, // 5MB default
  className = ""
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError("");
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
      onUrlChange(""); // Clear URL when file is selected
    }
  };

  const handleUrlChange = (url: string) => {
    onUrlChange(url);
    onFileSelect(null); // Clear file when URL is entered
    setError("");
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onFileSelect(null);
    onUrlChange("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (urlInputRef.current) {
      urlInputRef.current.value = "";
    }
  };

  const hasFileOrUrl = currentFile || currentUrl;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-brand bg-brand/5"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!hasFileOrUrl ? (
          <div className="space-y-2">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-brand hover:text-brand/80 cursor-pointer">
                Click to upload
              </span>{" "}
              or drag and drop
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to {maxSize}MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleInputChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              Select File
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              {currentFile ? (
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-6 w-6 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {currentFile.name}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-6 w-6 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Image URL provided
                  </span>
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeFile}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        )}
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Or enter image URL
        </Label>
        <Input
          ref={urlInputRef}
          type="url"
          placeholder="https://example.com/image.jpg"
          value={currentUrl || ""}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="border-gray-300 focus:border-brand"
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
