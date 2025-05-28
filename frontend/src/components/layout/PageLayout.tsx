import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 overflow-auto">
        <div className="h-full w-full">{children}</div>
      </div>
    </div>
  );
}
