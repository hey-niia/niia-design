import { Link } from "react-router-dom";
import DrawingPad from "./DrawingPad";

/**
 * LinkedIn · Email · GitHub · Résumé, optionally with a linked title on the
 * left. On phones the title drops below the links.
 */
export function FooterLinks({
  title,
}: {
  title?: { label: string; to: string };
}) {
  return (
    <div
      className={`flex gap-x-8 gap-y-3 px-4 py-4 font-mono text-[15px] text-gray-400 uppercase ${title ? "flex-col-reverse sm:flex-row sm:items-center sm:justify-between" : "flex-wrap items-center justify-end"}`}
    >
      {title && (
        <h2>
          <Link
            to={title.to}
            className="transition-colors hover:text-[var(--site-accent)]"
          >
            {title.label}
          </Link>
        </h2>
      )}
      <div className="t-footer flex flex-wrap items-center gap-x-6 gap-y-2">
        <a
          href="https://www.linkedin.com/in/niia-bieliavtseva/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          href="mailto:nia.bieliavtseva@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Email
        </a>
        <a
          href="https://github.com/hey-niia"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a href="/Niia-Bieliavtseva-Resume.pdf" target="_blank" rel="noopener noreferrer">
          Résumé
        </a>
      </div>
    </div>
  );
}

// Project pages show the links themselves, above their Lego band.
export default function Footer({ showLinks = true }: { showLinks?: boolean }) {
  return (
    <footer>
      {showLinks && <FooterLinks />}

      {/* The drawing pad is the footer's last, full-width section. */}
      <DrawingPad />
    </footer>
  );
}
