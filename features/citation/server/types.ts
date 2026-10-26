export type CitationSource =
  | "pubmed"
  | "crossref"
  | "pubmed+crossref"
  | "openlibrary"
  | "webpage";

export type SourceType = "journal" | "book" | "webpage" | "report";

export type ArticleMetadata = {
  sourceType: SourceType;
  doi: string;
  isbn?: string;
  url?: string;
  title: string;
  authors: string[];
  journal: string;
  journalAbbreviation: string;
  year: string;
  publicationDate: string;
  electronicPublicationDate: string;
  pubmedId: string;
  volume: string;
  issue: string;
  pages: string;
  language?: string;
  publicationTypes: string[];
  source: CitationSource;
  publisher?: string;
  websiteName?: string;
};

export type CitationLookupSuccess = {
  ok: true;
  resultType: "resolved";
  doi: string;
  metadata: ArticleMetadata;
  missingFields: Array<"authors" | "title" | "journal" | "year">;
  citation: string;
  formattingStatus: "ready" | "needs_format_support";
};

export type SourceCandidate = {
  id: string;
  sourceType: SourceType;
  title: string;
  authors: string[];
  year: string;
  container: string;
  resolve: { kind: "doi" | "isbn" | "url"; value: string };
};

export type CitationLookupCandidates = {
  ok: true;
  resultType: "candidates";
  query: string;
  candidates: SourceCandidate[];
};

export type CitationLookupResponse = CitationLookupSuccess | CitationLookupCandidates;

export type CitationLookupFailureCode =
  | "INVALID_DOI"
  | "NOT_FOUND"
  | "UNSUPPORTED_TYPE"
  | "UPSTREAM_FAILURE";

export class CitationLookupError extends Error {
  constructor(
    readonly code: CitationLookupFailureCode,
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "CitationLookupError";
  }
}

export type MetadataProviderResult = {
  metadata: Omit<ArticleMetadata, "source">;
  isJournalArticle: boolean;
};
