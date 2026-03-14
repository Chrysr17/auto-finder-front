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

      <header className="mt-6">
        <div>
          <h1 className="text-2xl font-semibold">Autos</h1>
          <p className="text-sm opacity-80">Catálogo de Auto-Finder</p>
        </div>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <input
          type="text"
          placeholder="Buscar por marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          className="rounded-xl border border-white/10 bg-black/20 p-3 outline-none focus:ring-2 focus:ring-white/20"
        />

        <button
          onClick={buscarMarca}
          className="rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
        >
          Buscar marca
        </button>

        <input
          type="text"
          placeholder="Buscar por categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="rounded-xl border border-white/10 bg-black/20 p-3 outline-none focus:ring-2 focus:ring-white/20"
        />

        <button
          onClick={buscarCategoria}
          className="rounded-xl bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700"
        >
          Buscar categoría
        </button>

        <button
          onClick={() => {
            setMarca("");
            setCategoria("");
            cargarAutos();
          }}
          className="rounded-xl bg-gray-600 px-4 py-3 font-medium text-white hover:bg-gray-700"
        >
          Reset
        </button>
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {autos.map((auto) => {
              const isFavorite = favoriteIds.includes(auto.id);

              return (
                <div
                  key={auto.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow transition hover:bg-white/10"
                >
                  <div className="relative">
                    <Link href={`/autos/${auto.id}`} className="block">
                      <div className="h-52 w-full bg-black/20">
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
                  </div>

                  <div className="p-4">
                    <Link href={`/autos/${auto.id}`} className="block">
                      <h2 className="text-lg font-bold">
                        {auto.marcaNombre} {auto.modeloNombre}
                      </h2>

                      <p className="mt-1 text-sm opacity-80">
                        {auto.categoriaNombre}
                      </p>

                      <p className="mt-1 text-sm opacity-80">
                        Color: {auto.color}
                      </p>

                      <p className="mt-1 text-sm opacity-80">
                        Año: {auto.anioFabricacion}
                      </p>

                      <p className="mt-3 text-lg font-semibold">
                        {typeof auto.precio === "number"
                          ? `S/ ${auto.precio.toFixed(2)}`
                          : "Precio no disponible"}
                      </p>
                    </Link>
                  </div>

                  <div className="px-4 pb-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Link
                        href={`/autos/${auto.id}`}
                        className="rounded-xl bg-white/10 px-4 py-3 text-center text-sm font-medium hover:bg-white/15"
                      >
                        Ver detalle
                      </Link>

                      <AddToCompareButton autoId={auto.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}