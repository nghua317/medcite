import type { ReactNode } from "react";
import Link from "next/link";
import { BrandHeader } from "@/components/brand-header";
import styles from "./content-page.module.css";

type ContentPageProps = {
  title: string;
  description: string;
  section: "guides" | "about" | "faq";
  isGuideIndex?: boolean;
  children: ReactNode;
};

const sectionLabels = {
  guides: "Citation Guides",
  about: "About",
  faq: "FAQ",
};

export function ContentPage({
  title,
  description,
  section,
  isGuideIndex = false,
  children,
}: ContentPageProps) {
  return (
    <>
      <BrandHeader />
      <main className={styles.main}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {section === "guides" && !isGuideIndex ? (
            <>
              <Link href="/guides">{sectionLabels.guides}</Link>
              <span aria-current="page">{title}</span>
            </>
          ) : (
            <span aria-current="page">{sectionLabels[section]}</span>
          )}
        </nav>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>{sectionLabels[section]}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </header>
        <div className={styles.content}>{children}</div>
      </main>
    </>
  );
}

export function ToolCallout() {
  return (
    <aside className={styles.callout}>
      <h2>Ready to create a reference?</h2>
      <p>Look up a source, review its details, and copy the available citation.</p>
      <Link className={styles.actionLink} href="/#citation-tool">
        Go to the citation tool
      </Link>
    </aside>
  );
}
