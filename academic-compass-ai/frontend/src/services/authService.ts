import apiClient from "../lib/apiClient";
import type { AuthResponse } from "../types";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  return data;
}

export async function register(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", {
    email,
    password,
    fullName,
  });
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}
