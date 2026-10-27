import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ToolCallout } from "@/components/content-page";
import styles from "@/components/content-page.module.css";

export const metadata: Metadata = {
  title: "How to Cite a Medical Journal Article in NLM Style | CiteEase",
  description:
    "Learn how to create and review an NLM-style reference for a medical journal article using its DOI.",
};

export default function NlmJournalCitationGuide() {
  return (
    <ContentPage
      section="guides"
      title="How to cite a medical journal article in NLM style"
      description="Use the article record as a starting point, then compare the reference with the published paper before using it."
    >
      <p>
        NLM is a citation style used in biomedical writing. Its guide,{" "}
        <a href="https://www.ncbi.nlm.nih.gov/books/NBK7256/">
          <em>Citing Medicine</em>
        </a>, includes examples for journal articles and other publication
        types. Details can vary by article, so use the relevant NLM example and
        your instructor’s or journal’s instructions when they apply.
      </p>
      <h2>Steps to create and review a reference</h2>
      <ol>
        <li>
          Find the article’s DOI on its publisher page or in a bibliographic
          record. See our guide to <Link href="/guides/find-a-doi">finding a DOI</Link>.
        </li>
        <li>
          Enter the DOI or DOI link in the <Link href="/#citation-tool">citation tool</Link>.
          The lookup uses available records; it does not independently verify
          every field against the article.
        </li>
        <li>
          Compare the authors, article title, journal, and publication year with
          the article itself. Check volume, issue, page range, or article number
          when those details are provided.
        </li>
        <li>
          Edit any incorrect details in the result, then copy the reference.
          Changes stay on the current page and are not saved after you leave or
          refresh it.
        </li>
      </ol>
      <h2>Use the right source type</h2>
      <p>
        This version accepts DOIs for medical journal articles and formats
        those articles in NLM style. It does not look up books or webpages. Do
        not use a journal-article reference for a different source type.
      </p>
      <p>
        For examples and detailed rules, consult the relevant chapter of NLM’s{" "}
        <a href="https://www.ncbi.nlm.nih.gov/books/NBK7256/">Citing Medicine</a>.
        Check your course or target journal requirements as well.
      </p>
      <div className={styles.relatedLinks}>
        <h2>Related</h2>
        <Link href="/guides/check-a-generated-citation">Check a generated citation</Link>
        <Link href="/faq">Citation tool FAQ</Link>
      </div>
      <ToolCallout />
    </ContentPage>
  );
}
