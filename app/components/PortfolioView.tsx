"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { CustomCursor } from "./CustomCursor";
import { SmoothScroll } from "./SmoothScroll";
import type { ProjectEntry } from "../site.config";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------

const INK_DARK = "#111111";

const EASE_OUT_TUPLE = [0.22, 1, 0.36, 1] as const;

type Site = {
  name: string;
  bio: string;
  contact: {
    email: { label: string; href: string };
    social: ReadonlyArray<{ label: string; href: string }>;
  };
};

// ---------------------------------------------------------------------------
// Typography helpers — letter-by-letter reveal
// ---------------------------------------------------------------------------

const titleWrapVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const letterVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.7, ease: EASE_OUT_TUPLE },
  },
};

// `short-slide-down` per-word build (skills/animate-text spec). Faithful
// reproduction of `assets/effects/short-slide-down.json` → portable_spec.enter:
//   • target: per-word
//   • from { opacity: 0, y_px: -24, scale: 0.992 }
//   • to   { opacity: 1, y_px: 0,   scale: 1     }
//   • duration_ms: 520           → 0.52s
//   • easing: cubic-bezier(0.2, 0.8, 0.2, 1)   → spec's signature easing
// Each word is its own self-contained motion.span with `whileInView`, so the
// trigger is per-word and immune to any parent variant-propagation edge case.
// Stagger is reproduced via a per-word delay (0.05 + index * 0.1) — 100ms
// between words — so word #1 lands first, then #2, then #3, mirroring the
// kinetic-top-build renderer's sequential build without looping.
//
// Note: the `filter: blur` from the spec is omitted here. With the Comico
// display font animating at the same time, the blur was masking the entrance
// just enough to make the whole title read as "missing" until each word
// fully settled — the editorial feel is cleaner without it. Drop, scale and
// fade still carry the full weight of the effect.
const SLIDE_DOWN_TITLE_INITIAL = { opacity: 0, y: -24, scale: 0.992 } as const;
const SLIDE_DOWN_TITLE_VISIBLE = { opacity: 1, y: 0, scale: 1 } as const;
const SLIDE_DOWN_TITLE_EASE = [0.2, 0.8, 0.2, 1] as const;
const SLIDE_DOWN_TITLE_DURATION = 0.52;
const SLIDE_DOWN_TITLE_STAGGER = 0.1;
const SLIDE_DOWN_TITLE_DELAY = 0.05;

