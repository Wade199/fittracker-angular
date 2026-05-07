export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  height?: number;
  weight?: number;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
