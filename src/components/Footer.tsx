export default function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 px-4 py-4 font-mono text-[15px] text-gray-400 uppercase">
      <p>
        Design + coded with <span aria-hidden>❤</span> by Niia
      </p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <a href="https://www.linkedin.com/in/niia-bieliavtseva/" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href="mailto:nia.bieliavtseva@gmail.com" target="_blank" rel="noopener noreferrer">
          Email
        </a>
        <a href="https://github.com/hey-niia" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
          Résumé
        </a>
      </div>
    </footer>
  );
}
