export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  password: string;
  email: string;
  rol?: "USER";
};

export type JwtResponse = {
  token: string;
};
