import { Button, Paper } from "@mantine/core";
import styles from "./citation.module.css";

export function CitationResultPreview() {
  return (
    <Paper className={styles.resultCard} radius="lg" withBorder>
      <div className={styles.resultHeader}>
        <div>
          <p className={styles.resultEyebrow}>NLM reference</p>
          <h2 className={styles.resultTitle}>Your NLM reference</h2>
        </div>
        <Button disabled variant="light">
          Copy reference
        </Button>
      </div>

      <div className={styles.citationPlaceholder}>
        The formatted reference will appear here after DOI lookup is connected.
      </div>

      <Button className={styles.editButton} disabled variant="subtle">
        Edit details
      </Button>
    </Paper>
  );
}
