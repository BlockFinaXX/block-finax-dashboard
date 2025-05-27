import { ethers } from "ethers";
import { signIn } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface RegisterData {
  email: string;
  password: string;
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

export async function checkMetaMaskConnection(): Promise<boolean> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return true;
  } catch (error) {
    throw new Error("Please connect your MetaMask wallet to continue");
  }
}

export async function getOwnerAddress(): Promise<string> {
  if (!(await checkMetaMaskConnection())) {
    throw new Error("Please connect your MetaMask wallet to continue");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return await signer.getAddress();
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    // Check MetaMask connection first
    await checkMetaMaskConnection();

    // Get owner address
    const ownerAddress = await getOwnerAddress();

    // Register user with owner address
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        ownerAddress,
      }),
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
  } catch (error) {
    throw error instanceof Error ? error : new Error("Registration failed");
  }
}

export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error("Invalid email or password");
    }

    // After successful login, check if user has a wallet
    const token = getAuthToken();
    if (token) {
      const userResponse = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        // Update local storage with latest user data including wallet info
        localStorage.setItem("user", JSON.stringify(userData));
        return { ...result, user: userData };
      }
    }

    return result;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Login failed");
  }
}

export async function createWallet(): Promise<{ address: string }> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  try {
    const ownerAddress = await getOwnerAddress();
    const response = await fetch("/api/wallet/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ownerAddress }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Wallet creation failed");
    }

    // Update user data with new wallet address
    const user = getAuthUser();
    if (user) {
      user.walletAddress = data.address;
      localStorage.setItem("user", JSON.stringify(user));
    }

    return data;
  } catch (error) {
    console.error("Wallet creation error:", error);
    throw error instanceof Error ? error : new Error("Wallet creation failed");
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
