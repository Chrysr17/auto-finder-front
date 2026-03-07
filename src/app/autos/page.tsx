"use client";

import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";

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

export default function AutosPage() {
  const [autos, setAutos] = useState<Auto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [marca, setMarca] = useState("");
  const [categoria, setCategoria] = useState("");

  const cargarAutos = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const resp = await fetch("/api/autos", { cache: "no-store" });

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
      const resp = await fetch(`/api/autos/marca/${encodeURIComponent(marca.trim())}`, {
        cache: "no-store",
      });

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
        { cache: "no-store" }
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
    cargarAutos();
  }, []);

  return (
    <main className="min-h-screen p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Autos</h1>
          <p className="text-sm opacity-80">Catálogo de Auto-Finder</p>
        </div>
        <LogoutButton />
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
            {autos.map((auto) => (
              <div
                key={auto.id}
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
                    S/ {auto.precio?.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}