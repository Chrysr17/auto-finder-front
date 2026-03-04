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

  const [marca, setMarca] = useState("");
  const [categoria, setCategoria] = useState("");

  const cargarAutos = async () => {
    setLoading(true);

    const resp = await fetch("/api/autos");

    const data = await resp.json();
    setAutos(data);

    setLoading(false);
  };

  const buscarMarca = async () => {
    if (!marca) return;

    setLoading(true);

    const resp = await fetch(`/api/autos/marca/${marca}`);

    const data = await resp.json();
    setAutos(data);

    setLoading(false);
  };

  const buscarCategoria = async () => {
    if (!categoria) return;

    setLoading(true);

    const resp = await fetch(`/api/autos/categoria/${categoria}`);

    const data = await resp.json();
    setAutos(data);

    setLoading(false);
  };

  useEffect(() => {
    cargarAutos();
  }, []);

  return (
    <main className="min-h-screen p-6">

      <header className="flex justify-between">
        <h1 className="text-2xl font-semibold">Autos</h1>
        <LogoutButton />
      </header>

      {/* filtros */}
      <section className="mt-6 flex gap-4 flex-wrap">

        <input
          placeholder="Buscar por marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={buscarMarca}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Buscar marca
        </button>

        <input
          placeholder="Buscar por categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={buscarCategoria}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Buscar categoría
        </button>

        <button
          onClick={cargarAutos}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>

      </section>

      {/* listado */}
      <section className="grid grid-cols-3 gap-4 mt-6">

        {loading && <p>Cargando...</p>}

        {!loading &&
          autos.map((auto) => (
            <div
              key={auto.id}
              className="border rounded p-4"
            >
              <h2 className="font-bold">
                {auto.marcaNombre} {auto.modeloNombre}
              </h2>

              <p>{auto.categoriaNombre}</p>

              <p>{auto.color}</p>

              <p className="font-semibold">
                S/ {auto.precio}
              </p>
            </div>
          ))}

      </section>

    </main>
  );
}