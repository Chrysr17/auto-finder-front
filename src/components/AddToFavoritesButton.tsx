"use client";

import { useState } from "react";

type Props = {
  autoId: number;
};

export default function AddToFavoritesButton({ autoId }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFavorite = async () => {
    setLoading(true);
    setMessage("");

    try {
      const resp = await fetch(`/api/favoritos/${autoId}`, {
        method: "POST",
      });

      if (!resp.ok) {
        setMessage("No se pudo agregar a favoritos.");
        return;
      }

      setMessage("Auto agregado a favoritos.");
    } catch {
      setMessage("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleFavorite}
        disabled={loading}
        className="w-full rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-60"
      >
        {loading ? "Agregando..." : "Agregar a favoritos"}
      </button>

      {message && <p className="text-sm opacity-80">{message}</p>}
    </div>
  );
}