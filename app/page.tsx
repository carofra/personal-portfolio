import { PortfolioView } from "./components/PortfolioView";
import { siteConfig, projects } from "./site.config";

export default function Home() {
  return <PortfolioView config={siteConfig} projects={projects} />;
}
