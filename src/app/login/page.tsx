"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }).then((res) => {
      // 400 = enabled (invalid data), 403 = disabled
      setRegistrationEnabled(res.status !== 403);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Registrering fejlede");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(
        mode === "register"
          ? "Konto oprettet, men login fejlede. Prøv at logge ind."
          : "Forkert email eller adgangskode"
      );
      setLoading(false);
      if (mode === "register") setMode("login");
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-xl font-bold text-gray-900">
          {mode === "login" ? "DynamicQR Login" : "Opret konto"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Navn</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Dit navn"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="din@email.com"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adgangskode</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder={mode === "register" ? "Mindst 8 tegn" : ""}
              required
              minLength={mode === "register" ? 8 : undefined}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? mode === "login" ? "Logger ind..." : "Opretter konto..."
              : mode === "login" ? "Log ind" : "Opret konto"}
          </button>
        </form>

        {registrationEnabled && (
          <p className="mt-4 text-center text-sm text-gray-500">
            {mode === "login" ? (
              <>
                Ingen konto?{" "}
                <button onClick={() => { setMode("register"); setError(""); }} className="text-blue-600 hover:underline cursor-pointer">
                  Opret en gratis
                </button>
              </>
            ) : (
              <>
                Har du allerede en konto?{" "}
                <button onClick={() => { setMode("login"); setError(""); }} className="text-blue-600 hover:underline cursor-pointer">
                  Log ind
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
