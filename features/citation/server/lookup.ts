import { normalizeDoi } from "./doi";
import { findInCrossref, findInPubMed } from "./providers";
import { formatNlmCitation, getMissingCitationFields } from "../format-nlm";
import {
  CitationLookupError,
  type ArticleMetadata,
  type CitationLookupSuccess,
  type MetadataProviderResult,
} from "./types";

function hasRequiredMetadata(
  result: MetadataProviderResult,
): boolean {
  const { title, authors, journal, year } = result.metadata;
  return Boolean(title && authors.length > 0 && journal && year);
}

function fillMissingFields(
  primary: MetadataProviderResult,
  fallback: MetadataProviderResult,
): Omit<ArticleMetadata, "source"> {
  const first = primary.metadata;
  const second = fallback.metadata;
  return {
    doi: first.doi,
    title: first.title || second.title,
    authors: first.authors.length ? first.authors : second.authors,
    journal: first.journal || second.journal,
    journalAbbreviation: first.journalAbbreviation || second.journalAbbreviation,
    year: first.year || second.year,
    publicationDate: first.publicationDate || second.publicationDate,
    electronicPublicationDate:
      first.electronicPublicationDate || second.electronicPublicationDate,
    pubmedId: first.pubmedId,
    volume: first.volume || second.volume,
    issue: first.issue || second.issue,
    pages: first.pages || second.pages,
    language: first.language || second.language,
    publicationTypes: first.publicationTypes.length
      ? first.publicationTypes
      : second.publicationTypes,
  };
}

export async function lookupCitation(input: unknown): Promise<CitationLookupSuccess> {
  const doi = normalizeDoi(input);
  let pubmedResult: MetadataProviderResult | null = null;
  let pubmedFailed = false;

  try {
    pubmedResult = await findInPubMed(doi);
  } catch {
    pubmedFailed = true;
  }

  let crossrefResult: MetadataProviderResult | null = null;
  let crossrefFailed = false;
  if (!pubmedResult || !hasRequiredMetadata(pubmedResult)) {
    try {
      crossrefResult = await findInCrossref(doi);
    } catch {
      crossrefFailed = true;
      if (pubmedFailed) {
        throw new CitationLookupError(
          "UPSTREAM_FAILURE",
          "We couldn’t reach the article databases. Please try again in a moment.",
          502,
        );
      }
    }
  }

  if (!pubmedResult && !crossrefResult) {
    if (pubmedFailed || crossrefFailed) {
      throw new CitationLookupError(
        "UPSTREAM_FAILURE",
        "We couldn’t reach the article databases. Please try again in a moment.",
        502,
      );
    }
    throw new CitationLookupError(
      "NOT_FOUND",
      "We couldn’t find article details for this DOI. Check the DOI and try again.",
      404,
    );
  }

  if (pubmedResult && !pubmedResult.isJournalArticle) {
    throw new CitationLookupError(
      "UNSUPPORTED_TYPE",
      "This DOI doesn’t appear to be a journal article. This version supports journal articles only.",
      422,
    );
  }
  if (!pubmedResult && crossrefResult && !crossrefResult.isJournalArticle) {
    throw new CitationLookupError(
      "UNSUPPORTED_TYPE",
      "This DOI doesn’t appear to be a journal article. This version supports journal articles only.",
      422,
    );
  }

  if (pubmedResult && crossrefResult && !crossrefResult.isJournalArticle) {
    crossrefResult = null;
  }

  const metadata = pubmedResult && crossrefResult
    ? fillMissingFields(pubmedResult, crossrefResult)
    : (pubmedResult ?? crossrefResult)!.metadata;
  const source: ArticleMetadata["source"] = pubmedResult && crossrefResult
    ? "pubmed+crossref"
    : pubmedResult
      ? "pubmed"
      : "crossref";

  const completeMetadata = { ...metadata, source };
  return {
    ok: true,
    doi,
    metadata: completeMetadata,
    missingFields: getMissingCitationFields(completeMetadata),
    citation: formatNlmCitation(completeMetadata),
    formattingStatus: "ready",
  };
}
