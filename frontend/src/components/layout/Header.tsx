"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { LogIn, UserPlus, LogOut } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-64 z-40 bg-white border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-primary-600">
            BlockFinax Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-primary-600 border-primary-600 hover:bg-primary-600 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setIsLoginOpen(true)}
                className="text-primary-600 border-primary-600 hover:bg-primary-600 hover:text-white"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <Button
                onClick={() => setIsRegisterOpen(true)}
                className="bg-primary-600 hover:bg-primary-700"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </Button>
            </div>
          )}
        </div>
      </div>

      <AuthDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <LoginForm onSuccess={() => setIsLoginOpen(false)} />
      </AuthDialog>

      <AuthDialog
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      >
        <RegisterForm onSuccess={() => setIsRegisterOpen(false)} />
      </AuthDialog>
    </header>
  );
}
