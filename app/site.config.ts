export const siteConfig = {
  name: "Carolina",
  /** Bio sotto l’header principale */
  bio: "Sviluppo esperienze web che uniscono estetica e funzionalità.",
  contact: {
    email: {
      label: "carolinafranceschiello@gmail.com",
      href: "mailto:carolinafranceschiello@gmail.com",
    },
    social: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/yourprofile" },
      { label: "GitHub", href: "https://github.com/youruser" },
    ] as const,
  },
} as const;

export type ProjectEntry = {
  title: string;
  href: string;
  description: string;
  /** Theme color for step card background */
  themeColor?: string;
  /** Optional accent color for future decorative details */
  accentColor?: string;
  /** Optional card labels/copy overrides */
  topCode?: string;
  leftMeta?: string;
  rightMeta?: string;
  ctaLabel?: string;
  /** Lista servizi/discipline mostrata in stile tux.co/work */
  services: readonly string[];
  /** 2–3 screenshot asimmetrici (mshots) per composizione scroll */
  images: readonly [string, string, string];
};

const shot = (url: string, w: number, h: number) =>
  `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${w}&h=${h}`;

export const projects: ProjectEntry[] = [
  {
    title: "The Butter Project",
    href: "https://www.thebutterproject.club/",
    description:
      "Piattaforma digitale per un collettivo creativo con design system modulare.",
    themeColor: "#ff5a00",
    accentColor: "#ffd8bf",
    topCode: "(PROJECT 01)",
    leftMeta: "Primary focus",
    rightMeta: "Secondary focus",
    ctaLabel: "Visit project",
    services: [
      "Art Direction",
      "Web Design",
      "Design System",
      "Development",
    ],
    images: [
      shot("https://www.thebutterproject.club/", 960, 600),
      shot("https://www.thebutterproject.club/", 520, 680),
      shot("https://www.thebutterproject.club/", 420, 320),
    ],
  },
  {
    title: "Giulia Pontico Makeup",
    href: "https://giuliaponticomakeup.it/",
    description:
      "Vetrina digitale e sistema di booking per una make-up artist.",
    themeColor: "#76b9db",
    accentColor: "#d7f0ff",
    topCode: "(PROJECT 02)",
    leftMeta: "Primary focus",
    rightMeta: "Secondary focus",
    ctaLabel: "Visit project",
    services: ["Branding", "UX/UI Design", "Booking Flow", "Development"],
    images: [
      shot("https://giuliaponticomakeup.it/", 920, 580),
      shot("https://giuliaponticomakeup.it/", 480, 640),
      shot("https://giuliaponticomakeup.it/", 400, 300),
    ],
  },
  {
    title: "Statte",
    href: "https://statte-site.vercel.app/",
    description:
      "Portale informativo per la community di Statte con navigazione essenziale.",
    themeColor: "#9eb26e",
    accentColor: "#ebf5d3",
    topCode: "(PROJECT 03)",
    leftMeta: "Primary focus",
    rightMeta: "Secondary focus",
    ctaLabel: "Visit project",
    services: ["Editorial", "Information Design", "UX/UI Design", "Development"],
    images: [
      shot("https://statte-site.vercel.app/", 940, 590),
      shot("https://statte-site.vercel.app/", 500, 660),
      shot("https://statte-site.vercel.app/", 380, 300),
    ],
  },
];
