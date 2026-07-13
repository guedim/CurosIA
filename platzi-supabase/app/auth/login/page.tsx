"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/client";

const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const isLocked = lockoutRemaining > 0;

  // Cuenta regresiva del bloqueo; al llegar a 0 se reinician los intentos
  useEffect(() => {
    if (lockoutRemaining <= 0) return;

    const timer = setTimeout(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          setAttempts(0);
          setMessage(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [lockoutRemaining]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setMessage({ type: "success", text: "¡Inicio de sesión exitoso! Redirigiendo..." });

      // Redirigir al home
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 800);
    } catch {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setLockoutRemaining(LOCKOUT_SECONDS);
        setMessage({
          type: "error",
          text: `Has agotado los ${MAX_ATTEMPTS} intentos. Podrás reintentar en ${LOCKOUT_SECONDS} segundos.`,
        });
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts;
        setMessage({
          type: "error",
          text: `Correo o contraseña incorrectos. Te ${remaining === 1 ? "queda 1 intento" : `quedan ${remaining} intentos`}.`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Suplatzigram
          </h1>
          <p className="text-foreground/60 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            required
            disabled={isLocked}
            className="w-full px-4 py-3 rounded-xl bg-card-bg border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            disabled={isLocked}
            className="w-full px-4 py-3 rounded-xl bg-card-bg border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />

          {/* Mensaje de estado */}
          {message && (
            <div
              className={`px-4 py-3 rounded-xl text-sm ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                  : "bg-red-500/10 text-red-500 border border-red-500/20"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Indicador de intentos */}
          {attempts > 0 && !isLocked && (
            <div className="flex items-center justify-center gap-1.5">
              {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < attempts ? "bg-red-500" : "bg-foreground/20"
                  }`}
                />
              ))}
              <span className="text-xs text-foreground/50 ml-2">
                {attempts} de {MAX_ATTEMPTS} intentos
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || isLocked}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLocked
              ? `Reintentar en ${lockoutRemaining}s`
              : isLoading
              ? "Iniciando sesión..."
              : "Iniciar sesión"}
          </button>
        </form>

        {/* Link a registro */}
        <p className="text-center text-foreground/60 mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Regístrate
          </Link>
        </p>

        {/* Link al home */}
        <p className="text-center mt-3">
          <Link href="/" className="text-sm text-foreground/50 hover:text-foreground hover:underline">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
