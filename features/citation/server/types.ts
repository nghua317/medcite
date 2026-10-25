export type CitationSource = "pubmed" | "crossref" | "pubmed+crossref";

export type ArticleMetadata = {
  doi: string;
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
};

export type CitationLookupSuccess = {
  ok: true;
  doi: string;
  metadata: ArticleMetadata;
  missingFields: Array<"authors" | "title" | "journal" | "year">;
  citation: string;
  formattingStatus: "ready";
};

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
