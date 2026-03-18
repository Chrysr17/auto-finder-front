"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";

type AutoComparado = {
  id: number;
  marcaNombre?: string;
  modeloNombre?: string;
  precio?: number;
  anioFabricacion?: number;
  color?: string;
  categoriaNombre?: string;
  imagenPortadaUrl?: string;
};

type ComparacionDTO = {
  criterio: string;
  autosComparados: AutoComparado[];
};

export default function CompararPage() {
  const [criterio, setCriterio] = useState("general");
  const [autos, setAutos] = useState<AutoComparado[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cargarComparacion = async (criterioActual: string = "general") => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const current = localStorage.getItem("compare_autos");
      const ids: number[] = current ? JSON.parse(current) : [];

      if (ids.length === 0) {
        setAutos([]);
        return;
      }

      const resp = await fetch(
        `/api/comparar?criterio=${encodeURIComponent(criterioActual)}`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ids),
        }
      );

      if (!resp.ok) {
        setErrorMsg("No se pudo generar la comparación.");
        return;
      }

      const data = (await resp.json());
      setAutos(data.autosComparados ?? []);
    } catch {
      setErrorMsg("No se pudieron cargar los autos a comparar.");
    } finally {
      setLoading(false);
    }
  };

  const limpiarComparacion = () => {
    localStorage.removeItem("compare_autos");
    setAutos([]);
  };

  const quitarAuto = async (id: number) => {
    const current = localStorage.getItem("compare_autos");
    const ids: number[] = current ? JSON.parse(current) : [];
    const nuevos = ids.filter((item) => item !== id);

    localStorage.setItem("compare_autos", JSON.stringify(nuevos));

    if (nuevos.length === 0) {
      setAutos([]);
      return;
    }

    await cargarComparacion(criterio);
  };

  useEffect(() => {
    cargarComparacion("general");
  }, []);

  const menorPrecio = useMemo(() => {
    const precios = autos
      .map((a) => a.precio)
      .filter((p): p is number => typeof p === "number");

    return precios.length > 0 ? Math.min(...precios) : null;
  }, [autos]);

  const anioMasReciente = useMemo(() => {
    const anios = autos
      .map((a) => a.anioFabricacion)
      .filter((a): a is number => typeof a === "number");

    return anios.length > 0 ? Math.max(...anios) : null;
  }, [autos]);

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="p-6">
        <header className="mt-2 mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400/80">
              Comparación inteligente
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Compara tus autos seleccionados
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
              Analiza precio, año, categoría y color desde una vista unificada
              para tomar una mejor decisión.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/autos"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Ir al catálogo
            </Link>

            <button
              onClick={limpiarComparacion}
              className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Limpiar comparación
            </button>
          </div>
        </header>

        <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white">Criterio de comparación</p>
              <p className="text-xs text-white/60">
                Puedes usar el criterio que soporte tu microservicio.
              </p>
            </div>

            <div className="flex gap-3">
              <select
                value={criterio}
                onChange={(e) => setCriterio(e.target.value)}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
              >
                <option value="general">General</option>
                <option value="precio">Precio</option>
                <option value="anio">Año</option>
                <option value="marca">Marca</option>
              </select>

              <button
                onClick={() => cargarComparacion(criterio)}
                className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Actualizar comparación
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6">
          {loading && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-lg backdrop-blur-sm">
              Cargando comparación...
            </div>
          )}

          {!loading && errorMsg && (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
              {errorMsg}
            </div>
          )}

          {!loading && !errorMsg && autos.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-lg backdrop-blur-sm">
              <h2 className="text-xl font-semibold">
                No hay autos para comparar
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Ve al catálogo y agrega hasta 3 autos para ver sus diferencias.
              </p>

              <div className="mt-5">
                <Link
                  href="/autos"
                  className="inline-flex rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Explorar autos
                </Link>
              </div>
            </div>
          )}

          {!loading && !errorMsg && autos.length > 0 && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {autos.map((auto) => (
                  <article
                    key={auto.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-lg backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-black/20">
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

                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

                      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                          {auto.categoriaNombre ?? "Categoría"}
                        </span>

                        <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                          {auto.anioFabricacion ?? "Año"}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <Link href={`/autos/${auto.id}`} className="block">
                        <h2 className="text-xl font-semibold tracking-tight">
                          {auto.marcaNombre} {auto.modeloNombre}
                        </h2>

                        <p className="mt-2 text-sm text-white/70">
                          {auto.color ?? "Color no disponible"}
                        </p>

                        <p className="mt-4 text-2xl font-bold tracking-tight">
                          {typeof auto.precio === "number"
                            ? `S/ ${auto.precio.toFixed(2)}`
                            : "Precio no disponible"}
                        </p>
                      </Link>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <Link
                          href={`/autos/${auto.id}`}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10"
                        >
                          Ver detalle
                        </Link>

                        <button
                          onClick={() => quitarAuto(auto.id)}
                          className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.04] shadow-lg backdrop-blur-sm">
                <table className="min-w-full text-sm">
                  <thead className="border-b border-white/10 bg-black/20">
                    <tr>
                      <th className="p-4 text-left text-white/80">Campo</th>
                      {autos.map((auto) => (
                        <th key={auto.id} className="p-4 text-left text-white">
                          {auto.marcaNombre} {auto.modeloNombre}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="p-4 font-medium text-white">Precio</td>
                      {autos.map((auto) => {
                        const destacado =
                          typeof auto.precio === "number" &&
                          menorPrecio !== null &&
                          auto.precio === menorPrecio;

                        return (
                          <td
                            key={auto.id}
                            className={`p-4 ${destacado
                                ? "font-semibold text-emerald-400"
                                : "text-white/80"
                              }`}
                          >
                            {typeof auto.precio === "number"
                              ? `S/ ${auto.precio.toFixed(2)}`
                              : "No disponible"}
                            {destacado && (
                              <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-1 text-xs">
                                Mejor precio
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="border-b border-white/10">
                      <td className="p-4 font-medium text-white">Año</td>
                      {autos.map((auto) => {
                        const destacado =
                          typeof auto.anioFabricacion === "number" &&
                          anioMasReciente !== null &&
                          auto.anioFabricacion === anioMasReciente;

                        return (
                          <td
                            key={auto.id}
                            className={`p-4 ${destacado
                                ? "font-semibold text-blue-400"
                                : "text-white/80"
                              }`}
                          >
                            {auto.anioFabricacion ?? "No disponible"}
                            {destacado && (
                              <span className="ml-2 rounded-full bg-blue-500/15 px-2 py-1 text-xs">
                                Más reciente
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="border-b border-white/10">
                      <td className="p-4 font-medium text-white">Categoría</td>
                      {autos.map((auto) => (
                        <td key={auto.id} className="p-4 text-white/80">
                          {auto.categoriaNombre ?? "No disponible"}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-white/10">
                      <td className="p-4 font-medium text-white">Color</td>
                      {autos.map((auto) => (
                        <td key={auto.id} className="p-4 text-white/80">
                          {auto.color ?? "No disponible"}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-medium text-white">Marca / Modelo</td>
                      {autos.map((auto) => (
                        <td key={auto.id} className="p-4 text-white/80">
                          {auto.marcaNombre} {auto.modeloNombre}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}