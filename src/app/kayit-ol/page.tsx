"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function KayitOlPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-semibold text-emerald-950 dark:text-white">
        Kayıt Ol
      </h1>

      <p className="mt-2 text-sm text-emerald-900/75 dark:text-slate-300">
        Hesabınızı oluşturarak siparişlerinizi, adreslerinizi ve profil
        bilgilerinizi kolayca yönetebilirsiniz.
      </p>

      <form
        className="mt-6 rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-emerald-900 dark:bg-slate-900 dark:shadow-black/20"
        onSubmit={(event) => {
          event.preventDefault();

          if (password !== passwordAgain) {
            setError("Şifreler eşleşmiyor.");
            return;
          }

          const result = register({ name, email, password });

          if (!result.ok) {
            setError(result.error ?? "Kayıt oluşturulamadı.");
            return;
          }

          setError("");
          router.push("/profil");
        }}
      >
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        <label className="text-sm font-semibold text-emerald-950 dark:text-white">
          Ad Soyad
        </label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ad Soyad"
          className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none transition focus:ring-2 focus:ring-emerald-900/20 dark:border-emerald-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-amber-300/20"
        />

        <label className="mt-4 block text-sm font-semibold text-emerald-950 dark:text-white">
          E-posta
        </label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
            onChange={(event) => setPassword(event.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="En az 6 karakter"
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

        <label className="mt-4 block text-sm font-semibold text-emerald-950 dark:text-white">
          Şifre Tekrar
        </label>
        <input
          value={passwordAgain}
          onChange={(event) => setPasswordAgain(event.target.value)}
          type={showPassword ? "text" : "password"}
          placeholder="Şifrenizi tekrar girin"
          className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none transition focus:ring-2 focus:ring-emerald-900/20 dark:border-emerald-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-amber-300/20"
        />

        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-emerald-900 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700 dark:hover:bg-emerald-600"
        >
          Kayıt Ol
        </button>

        <p className="mt-5 text-center text-sm text-emerald-900/70 dark:text-slate-300">
          Zaten hesabınız var mı?{" "}
          <Link
            href="/giris-yap"
            className="font-semibold text-emerald-900 underline-offset-4 hover:underline dark:text-amber-300"
          >
            Giriş yapın
          </Link>
        </p>
      </form>
    </div>
  );
}