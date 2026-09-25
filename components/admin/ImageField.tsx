"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, RotateCcw, AlertCircle, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";

interface ImageValue {
  src: string;
  alt: string;
}

interface ImageFieldProps {
  id: string;
  label: string;
  value: ImageValue;
  defaultValue: ImageValue;
  recommendedSize?: string;
  onChange: (val: ImageValue) => void;
  onToast?: (msg: string, type: "success" | "error") => void;
}

export function ImageField({
  id,
  label,
  value,
  defaultValue,
  recommendedSize,
  onChange,
  onToast,
}: ImageFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploadError(null);

    // Validate type (JPEG, PNG, WebP, AVIF only. Reject SVG and GIF)
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!validTypes.includes(file.type)) {
      const err = "Only JPEG, PNG, WebP, or AVIF images are accepted. SVG and GIF are not supported.";
      setUploadError(err);
      onToast?.(err, "error");
      return;
    }

    try {
      setIsUploading(true);

      // Browser compression step
      const options = {
        maxSizeMB: 3,
        maxWidthOrHeight: 2000,
        fileType: "image/webp",
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      if (compressedFile.size > 4 * 1024 * 1024) {
        const err = "The image is too large even after compression (over 4MB). Please select a smaller image.";
        setUploadError(err);
        onToast?.(err, "error");
        setIsUploading(false);
        return;
      }

      // Upload to server
      const formData = new FormData();
      formData.append("file", compressedFile, "upload.webp");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to upload image");
      }

      onChange({
        src: resData.url,
        alt: value.alt || file.name.replace(/\.[^/.]+$/, ""),
      });

      onToast?.("Image uploaded successfully!", "success");
    } catch (err: any) {
      const errMsg = err.message || "An error occurred during upload.";
      setUploadError(errMsg);
      onToast?.(errMsg, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const isModified = value.src !== defaultValue.src;

  return (
    <div className="flex flex-col gap-2.5 p-3.5 rounded-xl border border-border bg-white my-2">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-medium text-text_primary">
          {label}
        </label>
        {recommendedSize && (
          <span className="text-[11px] text-text_muted bg-surface_muted px-2 py-0.5 rounded-md border border-border/50">
            Rec: {recommendedSize}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Thumbnail Preview */}
        <div className="sm:col-span-4 relative h-28 w-full rounded-lg overflow-hidden border border-border bg-surface_muted flex items-center justify-center">
          {value.src ? (
            <Image
              src={value.src}
              alt={value.alt || "Preview"}
              fill
              className="object-cover"
              sizes="180px"
            />
          ) : (
            <span className="text-[11px] text-text_muted">No image</span>
          )}
        </div>

        {/* Upload Zone / Drop area */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`sm:col-span-8 h-28 rounded-lg border-2 border-dashed p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-sage_600 bg-sage_50/80"
              : "border-border hover:border-sage_400 hover:bg-surface_muted/60"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-1.5 text-sage_700">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-[12px] font-medium">Compressing & Uploading...</span>
            </div>
          ) : (
            <>
              <UploadCloud size={20} className="text-text_muted mb-1" />
              <span className="text-[12px] font-medium text-text_primary">
                Click or drag to replace image
              </span>
              <span className="text-[10px] text-text_muted mt-0.5">
                JPEG, PNG, WebP, AVIF up to 4MB
              </span>
            </>
          )}
        </div>
      </div>

      {uploadError && (
        <div className="flex items-center gap-1.5 text-red-600 text-[11px] mt-1">
          <AlertCircle size={13} />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Alt Text & Restore Original */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-border/50">
        <div className="flex-1 flex items-center gap-2">
          <label htmlFor={`${id}-alt`} className="text-[11px] text-text_muted whitespace-nowrap">
            Alt Text:
          </label>
          <input
            id={`${id}-alt`}
            type="text"
            value={value.alt}
            maxLength={140}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            placeholder="Descriptive image alt text"
            className="w-full text-[12px] px-2.5 py-1 rounded border border-border bg-white text-text_primary outline-none focus:border-sage_600"
          />
        </div>

        {isModified && (
          <button
            type="button"
            onClick={() => onChange(defaultValue)}
            className="flex items-center justify-center gap-1 text-[11px] text-sage_700 hover:text-sage_900 hover:underline px-2 py-1 font-medium whitespace-nowrap"
          >
            <RotateCcw size={12} />
            <span>Restore original</span>
          </button>
        )}
      </div>
    </div>
  );
}
