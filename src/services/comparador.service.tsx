import api from "@/app/api/axios";

export const compararAutos = async (
  ids: number[],
  criterio: string
) => {
  const res = await api.post("/comparador", {
    ids,
    criterio,
  });
  return res.data;
};