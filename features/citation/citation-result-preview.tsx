import { Alert, Button, Paper, Textarea, TextInput } from "@mantine/core";
import type { ArticleMetadata } from "./server/types";
import styles from "./citation.module.css";

type CitationResultPreviewProps = {
  metadata: ArticleMetadata;
  citation: string;
  missingFields: string[];
  isEditing: boolean;
  copied: boolean;
  onCopy: () => void;
  onToggleEdit: () => void;
  onUpdate: <K extends keyof ArticleMetadata>(
    key: K,
    value: ArticleMetadata[K],
  ) => void;
};

export function CitationResultPreview({
  metadata,
  citation,
  missingFields,
  isEditing,
  copied,
  onCopy,
  onToggleEdit,
  onUpdate,
}: CitationResultPreviewProps) {
  return (
    <Paper className={styles.resultCard} radius="lg" withBorder>
      <div className={styles.resultHeader}>
        <div>
          <p className={styles.resultEyebrow}>NLM reference</p>
          <h2 className={styles.resultTitle}>Your NLM reference</h2>
        </div>
        <Button disabled={!citation} onClick={onCopy} variant="light">
          {copied ? "Copied" : "Copy reference"}
        </Button>
      </div>

      {citation ? (
        <div className={styles.citationText} aria-live="polite">
          {citation}
        </div>
      ) : (
        <Alert className={styles.citationText} color="yellow" title="Complete the required details" variant="light">
          Add the missing author, title, journal, or year to preview a reference.
        </Alert>
      )}

      <Button className={styles.editButton} onClick={onToggleEdit} variant="subtle">
        {isEditing ? "Done editing" : "Edit details"}
      </Button>

      {isEditing && (
        <div className={styles.editor}>
          <Alert color="blue" variant="light">
            Please compare your changes with the article. We can’t verify edited details, and they won’t be saved after you refresh.
          </Alert>
          <Textarea
            label="Authors (one per line)"
            value={metadata.authors.join("\n")}
            onChange={(event) =>
              onUpdate(
                "authors",
                event.currentTarget.value.split("\n").filter((name) => name.trim()),
              )
            }
            autosize
            minRows={2}
          />
          <TextInput
            label="Article title"
            value={metadata.title}
            onChange={(event) => onUpdate("title", event.currentTarget.value)}
          />
          <TextInput
            label="Journal name"
            value={metadata.journal}
            onChange={(event) => onUpdate("journal", event.currentTarget.value)}
          />
          <TextInput
            label="Journal abbreviation used in NLM references"
            value={metadata.journalAbbreviation}
            onChange={(event) =>
              onUpdate("journalAbbreviation", event.currentTarget.value)
            }
          />
          <div className={styles.editGrid}>
            <TextInput
              label="Year"
              value={metadata.year}
              onChange={(event) => {
                const year = event.currentTarget.value;
                onUpdate("year", year);
                onUpdate(
                  "publicationDate",
                  metadata.publicationDate.startsWith(metadata.year)
                    ? metadata.publicationDate.replace(metadata.year, year)
                    : year,
                );
              }}
            />
            <TextInput
              label="Volume"
              value={metadata.volume}
              onChange={(event) => onUpdate("volume", event.currentTarget.value)}
            />
            <TextInput
              label="Issue"
              value={metadata.issue}
              onChange={(event) => onUpdate("issue", event.currentTarget.value)}
            />
            <TextInput
              label="Pages or article number"
              value={metadata.pages}
              onChange={(event) => onUpdate("pages", event.currentTarget.value)}
            />
            <TextInput
              label="DOI"
              value={metadata.doi}
              onChange={(event) => onUpdate("doi", event.currentTarget.value)}
            />
          </div>
          {missingFields.length > 0 && (
            <p className={styles.editorHint}>
              Still needed: {missingFields.join(", ")}.
            </p>
          )}
        </div>
      )}
    </Paper>
  );
}
