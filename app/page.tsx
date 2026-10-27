import { BrandHeader } from "@/components/brand-header";
import Link from "next/link";
import { DoiWorkspace } from "@/features/citation/doi-workspace";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <BrandHeader />
      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="page-title">
          <p className={styles.eyebrow}>A simpler way to cite medical research</p>
          <h1 className={styles.title} id="page-title">
            Citation Generator for Medical Articles
          </h1>
          <p className={styles.subtitle}>
            Search by DOI, title, URL, or ISBN, then review the available source
            details. NLM formatting is available for medical journal articles.
          </p>
        </section>

        <section id="citation-tool" aria-label="Medical article citation tool">
          <DoiWorkspace />
        </section>

        <section className={styles.guide} aria-label="Citation guide">
          <section className={styles.guideSection} aria-labelledby="how-to-cite">
            <h2 className={styles.guideTitle} id="how-to-cite">
              How to cite a medical journal article with a DOI
            </h2>
            <p className={styles.guideText}>
              A DOI (Digital Object Identifier) is a persistent identifier for a
              published work. For an NLM journal reference, enter the article DOI
              to look up its available bibliographic details and create a
              formatted citation.
            </p>
            <ol className={styles.steps}>
              <li>Enter the DOI or DOI link for an English medical journal article.</li>
              <li>
                Review the title, authors, journal name, publication year, and any
                available volume, issue, or page details.
              </li>
              <li>
                Edit details if needed, then copy the NLM-style reference for your
                paper or assignment.
              </li>
            </ol>
          </section>

          <section className={styles.guideSection} aria-labelledby="supported-sources">
            <h2 className={styles.guideTitle} id="supported-sources">
              Supported sources and citation format
            </h2>
            <p className={styles.guideText}>
              This version is designed for English medical journal articles that
              can be matched by DOI. Article details are retrieved from available
              records in PubMed and Crossref. Those records can be incomplete or
              differ, so check the result against the original publication before
              using it.
            </p>
            <p className={styles.guideText}>
              The tool formats journal references using NLM, based on the NLM{" "}
              <a href="https://www.ncbi.nlm.nih.gov/books/NBK7256/">
                <em>Citing Medicine</em>
              </a>{" "}
              guidance. Books, websites, reports, and other sources may be found,
              but their source-specific citation formats are not available yet. A
              DOI may also return no match if it is invalid or article details are
              unavailable.
            </p>
          </section>

          <section className={styles.guideSection} aria-labelledby="review-citation">
            <h2 className={styles.guideTitle} id="review-citation">
              Check the details before you use a citation
            </h2>
            <p className={styles.guideText}>
              Compare author names, the article title, journal, and year with the
              published paper. A missing-detail notice means only that a field is
              blank; it does not confirm that the other information is accurate.
              You can edit the details before copying. Some instructors and
              journals require additional formatting beyond NLM, so check their
              specific instructions when preparing a submission.
            </p>
            <a className={styles.guideLink} href="#citation-tool">
              Return to the citation tool
            </a>
          </section>

          <section className={styles.guideSection} aria-labelledby="citation-faq">
            <h2 className={styles.guideTitle} id="citation-faq">
              Common questions about DOI citations
            </h2>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Why can’t the tool find my DOI?</h3>
              <p className={styles.guideText}>
                Check that the DOI is complete and has no extra punctuation or
                spaces. The lookup can only use article details available from its
                metadata sources, so a valid DOI may still have no matching record
                here. If a database is temporarily unavailable, try the lookup
                again later.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Are the article details verified?</h3>
              <p className={styles.guideText}>
                No. Details are retrieved from bibliographic records and may be
                incomplete or inconsistent with the published paper. Compare the
                author names, article title, journal, and year with the original
                source before using the reference. You can edit the details on the
                page if you spot an error.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>What does a missing-detail notice mean?</h3>
              <p className={styles.guideText}>
                It means one or more required fields are blank. It does not mean
                the other fields have been checked for accuracy. Some articles
                also use an article number or omit traditional volume, issue, or
                page details, so compare the result with the article itself.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Will my edits be saved?</h3>
              <p className={styles.guideText}>
                Edits stay in the current page while you review and copy the
                reference. They are not saved to an account or project, and they
                disappear when you refresh or leave the page. Copy the corrected
                reference before closing it.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                Does NLM follow every medical journal’s instructions?
              </h3>
              <p className={styles.guideText}>
                NLM is the reference style used by this tool, but individual
                journals and instructors may request extra punctuation, fields,
                or ordering rules. Check the target journal’s author instructions
                or your course requirements before submitting your work.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                Can I use this format for a book or a website?
              </h3>
              <p className={styles.guideText}>
                This NLM citation format is currently for medical journal
                articles. The tool may find details for other source types, but
                their citation formats are not ready yet. Don’t use a journal
                reference for a book or website; use a format made for that
                source type instead.
              </p>
            </div>
            <p className={styles.guideText}>
              <Link href="/faq">Browse all citation tool FAQs</Link>
            </p>
          </section>
          <section className={styles.guideSection} aria-labelledby="more-guides">
            <h2 className={styles.guideTitle} id="more-guides">
              More citation help
            </h2>
            <p className={styles.guideText}>
              Read our guides to{" "}
              <Link href="/guides/how-to-cite-medical-journal-article-nlm">
                citing a medical journal article in NLM style
              </Link>
              , <Link href="/guides/find-a-doi">finding a DOI</Link>, and{" "}
              <Link href="/guides/check-a-generated-citation">
                checking a generated citation
              </Link>
              . Learn <Link href="/about">about CiteEase</Link>.
            </p>
          </section>
        </section>
      </main>
    </>
  );
}
