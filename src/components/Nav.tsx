import { Link, useLocation } from "react-router-dom";
import AIExperimentsNavLink from "./AIExperimentsNavLink";
import WiggleText from "./WiggleText";

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b bg-white px-4 pt-3 pb-4 text-base lg:text-xl">
      <Link to="/" className={pathname === "/" ? "nav-active" : undefined}>
        <WiggleText>Niia Bieliavtseva</WiggleText>
      </Link>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Link to="/about" className={`underline ${pathname === "/about" ? "nav-active" : ""}`}>
          <WiggleText>About</WiggleText>
        </Link>
        <AIExperimentsNavLink />
        <a
          href="mailto:nia.bieliavtseva@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          <WiggleText>Contact</WiggleText>
        </a>
      </div>
    </nav>
  );
}
