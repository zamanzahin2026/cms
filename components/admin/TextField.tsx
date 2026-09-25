"use client";

import React, { useRef, useEffect } from "react";

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
  type?: "text" | "textarea" | "url";
  description?: string;
  placeholder?: string;
  required?: boolean;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  maxLength,
  type = "text",
  description,
  placeholder,
  required = false,
}: TextFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    if (type === "textarea" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, type]);

  const length = value?.length || 0;
  const isOverLimit = maxLength ? length > maxLength : false;

  return (
    <div className="flex flex-col gap-1.5 py-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[13px] font-medium text-text_primary">
          {label}
        </label>
        {maxLength && (
          <span
            className={`text-[11px] tabular-nums ${
              isOverLimit ? "text-red-500 font-semibold" : "text-text_muted"
            }`}
          >
            {length}/{maxLength}
          </span>
        )}
      </div>

      {description && (
        <p className="text-[11px] text-text_muted leading-snug">{description}</p>
      )}

      {type === "textarea" ? (
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={3}
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-[14px] text-text_primary placeholder:text-text_muted focus:border-sage_600 focus:ring-1 focus:ring-sage_600 outline-none resize-none transition-all"
        />
      ) : (
        <input
          id={id}
          type={type === "url" ? "url" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-[14px] text-text_primary placeholder:text-text_muted focus:border-sage_600 focus:ring-1 focus:ring-sage_600 outline-none transition-all"
        />
      )}
    </div>
  );
}
