"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

const links = [
  { href: "/autos", label: "Autos" },
  { href: "/favoritos", label: "Favoritos" },
  { href: "/comparar", label: "Comparar" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/autos" className="text-xl font-bold tracking-wide">
          Auto-Finder
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}