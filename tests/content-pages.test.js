import assert from "node:assert/strict";
import test from "node:test";
import nextConfig from "../next.config.ts";

const baseUrl = "http://localhost:3001";

async function getPage(path) {
  const response = await fetch(new URL(path, baseUrl));
  return { response, html: await response.text() };
}

test("homepage HTML is not cached across frontend deployments", async () => {
  const rules = await nextConfig.headers();
  const homeRule = rules.find((rule) => rule.source === "/");
  const cacheHeader = homeRule?.headers.find((header) => header.key === "Cache-Control");

  assert.equal(cacheHeader?.value, "no-store, must-revalidate");
});

test("content pages are public and linked from the site navigation", async () => {
  const paths = ["/guides", "/faq", "/about"];

  for (const path of paths) {
    const { response, html } = await getPage(path);
    assert.equal(response.status, 200, `${path} should return HTTP 200`);
    assert.match(html, /<main[ >]/, `${path} should have a main landmark`);
  }

  const { html: home } = await getPage("/");
  for (const label of ["Citation Guides", "FAQ", "About"]) {
    assert.ok(home.includes(`>${label}</a>`), `navigation should include ${label}`);
  }
});

test("each guide is linked from the guide index and included in the sitemap", async () => {
  const guidePaths = [
    "/guides/how-to-cite-medical-journal-article-nlm",
    "/guides/find-a-doi",
    "/guides/check-a-generated-citation",
  ];
  const { response: indexResponse, html: indexHtml } = await getPage("/guides");
  assert.equal(indexResponse.status, 200);

  const { response: sitemapResponse, html: sitemap } = await getPage("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);

  for (const path of guidePaths) {
    const { response, html } = await getPage(path);
    assert.equal(response.status, 200, `${path} should return HTTP 200`);
    assert.match(html, /<h1[ >]/, `${path} should have a page heading`);
    assert.ok(indexHtml.includes(path), `${path} should be linked from the guide index`);
    assert.ok(sitemap.includes(`https://citeease.com${path}`), `${path} should be in sitemap.xml`);
  }
});

test("content pages link readers to the tool and related information", async () => {
  for (const path of [
    "/guides/how-to-cite-medical-journal-article-nlm",
    "/guides/find-a-doi",
    "/guides/check-a-generated-citation",
  ]) {
    const { html } = await getPage(path);
    assert.ok(html.includes('href="/#citation-tool"'), "guide should link back to the tool");
  }

  const { html: faq } = await getPage("/faq");
  const { html: about } = await getPage("/about");
  assert.ok(faq.includes('href="/guides"'), "FAQ should link to the guide index");
  assert.ok(about.includes('href="/faq"'), "About should link to the FAQ");
});
