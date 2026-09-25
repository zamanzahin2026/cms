"use client";

import React, { useState } from "react";
import { PasswordField } from "./PasswordField";
import { User, KeyRound, Mail, LogOut, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  changeUsernameAction,
  changePasswordAction,
  changeEmailAction,
  signOutEverywhereAction,
} from "@/app/admin/actions";

interface AccountFormsProps {
  currentUsername: string;
  currentEmail: string;
}

export function AccountForms({ currentUsername, currentEmail }: AccountFormsProps) {
  // Username state
  const [username, setUsername] = useState(currentUsername);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Email state
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Sign out state
  const [signOutLoading, setSignOutLoading] = useState(false);

  // Handlers
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameLoading(true);
    setUsernameMessage(null);
    try {
      const res = await changeUsernameAction(username);
      if (res.error) {
        setUsernameMessage({ text: res.error, type: "error" });
      } else {
        setUsernameMessage({ text: "Username updated successfully!", type: "success" });
      }
    } catch (err: any) {
      setUsernameMessage({ text: err.message || "Failed to update username", type: "error" });
    } finally {
      setUsernameLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage(null);
    try {
      const res = await changePasswordAction(currentPassword, newPassword, confirmPassword);
      if (res.error) {
        setPasswordMessage({ text: res.error, type: "error" });
      } else {
        setPasswordMessage({ text: "Password changed successfully!", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setPasswordMessage({ text: err.message || "Failed to change password", type: "error" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailMessage(null);
    try {
      const res = await changeEmailAction(email);
      if (res.error) {
        setEmailMessage({ text: res.error, type: "error" });
      } else {
        setEmailMessage({
          text: "Confirmation email sent! Click the link sent to your new email address to complete the update.",
          type: "success",
        });
        setEmail("");
      }
    } catch (err: any) {
      setEmailMessage({ text: err.message || "Failed to update email", type: "error" });
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSignOutEverywhere = async () => {
    if (!confirm("Are you sure you want to sign out from all browsers and devices?")) return;
    setSignOutLoading(true);
    try {
      await signOutEverywhereAction();
    } catch (err) {
      console.error(err);
    } finally {
      setSignOutLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[640px]">
      {/* 1. Change Username */}
      <div className="bg-white rounded-card border border-border p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60 mb-4">
          <User size={18} className="text-sage_600" />
          <h3 className="text-[16px] font-semibold text-text_primary">
            Change Username
          </h3>
        </div>

        <form onSubmit={handleUsernameSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-[13px] font-medium text-text_primary">
              Admin Username
            </label>
            <input
              id="username"
              type="text"
              required
              minLength={3}
              maxLength={32}
              pattern="^[a-zA-Z0-9._-]+$"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border text-[14px] text-text_primary focus:border-sage_600 focus:ring-1 focus:ring-sage_600 outline-none"
            />
            <span className="text-[11px] text-text_muted">
              3–32 characters (letters, numbers, dot, dash, underscore).
            </span>
          </div>

          {usernameMessage && (
            <div
              className={`p-3 rounded-lg text-[12px] flex items-center gap-2 ${
                usernameMessage.type === "success"
                  ? "bg-sage_50 text-sage_700 border border-sage_200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {usernameMessage.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{usernameMessage.text}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={usernameLoading || username === currentUsername}
              className="px-5 py-2.5 rounded-pill bg-primary-btn text-white text-[13px] font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {usernameLoading && <Loader2 size={13} className="animate-spin" />}
              <span>Save Username</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Change Password */}
      <div className="bg-white rounded-card border border-border p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60 mb-4">
          <KeyRound size={18} className="text-sage_600" />
          <h3 className="text-[16px] font-semibold text-text_primary">
            Change Password
          </h3>
        </div>

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <PasswordField
            id="current-password"
            name="currentPassword"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <PasswordField
            id="new-password"
            name="newPassword"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            showStrength
          />

          <PasswordField
            id="confirm-password"
            name="confirmPassword"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {passwordMessage && (
            <div
              className={`p-3 rounded-lg text-[12px] flex items-center gap-2 ${
                passwordMessage.type === "success"
                  ? "bg-sage_50 text-sage_700 border border-sage_200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {passwordMessage.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={passwordLoading || !currentPassword || !newPassword}
              className="px-5 py-2.5 rounded-pill bg-primary-btn text-white text-[13px] font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {passwordLoading && <Loader2 size={13} className="animate-spin" />}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Change Reset Email */}
      <div className="bg-white rounded-card border border-border p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60 mb-4">
          <Mail size={18} className="text-sage_600" />
          <h3 className="text-[16px] font-semibold text-text_primary">
            Reset Email Address
          </h3>
        </div>

        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          <div className="text-[13px] text-text_secondary">
            Current account email: <strong className="text-text_primary">{currentEmail}</strong>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-email" className="text-[13px] font-medium text-text_primary">
              New Reset Email Address
            </label>
            <input
              id="new-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@domain.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-border text-[14px] text-text_primary focus:border-sage_600 focus:ring-1 focus:ring-sage_600 outline-none"
            />
            <span className="text-[11px] text-text_muted">
              A verification link will be sent to the new email address. Changes apply once confirmed.
            </span>
          </div>

          {emailMessage && (
            <div
              className={`p-3 rounded-lg text-[12px] flex items-center gap-2 ${
                emailMessage.type === "success"
                  ? "bg-sage_50 text-sage_700 border border-sage_200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {emailMessage.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{emailMessage.text}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={emailLoading || !email}
              className="px-5 py-2.5 rounded-pill bg-primary-btn text-white text-[13px] font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {emailLoading && <Loader2 size={13} className="animate-spin" />}
              <span>Send Email Change Request</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. Global Sign Out */}
      <div className="bg-white rounded-card border border-border p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60 mb-2">
          <LogOut size={18} className="text-red-600" />
          <h3 className="text-[16px] font-semibold text-text_primary">
            Sign Out of All Devices
          </h3>
        </div>
        <p className="text-[13px] text-text_secondary mb-4 leading-relaxed">
          Invalidates all active sessions across any browser or mobile device. You will need to sign in again.
        </p>

        <button
          type="button"
          disabled={signOutLoading}
          onClick={handleSignOutEverywhere}
          className="px-5 py-2.5 rounded-pill border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-[13px] font-medium transition-colors flex items-center gap-1.5"
        >
          {signOutLoading && <Loader2 size={13} className="animate-spin" />}
          <span>Sign Out Everywhere</span>
        </button>
      </div>
    </div>
  );
}
