import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ToolCallout } from "@/components/content-page";
import styles from "@/components/content-page.module.css";

export const metadata: Metadata = {
  title: "Medical Citation Guides | CiteEase",
  description:
    "Practical guides to finding article DOIs, creating NLM references, and checking citation details.",
};

const guides = [
  {
    href: "/guides/how-to-cite-medical-journal-article-nlm",
    title: "How to Cite a Medical Journal Article in NLM Style",
    description:
      "Review the information used in an NLM journal reference and create a copy-ready result from a DOI.",
  },
  {
    href: "/guides/find-a-doi",
    title: "How to Find a DOI for a Journal Article",
    description:
      "Find an article DOI on the publisher page, in PubMed, or through Crossref, and recognize a DOI link.",
  },
  {
    href: "/guides/check-a-generated-citation",
    title: "How to Check a Generated Medical Citation",
    description:
      "Compare the generated reference with the published article before you use or submit it.",
  },
];

export default function GuidesPage() {
  return (
    <ContentPage
      section="guides"
      isGuideIndex
      title="Medical citation guides"
      description="Clear guidance for finding article details, using NLM references, and checking a citation before you copy it."
    >
      <ul className={styles.linkList}>
        {guides.map((guide) => (
          <li key={guide.href}>
            <h2><Link href={guide.href}>{guide.title}</Link></h2>
            <p>{guide.description}</p>
          </li>
        ))}
      </ul>
      <p>
        These guides focus on medical journal articles and NLM-style references.
        CiteEase can look up other source types, but their citation formats are
        not available yet. See the <Link href="/faq">FAQ</Link> for current
        support details.
      </p>
      <ToolCallout />
    </ContentPage>
  );
}
