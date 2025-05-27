export async function registerUser(email: string, password: string) {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Registration failed");
    }

    return data;
  } catch (error: any) {
    console.error("Registration error:", error);
    throw new Error(error.message || "Registration failed");
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.message || "Login failed");
  }
}

export async function createWallet(token: string) {
  try {
    const res = await fetch("/api/wallet/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Wallet creation failed");
    }

    return data;
  } catch (error: any) {
    console.error("Wallet creation error:", error);
    throw new Error(error.message || "Wallet creation failed");
  }
}
