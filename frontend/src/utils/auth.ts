import { ethers } from "ethers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface RegisterData {
  email: string;
  password: string;
  ownerAddress: string;
}

interface LoginData {
  email: string;
  password: string;
  ownerAddress: string;
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
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Registration failed");
    }

    // Store auth data
    if (result.token && result.user) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
    }

    return result;
  } catch (error: any) {
    return {
      error: error.message || "Registration failed",
    };
  }
}

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Login failed");
    }

    // Store auth data
    if (result.token && result.user) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
    }

    return result;
  } catch (error: any) {
    return {
      error: error.message || "Login failed",
    };
  }
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
