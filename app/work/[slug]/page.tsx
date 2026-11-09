import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "../../components/CaseStudyView";
import {
  getProjectBySlug,
  projects,
  siteConfig,
} from "../../site.config";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const title = project.title;
  const description = project.description.en;
  const path = `/work/${project.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${siteConfig.fullName}`,
      description,
      url: path,
      siteName: siteConfig.fullName,
      locale: "en_US",
      alternateLocale: ["it_IT"],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.fullName}`,
      description,
    },
  };
}

export default async function WorkCasePage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex((entry) => entry.slug === project.slug);

  return <CaseStudyView project={project} index={index} />;
}
