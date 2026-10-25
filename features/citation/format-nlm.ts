import type { ArticleMetadata } from "./server/types";

const REQUIRED_FIELDS = ["authors", "title", "journal", "year"] as const;

export function getMissingCitationFields(metadata: ArticleMetadata) {
  const missing: Array<(typeof REQUIRED_FIELDS)[number]> = [];
  if (!metadata.authors.some((author) => author.trim())) missing.push("authors");
  if (!metadata.title.trim()) missing.push("title");
  if (!(metadata.journalAbbreviation || metadata.journal).trim()) {
    missing.push("journal");
  }
  if (!metadata.year.trim()) missing.push("year");
  return missing;
}

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim().replace(/[.\s]+$/, "");
}

function formatDate(metadata: ArticleMetadata) {
  const date = clean(metadata.publicationDate);
  if (date && date.startsWith(metadata.year)) return date;
  return metadata.year;
}

function shortenPageRange(value: string) {
  const match = value.match(/^(\d{3,})([-–])(\d{1,})$/);
  if (!match) return value;

  const [, firstPage, separator, lastPage] = match;
  let sharedPrefixLength = 0;
  while (
    sharedPrefixLength < firstPage.length &&
    sharedPrefixLength < lastPage.length &&
    firstPage[sharedPrefixLength] === lastPage[sharedPrefixLength]
  ) {
    sharedPrefixLength += 1;
  }

  return `${firstPage}${separator}${lastPage.slice(sharedPrefixLength) || lastPage}`;
}

export function formatNlmCitation(metadata: ArticleMetadata) {
  if (getMissingCitationFields(metadata).length > 0) return "";

  const authors = metadata.authors.map(clean).filter(Boolean).join(", ");
  const journal = clean(metadata.journalAbbreviation || metadata.journal);
  let citation = `${authors}. ${clean(metadata.title)}. ${journal}. ${formatDate(metadata)};`;

  if (metadata.volume) citation += metadata.volume;
  if (metadata.issue) citation += `(${metadata.issue})`;
  if (metadata.pages) citation += `:${shortenPageRange(metadata.pages)}`;
  citation += ".";

  if (metadata.doi) citation += ` doi: ${metadata.doi}.`;
  if (
    metadata.electronicPublicationDate &&
    metadata.electronicPublicationDate !== metadata.publicationDate
  ) {
    citation += ` Epub ${clean(metadata.electronicPublicationDate)}.`;
  }
  if (metadata.pubmedId) citation += ` PMID: ${metadata.pubmedId}.`;
  return citation;
}
