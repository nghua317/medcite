import assert from "node:assert/strict";
import test from "node:test";
import { findInCrossref } from "./providers.ts";

test("Crossref fallback fetches metadata for the exact DOI", async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl;
  globalThis.fetch = async (input) => {
    requestedUrl = new URL(input);
    return {
      ok: true,
      status: 200,
      json: async () => ({
        message: {
          DOI: "10.1000/example.1",
          type: "journal-article",
          title: ["A medical study"],
          "container-title": ["Example Medical Journal"],
          author: [{ given: "Jane A", family: "Smith" }],
          "published-print": { "date-parts": [[2024, 5]] },
        },
      }),
    };
  };

  try {
    const result = await findInCrossref("10.1000/example.1");

    assert.equal(requestedUrl.pathname, "/works/10.1000%2Fexample.1");
    assert.equal(result.metadata.title, "A medical study");
    assert.equal(result.isJournalArticle, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Crossref fallback rejects a record whose DOI does not match", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ message: { DOI: "10.1000/other" } }),
  });

  try {
    assert.equal(await findInCrossref("10.1000/requested"), null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
