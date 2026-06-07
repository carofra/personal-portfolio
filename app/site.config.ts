export type Locale = "en" | "it";

/** Bilingual string — English is the canonical default for the site. */
export type L10n = {
  en: string;
  it: string;
};

export function pickL10n(strings: L10n, locale: Locale): string {
  return strings[locale];
}

export const siteConfig = {
  name: "Carolina",
  fullName: "Carolina Franceschiello",
  role: "Web Designer & Developer",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://carofra.github.io/personal-portfolio",
  bio: {
    en: "I build web experiences that blend aesthetics and functionality.",
    it: "Sviluppo esperienze web che uniscono estetica e funzionalità.",
  } satisfies L10n,
  about: {
    eyebrow: {
      en: "About",
      it: "Chi sono",
    } satisfies L10n,
    title: {
      en: "Digital experiences with a visual point of view.",
      it: "Esperienze digitali con un punto di vista visivo.",
    } satisfies L10n,
    body: {
      en: "I design and develop websites for creatives, small brands, and independent projects, pairing clean interfaces with expressive details and thoughtful interactions.",
      it: "Disegno e sviluppo siti per creativi, piccoli brand e progetti indipendenti, unendo interfacce pulite, dettagli espressivi e interazioni curate.",
    } satisfies L10n,
    services: [
      {
        label: { en: "Design", it: "Design" } satisfies L10n,
        description: {
          en: "Visual direction, interface systems, and responsive layouts.",
          it: "Direzione visiva, sistemi di interfaccia e layout responsive.",
        } satisfies L10n,
      },
      {
        label: { en: "Development", it: "Sviluppo" } satisfies L10n,
        description: {
          en: "Fast, accessible frontends built with modern web tools.",
          it: "Frontend veloci e accessibili costruiti con strumenti moderni.",
        } satisfies L10n,
      },
      {
        label: { en: "Motion", it: "Motion" } satisfies L10n,
        description: {
          en: "Subtle transitions and scroll moments that support the content.",
          it: "Transizioni e momenti di scroll che valorizzano il contenuto.",
        } satisfies L10n,
      },
    ] as const,
  },
  copy: {
    scrollToExplore: {
      en: "Scroll to explore ↓",
      it: "Scorri per esplorare ↓",
    } satisfies L10n,
    openProjectInNewTab: {
      en: "Open in a new tab",
      it: "Apri in una nuova scheda",
    } satisfies L10n,
  },
  contact: {
    email: {
      label: "carolinafranceschiello@gmail.com",
      href: "mailto:carolinafranceschiello@gmail.com",
    },
    social: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/carolina-franceschiello-b51687253/",
      },
      { label: "GitHub", href: "https://github.com/carofra" },
      { label: "Instagram", href: "https://www.instagram.com/cazola_/" },
    ] as const,
  },
} as const;

export type SiteConfig = typeof siteConfig;

export type ProjectEntry = {
  title: string;
  href: string;
  description: L10n;
  themeColor?: string;
  accentColor?: string;
  topCode: L10n;
  leftMeta: L10n;
  rightMeta: L10n;
  ctaLabel: L10n;
  services: readonly string[];
};

export const projects: ProjectEntry[] = [
  {
    title: "The Butter Project",
    href: "https://www.thebutterproject.club/",
    description: {
      en: "Digital platform for a creative collective with a modular design system.",
      it: "Piattaforma digitale per un collettivo creativo con design system modulare.",
    },
    themeColor: "#ff5a00",
    accentColor: "#ffd8bf",
    topCode: { en: "(PROJECT 01)", it: "(PROGETTO 01)" },
    leftMeta: { en: "Primary focus", it: "Focus principale" },
    rightMeta: { en: "Secondary focus", it: "Focus secondario" },
    ctaLabel: { en: "Visit project", it: "Visita il progetto" },
    services: [
      "Art Direction",
      "Web Design",
      "Design System",
      "Development",
    ],
  },
  {
    title: "Giulia Pontico Makeup",
    href: "https://giuliaponticomakeup.it/",
    description: {
      en: "Digital showcase and booking flow for a professional makeup artist.",
      it: "Vetrina digitale e sistema di booking per una make-up artist.",
    },
    themeColor: "#76b9db",
    accentColor: "#d7f0ff",
    topCode: { en: "(PROJECT 02)", it: "(PROGETTO 02)" },
    leftMeta: { en: "Primary focus", it: "Focus principale" },
    rightMeta: { en: "Secondary focus", it: "Focus secondario" },
    ctaLabel: { en: "Visit project", it: "Visita il progetto" },
    services: ["Branding", "UX/UI Design", "Booking Flow", "Development"],
  },
  {
    title: "Statte",
    href: "https://stattearteinatto.it/",
    description: {
      en: "Information portal for the Statte community with clear, essential navigation.",
      it: "Portale informativo per la community di Statte con navigazione essenziale.",
    },
    themeColor: "#9eb26e",
    accentColor: "#ebf5d3",
    topCode: { en: "(PROJECT 03)", it: "(PROGETTO 03)" },
    leftMeta: { en: "Primary focus", it: "Focus principale" },
    rightMeta: { en: "Secondary focus", it: "Focus secondario" },
    ctaLabel: { en: "Visit project", it: "Visita il progetto" },
    services: ["Editorial", "Information Design", "UX/UI Design", "Development"],
  },
];
