"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./ui/Container";
import { Wordmark } from "./ui/Wordmark";
import { LogoutButton } from "./LogoutButton";

const links = [
  { label: "Product", href: "/product" },
  { label: "Technology", href: "/technology" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Navbar({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center"
        >
          <Wordmark className="h-10 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm transition-colors hover:text-ink ${
                  active ? "text-ink" : "text-ink/70"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {userEmail ? (
            <>
              <span
                title={userEmail}
                className="hidden max-w-[160px] truncate font-mono text-xs text-ink/50 xl:block"
              >
                {userEmail}
              </span>
              <Link
                href="/dashboard"
                className="hidden rounded-md bg-teal px-4 py-2 text-sm font-semibold text-navy transition-all hover:bg-teal-light hover:shadow-glow-teal sm:block"
              >
                Dashboard
              </Link>
              <LogoutButton className="hidden text-sm font-medium text-ink/80 transition-colors hover:text-ink sm:block" />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-ink/80 transition-colors hover:text-ink sm:block"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="hidden rounded-md bg-teal px-4 py-2 text-sm font-semibold text-navy transition-all hover:bg-teal-light hover:shadow-glow-teal sm:block"
              >
                Get Started
              </Link>
            </>
          )}

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-ink/80 transition-colors hover:border-teal/40 hover:text-ink lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              className="h-5 w-5"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-white/10 bg-navy/95 backdrop-blur-md lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-white/5 hover:text-ink ${
                    active ? "text-ink" : "text-ink/70"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4 sm:hidden">
              {userEmail ? (
                <>
                  <p className="truncate px-3 font-mono text-xs text-ink/50">
                    {userEmail}
                  </p>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="rounded-md bg-teal px-3 py-2.5 text-center text-sm font-semibold text-navy transition-all hover:bg-teal-light"
                  >
                    Dashboard
                  </Link>
                  <LogoutButton
                    onDone={() => setOpen(false)}
                    className="rounded-md border border-white/15 px-3 py-2.5 text-center text-sm font-medium text-ink/80 transition-colors hover:text-ink"
                  />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-md border border-white/15 px-3 py-2.5 text-center text-sm font-medium text-ink/80 transition-colors hover:text-ink"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="rounded-md bg-teal px-3 py-2.5 text-center text-sm font-semibold text-navy transition-all hover:bg-teal-light"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
