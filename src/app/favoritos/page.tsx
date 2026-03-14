"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import RemoveFavoriteButton from "@/components/RemoveFavoriteButton";
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

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState<Auto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cargarFavoritos = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const resp = await fetch("/api/favoritos/detalle", { cache: "no-store" });

      if (!resp.ok) {
        if (resp.status === 401) {
          setErrorMsg("Sesión expirada. Vuelve a iniciar sesión.");
        } else {
          setErrorMsg("No se pudieron cargar los favoritos.");
        }
        return;
      }

      const data = await resp.json();
      setFavoritos(data);
    } catch {
      setErrorMsg("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const quitarDeLista = (autoId: number) => {
    setFavoritos((prev) => prev.filter((auto) => auto.id !== autoId));
  };

  useEffect(() => {
    cargarFavoritos();
  }, []);

  return (
    <main className="min-h-screen p-6">
      <Navbar />

      <header className="mt-6">
        <div>
          <h1 className="text-2xl font-semibold">Favoritos</h1>
          <p className="text-sm opacity-80">Tus autos guardados</p>
        </div>
      </header>

      <section className="mt-6">
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            Cargando favoritos...
          </div>
        )}

        {!loading && errorMsg && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && favoritos.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            No tienes autos favoritos todavía.
          </div>
        )}

        {!loading && !errorMsg && favoritos.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoritos.map((auto) => (
              <Link
                key={auto.id}
                href={`/autos/${auto.id}`}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow transition hover:bg-white/10"
              >
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

                <div className="p-4">
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

                  <div className="mt-4">
                    <RemoveFavoriteButton
                      autoId={auto.id}
                      onRemoved={quitarDeLista}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}