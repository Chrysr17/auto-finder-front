"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { useAppCounts } from "@/context/AppCountsContext";

type NavLink = {
  href: string;
  label: string;
  key?: "favorites" | "compare";
};

const links: NavLink[] = [
  { href: "/autos", label: "Autos" },
  { href: "/favoritos", label: "Favoritos", key: "favorites" },
  { href: "/comparar", label: "Comparar", key: "compare" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { favoriteCount, compareCount } = useAppCounts();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/autos" className="text-xl font-bold tracking-wide">
          Auto-Finder
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {links.map((link) => {
            const active = pathname === link.href;

            const count =
              link.key === "favorites"
                ? favoriteCount
                : link.key === "compare"
                  ? compareCount
                  : null;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${active
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <span>{link.label}</span>

                {count !== null && count > 0 && (
                  <span
                    className={`inline-flex min-w-6 justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${active
                        ? "bg-white/20 text-white"
                        : "bg-blue-600 text-white"
                      }`}
                  >
                    {count}
                  </span>
                )}
              </Link>
            );
          })}

          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}