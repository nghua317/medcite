import assert from "node:assert/strict";
import test from "node:test";
import { searchCrossref } from "./providers.ts";

test("bibliographic searches allow a provider response that takes over four seconds", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (_input, { signal }) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => resolve({ ok: true, status: 200, json: async () => ({ message: { items: [] } }) }),
        4_500,
      );
      signal.addEventListener(
        "abort",
        () => {
          clearTimeout(timer);
          reject(signal.reason);
        },
        { once: true },
      );
    });

  try {
    assert.deepEqual(await searchCrossref("medical education"), []);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("title searches return only journal article candidates ranked by title", async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl;
  globalThis.fetch = async (input) => {
    requestedUrl = new URL(input);
    return {
      ok: true,
      status: 200,
      json: async () => ({
        message: {
          items: [
            { DOI: "10.1000/review", type: "peer-review", title: ["Review of a vaccine study"] },
            { DOI: "10.1000/data", type: "dataset", title: ["Recommendation of a vaccine study"] },
            { DOI: "10.1000/paper", type: "journal-article", title: ["A vaccine study"] },
          ],
        },
      }),
    };
  };

  try {
    const candidates = await searchCrossref("A vaccine study");

    assert.equal(requestedUrl.searchParams.get("query.title"), "A vaccine study");
    assert.deepEqual(candidates.map((candidate) => candidate.title), ["A vaccine study"]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
