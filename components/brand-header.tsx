import styles from "./brand-header.module.css";
import Link from "next/link";

export function BrandHeader() {
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="MedCite home">
        <span className={styles.mark} aria-hidden="true">
          M
        </span>
        <span>MedCite</span>
      </Link>
      <nav className={styles.navigation} aria-label="Main navigation">
        <Link href="/guides">Citation Guides</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  );
}
