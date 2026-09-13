import { useNiiaChat } from "../context/useNiiaChat";

export default function Footer() {
  const { isOpen } = useNiiaChat();

  return (
    <footer
      className={`fixed bottom-0 left-0 z-10 flex items-center justify-between border-t bg-white p-4 text-base transition-[right] duration-300 ease-out lg:text-xl ${isOpen ? "right-0 sm:right-[380px]" : "right-0"}`}
    >
      <a href="mailto:nia.bieliavtseva@gmail.com" target="_blank" rel="noopener noreferrer">
        Email
      </a>
      <a href="https://www.linkedin.com/in/niia-bieliavtseva/" target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
      <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
        Résumé
      </a>
    </footer>
  );
}
