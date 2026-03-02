import api from "@/app/api/axios";

export const getAutos = async () => {
  const res = await api.get("/autos");
  return res.data;
};