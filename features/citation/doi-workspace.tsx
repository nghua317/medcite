"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Paper, TextInput } from "@mantine/core";
import { CitationResultPreview } from "./citation-result-preview";
import styles from "./citation.module.css";

export function DoiWorkspace() {
  const [doi, setDoi] = useState("");
  const [message, setMessage] = useState<"empty" | "preview" | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!doi.trim()) {
      setMessage("empty");
      return;
    }

    // This is a front-end preview only. DOI lookup will be connected separately.
    setMessage("preview");
  }

  return (
    <div className={styles.workspace}>
      <Paper className={styles.searchPanel} radius="xl" withBorder>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <TextInput
            classNames={{ input: styles.input, label: styles.label }}
            error={message === "empty" ? "Enter a DOI or DOI link." : undefined}
            label="DOI or DOI link"
            onChange={(event) => {
              setDoi(event.currentTarget.value);
              if (message === "empty") setMessage(null);
            }}
            placeholder="Paste a DOI or https://doi.org/..."
            value={doi}
          />
          <Button className={styles.submitButton} type="submit" size="lg">
            Generate reference
          </Button>
        </form>
        <p className={styles.helperText}>
          For English medical journal articles. Your citation appears here after
          a successful lookup.
        </p>
      </Paper>

      {message === "preview" && (
        <div className={styles.previewStack}>
          <Alert color="blue" title="Front-end preview only" variant="light">
            DOI lookup is not connected yet. This placeholder lets us review the
            result layout without showing made-up article details.
          </Alert>
          <CitationResultPreview />
        </div>
      )}
    </div>
  );
}
