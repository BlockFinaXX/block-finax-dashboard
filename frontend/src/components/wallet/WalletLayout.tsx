import React from "react";
import { Card } from "../ui/card";

interface WalletLayoutProps {
  children: React.ReactNode;
}

export function WalletLayout({ children }: WalletLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">{children}</Card>
      </div>
    </div>
  );
}
