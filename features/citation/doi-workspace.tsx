"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Alert, Button, Paper, TextInput } from "@mantine/core";
import type { ArticleMetadata, CitationLookupSuccess } from "./server/types";
import { formatNlmCitation, getMissingCitationFields } from "./format-nlm";
import { CitationResultPreview } from "./citation-result-preview";
import styles from "./citation.module.css";

type LookupFailure = {
  ok: false;
  error: { code: string; message: string };
};

export function DoiWorkspace() {
  const [doi, setDoi] = useState("");
  const [result, setResult] = useState<CitationLookupSuccess | null>(null);
  const [metadata, setMetadata] = useState<ArticleMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const citation = useMemo(
    () => (metadata ? formatNlmCitation(metadata) : ""),
    [metadata],
  );
  const missingFields = metadata ? getMissingCitationFields(metadata) : [];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setCopied(false);
    setResult(null);
    setMetadata(null);

    if (!doi.trim()) {
      setError("Enter a DOI or DOI link.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/citations/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doi }),
      });
      const payload = (await response.json()) as
        | CitationLookupSuccess
        | LookupFailure;

      if (!response.ok || !payload.ok) {
        const failure = payload as LookupFailure;
        throw new Error(failure.error?.message ?? "Please try again.");
      }

      setResult(payload);
      setMetadata(payload.metadata);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We couldn’t complete the lookup. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function updateMetadata<K extends keyof ArticleMetadata>(
    key: K,
    value: ArticleMetadata[K],
  ) {
    setMetadata((current) => (current ? { ...current, [key]: value } : current));
    setCopied(false);
  }

  async function copyCitation() {
    if (!citation) return;
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Your browser couldn’t copy the reference. You can select and copy it manually.");
    }
  }

  return (
    <div className={styles.workspace}>
      <Paper className={styles.searchPanel} radius="xl" withBorder>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <TextInput
            classNames={{ input: styles.input, label: styles.label }}
            error={error && !result ? error : undefined}
            label="DOI or DOI link"
            onChange={(event) => setDoi(event.currentTarget.value)}
            placeholder="Paste a DOI or https://doi.org/..."
            value={doi}
          />
          <Button
            className={styles.submitButton}
            type="submit"
            size="lg"
            loading={loading}
            disabled={loading}
          >
            Generate reference
          </Button>
        </form>
        <p className={styles.helperText}>
          For English medical journal articles. Review the details before copying.
        </p>
      </Paper>

      {error && result && (
        <Alert className={styles.feedback} color="red" title="Copy didn’t work" variant="light">
          {error}
        </Alert>
      )}

      {error && !result && (
        <Alert className={styles.feedback} color="orange" title="We couldn’t create a reference" variant="light">
          {error}
        </Alert>
      )}

      {result && metadata && (
        <div className={styles.previewStack}>
          {missingFields.length > 0 && (
            <Alert color="yellow" title="Some details are missing" variant="light">
              Please review the article information. This notice only means a field is empty; it doesn’t verify whether the other details are correct.
            </Alert>
          )}
          <CitationResultPreview
            metadata={metadata}
            citation={citation}
            missingFields={missingFields}
            isEditing={isEditing}
            copied={copied}
            onCopy={copyCitation}
            onToggleEdit={() => setIsEditing((value) => !value)}
            onUpdate={updateMetadata}
          />
          <p className={styles.sourceNote}>
            Metadata source: {result.metadata.source === "pubmed+crossref" ? "PubMed and Crossref" : result.metadata.source === "pubmed" ? "PubMed" : "Crossref"}. Your edits stay on this page and aren’t saved after refresh.
          </p>
        </div>
      )}
    </div>
  );
}
