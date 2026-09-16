import { Container } from "./ui/Container";

const links = [
  { label: "Home", href: "#home" },
  { label: "Product", href: "#platform" },
  { label: "Technology", href: "#workflow" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal/15 ring-1 ring-teal/40">
            <span className="h-2.5 w-2.5 rounded-sm bg-teal shadow-[0_0_10px_rgba(13,148,136,0.9)]" />
          </span>
          <span className="text-lg font-bold tracking-tight text-ink">
            Lucenta
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#login"
            className="hidden text-sm font-medium text-ink/80 transition-colors hover:text-ink sm:block"
          >
            Log In
          </a>
          <a
            href="#get-started"
            className="rounded-md bg-teal px-4 py-2 text-sm font-semibold text-navy transition-all hover:bg-teal-light hover:shadow-glow-teal"
          >
            Get Started
          </a>
        </div>
      </Container>
    </header>
  );
}
