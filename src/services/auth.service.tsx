import api from "@/app/api/axios";

export type LoginRequest = {
  username: string;
  password: string;
};

export type JwtResponse = {
  token: string;
};

export const login = async (data: LoginRequest): Promise<JwtResponse> => {
  const res = await api.post<JwtResponse>("/auth/login", data);
  return res.data;
};