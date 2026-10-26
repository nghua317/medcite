export type InputKind = "doi" | "url" | "isbn" | "title";

const DOI_PATTERN = /^10\.\d{4,9}\/\S+$/i;

function isDoiUrl(value: string) {
  try {
    const url = new URL(value);
    return ["doi.org", "dx.doi.org"].includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function normalizeIsbn(value: string) {
  return value.replace(/[\s-]/g, "").toUpperCase();
}

function isValidIsbn(value: string) {
  const isbn = normalizeIsbn(value);
  if (/^\d{9}[\dX]$/.test(isbn)) {
    const checksum = isbn
      .split("")
      .reduce((sum, digit, index) => sum + (digit === "X" ? 10 : Number(digit)) * (10 - index), 0);
    return checksum % 11 === 0;
  }

  if (/^\d{13}$/.test(isbn)) {
    const checksum = isbn
      .split("")
      .reduce((sum, digit, index) => sum + Number(digit) * (index % 2 === 0 ? 1 : 3), 0);
    return checksum % 10 === 0;
  }

  return false;
}

export function detectInputKind(input: string): InputKind {
  const value = input.trim();
  if (DOI_PATTERN.test(value) || isDoiUrl(value)) return "doi";

  if (/^https?:\/\//i.test(value)) return "url";
  if (isValidIsbn(value)) return "isbn";
  return "title";
}

export function normalizeDetectedInput(input: string, kind: InputKind) {
  const value = input.trim();
  if (kind === "isbn") return normalizeIsbn(value);
  if (kind === "doi" && isDoiUrl(value)) {
    const url = new URL(value);
    return decodeURIComponent(url.pathname.replace(/^\/+/, "")).replace(/[.,;\s]+$/, "").toLowerCase();
  }
  return kind === "doi"
    ? value.replace(/[.,;\s]+$/, "").toLowerCase()
    : value;
}
