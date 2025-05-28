"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  LayoutDashboard,
  Wallet,
  FileText,
  FolderArchive,
  User,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Wallet", href: "/wallet", icon: Wallet },
  { name: "Contracts", href: "/contracts", icon: FileText },
  { name: "Documents", href: "/documents", icon: FolderArchive },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-display font-bold text-[#195175]">
          BlockFinaX
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                hydrated && pathname === link.href
                  ? "bg-[#195175]/10 text-[#195175]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#195175]"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-[#195175]/10 flex items-center justify-center text-[#195175]">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session?.user?.email || "Demo User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session?.user?.address
                ? `${session.user.address.slice(
                    0,
                    6
                  )}...${session.user.address.slice(-4)}`
                : "Connect Wallet"}
            </p>
          </div>
          {session?.user && (
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
