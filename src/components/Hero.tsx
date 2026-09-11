import WiggleText from "./WiggleText";

export default function Hero() {
  return (
    <section className="flex flex-col items-center py-24 text-center lg:py-40">
      <h1 className="font-black tracking-tight text-4xl lg:text-6xl">Niia Bieliavtseva</h1>
      <h2 className="mt-3">Senior Product Designer, AI Design Engineer</h2>
      <div className="mt-4 flex space-x-4">
        <a
          href="mailto:nia.bieliavtseva@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          <WiggleText>Mail</WiggleText>
        </a>
        <a
          href="https://www.linkedin.com/in/niia-bieliavtseva/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          <WiggleText>LinkedIn</WiggleText>
        </a>
      </div>
    </section>
  );
}
