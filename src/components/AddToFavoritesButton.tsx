"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

type Props = {
  autoId: number;
  initialFavorite?: boolean;
  onToggle?: (autoId: number, nextValue: boolean) => void;
};

export default function AddToFavoritesButton({
  autoId,
  initialFavorite = false,
  onToggle,
}: Props) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const method = isFavorite ? "DELETE" : "POST";

      const resp = await fetch(`/api/favoritos/${autoId}`, {
        method,
        credentials: "include",
      });

      if (!resp.ok) {
        return;
      }

      const nextValue = !isFavorite;
      setIsFavorite(nextValue);
      onToggle?.(autoId, nextValue);
    } catch {
      // aquí luego puedes cambiarlo por toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      }}
      disabled={loading}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 disabled:opacity-60"
    >
      <Heart
        className={`h-5 w-5 transition ${
          isFavorite
            ? "fill-blue-500 text-blue-500"
            : "text-white/80"
        }`}
      />
    </button>
  );
}