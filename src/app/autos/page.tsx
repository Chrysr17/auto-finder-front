"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import AddToCompareButton from "@/components/AddToCompareButton";
import AddToFavoritesButton from "@/components/AddToFavoritesButton";
import Navbar from "@/components/Navbar";

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

type FavoritoDTO = {
  id: number;
  autoId: number;
  fechaCreacion: string;
};

export default function AutosPage() {
  const [autos, setAutos] = useState<Auto[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [marca, setMarca] = useState("");
  const [categoria, setCategoria] = useState("");

  const cargarFavoritos = async () => {
    try {
      const resp = await fetch("/api/favoritos", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!resp.ok) return;

      const data = (await resp.json()) as FavoritoDTO[];
      const ids = data.map((fav) => fav.autoId);

      setFavoriteIds(ids);
    } catch {
      // silencioso por ahora
    }
  };
  const cargarAutos = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const resp = await fetch("/api/autos", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!resp.ok) {
        setErrorMsg("No se pudieron cargar los autos.");
        return;
      }

      const data = await resp.json();
      setAutos(data);
    } catch {
      setErrorMsg("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const buscarMarca = async () => {
    if (!marca.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const resp = await fetch(
        `/api/autos/marca/${encodeURIComponent(marca.trim())}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!resp.ok) {
        setErrorMsg("No se pudo buscar por marca.");
        return;
      }

      const data = await resp.json();
      setAutos(data);
    } catch {
      setErrorMsg("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const buscarCategoria = async () => {
    if (!categoria.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const resp = await fetch(
        `/api/autos/categoria/${encodeURIComponent(categoria.trim())}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!resp.ok) {
        setErrorMsg("No se pudo buscar por categoría.");
        return;
      }

      const data = await resp.json();
      setAutos(data);
    } catch {
      setErrorMsg("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      try {
        const [autosResp, favResp] = await Promise.all([
          fetch("/api/autos", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),
          fetch("/api/favoritos", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        if (!autosResp.ok) {
          setErrorMsg("No se pudieron cargar los autos.");
          return;
        }

        const autosData = await autosResp.json();
        setAutos(autosData);

        if (favResp.ok) {
          const favData = await favResp.json();
          const ids = favData.map((f: { autoId: number }) => f.autoId);
          setFavoriteIds(ids);
        }

      } catch {
        setErrorMsg("Error de conexión.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <main className="min-h-screen p-6">
      <Navbar />

      <header className="mt-2 mb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400/80">
          Auto-finder
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Encuentra, compara y guarda tus autos favoritos
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
          Explora el catálogo de Auto-Finder, filtra por marca o categoría y encuentra tu auto favorito.
        </p>
      </header>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-lg backdrop-blur-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <input
            type="text"
            placeholder="Buscar por marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className="rounded-2xl border border-white/10 bg-black/20 p-3 outline-none transition focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20"
          />

          <button
            onClick={buscarMarca}
            className="rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Buscar marca
          </button>

          <input
            type="text"
            placeholder="Buscar por categoría"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="rounded-2xl border border-white/10 bg-black/20 p-3 outline-none transition focus:border-green-500/40 focus:ring-2 focus:ring-green-500/20"
          />

          <button
            onClick={buscarCategoria}
            className="rounded-2xl bg-green-600 px-4 py-3 font-medium text-white transition hover:bg-green-700"
          >
            Buscar categoría
          </button>

          <button
            onClick={() => {
              setMarca("");
              setCategoria("");
              cargarAutos();
            }}
            className="rounded-2xl bg-white/10 px-4 py-3 font-medium text-white transition hover:bg-white/15"
          >
            Reset
          </button>
        </div>
      </section>

      <section className="mt-6">
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            Cargando autos...
          </div>
        )}

        {!loading && errorMsg && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && autos.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            No se encontraron autos.
          </div>
        )}

        {!loading && !errorMsg && autos.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {autos.map((auto) => {
              const isFavorite = favoriteIds.includes(auto.id);

              return (
                <article
                  key={auto.id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-lg backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
                >
                  <div className="relative">
                    <Link href={`/autos/${auto.id}`} className="block">
                      <div className="relative h-56 w-full overflow-hidden bg-black/20">
                        {auto.imagenPortadaUrl ? (
                          <img
                            src={auto.imagenPortadaUrl}
                            alt={`${auto.marcaNombre ?? "Auto"} ${auto.modeloNombre ?? ""}`}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm opacity-70">
                            Sin portada
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                      </div>
                    </Link>

                    <div className="absolute right-3 top-3">
                      <AddToFavoritesButton
                        autoId={auto.id}
                        initialFavorite={isFavorite}
                        onToggle={(autoId, nextValue) => {
                          setFavoriteIds((prev) => {
                            if (nextValue) {
                              return prev.includes(autoId) ? prev : [...prev, autoId];
                            }
                            return prev.filter((id) => id !== autoId);
                          });
                        }}
                      />
                    </div>

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
                      <h2 className="line-clamp-1 text-xl font-semibold tracking-tight">
                        {auto.marcaNombre} {auto.modeloNombre}
                      </h2>

                      <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
                        <span>{auto.color ?? "Color no disponible"}</span>
                      </div>

                      <p className="mt-4 text-2xl font-bold tracking-tight text-white">
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

                      <AddToCompareButton autoId={auto.id} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}