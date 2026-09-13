import { Link, useLocation } from "react-router-dom";
import AIExperimentsNavLink from "./AIExperimentsNavLink";
import { useNiiaChat } from "../context/useNiiaChat";

export default function Nav() {
  const { pathname } = useLocation();
  const { openWelcome } = useNiiaChat();

  return (
    <header className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 bg-white px-4 pt-3 pb-4 font-mono text-[15px] uppercase">
      <p className="flex flex-wrap items-baseline gap-x-2">
        <Link to="/" className="font-medium text-black">
          Niia Bieliavtseva
        </Link>
        <span className="text-gray-400">Senior Product Designer, AI Design Engineer</span>
      </p>

      <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400">
        <Link to="/about" className={pathname === "/about" ? "nav-active" : undefined}>
          About
        </Link>
        <AIExperimentsNavLink />
        <Link to="/art" className={pathname === "/art" ? "nav-active" : undefined}>
          Art
        </Link>
        <button
          type="button"
          onClick={openWelcome}
          className="flex cursor-pointer items-center gap-1 hover:text-[#e65f2e]"
        >
          <span aria-hidden>✦</span> Niia AI
        </button>
        <a href="mailto:nia.bieliavtseva@gmail.com" target="_blank" rel="noopener noreferrer">
          Contact
        </a>
      </nav>
    </header>
  );
}
