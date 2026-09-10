export default function Header() {
  return (
    <header className="border-b pb-8">
      <h1>Niia Bieliavtseva</h1>
      <h2>
        Product Designer
        <br />
        AI Design Engineer
      </h2>
      <div className="flex space-x-2">
        <a
          href="mailto:nia.bieliavtseva@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Mail
        </a>
        <a
          href="https://www.linkedin.com/in/niia-bieliavtseva/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          LinkedIn
        </a>
      </div>
    </header>
  );
}
