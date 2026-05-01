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
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <nav
      className="fixed bottom-6 right-6 z-[100] flex flex-row items-center gap-6 mix-blend-difference text-white sm:top-1/2 sm:right-6 sm:bottom-auto sm:-translate-y-1/2 sm:flex-col sm:items-center"
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
              className={`font-mono text-[10px] uppercase leading-none tracking-widest text-white transition-opacity hover:opacity-70 ${
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
          className="inline-flex size-[18px] shrink-0 items-center justify-center leading-none text-white transition-opacity hover:opacity-70"
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
