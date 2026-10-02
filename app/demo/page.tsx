import { redirect } from "next/navigation";

// Preserve existing demo links while keeping one entry point for authentication.
export default function DemoPage() {
  redirect("/acceso");
}
