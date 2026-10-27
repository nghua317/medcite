import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ToolCallout } from "@/components/content-page";
import styles from "@/components/content-page.module.css";

export const metadata: Metadata = {
  title: "How to Check a Generated Medical Citation | CiteEase",
  description:
    "Check author names, title, journal, year, and publication details against the original medical article before using a citation.",
};

export default function CheckCitationGuide() {
  return (
    <ContentPage
      section="guides"
      title="How to check a generated medical citation"
      description="Generated references save formatting time, but you should compare their details with the original article."
    >
      <p>
        Citation tools retrieve details from available records. Those records
        can be incomplete or inconsistent with the published article, so treat
        a generated reference as a draft to review.
      </p>
      <h2>Check these details against the article</h2>
      <ul>
        <li>Author names and their order</li>
        <li>The complete article title</li>
        <li>The journal title and publication year</li>
        <li>Volume, issue, page range, or article number when present</li>
        <li>The DOI, if it appears in the source record</li>
      </ul>
      <p>
        Open the publisher’s article page or the full text and compare each
        available field. The relevant NLM examples in{" "}
        <a href="https://www.ncbi.nlm.nih.gov/books/NBK7256/">
          <em>Citing Medicine</em>
        </a> can help you check how journal article details are presented.
      </p>
      <h2>Understand missing-field notices</h2>
      <p>
        A missing-detail notice means a field is blank; it does not confirm the
        accuracy of other fields. Some articles use an article number or do not
        have traditional volume, issue, or page details. Compare what is shown
        with the publication rather than filling fields by guesswork.
      </p>
      <p>
        If you find an error, edit the details before copying. The current tool
        keeps edits on the page only, so copy the corrected reference before
        leaving or refreshing. See the <Link href="/faq">FAQ</Link> for more
        about edits and data sources.
      </p>
      <div className={styles.relatedLinks}>
        <h2>Related</h2>
        <Link href="/guides/how-to-cite-medical-journal-article-nlm">
          How to cite a medical journal article in NLM style
        </Link>
        <Link href="/guides/find-a-doi">How to find a DOI</Link>
      </div>
      <ToolCallout />
    </ContentPage>
  );
}
