import Link from "next/link";
import { Container } from "./ui/Container";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/product" },
      { label: "Technology", href: "/technology" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Trust & Legal",
    links: [
      { label: "Privacy Policy", href: "/legal#privacy" },
      { label: "Terms of Service", href: "/legal#terms" },
      { label: "Legal", href: "/legal" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-16">
      <Container>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal/15 ring-1 ring-teal/40">
                <span className="h-2.5 w-2.5 rounded-sm bg-teal shadow-[0_0_10px_rgba(13,148,136,0.9)]" />
              </span>
              <span className="text-lg font-bold tracking-tight text-ink">
                Lucentaa
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/60">
              AI-assisted clinical decision support for X-ray, CT, and MRI
              review — built alongside radiologists. Currently in pilot
              development.
            </p>
            <div className="mt-5 space-y-1.5 font-mono text-xs text-ink/40">
              <p>hello@lucentaa.com</p>
              <p>Lagos, Nigeria</p>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="font-mono text-xs uppercase tracking-widest text-ink/50">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink/65 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-ink/40">
            © 2026 Lucentaa. All rights reserved.
          </p>
          <p className="font-mono text-xs text-ink/30">
            For investigational and pilot use. Not a substitute for clinical judgment.
          </p>
        </div>
      </Container>
    </footer>
  );
}
