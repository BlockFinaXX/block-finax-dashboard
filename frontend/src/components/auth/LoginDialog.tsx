"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { LogIn } from "lucide-react";

export function LoginDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#195175] text-white hover:bg-[#195175]/90 hover:text-white"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-center">
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <LoginForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
