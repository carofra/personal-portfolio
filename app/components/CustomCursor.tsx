"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor({
  active,
  color = "#E33B2B",
}: {
  active: boolean;
  color?: string;
}) {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 320, damping: 30, mass: 0.35 });
  const springY = useSpring(mouseY, { stiffness: 320, damping: 30, mass: 0.35 });

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[80] hidden items-center justify-center sm:flex"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{ scale: active ? 1 : 0.55, opacity: active ? 1 : 0.88 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full font-mono text-[9px] tracking-[0.16em] text-white uppercase"
        animate={{
          width: active ? 64 : 32,
          height: active ? 64 : 32,
          backgroundColor: color,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      >
        <span className={active ? "opacity-100" : "opacity-0"}>VEDI</span>
      </motion.div>
    </motion.div>
  );
}
