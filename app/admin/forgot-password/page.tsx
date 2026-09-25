import { Suspense } from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-hero-gradient" />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
