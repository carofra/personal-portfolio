"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import {
  pickL10n,
  siteConfig,
  type ProjectEntry,
} from "../site.config";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

export function CaseStudyView({
  project,
  index,
}: {
  project: ProjectEntry;
  index: number;
}) {
  const { locale } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const theme = project.themeColor ?? "#ff5a00";
  const number = String(index + 1).padStart(2, "0");

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: "hidden" as const,
        animate: "visible" as const,
        variants: stagger,
      };

  return (
    <main className="relative isolate min-h-dvh w-full overflow-x-clip bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header
        className="relative overflow-hidden border-b border-white/15"
        style={{ backgroundColor: theme }}
      >
        {project.coverImage ? (
          <div className="pointer-events-none absolute inset-0">
            <Image
              src={project.coverImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-30 mix-blend-luminosity"
              aria-hidden
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(165deg, ${theme}f2 8%, ${theme}b8 70%, ${theme}e6 100%)`,
              }}
            />
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.16),transparent_45%),radial-gradient(circle_at_85%_75%,rgba(255,255,255,0.1),transparent_40%)]" />
        )}

        <div className="relative z-10 mx-auto flex w-full max-w-[92rem] flex-col px-4 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20 lg:px-16 lg:pt-14 lg:pb-24">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/#work"
              className="font-mono text-[10px] tracking-[0.22em] text-white/75 uppercase transition-colors hover:text-white"
            >
              ← {pickL10n(siteConfig.copy.backToWork, locale)}
            </Link>
            <span className="font-mono text-[10px] tracking-[0.24em] text-white/65 uppercase">
              {pickL10n(project.topCode, locale)}
            </span>
          </div>

          <motion.div {...motionProps}>
            <motion.p
              variants={fadeUp}
              className="font-display text-5xl leading-none text-white/90 sm:text-6xl lg:text-7xl"
            >
              {number}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="mt-6 max-w-[14ch] font-display text-[clamp(2.4rem,10vw,5.5rem)] leading-[0.92] tracking-tight text-white uppercase"
            >
              {project.title}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-base leading-snug text-white/95 sm:text-lg lg:text-xl"
            >
              {pickL10n(project.description, locale)}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-white px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-zinc-900 uppercase transition-transform duration-300 hover:scale-105 dark:bg-zinc-100 dark:text-zinc-950"
              >
                {pickL10n(siteConfig.copy.visitLiveSite, locale)} ↗
              </a>
            </motion.div>
          </motion.div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[92rem] px-4 py-14 sm:px-8 sm:py-18 lg:px-16 lg:py-24">
        <motion.section
          {...(shouldReduceMotion
            ? {}
            : {
                initial: "hidden" as const,
                whileInView: "visible" as const,
                viewport: { once: true, amount: 0.25 },
                variants: stagger,
              })}
          aria-labelledby="case-overview"
          className="grid gap-10 border-b border-zinc-200 pb-14 dark:border-zinc-800 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:pb-20"
        >
          <motion.div variants={fadeUp}>
            <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase dark:text-zinc-400">
              {pickL10n(siteConfig.copy.caseOverview, locale)}
            </p>
          </motion.div>
          <div>
            <motion.h2
              id="case-overview"
              variants={fadeUp}
              className="max-w-3xl text-2xl leading-snug text-zinc-900 sm:text-3xl lg:text-4xl dark:text-zinc-50"
            >
              {pickL10n(project.overview, locale)}
            </motion.h2>

            <motion.dl
              variants={fadeUp}
              className="mt-10 grid gap-px overflow-hidden border border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 sm:grid-cols-3"
            >
              <div className="bg-zinc-50 p-5 dark:bg-zinc-950 sm:p-6">
                <dt className="font-mono text-[10px] tracking-[0.24em] text-desina uppercase">
                  {pickL10n(siteConfig.copy.caseRole, locale)}
                </dt>
                <dd className="mt-6 text-base leading-snug text-zinc-700 dark:text-zinc-300">
                  {pickL10n(project.role, locale)}
                </dd>
              </div>
              {project.year ? (
                <div className="bg-zinc-50 p-5 dark:bg-zinc-950 sm:p-6">
                  <dt className="font-mono text-[10px] tracking-[0.24em] text-desina uppercase">
                    {pickL10n(siteConfig.copy.caseYear, locale)}
                  </dt>
                  <dd className="mt-6 text-base leading-snug text-zinc-700 dark:text-zinc-300">
                    {project.year}
                  </dd>
                </div>
              ) : null}
              <div className="bg-zinc-50 p-5 dark:bg-zinc-950 sm:p-6">
                <dt className="font-mono text-[10px] tracking-[0.24em] text-desina uppercase">
                  {pickL10n(siteConfig.copy.caseServices, locale)}
                </dt>
                <dd className="mt-6 text-base leading-snug text-zinc-700 dark:text-zinc-300">
                  {project.services.join(" · ")}
                </dd>
              </div>
            </motion.dl>
          </div>
        </motion.section>

        <div className="mt-14 space-y-14 sm:mt-18 lg:mt-20 lg:space-y-20">
          {project.sections.map((section) => (
            <motion.section
              key={pickL10n(section.title, "en")}
              {...(shouldReduceMotion
                ? {}
                : {
                    initial: "hidden" as const,
                    whileInView: "visible" as const,
                    viewport: { once: true, amount: 0.3 },
                    variants: stagger,
                  })}
              className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"
            >
              <motion.p
                variants={fadeUp}
                className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase dark:text-zinc-400"
              >
                {pickL10n(section.title, locale)}
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="max-w-3xl text-lg leading-snug text-zinc-700 sm:text-xl dark:text-zinc-300"
              >
                {pickL10n(section.body, locale)}
              </motion.p>
            </motion.section>
          ))}
        </div>

        {project.gallery && project.gallery.length > 0 ? (
          <section
            className="mt-16 border-t border-zinc-200 pt-14 dark:border-zinc-800 sm:mt-20 sm:pt-18 lg:mt-24 lg:pt-20"
            aria-label={locale === "it" ? "Galleria" : "Gallery"}
          >
            <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:gap-6">
              {project.gallery.map((src) => (
                <li
                  key={src}
                  className="relative aspect-[4/3] overflow-hidden rounded-sm bg-zinc-200 dark:bg-zinc-800"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-zinc-200 pt-10 dark:border-zinc-800 sm:mt-20 sm:pt-12">
          <Link
            href="/#work"
            className="font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase transition-colors hover:text-desina dark:text-zinc-400"
          >
            ← {pickL10n(siteConfig.copy.backToWork, locale)}
          </Link>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-zinc-300 px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-zinc-900 uppercase transition-colors hover:border-desina hover:text-desina dark:border-zinc-700 dark:text-zinc-50"
          >
            {pickL10n(siteConfig.copy.visitLiveSite, locale)} ↗
          </a>
        </div>
      </div>
    </main>
  );
}
