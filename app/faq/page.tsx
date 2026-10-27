import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ToolCallout } from "@/components/content-page";
import styles from "@/components/content-page.module.css";

export const metadata: Metadata = {
  title: "Citation Tool FAQ | CiteEase",
  description:
    "Answers about supported searches, NLM references, citation accuracy, missing details, and how your edits are handled.",
};

const questions = [
  {
    question: "What can I search for?",
    answer: (
      <>
        You can enter a DOI, article title or keywords, a public webpage URL, or
        an ISBN. Title and keyword searches return candidates for you to choose.
        See <Link href="/guides/find-a-doi">how to find a DOI</Link> or return
        to the <Link href="/#citation-tool">citation tool</Link>.
      </>
    ),
  },
  {
    question: "Which sources can the tool format as a citation?",
    answer: (
      <>
        The available citation format is NLM for medical journal articles.
        Books and webpages may be looked up, but their source-specific citation
        formats are not available yet. Read{" "}
        <Link href="/guides/how-to-cite-medical-journal-article-nlm">
          the NLM journal citation guide
        </Link>.
      </>
    ),
  },
  {
    question: "Are the retrieved details verified?",
    answer: (
      <>
        No. Details come from available metadata records and may be incomplete
        or differ from the published article. Compare them with the original
        source using{" "}
        <Link href="/guides/check-a-generated-citation">
          this citation checking guide
        </Link>.
      </>
    ),
  },
  {
    question: "What does a missing-detail notice mean?",
    answer:
      "It means one or more required fields are blank. It does not mean the other fields have been checked for accuracy. Some articles use an article number or do not have traditional volume, issue, or page details.",
  },
  {
    question: "Can I edit the citation details?",
    answer:
      "Yes. Open the result’s edit controls, make your changes, and review the citation preview before copying. The tool does not verify edits against the article.",
  },
  {
    question: "Will my edits or searches be saved?",
    answer:
      "Edits stay on the current page and are not saved to an account or project. They disappear when you refresh or leave the page, so copy the corrected reference before closing it.",
  },
  {
    question: "Does NLM follow every journal’s instructions?",
    answer:
      "NLM is the format used by this tool, but an instructor or journal may request additional details or formatting. Check the relevant instructions before submitting your work.",
  },
];

export default function FaqPage() {
  return (
    <ContentPage
      section="faq"
      title="Frequently asked questions"
      description="Answers about searching for sources and reviewing citation results."
    >
      {questions.map(({ question, answer }) => (
        <section className={styles.faqItem} key={question}>
          <h2>{question}</h2>
          <p>{answer}</p>
        </section>
      ))}
      <div className={styles.relatedLinks}>
        <h2>More help</h2>
        <Link href="/guides">Browse all citation guides</Link>
        <Link href="/about">About CiteEase</Link>
      </div>
      <ToolCallout />
    </ContentPage>
  );
}
