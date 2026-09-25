import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/auth-guard";
import { AccountForms } from "@/components/admin/AccountForms";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-[700px] mx-auto">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-[13px] text-text_secondary hover:text-text_primary font-medium transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            <span>Back to Content Editor</span>
          </Link>

          <h1 className="text-2xl font-serif text-text_primary font-normal">
            Account Settings
          </h1>
          <p className="text-[13px] text-text_secondary mt-1">
            Manage your admin credentials, login credentials, and session access.
          </p>
        </div>

        <AccountForms
          currentUsername={admin.username}
          currentEmail={admin.email}
        />
      </div>
    </div>
  );
}
