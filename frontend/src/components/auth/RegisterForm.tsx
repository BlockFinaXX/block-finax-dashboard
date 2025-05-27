// components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, User, Mail, Lock, Building } from "lucide-react";
import { register } from "@/utils/auth";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(formData);
      toast({
        title: "Success",
        description: "Registration successful! Please login.",
      });
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
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="pl-10"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10"
              placeholder="Create a password"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-medium">
            Company Name
          </Label>
          <div className="relative">
            <Building className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleChange}
              className="pl-10"
              placeholder="Enter your company name"
              required
            />
          </div>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-[#195175] hover:bg-[#195175]/90"
        disabled={isLoading}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
