"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AddToFavoritesButton from "@/components/AddToFavoritesButton";
import AddToCompareButton from "@/components/AddToCompareButton";
import GoToCompareButton from "@/components/GoToCompareButton";
import type { Auto } from "@/types";

export default function AutoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [auto, setAuto] = useState<Auto | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const cargarDetalle = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const resp = await fetch(`/api/autos/${id}`, {
          method: "GET",
          credentials: "include",
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
  }, [id]);

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="p-6">
        <div className="mb-6">
          <Link
            href="/autos"
            className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            ← Volver al listado
          </Link>
        </div>

        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            Cargando detalle...
          </div>
        )}

        {!loading && errorMsg && (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && auto && (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-lg">
              <div className="h-[320px] w-full bg-black/20 sm:h-[450px]">
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
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.2em] text-blue-400/80">
                {auto.categoriaNombre ?? "Categoría"}
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                {auto.marcaNombre} {auto.modeloNombre}
              </h1>

              <div className="mt-6 space-y-3 text-white/80">
                <p>
                  <span className="font-medium text-white">Color:</span>{" "}
                  {auto.color ?? "No disponible"}
                </p>
                <p>
                  <span className="font-medium text-white">Año de fabricación:</span>{" "}
                  {auto.anioFabricacion ?? "No disponible"}
                </p>
              </div>

              <p className="mt-8 text-4xl font-bold tracking-tight text-white">
                {typeof auto.precio === "number"
                  ? `S/ ${auto.precio.toFixed(2)}`
                  : "Precio no disponible"}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <AddToFavoritesButton autoId={auto.id} />
                <AddToCompareButton autoId={auto.id} />
              </div>

              <div className="mt-3">
                <GoToCompareButton />
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
