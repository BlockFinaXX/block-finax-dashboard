// components/auth/RegisterForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { register } from "../../utils/auth";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error("All fields are required");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Create a new wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const ownerAddress = await signer.getAddress();

      // Register user with wallet
      const response = await register({
        email: formData.email,
        password: formData.password,
        ownerAddress,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Join BlockFinax to start managing your finances
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            I agree to the{" "}
            <a
              href="#"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Privacy Policy
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating account...
            </span>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-medium text-primary-600 hover:text-primary-500"
        >
          Sign in
        </a>
      </p>
    </div>
  );
}
