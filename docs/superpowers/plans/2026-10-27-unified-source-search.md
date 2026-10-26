# Unified Source Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the citation input to detect DOI, title/keywords, URL, and ISBN, resolve single-source inputs, and show confirmed candidates for title searches.

**Architecture:** Keep the existing Route Handler and `features/citation` boundary. Add a pure input detector, provider-specific lookup functions, a response union for resolved results versus candidates, and a client-side candidate selection state. Preserve the existing DOI/PubMed/Crossref path.

**Tech Stack:** Next.js 16 App Router, TypeScript, React, Mantine, native `fetch`, Node's built-in test runner for pure TypeScript utilities.

**Spec:** `docs/superpowers/specs/2026-10-27-unified-source-search-design.md`

## Global Constraints

- Keep DOI as the existing PubMed-first, Crossref-fallback flow.
- Do not add accounts, databases, API keys, or server-side persistence.
- Do not change existing citation colors, typography, or layout beyond the search controls and candidate feedback needed for this requirement.
- Do not silently choose the first title/keyword candidate.
- Bound external requests by timeout and response size; reject unsafe URL inputs.

## Review Focus

- DOI and DOI URLs keep returning the current NLM citation path — detector and route tests.
- ISBN-10 and ISBN-13 are distinguished from ordinary numbers — detector tests.
- Title searches return candidates rather than an automatic citation — lookup contract and UI tests.
- URL metadata failures are actionable and do not expose arbitrary request details — provider tests.
- Empty, malformed, or unsupported inputs stay on the existing error path — detector and route tests.

### Task 1: Input detection

**Files:**
- Create: `features/citation/input-detection.ts`
- Test: `features/citation/input-detection.test.js`

- [ ] Write failing tests for DOI, DOI URL, URL, ISBN-10, ISBN-13, and title/keyword classification.
- [ ] Run `node --experimental-strip-types --test features/citation/input-detection.test.ts` and confirm the expected failures.
- [ ] Implement `detectInputKind(input: string): InputKind` and shared normalization helpers.
- [ ] Run the focused test and the full available checks.

### Task 2: Lookup response and provider adapters

**Files:**
- Modify: `features/citation/server/types.ts`
- Modify: `features/citation/server/lookup.ts`
- Modify: `features/citation/server/providers.ts`
- Modify: `app/api/citations/lookup/route.ts`
- Test: `features/citation/server/input-lookups.test.ts`

- [ ] Add failing tests for ISBN normalization and candidate response shape.
- [ ] Implement ISBN/Open Library, title/Crossref, and public URL metadata lookup with bounded requests.
- [ ] Preserve `CitationLookupSuccess` for resolved sources and add a separate candidate response type.
- [ ] Route `kind: auto|doi|title|url|isbn` requests without breaking `{doi}` compatibility.
- [ ] Run focused tests, typecheck, and build.

### Task 3: Search UI and candidate confirmation

**Files:**
- Modify: `features/citation/doi-workspace.tsx`
- Modify: `features/citation/citation.module.css`
- Modify: `features/citation/citation-result-preview.tsx` only if shared result props require it

- [ ] Add the type override control, new placeholder, detected-kind feedback, and candidate list.
- [ ] Ensure selecting a candidate makes a second request for the resolved source and does not auto-select the first candidate.
- [ ] Keep existing edit/copy/error behavior for resolved metadata.
- [ ] Run typecheck, build, and inspect the page at `http://localhost:3000`.

### Task 4: Verification and commit

- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Run `git diff --check` and inspect the complete diff.
- [ ] Restore generated files changed by Next.js checks if they are unrelated.
- [ ] Commit only the first requirement with `git commit -m "feat: add unified citation source search"`.
