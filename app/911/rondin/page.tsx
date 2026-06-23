import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ReporteRecorridoZen from "@/components/911/radio/FormSection"; 

export default async function ReporteRecorridoPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return <ReporteRecorridoZen user={session.user} />;
}