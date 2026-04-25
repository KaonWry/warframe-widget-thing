import FissuresList from "./components/FissuresList";
import CircuitRotation from "./components/CircuitRotation";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="flex flex-col items-center p-8 md:p-16 gap-12 max-w-7xl mx-auto w-full">
        <header className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">
            Warframe <span className="text-indigo-600 dark:text-indigo-400">Tracker</span> Dashboard
          </h1>
          <p className="max-w-md text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            A centralized overview of the Origin System: Void Fissures, Circuit rotations, and more.
          </p>
        </header>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start justify-items-center">
          <FissuresList />
          <CircuitRotation />
        </div>
      </main>
    </div>
  );
}
