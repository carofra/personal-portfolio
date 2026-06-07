"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export function FloatingNav() {
  const { locale, setLocale } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <nav
      className="fixed right-4 bottom-4 z-[100] flex flex-row items-center gap-5 rounded-full border border-white/15 bg-zinc-950/80 px-4 py-3 text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-md sm:top-1/2 sm:right-6 sm:bottom-auto sm:-translate-y-1/2 sm:flex-col sm:items-center sm:px-3 sm:py-4 dark:border-white/10 dark:bg-white/10"
      aria-label={locale === "it" ? "Navigazione sito" : "Site navigation"}
    >
      <div
        className="flex flex-row items-center gap-3 leading-none"
        role="group"
        aria-label={locale === "it" ? "Lingua" : "Language"}
      >
        {(["en", "it"] as const).map((code) => {
          const active = locale === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              className={`rounded-sm font-mono text-[10px] leading-none tracking-widest uppercase transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none ${
                active ? "opacity-100 hover:opacity-100" : "opacity-50"
              }`}
              aria-pressed={active}
              aria-label={code === "it" ? "Italiano" : "English"}
            >
              {code}
            </button>
          );
        })}
      </div>

      {!mounted ? (
        <span className="inline-flex size-[18px] shrink-0" aria-hidden />
      ) : (
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-sm leading-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none"
          aria-label={
            isDark
              ? locale === "it"
                ? "Passa al tema chiaro"
                : "Switch to light theme"
              : locale === "it"
                ? "Passa al tema scuro"
                : "Switch to dark theme"
          }
        >
          {isDark ? (
            <Sun className="size-[18px]" strokeWidth={1.75} />
          ) : (
            <Moon className="size-[18px]" strokeWidth={1.75} />
          )}
        </button>
      )}
    </nav>
  );
}
