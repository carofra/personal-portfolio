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
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://carofra.dev",
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
    openCaseStudy: {
      en: "View case study",
      it: "Vedi il case study",
    } satisfies L10n,
    availability: {
      en: "Let's make something together",
      it: "Creiamo qualcosa insieme",
    } satisfies L10n,
    backToWork: {
      en: "Back to work",
      it: "Torna ai progetti",
    } satisfies L10n,
    visitLiveSite: {
      en: "Visit live site",
      it: "Visita il sito",
    } satisfies L10n,
    caseOverview: {
      en: "Overview",
      it: "Panoramica",
    } satisfies L10n,
    caseRole: {
      en: "Role",
      it: "Ruolo",
    } satisfies L10n,
    caseYear: {
      en: "Year",
      it: "Anno",
    } satisfies L10n,
    caseServices: {
      en: "Services",
      it: "Servizi",
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

export type ProjectSection = {
  title: L10n;
  body: L10n;
};

export type ProjectEntry = {
  slug: string;
  title: string;
  /** Live client site URL */
  href: string;
  description: L10n;
  themeColor?: string;
  accentColor?: string;
  topCode: L10n;
  leftMeta: L10n;
  rightMeta: L10n;
  ctaLabel: L10n;
  services: readonly string[];
  /** Optional cover under `public/projects/{slug}/cover.webp` */
  coverImage?: string;
  year?: string;
  role: L10n;
  overview: L10n;
  sections: readonly ProjectSection[];
  gallery?: readonly string[];
};

export function getProjectBySlug(slug: string): ProjectEntry | undefined {
  return projects.find((project) => project.slug === slug);
}

export const projects: ProjectEntry[] = [
  {
    slug: "butter",
    title: "The Butter Project",
    href: "https://www.thebutterproject.club/",
    description: {
      en: "Digital platform for a creative collective with a modular design system.",
      it: "Piattaforma digitale per un collettivo creativo con design system modulare.",
    },
    themeColor: "#ff5a00",
    accentColor: "#ffd8bf",
    topCode: { en: "(PROJECT 01)", it: "(PROGETTO 01)" },
    leftMeta: { en: "Art direction", it: "Art direction" },
    rightMeta: { en: "Design system", it: "Design system" },
    ctaLabel: { en: "View case", it: "Vedi progetto" },
    services: [
      "Art Direction",
      "Web Design",
      "Design System",
      "Development",
    ],
    year: "2024",
    role: {
      en: "Art direction, design system & frontend development",
      it: "Art direction, design system e sviluppo frontend",
    },
    overview: {
      en: "The Butter Project needed a digital home that felt as modular and collaborative as the collective itself — a platform that could grow with new voices without losing visual coherence.",
      it: "The Butter Project aveva bisogno di una casa digitale modulabile come il collettivo stesso: una piattaforma capace di crescere con nuove voci senza perdere coerenza visiva.",
    },
    sections: [
      {
        title: { en: "Challenge", it: "Sfida" },
        body: {
          en: "Translate a creative collective’s energy into a clear, flexible web presence — one that could host varied content while staying unmistakably Butter.",
          it: "Tradurre l’energia di un collettivo creativo in una presenza web chiara e flessibile, capace di ospitare contenuti diversi restando riconoscibilmente Butter.",
        },
      },
      {
        title: { en: "Approach", it: "Approccio" },
        body: {
          en: "I defined a modular visual system, then built the frontend around reusable patterns so new pages and features could land without redesigning from scratch.",
          it: "Ho definito un sistema visivo modulare e costruito il frontend su pattern riusabili, così nuove pagine e feature possono arrivare senza ripartire da zero.",
        },
      },
      {
        title: { en: "Outcome", it: "Risultato" },
        body: {
          en: "A live platform with a coherent identity, expressive motion, and a structure ready for the collective to expand.",
          it: "Una piattaforma online con identità coerente, motion espressiva e una struttura pronta a crescere con il collettivo.",
        },
      },
    ],
  },
  {
    slug: "giulia-pontico",
    title: "Giulia Pontico Makeup",
    href: "https://giuliaponticomakeup.it/",
    description: {
      en: "Digital showcase and booking flow for a professional makeup artist.",
      it: "Vetrina digitale e sistema di booking per una make-up artist.",
    },
    themeColor: "#76b9db",
    accentColor: "#d7f0ff",
    topCode: { en: "(PROJECT 02)", it: "(PROGETTO 02)" },
    leftMeta: { en: "Brand & UI", it: "Brand & UI" },
    rightMeta: { en: "Booking flow", it: "Flusso booking" },
    ctaLabel: { en: "View case", it: "Vedi progetto" },
    services: ["Branding", "UX/UI Design", "Booking Flow", "Development"],
    year: "2024",
    role: {
      en: "Branding, UX/UI design & development",
      it: "Branding, design UX/UI e sviluppo",
    },
    overview: {
      en: "Giulia Pontico needed a site that showcased her craft with elegance and made booking feel as polished as the makeup itself.",
      it: "Giulia Pontico aveva bisogno di un sito che valorizzasse il suo lavoro con eleganza e rendesse il booking fluido quanto il risultato del make-up.",
    },
    sections: [
      {
        title: { en: "Challenge", it: "Sfida" },
        body: {
          en: "Balance a refined visual identity with a practical booking journey — beauty-first, friction-light.",
          it: "Bilanciare un’identità visiva raffinata con un percorso di booking pratico: beauty-first, poca frizione.",
        },
      },
      {
        title: { en: "Approach", it: "Approccio" },
        body: {
          en: "I shaped a calm brand language, then designed and built an interface that leads from portfolio to inquiry without visual noise.",
          it: "Ho definito un linguaggio di brand calmo, poi progettato e sviluppato un’interfaccia che porta dal portfolio alla richiesta senza rumore visivo.",
        },
      },
      {
        title: { en: "Outcome", it: "Risultato" },
        body: {
          en: "A cohesive digital showcase with a clear path to book, aligned with the artist’s tone and clientele.",
          it: "Una vetrina digitale coerente, con un percorso chiaro verso la prenotazione, allineata al tono e alla clientela dell’artist.",
        },
      },
    ],
  },
  {
    slug: "statte",
    title: "Statte",
    href: "https://stattearteinatto.it/",
    description: {
      en: "Information portal for the Statte community with clear, essential navigation.",
      it: "Portale informativo per la community di Statte con navigazione essenziale.",
    },
    themeColor: "#9eb26e",
    accentColor: "#ebf5d3",
    topCode: { en: "(PROJECT 03)", it: "(PROGETTO 03)" },
    leftMeta: { en: "Editorial", it: "Editoriale" },
    rightMeta: { en: "Information design", it: "Information design" },
    ctaLabel: { en: "View case", it: "Vedi progetto" },
    services: ["Editorial", "Information Design", "UX/UI Design", "Development"],
    year: "2025",
    role: {
      en: "Editorial direction, UX/UI & development",
      it: "Direzione editoriale, UX/UI e sviluppo",
    },
    overview: {
      en: "Statte needed an information portal that felt open and local — easy to scan, easy to trust, and structured around the community’s real questions.",
      it: "Statte aveva bisogno di un portale informativo aperto e locale: facile da scorrere, affidabile, strutturato intorno alle domande reali della community.",
    },
    sections: [
      {
        title: { en: "Challenge", it: "Sfida" },
        body: {
          en: "Organize dense local information without overwhelming visitors — clarity first, personality second.",
          it: "Organizzare informazioni locali dense senza opprimere: prima la chiarezza, poi la personalità.",
        },
      },
      {
        title: { en: "Approach", it: "Approccio" },
        body: {
          en: "I used editorial hierarchy and essential navigation patterns, then built a responsive frontend that keeps content front and center.",
          it: "Ho usato gerarchia editoriale e navigazione essenziale, poi costruito un frontend responsive che tiene il contenuto al centro.",
        },
      },
      {
        title: { en: "Outcome", it: "Risultato" },
        body: {
          en: "A calm, readable portal that helps the Statte community find what they need quickly.",
          it: "Un portale calmo e leggibile che aiuta la community di Statte a trovare rapidamente ciò che serve.",
        },
      },
    ],
  },
  {
    slug: "tenute-tufilli",
    title: "Tenute Tufilli",
    href: "https://www.tenutetufilli.com/",
    description: {
      en: "Brand site, e-commerce and harvest booking for an olive oil estate in Molise.",
      it: "Sito brand, e-commerce e booking raccolte per un’azienda olivicola in Molise.",
    },
    themeColor: "#2f3d2c",
    accentColor: "#f3ebd4",
    topCode: { en: "(PROJECT 04)", it: "(PROGETTO 04)" },
    leftMeta: { en: "Brand & commerce", it: "Brand & commerce" },
    rightMeta: { en: "Booking & SEO", it: "Booking & SEO" },
    ctaLabel: { en: "View case", it: "Vedi progetto" },
    services: [
      "Web Design",
      "E-commerce",
      "Booking Flow",
      "Development",
      "SEO",
    ],
    year: "2026",
    role: {
      en: "Web design, e-commerce, booking & frontend development",
      it: "Web design, e-commerce, booking e sviluppo frontend",
    },
    overview: {
      en: "Tenute Tufilli needed a digital home for Gocce di Canneto — a place to tell the family story, sell olive oil, and book harvest experiences in Roccavivara, Molise.",
      it: "Tenute Tufilli aveva bisogno di una casa digitale per Gocce di Canneto: raccontare la storia di famiglia, vendere l’olio e prenotare le esperienze di raccolta a Roccavivara, in Molise.",
    },
    sections: [
      {
        title: { en: "Challenge", it: "Sfida" },
        body: {
          en: "Unite storytelling, product sales, and experiential booking in one bilingual site — warm and territorial, without feeling cluttered.",
          it: "Unire storytelling, vendita prodotto e booking esperienze in un solo sito bilingue: caldo e territoriale, senza affollare.",
        },
      },
      {
        title: { en: "Approach", it: "Approccio" },
        body: {
          en: "I shaped a forest-and-cream visual language rooted in the estate, then built a React frontend with Stripe checkout, harvest booking, and SEO-ready structure.",
          it: "Ho definito un linguaggio visivo forest-and-cream legato all’azienda, poi costruito un frontend React con checkout Stripe, booking raccolte e struttura pronta per la SEO.",
        },
      },
      {
        title: { en: "Outcome", it: "Risultato" },
        body: {
          en: "A live brand site where visitors can discover Gocce di Canneto, buy bottles, and book a day among the olive trees.",
          it: "Un sito brand online dove scoprire Gocce di Canneto, acquistare le bottiglie e prenotare un giorno tra gli ulivi.",
        },
      },
    ],
  },
];
