import FissuresList from "./components/FissuresList";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="flex flex-col items-center justify-center p-8 md:p-24 gap-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">
            Warframe <span className="text-indigo-600 dark:text-indigo-400">Void</span> Tracker
          </h1>
          <p className="max-w-md text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            Real-time monitoring of active Orokin Void fissures across the Origin System.
          </p>
        </div>

        <div className="w-full flex justify-center">
          <FissuresList />
        </div>
      </main>
    </div>
  );
}
