import { redirect } from "next/navigation";

// Root page redirects to default locale
// Middleware handles Accept-Language detection,
// but this is a fallback for direct access
export default function Home() {
  redirect("/en");
}
