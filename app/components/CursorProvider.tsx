"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CursorMode = "default" | "project";

type Ctx = {
  setMode: (m: CursorMode) => void;
};

const CursorContext = createContext<Ctx | null>(null);

export function useProjectCursor() {
  const c = useContext(CursorContext);
  return c?.setMode;
}

function CustomCursor({ mode, enabled }: { mode: CursorMode; enabled: boolean }) {
  const x = useMotionValue(-1e3);
  const y = useMotionValue(-1e3);
  const springX = useSpring(x, { stiffness: 420, damping: 30, mass: 0.45 });
  const springY = useSpring(y, { stiffness: 420, damping: 30, mass: 0.45 });
  const project = mode === "project";

  useEffect(() => {
    if (!enabled) return;
    const on = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", on, { passive: true });
    return () => window.removeEventListener("mousemove", on);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[10000] h-0 w-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="flex select-none items-center justify-center overflow-hidden rounded-full border border-white/25 bg-desina text-[10px] font-sans font-bold tracking-widest text-white"
        initial={false}
        animate={{ width: project ? 100 : 28, height: project ? 100 : 28 }}
        transition={{ type: "spring", stiffness: 500, damping: 34, mass: 0.3 }}
      >
        {project ? "VEDI" : null}
      </motion.div>
    </motion.div>
  );
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [mode, setModeState] = useState<CursorMode>("default");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 768px)"
    );
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [reduced]);

  const setMode = useCallback(
    (m: CursorMode) => {
      if (enabled) setModeState(m);
    },
    [enabled]
  );

  const ctx = useMemo(() => ({ setMode }), [setMode]);

  useEffect(() => {
    if (!enabled) {
      try {
        document.body.classList.remove("custom-cursor-active");
      } catch {
        /* */
      }
      return;
    }
    document.body.classList.add("custom-cursor-active");
    return () => {
      try {
        document.body.classList.remove("custom-cursor-active");
      } catch {
        /* */
      }
    };
  }, [enabled]);

  return (
    <CursorContext.Provider value={ctx}>
      {children}
      <CustomCursor mode={mode} enabled={enabled} />
    </CursorContext.Provider>
  );
}

