import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RegistroIncidenteForm from "@/components/911/whatsapp/RegistroIncidenteForm"; // Importas el cliente

export default async function RegistroIncidentePage() {
  // Aquí el await NO da error porque es un Server Component
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Renderizamos el formulario y le pasamos los datos del usuario
  return <RegistroIncidenteForm user={session.user} />;
}