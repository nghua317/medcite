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

        <DoiWorkspace />
      </main>
    </>
  );
}
