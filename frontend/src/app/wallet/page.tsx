"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WalletDashboard } from "@/components/wallet/WalletDashboard";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { LoginForm } from "@/components/auth/LoginForm";
import { PageLayout } from "@/components/layout/PageLayout";

export default function WalletPage() {
  const { data: session } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    if (!session) {
      setIsLoginOpen(true);
    }
  }, [session]);

  if (!session) {
    return (
      <AuthDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <LoginForm onSuccess={() => setIsLoginOpen(false)} />
      </AuthDialog>
    );
  }

  return (
    <PageLayout>
      <WalletDashboard />
    </PageLayout>
  );
}
