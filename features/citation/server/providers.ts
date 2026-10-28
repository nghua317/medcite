import type { MetadataProviderResult } from "./types";

const NCBI_BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const CROSSREF_BASE_URL = "https://api.crossref.org/works";
const PROVIDER_TIMEOUT_MS = 4_000;

async function getJson(url: URL): Promise<unknown> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Metadata provider returned HTTP ${response.status}`);
  }

  return response.json();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function extractYear(value: string): string {
  return value.match(/\b\d{4}\b/)?.[0] ?? "";
}

function formatCrossrefName(author: CrossrefAuthor) {
  const initials = (author.given ?? "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .join("");
  return [author.family, initials].filter(Boolean).join(" ") || author.name || "";
}

export async function findInPubMed(doi: string): Promise<MetadataProviderResult | null> {
  const searchUrl = new URL(`${NCBI_BASE_URL}/esearch.fcgi`);
  searchUrl.searchParams.set("db", "pubmed");
  searchUrl.searchParams.set("term", `${doi}[AID]`);
  searchUrl.searchParams.set("retmode", "json");
  searchUrl.searchParams.set("retmax", "2");

  const searchPayload = asRecord(await getJson(searchUrl));
  const searchResult = asRecord(searchPayload?.esearchresult);
  const ids = asStringList(searchResult?.idlist);
  if (ids.length === 0) return null;

  const summaryUrl = new URL(`${NCBI_BASE_URL}/esummary.fcgi`);
  summaryUrl.searchParams.set("db", "pubmed");
  summaryUrl.searchParams.set("id", ids.join(","));
  summaryUrl.searchParams.set("retmode", "json");

  const summaryPayload = asRecord(await getJson(summaryUrl));
  const summaryRoot = asRecord(summaryPayload?.result);
  const summaries = ids
    .map((id) => asRecord(summaryRoot?.[id]))
    .filter((summary): summary is Record<string, unknown> => summary !== null);

  const selected = summaries.find((summary) => {
    const identifiers = Array.isArray(summary.articleids)
      ? summary.articleids
      : [];
    return identifiers.some((entry) => {
      const item = asRecord(entry);
      return (
        asString(item?.idtype).toLowerCase() === "doi" &&
        asString(item?.value).toLowerCase() === doi
      );
    });
  });

  // If the provider did not return an identifier list in its summary, only
  // accept a single exact DOI search result; otherwise avoid a fuzzy match.
  const summary = selected ?? (ids.length === 1 ? summaries[0] : undefined);
  if (!summary) return null;

  const journal = asString(summary.fulljournalname) || asString(summary.source);
  const journalAbbreviation = asString(summary.source) || journal;
  const publicationTypes = asStringList(summary.pubtype);
  const languageValues = asStringList(summary.lang);
  const language = languageValues[0] ?? "";
  const title = asString(summary.title);
  const authors = Array.isArray(summary.authors)
    ? summary.authors
        .map((author) => asString(asRecord(author)?.name))
        .filter(Boolean)
    : [];

  const metadata = {
    doi,
    title,
    authors,
    journal,
    year: extractYear(asString(summary.pubdate)),
    publicationDate: asString(summary.pubdate),
    electronicPublicationDate: asString(summary.epubdate),
    pubmedId: asString(summary.uid) || ids[summaries.indexOf(summary)] || "",
    journalAbbreviation,
    volume: asString(summary.volume),
    issue: asString(summary.issue),
    pages: asString(summary.pages),
    language: language || undefined,
    publicationTypes,
  };

  const normalizedLanguage = language.toLowerCase();
  const hasPublicationTypes = publicationTypes.length > 0;
  const isJournalArticleType = publicationTypes.some(
    (type) => type.trim().toLowerCase() === "journal article",
  );
  return {
    metadata,
    isJournalArticle:
      Boolean(journal) &&
      (!normalizedLanguage || ["en", "eng", "english"].includes(normalizedLanguage)) &&
      (!hasPublicationTypes || isJournalArticleType),
  };
}

type CrossrefAuthor = { given?: string; family?: string; name?: string };

export async function findInCrossref(
  doi: string,
): Promise<MetadataProviderResult | null> {
  const url = new URL(`${CROSSREF_BASE_URL}/${encodeURIComponent(doi)}`);
  const payload = asRecord(await getJson(url));
  const message = asRecord(payload?.message);
  if (!message || asString(message.DOI).toLowerCase() !== doi) return null;

  const titles = Array.isArray(message.title) ? message.title : [];
  const journals = Array.isArray(message["container-title"])
    ? message["container-title"]
    : [];
  const authors = Array.isArray(message.author)
    ? (message.author as CrossrefAuthor[]).map(formatCrossrefName).filter(Boolean)
    : [];
  const date = asRecord(message["published-print"]) ??
    asRecord(message["published-online"]) ??
    asRecord(message.created);
  const onlineDate = asRecord(message["published-online"]);
  const printDate = asRecord(message["published-print"]);
  const dateParts = Array.isArray(date?.["date-parts"])
    ? (date?.["date-parts"] as unknown[])[0]
    : undefined;
  const year = Array.isArray(dateParts) ? String(dateParts[0] ?? "") : "";
  const printDateParts = Array.isArray(printDate?.["date-parts"])
    ? (printDate?.["date-parts"] as unknown[])[0]
    : undefined;
  const onlineDateParts = Array.isArray(onlineDate?.["date-parts"])
    ? (onlineDate?.["date-parts"] as unknown[])[0]
    : undefined;
  const formatDateParts = (parts: unknown) => {
    if (!Array.isArray(parts) || parts.length === 0) return "";
    const [dateYear, dateMonth, dateDay] = parts;
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return [
      String(dateYear),
      typeof dateMonth === "number" ? monthNames[dateMonth - 1] : "",
      typeof dateDay === "number" ? String(dateDay) : "",
    ].filter(Boolean).join(" ");
  };
  const page = asString(message.page);
  const articleType = asString(message.type);
  const language = asString(message.language);

  return {
    metadata: {
      doi,
      title: asString(titles[0]),
      authors,
      journal: asString(journals[0]),
      journalAbbreviation: asString(
        (Array.isArray(message["short-container-title"])
          ? message["short-container-title"]
          : [])[0],
      ),
      year,
      publicationDate: formatDateParts(printDateParts) || formatDateParts(dateParts),
      electronicPublicationDate: formatDateParts(onlineDateParts),
      pubmedId: "",
      volume: asString(message.volume),
      issue: asString(message.issue),
      pages: page,
      language: language || undefined,
      publicationTypes: articleType ? [articleType] : [],
    },
    isJournalArticle:
      articleType === "journal-article" &&
      (!language || ["en", "eng", "english"].includes(language.toLowerCase())),
  };
}
