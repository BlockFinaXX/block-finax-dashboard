import { ethers } from "ethers";
import { signIn } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success?: boolean;
  error?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    walletAddress: string;
    address: string;
  };
}

interface AuthError {
  error: string;
}

export async function getOwnerAddress(): Promise<string> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return await signer.getAddress();
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Registration failed");
  }

  // Store auth data
  if (responseData.token && responseData.user) {
    localStorage.setItem("token", responseData.token);
    localStorage.setItem("user", JSON.stringify(responseData.user));
  }

  return responseData;
}

export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const result = await signIn("credentials", {
    email: credentials.email,
    password: credentials.password,
    redirect: false,
  });

  if (result?.error) {
    throw new Error("Invalid email or password");
  }

  // Store auth data
  if (result.token && result.user) {
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
  }

  return result;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

export function getAuthUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
