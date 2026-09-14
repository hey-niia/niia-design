import { Link, useLocation } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";
import AIPlaygroundNavLink from "./AIPlaygroundNavLink";
import { useNiiaChat } from "../context/useNiiaChat";

const LINKEDIN_URL = "https://www.linkedin.com/in/niia-bieliavtseva/";

export default function Nav() {
  const { pathname } = useLocation();
  const { openWelcome } = useNiiaChat();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fitsInline, setFitsInline] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Rather than guessing a fixed breakpoint (which leaves a dead zone where
  // the nav no longer fits but the mobile menu hasn't kicked in yet, causing
  // it to wrap onto its own line), measure the full single-line layout's
  // natural width off-screen and compare it to the header's actual width.
  useLayoutEffect(() => {
    const header = headerRef.current;
    const measure = measureRef.current;
    if (!header || !measure) return;

    const checkFit = () => {
      const style = getComputedStyle(header);
      const availableWidth =
        header.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const fits = measure.scrollWidth <= availableWidth;
      setFitsInline(fits);
      if (fits) setIsMenuOpen(false);
    };
    checkFit();

    const observer = new ResizeObserver(checkFit);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className="-mx-4 flex flex-col gap-y-2 bg-white px-4 pt-3 pb-4 font-mono text-[15px] uppercase"
    >
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible fixed top-[-9999px] left-[-9999px] flex items-baseline gap-x-8 whitespace-nowrap"
      >
        <span className="flex items-baseline gap-x-2">
          <span className="font-medium">Niia Bieliavtseva</span>
          <span>Product Designer + Engineer</span>
        </span>
        <span className="flex items-center gap-x-6">
          <span>Work</span>
          <span>AI Playground</span>
          <span>About</span>
          <span>✦ Niia AI</span>
        </span>
        <span className="flex items-center gap-x-6">
          <span>Email</span>
          <span>LinkedIn</span>
        </span>
      </div>

      <div className="flex items-start justify-between gap-x-8">
        <p className={`flex gap-x-2 ${fitsInline ? "items-baseline" : "flex-col"}`}>
          <Link to="/" className="font-medium text-black">
            Niia Bieliavtseva
          </Link>
          <span className="text-gray-400">Product Designer + Engineer</span>
        </p>

        {fitsInline ? (
          <>
            <nav className="flex items-center gap-x-6 text-gray-400">
              <Link to="/" state={{ scrollTo: "work" }} className={pathname === "/" ? "nav-active" : undefined}>
                Work
              </Link>
              <AIPlaygroundNavLink />
              <Link to="/about" className={pathname === "/about" ? "nav-active" : undefined}>
                About
              </Link>
              <button
                type="button"
                onClick={openWelcome}
                className="flex cursor-pointer items-center gap-1 hover:text-[#e65f2e]"
              >
                <span aria-hidden className="text-[20px]">✦</span> Niia AI
              </button>
            </nav>

            <div className="flex items-center gap-x-6 text-gray-400">
              <a href="mailto:nia.bieliavtseva@gmail.com" target="_blank" rel="noopener noreferrer">
                Email
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="flex h-6 w-6 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`block h-px w-5 bg-current transition-transform ${isMenuOpen ? "translate-y-[3px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-current transition-transform ${isMenuOpen ? "-translate-y-[3px] -rotate-45" : ""}`}
            />
          </button>
        )}
      </div>

      {!fitsInline && isMenuOpen && (
        <nav className="flex flex-col gap-4 pt-2 text-gray-400">
          <Link
            to="/"
            state={{ scrollTo: "work" }}
            onClick={() => setIsMenuOpen(false)}
            className={pathname === "/" ? "nav-active" : undefined}
          >
            Work
          </Link>
          <AIPlaygroundNavLink />
          <Link
            to="/about"
            onClick={() => setIsMenuOpen(false)}
            className={pathname === "/about" ? "nav-active" : undefined}
          >
            About
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              openWelcome();
            }}
            className="flex cursor-pointer items-center gap-1 text-left hover:text-[#e65f2e]"
          >
            <span aria-hidden className="text-[20px]">✦</span> Niia AI
          </button>
          <div className="border-t border-gray-200" />
          <a href="mailto:nia.bieliavtseva@gmail.com" target="_blank" rel="noopener noreferrer">
            Email
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </nav>
      )}
    </header>
  );
}
