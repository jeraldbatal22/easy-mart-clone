"use client";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

interface UploadState {
  isUploading: boolean;
  error: string | null;
  success: string | null;
}

const CmsPage = () => {
  const router = useRouter();
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    error: null,
    success: null,
  });
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    setUploadState({ isUploading: true, error: null, success: null });

    try {
      // Validate file
      if (!file) {
        throw new Error("No file selected");
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Invalid file type. Please select an image file.");
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File too large. Maximum size is 5MB.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", "Grapes");
      formData.append("groceryCategory", "68beb23cde1a5f21222ca473");
      formData.append("stock", "30");
      formData.append("price", "750");
      formData.append("unit", "lb");

      const response = await fetch("/api/product", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload category");
      }

      setUploadState({
        isUploading: false,
        error: null,
        success: "Category uploaded successfully!",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadState((prev) => ({ ...prev, success: null }));
      }, 3000);
    } catch (error) {
      setUploadState({
        isUploading: false,
        error: error instanceof Error ? error.message : "Upload failed",
        success: null,
      });

      // Clear error message after 5 seconds
      setTimeout(() => {
        setUploadState((prev) => ({ ...prev, error: null }));
      }, 5000);
    }
  }, []);
  return (
    <div className="flex justify-center h-dvh items-center gap-5">
      <input
        ref={uploadRef}
        id="upload-image"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
          }
        }}
      />
      <label htmlFor="upload-image">
        <Button
          asChild
          disabled={uploadState.isUploading}
          onClick={(event) => {
            event.preventDefault();
            if (uploadRef.current) {
              uploadRef.current.click();
            }
          }}
        >
          <span className="flex items-center gap-2">
            {uploadState.isUploading && <LoadingSpinner size="sm" />}
            {uploadState.isUploading ? "Uploading..." : "Upload"}
          </span>
        </Button>
      </label>
      
      <Button
        variant="ghost"
        className="underline"
        disabled={uploadState.isUploading}
        onClick={() => {
          router.push("/")
        }}
      >
        Return to Home
      </Button>

      {/* Status Messages */}
      {uploadState.error && (
        <Alert variant="destructive">
          <AlertDescription>{uploadState.error}</AlertDescription>
        </Alert>
      )}

      {uploadState.success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{uploadState.success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CmsPage;
