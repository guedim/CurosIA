"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/client";

export function UserMenu() {
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsLoggedIn(true);
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", user.id)
          .single();

        setUsername(profile?.username || user.user_metadata?.username || null);
        setAvatarUrl(profile?.avatar_url || null);
      }
      setIsChecked(true);
    };
    getUser();
  }, []);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    router.push("/auth/login");
    router.refresh();
  };

  if (!isChecked) {
    return <div className="w-10 h-10" />;
  }

  if (!isLoggedIn) {
    return (
      <Link
        href="/auth/login"
        className="text-sm font-medium text-primary hover:underline whitespace-nowrap"
      >
        Iniciar sesión
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary bg-card-bg flex items-center justify-center text-foreground/60 font-semibold hover:opacity-80 transition-opacity"
        aria-label="Menú de usuario"
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt={username || "Avatar"} fill className="object-cover" />
        ) : (
          username?.charAt(0).toUpperCase() || "?"
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-12 w-52 bg-card-bg border border-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-foreground truncate">
              @{username || "usuario"}
            </p>
          </div>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-sm text-foreground hover:bg-primary/10 transition-colors"
          >
            👤 Mi perfil
          </Link>

          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-sm text-foreground hover:bg-primary/10 transition-colors"
          >
            📊 Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors border-t border-border"
          >
            🚪 Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
