import { CitationLookupError } from "./types";

const DOI_PATTERN = /^10\.\d{4,9}\/\S+$/i;

export function normalizeDoi(input: unknown): string {
  if (typeof input !== "string") {
    throw new CitationLookupError(
      "INVALID_DOI",
      "Enter a valid DOI or DOI link.",
      400,
    );
  }

  let value = input.trim();
  if (!value || value.length > 500) {
    throw new CitationLookupError(
      "INVALID_DOI",
      "Enter a valid DOI or DOI link.",
      400,
    );
  }

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if (!["doi.org", "dx.doi.org"].includes(url.hostname.toLowerCase())) {
        throw new Error("Unsupported DOI host");
      }
      if (url.search || url.hash) {
        throw new Error("DOI links must not include a query or fragment");
      }
      value = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
    } catch {
      throw new CitationLookupError(
        "INVALID_DOI",
        "Enter a valid DOI or DOI link.",
        400,
      );
    }
  }

  value = value.replace(/[.,;\s]+$/, "").toLowerCase();
  if (value.length > 500 || !DOI_PATTERN.test(value)) {
    throw new CitationLookupError(
      "INVALID_DOI",
      "Enter a valid DOI or DOI link.",
      400,
    );
  }

  return value;
}
