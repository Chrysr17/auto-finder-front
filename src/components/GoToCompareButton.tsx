"use client";

import { useRouter } from "next/navigation";

export default function GoToCompareButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/comparar")}
      className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-700"
    >
      Ir al comparador
    </button>
  );
}