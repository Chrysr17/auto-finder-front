"use client";

import { useState } from "react";

type Props = {
  autoId: number;
  onRemoved: (autoId: number) => void;
};

export default function RemoveFavoriteButton({ autoId, onRemoved }: Props) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setLoading(true);

    try {
      const resp = await fetch(`/api/favoritos/${autoId}`, {
        method: "DELETE",
      });

      if (!resp.ok) {
        alert("No se pudo quitar de favoritos.");
        return;
      }

      onRemoved(autoId);
    } catch {
      alert("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleRemove();
      }}
      disabled={loading}
      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
    >
      {loading ? "Quitando..." : "Quitar"}
    </button>
  );
}