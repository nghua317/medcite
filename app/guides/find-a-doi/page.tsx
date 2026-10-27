import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ToolCallout } from "@/components/content-page";
import styles from "@/components/content-page.module.css";

export const metadata: Metadata = {
  title: "How to Find a DOI for a Journal Article | CiteEase",
  description:
    "Find a journal article DOI from its publisher page, PubMed, or Crossref and use it to look up citation details.",
};

export default function FindDoiGuide() {
  return (
    <ContentPage
      section="guides"
      title="How to find a DOI for a journal article"
      description="A DOI identifies a digital publication and can help retrieve its available citation details."
    >
      <p>
        A DOI, or Digital Object Identifier, is a persistent identifier for a
        publication. It is commonly shown as a number beginning with
        <code> 10.</code> and may also appear as a link beginning with
        <code> https://doi.org/</code>.
      </p>
      <h2>Where to look</h2>
      <ul>
        <li>
          <strong>Publisher article page:</strong> check the article details,
          abstract, or citation information area.
        </li>
        <li>
          <strong>PubMed:</strong> open the article record and look in its
          identifier details for a DOI, when one is listed.
        </li>
        <li>
          <strong>Crossref:</strong> search by article title or authors in its
          public metadata search, then compare the result with the publication.
        </li>
      </ul>
      <p>
        A DOI link and a plain DOI identify the same item. Copy the complete
        value, without surrounding quotation marks or sentence punctuation. If
        the article has no DOI, you can try a title or keyword search, but check
        the candidate list carefully before selecting a record.
      </p>
      <h2>If the lookup finds no result</h2>
      <p>
        Check for a missing character or extra punctuation and compare the DOI
        with the publisher page. A valid DOI can still lack a matching record in
        the sources available to the tool. You can also look up a source by its
        title or keywords, then review the returned candidates.
      </p>
      <p>
        Once you have a result, follow the steps in{" "}
        <Link href="/guides/how-to-cite-medical-journal-article-nlm">
          our NLM journal citation guide
        </Link> and compare the details with the article.
      </p>
      <div className={styles.relatedLinks}>
        <h2>Related</h2>
        <Link href="/faq">Read the citation tool FAQ</Link>
        <Link href="/guides/check-a-generated-citation">Check a generated citation</Link>
      </div>
      <ToolCallout />
    </ContentPage>
  );
}
