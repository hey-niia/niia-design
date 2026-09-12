import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import WiggleText from "../components/WiggleText";

type RoutineTask = { id: string; text: string; lastDoneDate: string | null };
type TodayTask = { id: string; text: string; done: boolean };

type Stored = {
  routine: RoutineTask[];
  today: TodayTask[];
  todayDate: string;
};

const STORAGE_KEY = "taski:v1";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function loadInitial(): Stored {
  const fallback: Stored = { routine: [], today: [], todayDate: todayStr() };
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Stored;
    // A new day wipes today's one-off list but keeps the routine (its
    // checkmarks are derived from lastDoneDate, so they reset on their own).
    if (parsed.todayDate !== fallback.todayDate) {
      return { ...parsed, today: [], todayDate: fallback.todayDate };
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function TaskRow({
  text,
  done,
  onToggle,
  onDelete,
}: {
  text: string;
  done: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="flex items-center border-b">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={done}
        className="flex flex-1 items-center gap-3 py-4 text-left"
      >
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center border text-base ${
            done ? "bg-black text-white" : ""
          }`}
          aria-hidden="true"
        >
          {done ? "✓" : ""}
        </span>
        <span className={done ? "line-through opacity-60" : ""}>{text}</span>
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete "${text}"`}
        className="p-4 opacity-50 hover:opacity-100"
      >
        ×
      </button>
    </li>
  );
}

export default function TaskiV1() {
  const [data, setData] = useState<Stored>(loadInitial);
  const [routineDraft, setRoutineDraft] = useState("");
  const [todayDraft, setTodayDraft] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const doneCount = data.routine.filter((t) => t.lastDoneDate === data.todayDate).length;
  const hasDoneToday = data.today.some((t) => t.done);

  function addRoutine(e: FormEvent) {
    e.preventDefault();
    const text = routineDraft.trim();
    if (!text) return;
    setData((d) => ({ ...d, routine: [...d.routine, { id: uid(), text, lastDoneDate: null }] }));
    setRoutineDraft("");
  }

  function toggleRoutine(id: string) {
    setData((d) => ({
      ...d,
      routine: d.routine.map((t) =>
        t.id === id
          ? { ...t, lastDoneDate: t.lastDoneDate === d.todayDate ? null : d.todayDate }
          : t,
      ),
    }));
  }

  function deleteRoutine(id: string) {
    setData((d) => ({ ...d, routine: d.routine.filter((t) => t.id !== id) }));
  }

  function addToday(e: FormEvent) {
    e.preventDefault();
    const text = todayDraft.trim();
    if (!text) return;
    setData((d) => ({ ...d, today: [...d.today, { id: uid(), text, done: false }] }));
    setTodayDraft("");
  }

  function toggleToday(id: string) {
    setData((d) => ({
      ...d,
      today: d.today.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  }

  function deleteToday(id: string) {
    setData((d) => ({ ...d, today: d.today.filter((t) => t.id !== id) }));
  }

  function clearDoneToday() {
    setData((d) => ({ ...d, today: d.today.filter((t) => !t.done) }));
  }

  return (
    <main className="pb-24">
      <Nav />

      <section className="py-8">
        <Link to="/ai-experiments" className="underline">
          <WiggleText>← AI Experiments</WiggleText>
        </Link>

        <h1 className="mt-6 mb-2 text-3xl font-medium lg:text-5xl">Taski — first version</h1>
        <p className="mb-10 max-w-xl italic">
          This was the first version of Taski, before it became a native Mac app. A to-do list
          that doesn't pressure you: add the things you want to do most days once, then just
          check them off — nothing scores you, nothing has to happen at an exact time. It's kept
          running here, working exactly as it did originally.
        </p>

        <div className="mb-12">
          <div className="mb-4 flex items-baseline justify-between border-b pb-2">
            <h3>Routine</h3>
            {data.routine.length > 0 && (
              <span className="text-base opacity-60">
                {doneCount}/{data.routine.length} today
              </span>
            )}
          </div>

          {data.routine.length === 0 && (
            <p className="mb-2 italic opacity-60">
              Nothing here yet. Add the first thing you want to do most days — waking up, a walk,
              anything.
            </p>
          )}

          {data.routine.length > 0 && (
            <ul className="mb-2">
              {data.routine.map((t) => (
                <TaskRow
                  key={t.id}
                  text={t.text}
                  done={t.lastDoneDate === data.todayDate}
                  onToggle={() => toggleRoutine(t.id)}
                  onDelete={() => deleteRoutine(t.id)}
                />
              ))}
            </ul>
          )}

          <form onSubmit={addRoutine} className="flex items-center gap-3 border-b py-3">
            <input
              value={routineDraft}
              onChange={(e) => setRoutineDraft(e.target.value)}
              placeholder="Add a routine step…"
              className="flex-1 bg-transparent outline-none placeholder:opacity-40"
            />
            <button
              type="submit"
              disabled={!routineDraft.trim()}
              className="shrink-0 underline disabled:opacity-30"
            >
              Add
            </button>
          </form>
        </div>

        <div>
          <div className="mb-4 flex items-baseline justify-between border-b pb-2">
            <h3>Today</h3>
            {hasDoneToday && (
              <button
                type="button"
                onClick={clearDoneToday}
                className="text-base underline opacity-60 hover:opacity-100"
              >
                Clear done
              </button>
            )}
          </div>

          {data.today.length === 0 && (
            <p className="mb-2 italic opacity-60">
              Nothing here yet. Add whatever's on your mind for today.
            </p>
          )}

          {data.today.length > 0 && (
            <ul className="mb-2">
              {data.today.map((t) => (
                <TaskRow
                  key={t.id}
                  text={t.text}
                  done={t.done}
                  onToggle={() => toggleToday(t.id)}
                  onDelete={() => deleteToday(t.id)}
                />
              ))}
            </ul>
          )}

          <form onSubmit={addToday} className="flex items-center gap-3 border-b py-3">
            <input
              value={todayDraft}
              onChange={(e) => setTodayDraft(e.target.value)}
              placeholder="Add something for today…"
              className="flex-1 bg-transparent outline-none placeholder:opacity-40"
            />
            <button
              type="submit"
              disabled={!todayDraft.trim()}
              className="shrink-0 underline disabled:opacity-30"
            >
              Add
            </button>
          </form>
        </div>

        <p className="mt-12 max-w-xl text-base italic opacity-50">
          Routine checkmarks clear every morning. Today's list clears itself too, so it never
          piles up. Everything is saved only on this device.
        </p>

        <h3 className="mt-12 mb-2">Why it became something else</h3>
        <p className="my-4">
          This version proved the idea — routines instead of due dates — but it lived in a
          browser tab, which meant it was only ever as close as the tab I happened to have open.
          The{" "}
          <Link to="/taski" className="underline">
            <WiggleText>native Mac app</WiggleText>
          </Link>{" "}
          picks up from here: same core idea, now with recurrence, drag-and-drop, a calendar, and
          real theming.
        </p>
      </section>

      <footer className="border-t py-8">
        <p>
          <Link to="/taski" className="underline">
            <WiggleText>See the current version →</WiggleText>
          </Link>
        </p>
        <p className="my-2">
          <Link to="/ai-experiments" className="underline">
            <WiggleText>← AI Experiments</WiggleText>
          </Link>
        </p>
      </footer>
    </main>
  );
}
