# Unified Source Search Design

## Intent

Extend the first-version DOI input into one citation search entry point that accepts DOI, title/keywords, public URLs, and ISBNs while preserving the current direct DOI workflow.

## Goals

- Detect DOI, URL, ISBN, or title/keyword input automatically.
- Let the user override the detected type when automatic detection is wrong.
- Resolve DOI, URL, and ISBN to one editable source result.
- Return a short candidate list for title/keyword searches so the user confirms the source before citation formatting.
- Keep the existing NLM citation flow and review warnings intact.

## Non-goals

- Citation-style selection, multi-source lists, exports, or new source-type editors; those are later requirements.
- Account storage or server-side persistence.
- Fetching arbitrary private network URLs or bypassing page access controls.

## Decisions

- The default mode is `Auto detect`; the UI also offers DOI, Title / keywords, URL, and ISBN overrides.
- Title/keyword searches return up to five candidates with title, author, year, and source label. The user must select a candidate before a citation result is shown.
- DOI continues to use PubMed first and Crossref as fallback.
- ISBN lookup uses Open Library without an API key.
- URL lookup reads public HTML metadata with bounded response size and a timeout; unsupported or unsafe URLs return an actionable error.
- The lookup response distinguishes `resolved` results from `candidates` so the client does not guess which title result the user meant.

## Acceptance

- A DOI still produces the existing NLM reference path.
- A DOI URL is recognized as DOI input.
- A valid ISBN reaches the book lookup path.
- A public URL reaches the webpage metadata path.
- A title or keyword query shows candidates and does not silently select the first result.
- Invalid or unsupported input produces a clear error.
- Existing typecheck and production build remain passing.