function AnimatedTitle({
  text,
  className = "",
  as = "h2",
  effect = "letter-rise",
  /** Extra seconds before the first project-title word moves (after imagery). */
  afterRevealDelay = 0,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2";
  // `letter-rise`       — current Comico letter-by-letter slide-up, used by
  //                       the hero CAROLINA signature.
  // `short-slide-down`  — animate-text skill: each word drops from above
  //                       with a subtle scale settle. Used for the project
  //                       titles.
  effect?: "letter-rise" | "short-slide-down";
  afterRevealDelay?: number;
}) {
  const isSlideDown = effect === "short-slide-down";

  if (isSlideDown) {
    const Tag = as === "h1" ? "h1" : "h2";
    return (
      <Tag
        aria-label={text}
        className={`font-display leading-[0.95] font-extrabold tracking-tight uppercase ${className}`}
      >
        {text.split(" ").map((word, w) => (
          // Each word animates independently — no parent variant cascade.
          // No clip-path: the 24px drop is the whole point of the effect, so
          // we want to see it. Opacity-from-0 keeps the raised start invisible
          // until the tween picks up.
          <motion.span
            key={`w-${w}`}
            initial={SLIDE_DOWN_TITLE_INITIAL}
            whileInView={SLIDE_DOWN_TITLE_VISIBLE}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: SLIDE_DOWN_TITLE_DURATION,
              ease: SLIDE_DOWN_TITLE_EASE,
              delay:
                SLIDE_DOWN_TITLE_DELAY +
                afterRevealDelay +
                w * SLIDE_DOWN_TITLE_STAGGER,
            }}
            className="mr-[0.28em] inline-block align-baseline will-change-transform"
          >
            {word}
          </motion.span>
        ))}
      </Tag>
    );
  }

  // Letter-rise (default) — Comico letter-by-letter, used by hero CAROLINA.
  const Tag = as === "h1" ? motion.h1 : motion.h2;
  return (
    <Tag
      aria-label={text}
      className={`font-display leading-[0.95] font-extrabold tracking-tight uppercase ${className}`}
      variants={titleWrapVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      {text.split(" ").map((word, w) => (
        // The clip-path masks the letter slide-in vertically (top/bottom flush
        // with the line-box) while leaving horizontal overflow visible — vital
        // for Comico, whose decorative serifs extend beyond the character
        // cell and were being sliced off by a plain `overflow-hidden`.
        <span
          key={`w-${w}`}
          className="mr-[0.28em] inline-block align-baseline [clip-path:inset(0_-100vw)]"
        >
          {word.split("").map((ch, i) => (
            <motion.span
              key={`c-${w}-${i}`}
              variants={letterVariants}
              className="inline-block"
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  );
}

// ---------------------------------------------------------------------------
// Projects section — inspired by fourmula "From idea to assets in four steps":
// big heading, compact explanatory lead, and numbered process cards.
// ---------------------------------------------------------------------------

type SectionProps = {
  project: ProjectEntry;
  index: number;
  onCardHoverChange: (hovered: boolean, color?: string) => void;
};

function TitleFillOverlay({
  title,
  progress,
}: {
  title: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const fillRevealInset = useTransform(progress, [0, 1], [100, 0]);
  const fillClipPath = useMotionTemplate`inset(${fillRevealInset}% 0% 0% 0%)`;

  return (
    <motion.span
      style={{ clipPath: fillClipPath, WebkitClipPath: fillClipPath }}
      className="pointer-events-none absolute inset-0 block font-display text-[clamp(2rem,12vw,3.4rem)] leading-[0.92] tracking-tight text-white md:text-5xl lg:text-6xl"
      aria-hidden
    >
      {title}
    </motion.span>
  );
}

function ProjectSlideCard({ project, index, onCardHoverChange }: SectionProps) {
  const ref = useRef<HTMLLIElement | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsSmallScreen(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "center 50%"],
  });
  const { scrollYProgress: cardExitProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Flat stacking: outgoing card stays almost still while next card slides over it.
  const cardY = useTransform(cardExitProgress, [0, 1], [0, 0]);
  const cardScale = useTransform(cardExitProgress, [0, 1], [1, 1]);
  const depthOverlayOpacity = useTransform(cardExitProgress, [0, 1], [0, 0.12]);

  const number = String(index + 1).padStart(2, "0");
  const ui = {
    bg: project.themeColor ?? "#ff5a00",
    topCode: project.topCode ?? `(PROJECT ${number})`,
    leftMeta: project.leftMeta ?? "Primary focus",
    rightMeta: project.rightMeta ?? "Secondary focus",
    cta: project.ctaLabel ?? "Visit project",
  };

  return (
    <li
      id={`project-step-${index}`}
      ref={ref}
      className="group sticky top-0 w-full scroll-mt-0"
      style={{ zIndex: index + 1 }}
    >
      <motion.a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} — apri in una nuova scheda`}
        style={{
          y: cardY,
          scale: cardScale,
          opacity: 1,
          backgroundColor: ui.bg,
          transformPerspective: 1200,
        }}
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_OUT_TUPLE }}
        whileHover={{ y: 0 }}
        onMouseEnter={() => onCardHoverChange(true, ui.bg)}
        onMouseLeave={() => onCardHoverChange(false)}
        className="relative block min-h-screen w-full overflow-hidden transform-gpu rounded-sm border border-white/20 px-4 py-8 no-underline shadow-none sm:px-6 sm:py-10 md:px-8 md:py-11 md:shadow-[0_10px_24px_rgba(15,15,15,0.14)] lg:px-9 lg:py-12 lg:shadow-[0_12px_28px_rgba(15,15,15,0.13)] xl:shadow-[0_14px_30px_rgba(15,15,15,0.13)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(255,255,255,0.14),transparent_42%),radial-gradient(circle_at_82%_80%,rgba(255,255,255,0.09),transparent_40%)]" />
        <motion.div
          style={{ opacity: depthOverlayOpacity }}
          className="pointer-events-none absolute inset-0 z-20 bg-black"
          aria-hidden
        />
        <div className="relative z-10 mb-8 flex items-start justify-between gap-4">
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.5, delay: 0.15 + index * 0.04, ease: EASE_OUT_TUPLE }}
            className="font-mono text-[9px] tracking-[0.24em] text-white/65 uppercase"
          >
            {ui.topCode}
          </motion.span>
          <span className="font-display text-5xl leading-none text-white/95 sm:text-6xl lg:text-7xl">
            {number}
          </span>
        </div>

        <div
          className={`relative z-10 block max-w-[20ch] ${
            index === 0 ? "mb-8 sm:mb-9 lg:mb-10" : "mb-9 sm:mb-10 lg:mb-12"
          }`}
        >
          {/* Outline sempre visibile */}
          <span className="block font-display text-[clamp(2rem,12vw,3.4rem)] leading-[0.92] tracking-tight text-white/55 [-webkit-text-stroke:1.3px_white] md:text-5xl lg:text-6xl">
            {project.title}
          </span>
          {/* Mobile: no clip-path transform, always fully visible */}
          {isSmallScreen ? (
            <span
              className="pointer-events-none absolute inset-0 block font-display text-[clamp(2rem,12vw,3.4rem)] leading-[0.92] tracking-tight text-white md:text-5xl lg:text-6xl"
              aria-hidden
            >
              {project.title}
            </span>
          ) : (
            <TitleFillOverlay title={project.title} progress={scrollYProgress} />
          )}
        </div>

        <p
          className={`relative z-10 max-w-xl text-base leading-snug text-white/95 sm:text-lg lg:text-xl ${
            index === 0 ? "mt-1" : "mt-2"
          }`}
        >
          {project.description}
        </p>

        <div className="mt-6 inline-flex items-center rounded-full bg-white px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-[#111] uppercase transition-transform duration-300 group-hover:scale-105 sm:mt-7 lg:mt-8">
          {ui.cta}
        </div>

        <div className="relative z-10 mt-12 grid grid-cols-1 border border-white/15 sm:mt-14 sm:grid-cols-2 lg:mt-16">
          <div className="border-b border-white/15 p-4 sm:border-r sm:border-b-0">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.55, margin: "-10% 0px -10% 0px" }}
              transition={{ duration: 0.4, delay: 0.25 + index * 0.05, ease: EASE_OUT_TUPLE }}
              className="font-mono text-[9px] tracking-[0.28em] text-white/80 uppercase"
            >
              {ui.leftMeta}
            </motion.p>
            <p className="mt-6 max-w-[20ch] text-xl leading-[1.1] text-white sm:text-2xl lg:mt-8 lg:text-3xl">
              {project.services[0] ?? project.services.join(" • ")}
            </p>
          </div>
          <div className="p-4">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.55, margin: "-10% 0px -10% 0px" }}
              transition={{ duration: 0.4, delay: 0.32 + index * 0.05, ease: EASE_OUT_TUPLE }}
              className="font-mono text-[9px] tracking-[0.28em] text-white/80 uppercase"
            >
              {ui.rightMeta}
            </motion.p>
            <p className="mt-6 max-w-[20ch] text-xl leading-[1.1] text-white sm:text-2xl lg:mt-8 lg:text-3xl">
              {project.services[1] ?? project.services.join(" • ")}
            </p>
          </div>
        </div>

      </motion.a>
    </li>
  );
}

function ProjectsStepsSection({
  projects,
  onCardHoverChange,
}: {
  projects: ProjectEntry[];
  onCardHoverChange: (hovered: boolean, color?: string) => void;
}) {
  return (
    <section className="w-full border-t border-zinc-200/80 px-4 pt-4 pb-14 sm:px-8 sm:pt-6 sm:pb-18 lg:px-16 lg:pt-8 lg:pb-28">
      <div className="mx-auto w-full max-w-[92rem]">
        <ul role="list" className="space-y-8 sm:space-y-10 lg:space-y-0">
          {projects.map((project, index) => (
            <ProjectSlideCard
              key={project.title}
              project={project}
              index={index}
              onCardHoverChange={onCardHoverChange}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer — sits on the same animated paper wash as `motion.main` (transparent
// fill) so tonal shifts read continuously to the bottom.
// ---------------------------------------------------------------------------

function Footer({ config }: { config: Site }) {
  const links = [config.contact.email, ...config.contact.social];

  return (
    <footer
      id="contatti"
      className="relative w-full bg-transparent px-10 py-20 text-[#111] sm:px-16 sm:py-24 lg:px-24"
      aria-label="Contatti"
    >
      <ul
        role="list"
        className="flex flex-row flex-wrap items-center justify-center gap-x-10 gap-y-3 font-mono text-xs font-medium tracking-widest text-[#111] uppercase sm:gap-x-14"
      >
        {links.map((l) => {
          const isMail = l.href.startsWith("mailto:");
          return (
            <li key={l.href}>
              <a
                href={l.href}
                target={isMail ? undefined : "_blank"}
                rel={isMail ? undefined : "noopener noreferrer"}
                className="transition-colors duration-500 ease-out hover:text-[#E33B2B]"
              >
                {l.label}
              </a>
            </li>
          );
        })}
      </ul>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Portfolio inner
// ---------------------------------------------------------------------------

function PortfolioInner({
  config,
  projectList,
}: {
  config: Site;
  projectList: ProjectEntry[];
}) {
  const [isProjectHovered, setIsProjectHovered] = useState(false);
  const [cursorColor, setCursorColor] = useState("#111111");
  const { scrollY } = useScroll();
  const heroX = useTransform(scrollY, [0, 460], [0, -560]);
  const heroY = useTransform(scrollY, [0, 460], [0, -320]);
  const heroScale = useTransform(scrollY, [0, 460], [1, 0.24]);
  const heroOpacity = useTransform(scrollY, [0, 180, 260], [1, 0.25, 0]);
  const hintOpacity = useTransform(scrollY, [0, 320, 420], [1, 1, 0]);

  const handleCardHoverChange = (hovered: boolean, color?: string) => {
    setIsProjectHovered(hovered);
    if (hovered && color) {
      setCursorColor(color);
      return;
    }
    setCursorColor("#111111");
  };

  return (
    <SmoothScroll>
      <main className="relative isolate w-full overflow-x-clip bg-[#FAFAFA] text-[#111]">
        <CustomCursor active={isProjectHovered} color={cursorColor} />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[60] hidden opacity-[0.014] sm:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 1px, transparent 1px 8px), repeating-linear-gradient(90deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 9px)",
            backgroundSize: "16px 16px, 18px 18px",
          }}
        />
        <div className="relative z-10">
      {/* Mobile hero: static, readable, no clipping */}
      <section className="relative flex min-h-screen w-full items-center justify-center px-4 sm:hidden">
        <div className="text-center">
          <h1 className="font-display text-[clamp(2.1rem,15vw,3.2rem)] leading-[0.88] tracking-tight text-[#111] uppercase">
            CA
            <br />
            RO
            <br />
            LI
            <br />
            NA
          </h1>
        </div>
        <motion.p
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-4 font-mono text-[10px] tracking-[0.18em] text-zinc-600 uppercase"
        >
          Scroll to explore ↓
        </motion.p>
      </section>

      {/* Desktop/tablet hero: fixed transform on first scroll segment */}
      <section className="relative hidden h-[110vh] w-full px-4 sm:block sm:h-[115vh] sm:px-8 lg:h-[120vh] lg:px-20">
        <span className="sr-only">{config.bio}</span>
      </section>

      <motion.div
        aria-hidden
        style={{ x: heroX, y: heroY, scale: heroScale, opacity: heroOpacity }}
        className="pointer-events-none fixed top-1/2 left-1/2 z-50 hidden -translate-x-1/2 -translate-y-1/2 px-4 sm:block sm:px-0"
      >
        <AnimatedTitle
          as="h1"
          text={config.name}
          className="text-center text-[clamp(2.5rem,15vw,9rem)] sm:text-[clamp(3.5rem,14vw,9rem)]"
        />
      </motion.div>

      <motion.div
        style={{ opacity: hintOpacity }}
        className="fixed bottom-10 left-4 z-40 hidden sm:block sm:bottom-14 sm:left-8 lg:bottom-16 lg:left-20"
      >
        <motion.p
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="font-mono text-[10px] tracking-[0.18em] text-zinc-600 uppercase"
        >
          Scroll to explore ↓
        </motion.p>
      </motion.div>

        <ProjectsStepsSection
          projects={projectList}
          onCardHoverChange={handleCardHoverChange}
        />

          <Footer config={config} />
        </div>
      </main>
    </SmoothScroll>
  );
}

export function PortfolioView({
  config,
  projects: projectList,
}: {
  config: Site;
  projects: ProjectEntry[];
}) {
  return <PortfolioInner config={config} projectList={projectList} />;
}
