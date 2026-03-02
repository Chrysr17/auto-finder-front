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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const resp = await fetch("/api/autos", { cache: "no-store" });

        if (!resp.ok) {
          if (resp.status === 401) setErrorMsg("Sesión expirada. Vuelve a iniciar sesión.");
          else setErrorMsg("No se pudieron cargar los autos.");
          return;
        }

        const data = await resp.json();

        // Soporta: respuesta como array o como { content: [] } (paginado)
        const list = Array.isArray(data) ? data : (data?.content ?? []);
        setAutos(list);
      } catch {
        setErrorMsg("Error de conexión.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <main className="min-h-screen p-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Autos</h1>
          <p className="text-sm opacity-80">Listado desde tu API Gateway (9000)</p>
        </div>
        <LogoutButton />
      </header>

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
            No hay autos para mostrar.
          </div>
        )}

        {!loading && !errorMsg && autos.length > 0 && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {autos.map((a) => (
              <article
                key={a.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
              >
                <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  {a.imagenPortadaUrl ? (
                    // Si usas next/image luego lo cambiamos (requiere configurar domains)
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.imagenPortadaUrl}
                      alt={`Auto ${a.id}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm opacity-70">
                      Sin imagen
                    </div>
                  )}
                </div>

                <h2 className="mt-3 font-semibold">
                  {a.marcaNombre ?? "Marca"} {a.modeloNombre ?? "Modelo"}
                </h2>

                <p className="text-sm opacity-80 mt-1">
                  {a.categoriaNombre ?? "Categoría"} • {a.color ?? "Color"} • {a.anioFabricacion ?? "Año"}
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {typeof a.precio === "number" ? `S/ ${a.precio.toFixed(2)}` : "Precio no disponible"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}