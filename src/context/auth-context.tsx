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

type StoredUser = User & {
  password?: string;
};

type AuthResult = {
  ok: boolean;
  error?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => AuthResult;
  register: (payload: {
    name: string;
    email: string;
    password: string;
  }) => AuthResult;
  socialLogin: (provider: "google" | "facebook") => void;
  updateUser: (payload: Partial<Pick<User, "name" | "email">>) => void;
  logout: () => void;
};

const AUTH_STORAGE_KEY = "anzerana-auth-v2";
const USERS_STORAGE_KEY = "anzerana-users-v2";

const AuthContext = createContext<AuthContextType | null>(null);

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}`;
}

function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return;

    try {
      setUser(JSON.parse(raw));
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  function setSession(nextUser: User) {
    setUser(nextUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
  }

  function register(payload: {
    name: string;
    email: string;
    password: string;
  }): AuthResult {
    const name = payload.name.trim();
    const email = payload.email.trim().toLowerCase();
    const password = payload.password.trim();

    if (!name || !email || !password) {
      return { ok: false, error: "Lütfen tüm alanları doldurun." };
    }

    if (password.length < 6) {
      return { ok: false, error: "Şifre en az 6 karakter olmalıdır." };
    }

    const users = getStoredUsers();
    const exists = users.some((item) => item.email === email);

    if (exists) {
      return { ok: false, error: "Bu e-posta adresiyle kayıtlı bir hesap var." };
    }

    const nextUser: StoredUser = {
      id: createId(),
      name,
      email,
      password,
      provider: "email",
      createdAt: new Date().toISOString(),
    };

    saveStoredUsers([...users, nextUser]);

    const { password: _password, ...publicUser } = nextUser;
    setSession(publicUser);

    return { ok: true };
  }

  function login(emailInput: string, passwordInput: string): AuthResult {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!email || !password) {
      return { ok: false, error: "E-posta ve şifre alanları zorunludur." };
    }

    const users = getStoredUsers();
    const found = users.find(
      (item) =>
        item.email === email &&
        item.password === password &&
        item.provider === "email",
    );

    if (!found) {
      return { ok: false, error: "E-posta veya şifre hatalı." };
    }

    const { password: _password, ...publicUser } = found;
    setSession(publicUser);

    return { ok: true };
  }

  function socialLogin(provider: "google" | "facebook") {
    const email =
      provider === "google"
        ? "google.kullanici@anzerana.com"
        : "facebook.kullanici@anzerana.com";

    const name =
      provider === "google" ? "Google Kullanıcısı" : "Facebook Kullanıcısı";

    const users = getStoredUsers();
    const existing = users.find((item) => item.email === email);

    if (existing) {
      const { password: _password, ...publicUser } = existing;
      setSession(publicUser);
      return;
    }

    const nextUser: StoredUser = {
      id: createId(),
      name,
      email,
      provider,
      createdAt: new Date().toISOString(),
    };

    saveStoredUsers([...users, nextUser]);
    setSession(nextUser);
  }

  function updateUser(payload: Partial<Pick<User, "name" | "email">>) {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      name: payload.name?.trim() || user.name,
      email: payload.email?.trim().toLowerCase() || user.email,
    };

    setSession(updatedUser);

    const users = getStoredUsers();
    const updatedUsers = users.map((item) =>
      item.id === user.id ? { ...item, ...updatedUser } : item,
    );

    saveStoredUsers(updatedUsers);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
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
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}