import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ToolCallout } from "@/components/content-page";

export const metadata: Metadata = {
  title: "About CiteEase",
  description:
    "Learn what CiteEase does, which citation workflow it supports, and what to check before using a reference.",
};

export default function AboutPage() {
  return (
    <ContentPage
      section="about"
      title="About CiteEase"
      description="A citation lookup and formatting tool focused on helping students review references for medical journal articles."
    >
      <p>
        CiteEase helps you look up bibliographic details and prepare a
        copyable reference. The current citation workflow focuses on English
        medical journal articles and NLM style, based on the National Library of
        Medicine’s <a href="https://www.ncbi.nlm.nih.gov/books/NBK7256/">
          <em>Citing Medicine</em>
        </a>.
      </p>
      <h2>What the tool does</h2>
      <p>
        Search can start with a DOI, title or keywords, public webpage URL, or
        ISBN. The information is retrieved from available records, and title
        searches show candidates for you to choose. You can review and edit
        returned details before copying.
      </p>
      <p>
        NLM formatting is currently available for medical journal articles.
        Although the tool can look up books and webpages, their citation
        formats are not ready yet. Visit the <Link href="/faq">FAQ</Link> for
        current support details or browse the <Link href="/guides">citation guides</Link>.
      </p>
      <h2>Review before you use a reference</h2>
      <p>
        Metadata records can be incomplete or differ from the published work.
        A missing-field message only indicates that a field is blank; it does
        not verify other information. Compare the result with the original
        article and your instructor’s or journal’s requirements. Learn{" "}
        <Link href="/guides/check-a-generated-citation">
          how to check a generated citation
        </Link>.
      </p>
      <ToolCallout />
    </ContentPage>
  );
}
