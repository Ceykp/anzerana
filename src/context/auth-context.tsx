"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthProviderName = "email" | "google" | "facebook";

export type User = {
  id: string;
  name: string;
  email: string;
  provider: AuthProviderName;
  createdAt: string;
};

type AuthResult = {
  ok: boolean;
  error?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
  }) => Promise<AuthResult>;
  socialLogin: (provider: "google" | "facebook") => void;
  updateUser: (payload: Partial<Pick<User, "name" | "email">>) => void;
  logout: () => void;
};

const AUTH_STORAGE_KEY = "anzerana-auth-v2";

const CartStoragePrefix = "anzerana-cart-v1";
const WishlistStoragePrefix = "anzerana-wishlist-v1";
const ProfileAddressPrefix = "anzerana-profile-address-v1";

const AuthContext = createContext<AuthContextType | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function clearLegacyUserData() {
  localStorage.removeItem(CartStoragePrefix);
  localStorage.removeItem(WishlistStoragePrefix);
  localStorage.removeItem(ProfileAddressPrefix);
}

function clearSessionOnly() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function normalizeUser(value: unknown): User | null {
  if (!value || typeof value !== "object") return null;

  const user = value as Partial<User>;

  if (!user.id || !user.name || !user.email) return null;

  return {
    id: String(user.id),
    name: String(user.name),
    email: normalizeEmail(String(user.email)),
    provider: (user.provider ?? "email") as AuthProviderName,
    createdAt: String(user.createdAt ?? new Date().toISOString()),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      const safeUser = normalizeUser(parsed);

      if (!safeUser) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }

      setUser(safeUser);
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  function setSession(nextUser: User) {
    const safeUser = normalizeUser(nextUser);

    if (!safeUser) return;

    clearLegacyUserData();
    setUser(safeUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser));
  }

  async function register(payload: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResult> {
    const name = payload.name.trim();
    const email = normalizeEmail(payload.email);
    const password = payload.password.trim();

    if (!name || !email || !password) {
      return { ok: false, error: "Lütfen tüm alanları doldurun." };
    }

    if (!email.includes("@")) {
      return { ok: false, error: "Geçerli bir e-posta adresi girin." };
    }

    if (password.length < 6) {
      return { ok: false, error: "Şifre en az 6 karakter olmalıdır." };
    }

    const response = await fetch("/api/customer-auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        error: result?.error ?? "Kayıt oluşturulamadı.",
      };
    }

    const safeUser = normalizeUser(result?.user);

    if (!safeUser) {
      return {
        ok: false,
        error: "Kullanıcı bilgileri alınamadı.",
      };
    }

    setSession(safeUser);

    return { ok: true };
  }

  async function login(
    emailInput: string,
    passwordInput: string,
  ): Promise<AuthResult> {
    const email = normalizeEmail(emailInput);
    const password = passwordInput.trim();

    if (!email || !password) {
      return { ok: false, error: "E-posta ve şifre alanları zorunludur." };
    }

    const response = await fetch("/api/customer-auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        error: result?.error ?? "E-posta veya şifre hatalı.",
      };
    }

    const safeUser = normalizeUser(result?.user);

    if (!safeUser) {
      return {
        ok: false,
        error: "Kullanıcı bilgileri alınamadı.",
      };
    }

    setSession(safeUser);

    return { ok: true };
  }

  function socialLogin(provider: "google" | "facebook") {
    const email =
      provider === "google"
        ? "google.kullanici@anzerana.com"
        : "facebook.kullanici@anzerana.com";

    const name =
      provider === "google" ? "Google Kullanıcısı" : "Facebook Kullanıcısı";

    setSession({
      id: `${provider}-${email}`,
      name,
      email,
      provider,
      createdAt: new Date().toISOString(),
    });
  }

  function updateUser(payload: Partial<Pick<User, "name" | "email">>) {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      name: payload.name?.trim() || user.name,
      email: payload.email ? normalizeEmail(payload.email) : user.email,
    };

    setSession(updatedUser);
  }

  function logout() {
    setUser(null);
    clearSessionOnly();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        socialLogin,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}