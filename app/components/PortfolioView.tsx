"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  motion,
  useReducedMotion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { CustomCursor } from "./CustomCursor";
import { SmoothScroll } from "./SmoothScroll";
import { useLanguage } from "../contexts/LanguageContext";
import {
  pickL10n,
  type Locale,
  type ProjectEntry,
  type SiteConfig,
} from "../site.config";

const EASE_OUT_TUPLE = [0.22, 1, 0.36, 1] as const;

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

const SLIDE_DOWN_TITLE_INITIAL = { opacity: 0, y: -24, scale: 0.992 } as const;
const SLIDE_DOWN_TITLE_VISIBLE = { opacity: 1, y: 0, scale: 1 } as const;
const SLIDE_DOWN_TITLE_EASE = [0.2, 0.8, 0.2, 1] as const;
const SLIDE_DOWN_TITLE_DURATION = 0.52;
const SLIDE_DOWN_TITLE_STAGGER = 0.1;
const SLIDE_DOWN_TITLE_DELAY = 0.05;

function AnimatedTitle({
  text,
  id,
  className = "",
  as = "h2",
  effect = "letter-rise",
  afterRevealDelay = 0,
}: {
  text: string;
  id?: string;
  className?: string;
  as?: "h1" | "h2";
  effect?: "letter-rise" | "short-slide-down";
  afterRevealDelay?: number;
}) {
  const isSlideDown = effect === "short-slide-down";
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag = as;
    return (
      <Tag
        id={id}
        aria-label={text}
        className={`font-display leading-[0.95] font-extrabold tracking-tight uppercase ${className}`}
      >
        {text}
      </Tag>
    );
  }

  if (isSlideDown) {
    const Tag = as === "h1" ? "h1" : "h2";
    return (
      <Tag
        id={id}
        aria-label={text}
        className={`font-display leading-[0.95] font-extrabold tracking-tight uppercase ${className}`}
      >
        {text.split(" ").map((word, w) => (
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

  const Tag = as === "h1" ? motion.h1 : motion.h2;
  return (
    <Tag
      id={id}
      aria-label={text}
      className={`font-display leading-[0.95] font-extrabold tracking-tight uppercase ${className}`}
      variants={titleWrapVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      {text.split(" ").map((word, w) => (
        <span
          key={`w-${w}`}
          className="mr-[0.28em] inline-block align-baseline whitespace-nowrap [clip-path:inset(0_-100vw)]"
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

type SectionProps = {
  project: ProjectEntry;
  index: number;
  locale: Locale;
  openCaseLabel: string;
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

function ProjectSlideCard({
  project,
  index,
  locale,
  openCaseLabel,
  onCardHoverChange,
}: SectionProps) {
  const ref = useRef<HTMLLIElement | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const caseHref = `/work/${project.slug}`;

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
  const cardY = useTransform(cardExitProgress, [0, 1], [0, 0]);
  const cardScale = useTransform(cardExitProgress, [0, 1], [1, 1]);
  const depthOverlayOpacity = useTransform(cardExitProgress, [0, 1], [0, 0.12]);

  const number = String(index + 1).padStart(2, "0");
  const ui = {
    bg: project.themeColor ?? "#ff5a00",
    topCode: pickL10n(project.topCode, locale),
    leftMeta: pickL10n(project.leftMeta, locale),
    rightMeta: pickL10n(project.rightMeta, locale),
    cta: pickL10n(project.ctaLabel, locale),
  };
  const description = pickL10n(project.description, locale);

  return (
    <li
      id={`project-step-${index}`}
      ref={ref}
      className="group w-full scroll-mt-0 md:sticky md:top-0"
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        style={{
          y: cardY,
          scale: cardScale,
          opacity: 1,
          backgroundColor: ui.bg,
          transformPerspective: 1200,
        }}
        initial={shouldReduceMotion ? false : { y: "100%" }}
        whileInView={shouldReduceMotion ? undefined : { y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.8,
          ease: EASE_OUT_TUPLE,
        }}
        className="relative min-h-screen w-full overflow-hidden transform-gpu rounded-sm border border-white/20 shadow-none md:shadow-[0_10px_24px_rgba(15,15,15,0.14)] lg:shadow-[0_12px_28px_rgba(15,15,15,0.13)] xl:shadow-[0_14px_30px_rgba(15,15,15,0.13)]"
      >
        <Link
          href={caseHref}
          aria-label={`${project.title} — ${openCaseLabel}`}
          onMouseEnter={() => onCardHoverChange(true, ui.bg)}
          onMouseLeave={() => onCardHoverChange(false)}
          className="relative flex min-h-screen w-full flex-col no-underline"
        >
          {project.coverImage ? (
            <div className="pointer-events-none absolute inset-0 z-0">
              <Image
                src={project.coverImage}
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-35 mix-blend-luminosity"
                aria-hidden
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(160deg, ${ui.bg}ee 10%, ${ui.bg}99 55%, ${ui.bg}cc 100%)`,
                }}
              />
            </div>
          ) : null}
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_20%_16%,rgba(255,255,255,0.14),transparent_42%),radial-gradient(circle_at_82%_80%,rgba(255,255,255,0.09),transparent_40%)]" />
          <motion.div
            style={{ opacity: depthOverlayOpacity }}
            className="pointer-events-none absolute inset-0 z-20 bg-black"
            aria-hidden
          />
          <div className="relative z-10 flex min-h-screen flex-col px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-11 lg:px-9 lg:py-12">
            <div className="mb-8 flex items-start justify-between gap-4">
              <motion.span
                initial={{ opacity: 0, y: -12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6, margin: "-10% 0px -10% 0px" }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + index * 0.04,
                  ease: EASE_OUT_TUPLE,
                }}
                className="font-mono text-[9px] tracking-[0.24em] text-white/65 uppercase"
              >
                {ui.topCode}
              </motion.span>
              <span className="font-display text-5xl leading-none text-white/95 sm:text-6xl lg:text-7xl">
                {number}
              </span>
            </div>

            <div
              className={`relative block max-w-[20ch] ${
                index === 0 ? "mb-8 sm:mb-9 lg:mb-10" : "mb-9 sm:mb-10 lg:mb-12"
              }`}
            >
              <span className="block font-display text-[clamp(2rem,12vw,3.4rem)] leading-[0.92] tracking-tight text-white/55 [-webkit-text-stroke:1.3px_white] md:text-5xl lg:text-6xl">
                {project.title}
              </span>
              {isSmallScreen ? (
                <span
                  className="pointer-events-none absolute inset-0 block font-display text-[clamp(2rem,12vw,3.4rem)] leading-[0.92] tracking-tight text-white md:text-5xl lg:text-6xl"
                  aria-hidden
                >
                  {project.title}
                </span>
              ) : (
                <TitleFillOverlay
                  title={project.title}
                  progress={scrollYProgress}
                />
              )}
            </div>

            <p
              className={`max-w-xl text-base leading-snug text-white/95 sm:text-lg lg:text-xl ${
                index === 0 ? "mt-1" : "mt-2"
              }`}
            >
              {description}
            </p>

            <div className="mt-6 inline-flex items-center self-start rounded-full bg-white px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-zinc-900 uppercase transition-transform duration-300 group-hover:scale-105 sm:mt-7 lg:mt-8 dark:bg-zinc-100 dark:text-zinc-950">
              {ui.cta}
            </div>

            <div className="mt-auto grid grid-cols-1 border border-white/15 pt-12 sm:grid-cols-2 sm:pt-14 lg:pt-16">
              <div className="border-b border-white/15 p-4 sm:border-r sm:border-b-0">
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.55,
                    margin: "-10% 0px -10% 0px",
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.25 + index * 0.05,
                    ease: EASE_OUT_TUPLE,
                  }}
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
                  viewport={{
                    once: true,
                    amount: 0.55,
                    margin: "-10% 0px -10% 0px",
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.32 + index * 0.05,
                    ease: EASE_OUT_TUPLE,
                  }}
                  className="font-mono text-[9px] tracking-[0.28em] text-white/80 uppercase"
                >
                  {ui.rightMeta}
                </motion.p>
                <p className="mt-6 max-w-[20ch] text-xl leading-[1.1] text-white sm:text-2xl lg:mt-8 lg:text-3xl">
                  {project.services[1] ?? project.services.join(" • ")}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </li>
  );
}

function ProjectsStepsSection({
  projects,
  locale,
  openCaseLabel,
  onCardHoverChange,
}: {
  projects: ProjectEntry[];
  locale: Locale;
  openCaseLabel: string;
  onCardHoverChange: (hovered: boolean, color?: string) => void;
}) {
  return (
    <section
      id="work"
      className="w-full border-t border-zinc-200/80 px-4 pt-4 pb-14 dark:border-zinc-800/80 sm:px-8 sm:pt-6 sm:pb-18 lg:px-16 lg:pt-8 lg:pb-28"
    >
      <div className="mx-auto w-full max-w-[92rem]">
        <ul role="list" className="space-y-8 sm:space-y-10 lg:space-y-0">
          {projects.map((project, index) => (
            <ProjectSlideCard
              key={project.slug}
              project={project}
              index={index}
              locale={locale}
              openCaseLabel={openCaseLabel}
              onCardHoverChange={onCardHoverChange}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function AboutSection({
  config,
  locale,
}: {
  config: SiteConfig;
  locale: Locale;
}) {
  const about = config.about;

  return (
    <section
      id="about"
      className="w-full border-t border-zinc-200/80 px-4 py-16 dark:border-zinc-800/80 sm:px-8 sm:py-20 lg:px-16 lg:py-28"
      aria-labelledby="about-title"
    >
      <div className="mx-auto grid w-full max-w-[92rem] gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase dark:text-zinc-400">
            {pickL10n(about.eyebrow, locale)}
          </p>
        </div>

        <div>
          <AnimatedTitle
            as="h2"
            id="about-title"
            text={pickL10n(about.title, locale)}
            effect="short-slide-down"
            className="max-w-4xl text-[clamp(2rem,7.5vw,5.5rem)] text-zinc-900 dark:text-zinc-50"
          />
          <p className="mt-8 max-w-3xl text-lg leading-snug text-zinc-700 sm:text-xl lg:text-2xl dark:text-zinc-300">
            {pickL10n(about.body, locale)}
          </p>

          <ul
            role="list"
            className="mt-12 grid gap-px overflow-hidden border border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 sm:grid-cols-3"
          >
            {about.services.map((service) => (
              <li
                key={pickL10n(service.label, locale)}
                className="bg-zinc-50 p-5 dark:bg-zinc-950 sm:p-6"
              >
                <p className="font-mono text-[10px] tracking-[0.24em] text-desina uppercase">
                  {pickL10n(service.label, locale)}
                </p>
                <p className="mt-8 text-base leading-snug text-zinc-700 dark:text-zinc-300">
                  {pickL10n(service.description, locale)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Footer({ config }: { config: SiteConfig }) {
  const { locale } = useLanguage();
  const links = [config.contact.email, ...config.contact.social];
  const availability = pickL10n(config.copy.availability, locale);

  return (
    <footer
      id="contatti"
      className="relative w-full bg-transparent px-10 py-20 text-zinc-900 sm:px-16 sm:py-24 lg:px-24 dark:text-zinc-50"
      aria-label="Contatti"
    >
      <p className="mb-10 text-center sm:mb-12">
        <a
          href={config.contact.email.href}
          className="font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase transition-colors duration-500 ease-out hover:text-desina dark:text-zinc-400"
        >
          {availability}
        </a>
      </p>
      <ul
        role="list"
        className="flex flex-row flex-wrap items-center justify-center gap-x-10 gap-y-3 font-mono text-xs font-medium tracking-widest text-zinc-900 uppercase sm:gap-x-14 dark:text-zinc-50"
      >
        {links.map((l) => {
          const isMail = l.href.startsWith("mailto:");
          return (
            <li key={l.href}>
              <a
                href={l.href}
                target={isMail ? undefined : "_blank"}
                rel={isMail ? undefined : "noopener noreferrer"}
                className="transition-colors duration-500 ease-out hover:text-desina"
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

function PortfolioInner({
  config,
  projectList,
}: {
  config: SiteConfig;
  projectList: ProjectEntry[];
}) {
  const { locale } = useLanguage();
  const [projectHoverColor, setProjectHoverColor] = useState<string | null>(
    null,
  );
  const { resolvedTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroX = useTransform(scrollY, [0, 460], [0, -560]);
  const heroY = useTransform(scrollY, [0, 460], [0, -320]);
  const heroScale = useTransform(scrollY, [0, 460], [1, 0.24]);
  const heroOpacity = useTransform(scrollY, [0, 180, 260], [1, 0.25, 0]);
  const hintOpacity = useTransform(scrollY, [0, 320, 420], [1, 1, 0]);

  const defaultCursorColor = resolvedTheme === "dark" ? "#fafafa" : "#18181b";
  const cursorColor = projectHoverColor ?? defaultCursorColor;

  const handleCardHoverChange = (hovered: boolean, color?: string) => {
    setProjectHoverColor(hovered && color ? color : null);
  };

  const bio = pickL10n(config.bio, locale);
  const scrollHint = pickL10n(config.copy.scrollToExplore, locale);
  const openCaseLabel = pickL10n(config.copy.openCaseStudy, locale);
  const cursorHoverLabel = locale === "it" ? "VEDI" : "VIEW";

  return (
    <SmoothScroll>
      <main className="relative isolate w-full overflow-x-clip bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <CustomCursor
          active={projectHoverColor !== null}
          color={cursorColor}
          hoverLabel={cursorHoverLabel}
        />
        <div className="relative z-10">
          <section className="relative flex min-h-screen w-full items-center justify-center px-4 sm:hidden">
            <div className="text-center">
              <h1 className="font-display text-[clamp(2.1rem,15vw,3.2rem)] leading-[0.88] tracking-tight text-zinc-900 uppercase dark:text-zinc-50">
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
              animate={
                shouldReduceMotion ? { opacity: 1 } : { opacity: [0.35, 1, 0.35] }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              }
              className="absolute left-4 z-20 font-mono text-[10px] tracking-[0.18em] text-zinc-600 uppercase dark:text-zinc-400 bottom-[calc(env(safe-area-inset-bottom)+6rem)]"
            >
              {scrollHint}
            </motion.p>
          </section>

          <section className="relative hidden h-[110vh] w-full px-4 sm:block sm:h-[115vh] sm:px-8 lg:h-[120vh] lg:px-20">
            <span className="sr-only">{bio}</span>
          </section>

          <motion.div
            aria-hidden
            style={
              shouldReduceMotion
                ? { opacity: 1 }
                : { x: heroX, y: heroY, scale: heroScale, opacity: heroOpacity }
            }
            className="pointer-events-none fixed top-1/2 left-1/2 z-50 hidden -translate-x-1/2 -translate-y-1/2 px-4 sm:block sm:px-0"
          >
            <AnimatedTitle
              as="h1"
              text={config.name}
              className="text-center text-[clamp(2.5rem,15vw,9rem)] sm:text-[clamp(3.5rem,14vw,9rem)]"
            />
          </motion.div>

          <motion.div
            style={shouldReduceMotion ? { opacity: 1 } : { opacity: hintOpacity }}
            className="fixed bottom-10 left-4 z-40 hidden sm:block sm:bottom-14 sm:left-8 lg:bottom-16 lg:left-20"
          >
            <motion.p
              animate={
                shouldReduceMotion ? { opacity: 1 } : { opacity: [0.35, 1, 0.35] }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
              className="font-mono text-[10px] tracking-[0.18em] text-zinc-600 uppercase dark:text-zinc-400"
            >
              {scrollHint}
            </motion.p>
          </motion.div>

          <AboutSection config={config} locale={locale} />

          <ProjectsStepsSection
            projects={projectList}
            locale={locale}
            openCaseLabel={openCaseLabel}
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
  config: SiteConfig;
  projects: ProjectEntry[];
}) {
  return <PortfolioInner config={config} projectList={projectList} />;
}
