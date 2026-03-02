import api from "@/app/api/axios";

export interface Favorito {
  id: number;
  autoId: number;
  usuarioId: number;
}

export const getFavoritos = async (): Promise<Favorito[]> => {
  const res = await api.get("/favoritos");
  return res.data;
};

export const agregarFavorito = async (autoId: number) => {
  const res = await api.post(`/favoritos/${autoId}`);
  return res.data;
};

export const eliminarFavorito = async (autoId: number) => {
  const res = await api.delete(`/favoritos/${autoId}`);
  return res.data;
};