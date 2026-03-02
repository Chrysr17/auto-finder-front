"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  username: z.string().min(1, "Ingresa tu usuario"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!resp.ok) {
        if (resp.status === 401) setErrorMsg("Usuario o contraseña incorrectos.");
        else setErrorMsg("Error al iniciar sesión.");
        return;
      }

      // cookie ya quedó seteada, ahora navegas
      router.push("/autos");
    } catch {
      setErrorMsg("No se pudo conectar. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow">
        <h1 className="text-2xl font-semibold">Auto-Finder</h1>
        <p className="text-sm opacity-80 mt-1">Inicia sesión para continuar</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="text-sm opacity-90">Usuario</label>
            <input
              {...register("username")}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 p-3 outline-none focus:ring-2 focus:ring-white/20"
              autoComplete="username"
            />
            {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>}
          </div>

          <div>
            <label className="text-sm opacity-90">Contraseña</label>
            <input
              {...register("password")}
              type="password"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 p-3 outline-none focus:ring-2 focus:ring-white/20"
              autoComplete="current-password"
            />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {errorMsg}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-white text-black font-medium p-3 disabled:opacity-60"
            type="submit"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}