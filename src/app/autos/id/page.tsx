"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Auto = {
  id: number;
  color?: string;
  precio?: number;
  anioFabricacion?: number;
  marcaNombre?: string;
  modeloNombre?: string;
  categoriaNombre?: string;
  imagenPortadaUrl?: string;
};

export default function AutoDetallePage({
  params,
}: {
  params: { id: string };
}) {
  const [auto, setAuto] = useState<Auto | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const cargarDetalle = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const resp = await fetch(`/api/autos/${params.id}`, {
          cache: "no-store",
        });

        if (!resp.ok) {
          if (resp.status === 404) {
            setErrorMsg("Auto no encontrado.");
          } else {
            setErrorMsg("No se pudo cargar el detalle del auto.");
          }
          return;
        }

        const data = await resp.json();
        setAuto(data);
      } catch {
        setErrorMsg("Error de conexión.");
      } finally {
        setLoading(false);
      }
    };

    cargarDetalle();
  }, [params.id]);

  return (
    <main className="min-h-screen p-6">
      <div className="mb-6">
        <Link
          href="/autos"
          className="inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          ← Volver al listado
        </Link>
      </div>

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          Cargando detalle...
        </div>
      )}

      {!loading && errorMsg && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && auto && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="h-[300px] sm:h-[420px] w-full bg-black/20">
              {auto.imagenPortadaUrl ? (
                <img
                  src={auto.imagenPortadaUrl}
                  alt={`${auto.marcaNombre ?? "Auto"} ${auto.modeloNombre ?? ""}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm opacity-70">
                  Sin portada
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h1 className="text-3xl font-bold">
              {auto.marcaNombre} {auto.modeloNombre}
            </h1>

            <p className="mt-2 text-sm opacity-80">
              Categoría: {auto.categoriaNombre ?? "No disponible"}
            </p>

            <p className="mt-2 text-sm opacity-80">
              Color: {auto.color ?? "No disponible"}
            </p>

            <p className="mt-2 text-sm opacity-80">
              Año de fabricación: {auto.anioFabricacion ?? "No disponible"}
            </p>

            <p className="mt-6 text-3xl font-semibold">
              {typeof auto.precio === "number"
                ? `S/ ${auto.precio.toFixed(2)}`
                : "Precio no disponible"}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}