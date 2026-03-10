"use client";

import { useEffect, useState } from "react";

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

export default function CompararPage() {
  const [autos, setAutos] = useState<Auto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cargarAutosComparar = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const current = localStorage.getItem("compare_autos");
      const ids: number[] = current ? JSON.parse(current) : [];

      if (ids.length === 0) {
        setAutos([]);
        setLoading(false);
        return;
      }

      const results = await Promise.all(
        ids.map(async (id) => {
          const resp = await fetch(`/api/autos/${id}`, { cache: "no-store" });
          if (!resp.ok) return null;
          return resp.json();
        })
      );

      setAutos(results.filter(Boolean));
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

  const quitarAuto = (id: number) => {
    const current = localStorage.getItem("compare_autos");
    const ids: number[] = current ? JSON.parse(current) : [];
    const nuevos = ids.filter((item) => item !== id);

    localStorage.setItem("compare_autos", JSON.stringify(nuevos));
    setAutos((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    cargarAutosComparar();
  }, []);

  return (
    <main className="min-h-screen p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Comparador de autos</h1>
          <p className="text-sm opacity-80">
            Compara precio, año, categoría y color
          </p>
        </div>

        <button
          onClick={limpiarComparacion}
          className="rounded-xl bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          Limpiar comparación
        </button>
      </header>

      <section className="mt-6">
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            Cargando comparación...
          </div>
        )}

        {!loading && errorMsg && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && autos.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            No hay autos seleccionados para comparar.
          </div>
        )}

        {!loading && !errorMsg && autos.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
            <table className="min-w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="p-4 text-left">Campo</th>
                  {autos.map((auto) => (
                    <th key={auto.id} className="p-4 text-left min-w-[240px]">
                      <div className="space-y-3">
                        <div className="h-36 w-full overflow-hidden rounded-xl bg-black/20">
                          {auto.imagenPortadaUrl ? (
                            <img
                              src={auto.imagenPortadaUrl}
                              alt={`${auto.marcaNombre ?? "Auto"} ${auto.modeloNombre ?? ""}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center opacity-70">
                              Sin portada
                            </div>
                          )}
                        </div>

                        <div className="font-semibold">
                          {auto.marcaNombre} {auto.modeloNombre}
                        </div>

                        <button
                          onClick={() => quitarAuto(auto.id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs text-white hover:bg-red-700"
                        >
                          Quitar
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-white/10">
                  <td className="p-4 font-medium">Precio</td>
                  {autos.map((auto) => (
                    <td key={auto.id} className="p-4">
                      {typeof auto.precio === "number"
                        ? `S/ ${auto.precio.toFixed(2)}`
                        : "No disponible"}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-white/10">
                  <td className="p-4 font-medium">Año</td>
                  {autos.map((auto) => (
                    <td key={auto.id} className="p-4">
                      {auto.anioFabricacion ?? "No disponible"}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-white/10">
                  <td className="p-4 font-medium">Categoría</td>
                  {autos.map((auto) => (
                    <td key={auto.id} className="p-4">
                      {auto.categoriaNombre ?? "No disponible"}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-white/10">
                  <td className="p-4 font-medium">Color</td>
                  {autos.map((auto) => (
                    <td key={auto.id} className="p-4">
                      {auto.color ?? "No disponible"}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-medium">Marca / Modelo</td>
                  {autos.map((auto) => (
                    <td key={auto.id} className="p-4">
                      {auto.marcaNombre} {auto.modeloNombre}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}