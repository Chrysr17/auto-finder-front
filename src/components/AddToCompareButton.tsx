"use client";

import { useState } from "react";

type Props = {
  autoId: number;
};

export default function AddToCompareButton({ autoId }: Props) {
  const [message, setMessage] = useState("");

  const handleAdd = () => {
    const current = localStorage.getItem("compare_autos");
    const ids: number[] = current ? JSON.parse(current) : [];

    if (ids.includes(autoId)) {
      setMessage("Este auto ya está en comparación.");
      return;
    }

    if (ids.length >= 3) {
      setMessage("Solo puedes comparar hasta 3 autos.");
      return;
    }

    ids.push(autoId);
    localStorage.setItem("compare_autos", JSON.stringify(ids));
    setMessage("Auto agregado para comparar.");
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleAdd}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
      >
        Agregar a comparar
      </button>

      {message && <p className="text-sm opacity-80">{message}</p>}
    </div>
  );
}