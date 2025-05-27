"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-display font-semibold text-[#195175]">
          BlockFinaX
        </h1>
      </div>

      <nav className="flex items-center gap-4">
        {pathname !== "/login" && (
          <Link
            href="/login"
            className="flex items-center space-x-2 text-sm font-medium px-4 py-2 text-[#195175] hover:text-[#195175]/80 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
        )}

        {pathname !== "/register" && (
          <Link
            href="/register"
            className="flex items-center space-x-2 text-sm font-medium px-4 py-2 bg-[#195175] text-white rounded-lg hover:bg-[#195175]/90 transition-colors shadow-sm hover:shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
