import { NADIIA_ACCENT, NADIIA_LABEL, NADIIA_SHAPE, NADIIA_SMALL, NADIIA_SURFACE } from "./nadiia";
import { Arrow } from "./NadiiaParts";

/**
 * One column per user group, in the Nadiia style: the group's name in a white
 * box, then arrows down to its pain points (subtle orange) and to what it
 * creates or needs (subtle green). Columns stack on phones.
 */

export interface UserGroup {
  name: string;
  pains: string[];
  needsLabel: string;
  needs: string[];
}

function ListCard({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "green" | "orange";
}) {
  return (
    <div className={`${NADIIA_SHAPE} ${NADIIA_SURFACE[tone]} p-5`}>
      <p className="mb-3 flex items-center gap-2 font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
        <span
          aria-hidden
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: NADIIA_ACCENT[tone] }}
        />
        {label}
      </p>
      <ul className={`${NADIIA_SMALL} space-y-1.5 text-[var(--nd-ink,#262626)]`}>
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden className="text-neutral-400">
              ·
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function UserGroups({ groups }: { groups: UserGroup[] }) {
  return (
    <div className="my-10 grid gap-12 md:grid-cols-3 md:gap-5">
      {groups.map((group) => (
        <div key={group.name} className="flex flex-col">
          <p
            className={`${NADIIA_SHAPE} ${NADIIA_SURFACE.white} ${NADIIA_LABEL} flex h-16 items-center justify-center px-4 text-center`}
          >
            {group.name}
          </p>
          <Arrow direction="down" />
          <ListCard label="Pain points" items={group.pains} tone="orange" />
          <Arrow direction="down" />
          <ListCard label={group.needsLabel} items={group.needs} tone="green" />
        </div>
      ))}
    </div>
  );
}
