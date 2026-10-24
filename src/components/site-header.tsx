"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const links = [
  { href: "/", label: "概览" },
  { href: "/releases", label: "发布记录" },
  { href: "/checklist", label: "上线检查单" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/10 bg-[oklch(0.28_0.04_242)] text-[oklch(0.96_0.012_88)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <Link href="/" className="group block">
          <span className="font-heading text-3xl leading-none tracking-wide">
            栈桥
          </span>
          <span className="mt-1 block text-[0.7rem] tracking-[0.28em] text-[oklch(0.78_0.08_78)]">
            ZHANQIAO
          </span>
        </Link>
        <nav className="flex flex-wrap gap-2" aria-label="页面">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-[oklch(0.78_0.08_78)] text-[oklch(0.28_0.04_242)]"
                    : "text-[oklch(0.9_0.02_88)] hover:bg-white/10",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
