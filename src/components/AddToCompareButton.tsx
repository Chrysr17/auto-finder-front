"use client";

import { useState } from "react";
import { useAppCounts } from "@/context/AppCountsContext";

type Props = {
  autoId: number;
};

export default function AddToCompareButton({ autoId }: Props) {
  const [message, setMessage] = useState("");
  const { refreshCompareCount } = useAppCounts();

  const handleAdd = () => {
    const current = localStorage.getItem("compare_autos");
    const ids: number[] = current ? JSON.parse(current) : [];

    if (ids.includes(autoId)) {
      setMessage("Ya agregado");
      return;
    }

    if (ids.length >= 3) {
      setMessage("Máximo 3 autos");
      return;
    }

    ids.push(autoId);
    localStorage.setItem("compare_autos", JSON.stringify(ids));
    refreshCompareCount();
    setMessage("Agregado");
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleAdd}
        className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Agregar a comparar
      </button>

      {message && (
        <p className="text-center text-xs text-white/60">{message}</p>
      )}
    </div>
  );
}