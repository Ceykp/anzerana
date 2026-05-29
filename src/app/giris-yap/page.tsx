"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function GirisYapPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSuccess() {
    router.push("/profil");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-semibold text-emerald-950 dark:text-white">
        Giriş Yap
      </h1>

      <p className="mt-2 text-sm text-emerald-900/75 dark:text-slate-300">
        Hesabınıza giriş yaparak siparişlerinizi, adreslerinizi ve profil
        bilgilerinizi yönetebilirsiniz.
      </p>

      <form
        className="mt-6 rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-emerald-900 dark:bg-slate-900 dark:shadow-black/20"
        onSubmit={async (event) => {
          event.preventDefault();
        
          const result = await login(email, password);
        
          if (!result.ok) {
            setError(result.error ?? "Giriş yapılamadı.");
            return;
          }
        
          router.push("/profil");
        }}
      >
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        <label className="text-sm font-semibold text-emerald-950 dark:text-white">
          E-posta
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@anzerana.com"
          type="email"
          className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none transition focus:ring-2 focus:ring-emerald-900/20 dark:border-emerald-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-amber-300/20"
        />

        <label className="mt-4 block text-sm font-semibold text-emerald-950 dark:text-white">
          Şifre
        </label>
        <div className="mt-2 flex rounded-xl border border-amber-200 bg-white dark:border-emerald-800 dark:bg-slate-950">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Şifreniz"
            className="w-full rounded-xl bg-transparent px-3 py-2 text-sm text-emerald-950 outline-none dark:text-white dark:placeholder:text-slate-500"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="px-3 text-xs font-semibold text-emerald-900 dark:text-slate-300"
          >
            {showPassword ? "Gizle" : "Göster"}
          </button>
        </div>

        <button className="mt-5 w-full rounded-full bg-emerald-900 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700 dark:hover:bg-emerald-600">
          Giriş Yap
        </button>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-amber-100 dark:bg-emerald-900" />
          <span className="text-xs text-emerald-900/60 dark:text-slate-400">
            veya
          </span>
          <span className="h-px flex-1 bg-amber-100 dark:bg-emerald-900" />
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { redirectTo: "/profil" })}
          className="w-full rounded-full border border-amber-200 px-5 py-2.5 text-sm font-semibold text-emerald-900 transition hover:bg-amber-50 dark:border-emerald-800 dark:text-slate-100 dark:hover:bg-slate-950"
        >
          Google ile giriş yap
        </button>

        <button
          type="button"
          disabled
          className="mt-2 w-full cursor-not-allowed rounded-full border border-amber-200 px-5 py-2.5 text-sm font-semibold text-emerald-900/45 dark:border-emerald-900 dark:text-slate-500"
          title="Facebook girişi için Facebook App ID ve Secret gerekir."
        >
          Facebook ile giriş yakında
        </button>

        <p className="mt-5 text-center text-sm text-emerald-900/70 dark:text-slate-300">
          Hesabınız yok mu?{" "}
          <Link
            href="/kayit-ol"
            className="font-semibold text-emerald-900 underline-offset-4 hover:underline dark:text-amber-300"
          >
            Kayıt olun
          </Link>
        </p>
      </form>
    </div>
  );
}