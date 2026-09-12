import { Link, useLocation } from "react-router-dom";
import AIExperimentsNavLink from "./AIExperimentsNavLink";

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-20 -mx-4 flex flex-wrap items-start justify-between gap-x-8 gap-y-2 bg-white px-4 pt-3 pb-4">
      <p className="flex flex-wrap items-baseline gap-x-2">
        <Link to="/" className="font-bold">
          Niia Bieliavtseva
        </Link>
        <span>Senior Product Designer, AI Design Engineer</span>
      </p>

      <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link to="/about" className={pathname === "/about" ? "nav-active" : undefined}>
          About
        </Link>
        <AIExperimentsNavLink />
        <a href="mailto:nia.bieliavtseva@gmail.com" target="_blank" rel="noopener noreferrer">
          Contact
        </a>
      </nav>
    </header>
  );
}
