import Nav from "../components/Nav";

const PLACEHOLDER_COUNT = 9;

export default function Art() {
  return (
    <main className="pb-24">
      <Nav />

      <header className="border-b py-8">
        <h1 className="font-black tracking-tight text-4xl lg:text-6xl">Art</h1>
      </header>

      <section className="py-8">
        <p className="mb-8 italic">A collection of drawings, on the side.</p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center border border-dashed border-neutral-300 bg-white"
            >
              <span className="text-sm text-neutral-300">Drawing coming soon</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
