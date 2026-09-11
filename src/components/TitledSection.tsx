import type { ReactNode } from "react";

export default function TitledSection({
  id,
  title,
  contentClassName = "md:max-w-xl",
  children,
}: {
  id?: string;
  title: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="flex flex-col gap-4 border-b py-8 md:flex-row md:gap-8">
      <h3 className="md:w-40 md:shrink-0">{title}</h3>
      <div className={`md:ml-auto ${contentClassName}`}>{children}</div>
    </section>
  );
}
