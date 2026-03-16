"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AddToFavoritesButton from "@/components/AddToFavoritesButton";
import AddToCompareButton from "@/components/AddToCompareButton";

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

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState<Auto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cargarFavoritos = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const resp = await fetch("/api/favoritos/detalle", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!resp.ok) {
        if (resp.status === 401) {
          setErrorMsg("Sesión expirada. Vuelve a iniciar sesión.");
        } else {
          setErrorMsg("No se pudieron cargar los favoritos.");
        }
        return;
      }

      const data = (await resp.json()) as Auto[];
      setFavoritos(data);
    } catch {
      setErrorMsg("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFavoritos();
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="p-6">
        <header className="mt-2 mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-pink-400/80">
            Tus seleccionados
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Autos favoritos
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
            Revisa los autos que has guardado, entra a su detalle o agrégalos
            al comparador para analizar opciones más fácilmente.
          </p>
        </header>

        <section className="mt-6">
          {loading && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-lg backdrop-blur-sm">
              Cargando favoritos...
            </div>
          )}

          {!loading && errorMsg && (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
              {errorMsg}
            </div>
          )}

          {!loading && !errorMsg && favoritos.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-lg backdrop-blur-sm">
              <h2 className="text-xl font-semibold">Aún no tienes favoritos</h2>
              <p className="mt-2 text-sm text-white/70">
                Explora el catálogo y guarda los autos que más te interesen.
              </p>

              <div className="mt-5">
                <Link
                  href="/autos"
                  className="inline-flex rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Ir al catálogo
                </Link>
              </div>
            </div>
          )}

          {!loading && !errorMsg && favoritos.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {favoritos.map((auto) => (
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
                        initialFavorite={true}
                        onToggle={(autoId, nextValue) => {
                          if (!nextValue) {
                            setFavoritos((prev) =>
                              prev.filter((item) => item.id !== autoId)
                            );
                          }
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
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}