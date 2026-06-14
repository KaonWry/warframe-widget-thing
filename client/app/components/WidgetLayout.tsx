import React from "react";

interface WidgetLayoutProps {
  title: string;
  subtitle: string;
  headerExtra?: React.ReactNode;
  footerContent: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

export default function WidgetLayout({
  title,
  subtitle,
  headerExtra,
  footerContent,
  children,
  className = "",
  scrollable = true,
}: WidgetLayoutProps) {
  return (
    <div className={`flex flex-col w-full max-w-md border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-xl ${className}`}>
      <header className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">{title}</h2>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{subtitle}</p>
        </div>
        {headerExtra}
      </header>

      <div className={`flex-1 ${scrollable ? "overflow-y-auto custom-scrollbar" : ""}`}>
        {children}
      </div>

      <footer className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
        {footerContent}
      </footer>
    </div>
  );
}
