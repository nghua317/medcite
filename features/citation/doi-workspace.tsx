"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Alert, Button, Paper, Select, TextInput } from "@mantine/core";
import { detectInputKind, type InputKind } from "./input-detection";
import type {
  ArticleMetadata,
  CitationLookupCandidates,
  CitationLookupSuccess,
  SourceCandidate,
} from "./server/types";
import { formatNlmCitation, getMissingCitationFields } from "./format-nlm";
import { CitationResultPreview } from "./citation-result-preview";
import styles from "./citation.module.css";

type LookupFailure = {
  ok: false;
  error: { code: string; message: string };
};

type SearchKind = "auto" | InputKind;

export function DoiWorkspace() {
  const [query, setQuery] = useState("");
  const [searchKind, setSearchKind] = useState<SearchKind>("auto");
  const [detectedKind, setDetectedKind] = useState<InputKind | null>(null);
  const [result, setResult] = useState<CitationLookupSuccess | null>(null);
  const [candidates, setCandidates] = useState<SourceCandidate[]>([]);
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
    setCandidates([]);

    if (!query.trim()) {
      setError("Enter a title, keyword, URL, DOI, or ISBN.");
      return;
    }

    const kind = searchKind === "auto" ? detectInputKind(query) : searchKind;
    setDetectedKind(kind);
    setLoading(true);
    try {
      const response = await fetch("/api/citations/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, kind }),
      });
      const payload = (await response.json()) as
        | CitationLookupSuccess
        | CitationLookupCandidates
        | LookupFailure;

      if (!response.ok || !payload.ok) {
        const failure = payload as LookupFailure;
        throw new Error(failure.error?.message ?? "Please try again.");
      }

      if (payload.resultType === "candidates") {
        setCandidates(payload.candidates);
        return;
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

  async function selectCandidate(candidate: SourceCandidate) {
    setError(null);
    setCopied(false);
    setLoading(true);
    try {
      const response = await fetch("/api/citations/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: candidate.resolve.value, kind: candidate.resolve.kind }),
      });
      const payload = (await response.json()) as CitationLookupSuccess | LookupFailure;
      if (!response.ok || !payload.ok || payload.resultType !== "resolved") {
        const failure = payload as LookupFailure;
        throw new Error(failure.error?.message ?? "Please try again.");
      }
      setResult(payload);
      setMetadata(payload.metadata);
      setCandidates([]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We couldn’t load that source. Please try again.",
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
            label="Title, keywords, URL, DOI, or ISBN"
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search by title, URL, DOI, or ISBN"
            value={query}
          />
          <Select
            classNames={{ input: styles.input, label: styles.label }}
            data={[
              { value: "auto", label: "Auto detect" },
              { value: "doi", label: "DOI" },
              { value: "title", label: "Title / keywords" },
              { value: "url", label: "URL" },
              { value: "isbn", label: "ISBN" },
            ]}
            label="Input type"
            onChange={(value) => setSearchKind((value as SearchKind) ?? "auto")}
            value={searchKind}
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
          {detectedKind
            ? `Detected as ${detectedKind === "title" ? "title / keywords" : detectedKind.toUpperCase()}. `
            : ""}
          Review source details before copying.
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

      {candidates.length > 0 && (
        <Paper className={styles.candidatePanel} radius="lg" withBorder>
          <div className={styles.candidateHeader}>
            <div>
              <p className={styles.resultEyebrow}>Choose a source</p>
              <h2 className={styles.resultTitle}>Which source did you mean?</h2>
            </div>
            <span className={styles.candidateCount}>{candidates.length} matches</span>
          </div>
          <div className={styles.candidateList}>
            {candidates.map((candidate) => (
              <button
                className={styles.candidate}
                key={candidate.id}
                onClick={() => selectCandidate(candidate)}
                type="button"
              >
                <strong>{candidate.title}</strong>
                <span>
                  {[candidate.authors.join(", "), candidate.year, candidate.container]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </button>
            ))}
          </div>
        </Paper>
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
            Metadata source: {result.metadata.source === "pubmed+crossref" ? "PubMed and Crossref" : result.metadata.source === "pubmed" ? "PubMed" : result.metadata.source === "crossref" ? "Crossref" : result.metadata.source === "openlibrary" ? "Open Library" : "The web page"}. Your edits stay on this page and aren’t saved after refresh.
          </p>
        </div>
      )}
    </div>
  );
}
