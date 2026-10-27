import { BrandHeader } from "@/components/brand-header";
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
            Create an NLM-style citation from a DOI and review it before
            copying.
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
        </section>
      </main>
    </>
  );
}
