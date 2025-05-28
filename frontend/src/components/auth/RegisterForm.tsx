// components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, Mail, Lock, Wallet } from "lucide-react";
import { register, checkMetaMaskConnection } from "@/utils/auth";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleConnectMetaMask = async () => {
    try {
      await checkMetaMaskConnection();
      setIsMetaMaskConnected(true);
      toast({
        title: "Success",
        description: "MetaMask connected successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to connect MetaMask",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isMetaMaskConnected) {
      toast({
        title: "Error",
        description: "Please connect your MetaMask wallet first",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(formData);

      if (result.user?.walletAddress) {
        toast({
          title: "Success",
          description: "Account and wallet created successfully!",
        });
      } else {
        toast({
          title: "Partial Success",
          description:
            "Account created, but wallet creation failed. You can create a wallet later.",
        });
      }

      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Registration failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-white">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-primary-600" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 focus:border-primary-500 focus:ring-primary-500 text-primary-900 placeholder:text-primary-400"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-white">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-primary-600" />
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 focus:border-primary-500 focus:ring-primary-500 text-primary-900 placeholder:text-primary-400"
              placeholder="Create a password"
              required
            />
          </div>
        </div>
      </div>

      {!isMetaMaskConnected && (
        <Button
          type="button"
          onClick={handleConnectMetaMask}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect MetaMask
        </Button>
      )}

      <Button
        type="submit"
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium"
        disabled={isLoading || !isMetaMaskConnected}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
