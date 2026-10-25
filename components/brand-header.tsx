import styles from "./brand-header.module.css";

export function BrandHeader() {
  return (
    <header className={styles.header}>
      <a className={styles.brand} href="/" aria-label="MedCite home">
        <span className={styles.mark} aria-hidden="true">
          M
        </span>
        <span>MedCite</span>
      </a>
    </header>
  );
}
