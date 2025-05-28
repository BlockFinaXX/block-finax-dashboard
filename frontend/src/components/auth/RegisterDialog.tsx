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
import { RegisterForm } from "./RegisterForm";
import { UserPlus } from "lucide-react";

export function RegisterDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary-600 hover:bg-primary-700 text-white font-medium">
          <UserPlus className="mr-2 h-4 w-4" />
          Register
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary-900">
            Create Account
          </DialogTitle>
          <DialogDescription className="text-center text-primary-700">
            Fill in your details to create your account
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RegisterForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
