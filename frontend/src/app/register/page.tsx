import { useAuth } from "@/hooks/useAuth";

// ... other imports ...

export default function Register() {
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          ownerAddress: address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data
        setUser(data.user);
        router.push("/dashboard");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Registration failed");
    }
  };
}
