import type {
  ArticleMetadata,
  MetadataProviderResult,
  SourceCandidate,
} from "./types";

const NCBI_BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const CROSSREF_BASE_URL = "https://api.crossref.org/works";
const OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json";
const PROVIDER_TIMEOUT_MS = 4_000;
const MAX_HTML_BYTES = 1_000_000;

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

async function getHtml(url: URL): Promise<string> {
  const response = await fetch(url, {
    headers: { Accept: "text/html,application/xhtml+xml" },
    cache: "no-store",
    redirect: "manual",
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
  });

  if (response.status >= 300 && response.status < 400) {
    throw new Error("The page redirected and could not be checked safely.");
  }
  if (!response.ok) throw new Error(`Web page returned HTTP ${response.status}`);
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
    throw new Error("The URL does not point to an HTML page.");
  }
  const contentLength = Number(response.headers.get("content-length") ?? "0");
  if (contentLength > MAX_HTML_BYTES) throw new Error("The web page is too large to inspect.");
  const text = await response.text();
  if (new TextEncoder().encode(text).length > MAX_HTML_BYTES) {
    throw new Error("The web page is too large to inspect.");
  }
  return text;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asScalarString(value: unknown): string {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
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

function formatCandidateAuthors(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((author) => formatCrossrefName((asRecord(author) ?? {}) as CrossrefAuthor))
    .filter(Boolean);
}

function safePublicUrl(value: string) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only HTTP and HTTPS URLs are supported.");
  if (url.username || url.password) throw new Error("URLs with credentials are not supported.");
  if (url.port && !["80", "443"].includes(url.port)) throw new Error("Only standard web ports are supported.");
  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "0.0.0.0" || hostname === "::1") {
    throw new Error("Private network URLs are not supported.");
  }
  const ipv4 = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (ipv4) {
    const [a, b] = ipv4.slice(1, 3).map(Number);
    if (a === 10 || a === 127 || a === 169 && b === 254 || a === 192 && b === 168 || a === 172 && b >= 16 && b <= 31) {
      throw new Error("Private network URLs are not supported.");
    }
  }
  return url;
}

function htmlAttribute(tag: string, name: string) {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match?.[1]?.trim() ?? "";
}

function metaValues(html: string, wanted: string[]) {
  const values: string[] = [];
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const key = htmlAttribute(tag, "name") || htmlAttribute(tag, "property");
    if (wanted.includes(key.toLowerCase())) {
      const value = htmlAttribute(tag, "content");
      if (value) values.push(value);
    }
  }
  return values;
}

function htmlTitle(html: string) {
  return html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]
    ?.replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim() ?? "";
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
    sourceType: "journal" as const,
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
      sourceType: "journal",
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

export async function searchCrossref(query: string): Promise<SourceCandidate[]> {
  const url = new URL(CROSSREF_BASE_URL);
  url.searchParams.set("query.bibliographic", query);
  url.searchParams.set("rows", "5");
  const payload = asRecord(await getJson(url));
  const message = asRecord(payload?.message);
  const items = Array.isArray(message?.items) ? message.items : [];
  return items.flatMap((item, index) => {
    const record = asRecord(item);
    const doi = asString(record?.DOI).toLowerCase();
    const title = asString((Array.isArray(record?.title) ? record.title : [])[0]);
    if (!doi || !title) return [];
    const type = asString(record?.type);
    const container = asString((Array.isArray(record?.["container-title"]) ? record["container-title"] : [])[0]);
    const date = asRecord(record?.published) ?? asRecord(record?.created);
    const dateParts = Array.isArray(date?.["date-parts"]) ? (date?.["date-parts"] as unknown[])[0] : [];
    return [{
      id: `crossref-${index}-${doi}`,
      sourceType: type === "report" ? "report" : "journal",
      title,
      authors: formatCandidateAuthors(record?.author),
      year: Array.isArray(dateParts) ? String(dateParts[0] ?? "") : "",
      container,
      resolve: { kind: "doi", value: doi },
    } satisfies SourceCandidate];
  });
}

export async function findInOpenLibrary(isbn: string): Promise<ArticleMetadata | null> {
  const url = new URL(OPEN_LIBRARY_SEARCH_URL);
  url.searchParams.set("isbn", isbn);
  url.searchParams.set("limit", "1");
  const payload = asRecord(await getJson(url));
  const docs = Array.isArray(payload?.docs) ? payload.docs : [];
  const book = asRecord(docs[0]);
  if (!book) return null;
  const authors = asStringList(book.author_name);
  const title = asString(book.title);
  if (!title) return null;
  return {
    sourceType: "book",
    doi: "",
    isbn,
    title,
    authors,
    journal: "",
    journalAbbreviation: "",
    year: asScalarString(book.first_publish_year),
    publicationDate: asScalarString(book.first_publish_year),
    electronicPublicationDate: "",
    pubmedId: "",
    volume: "",
    issue: "",
    pages: "",
    language: undefined,
    publicationTypes: ["Book"],
    source: "openlibrary",
    publisher: asString((Array.isArray(book.publisher) ? book.publisher : [])[0]),
  };
}

export async function findInWebPage(input: string): Promise<ArticleMetadata> {
  const url = safePublicUrl(input);
  const html = await getHtml(url);
  const citationTitles = metaValues(html, ["citation_title"]);
  const title = citationTitles[0] || metaValues(html, ["og:title", "twitter:title"])[0] || htmlTitle(html) || url.hostname;
  const authors = metaValues(html, ["citation_author", "author"]);
  const publicationDate = metaValues(html, ["citation_publication_date", "article:published_time", "date"])[0] ?? "";
  return {
    sourceType: "webpage",
    doi: "",
    url: url.toString(),
    title,
    authors,
    journal: "",
    journalAbbreviation: "",
    year: extractYear(publicationDate),
    publicationDate,
    electronicPublicationDate: "",
    pubmedId: "",
    volume: "",
    issue: "",
    pages: "",
    language: undefined,
    publicationTypes: ["Web page"],
    source: "webpage",
    websiteName: metaValues(html, ["og:site_name"])[0] || url.hostname,
  };
}
