import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/auth-guard";
import { getSiteContent, getDefaultSiteContent } from "@/lib/content";
import AdminEditor from "./AdminEditor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const initialContent = await getSiteContent();
  const defaultContent = getDefaultSiteContent();

  return (
    <AdminEditor
      initialContent={initialContent}
      defaultContent={defaultContent}
    />
  );
}
