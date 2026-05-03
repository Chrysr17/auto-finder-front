import api from "@/app/api/axios";
import type { JwtResponse, LoginRequest } from "@/types";

export const login = async (data: LoginRequest): Promise<JwtResponse> => {
  const res = await api.post<JwtResponse>("/auth/login", data);
  return res.data;
};
