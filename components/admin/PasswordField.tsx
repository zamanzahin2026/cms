"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showStrength?: boolean;
  required?: boolean;
  autoComplete?: string;
}

export function PasswordField({
  id = "password",
  name,
  label = "Password",
  placeholder = "••••••••••••",
  value,
  onChange,
  showStrength = false,
  required = true,
  autoComplete = "current-password",
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const [internalValue, setInternalValue] = useState("");

  const currentVal = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  // Strength score: 0 to 4
  const getStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 10) score += 1;
    if (pwd.length >= 14) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strength = getStrength(currentVal);
  const strengthLabels = ["Too short (min 10)", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-amber-500", "bg-yellow-500", "bg-sage_400", "bg-sage_600"];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[13px] font-medium text-text_primary">
          {label}
        </label>
        {showStrength && currentVal && (
          <span className="text-[11px] text-text_muted">
            {strengthLabels[strength]}
          </span>
        )}
      </div>

      <div className="relative flex items-center">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={handleChange}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-[14px] text-text_primary placeholder:text-text_muted focus:border-sage_600 focus:ring-1 focus:ring-sage_600 outline-none transition-all pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 text-text_muted hover:text-text_secondary p-1"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {showStrength && currentVal && (
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1 flex-1 rounded-full transition-colors ${
                strength >= step ? strengthColors[strength] : "bg-border/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
