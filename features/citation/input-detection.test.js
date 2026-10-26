import assert from "node:assert/strict";
import test from "node:test";
import { detectInputKind, normalizeDetectedInput } from "./input-detection.ts";

test("detects a bare DOI and DOI URL", () => {
  assert.equal(detectInputKind("10.1000/example.1"), "doi");
  assert.equal(detectInputKind("https://doi.org/10.1000/example.1"), "doi");
});

test("detects a public URL", () => {
  assert.equal(detectInputKind("https://www.example.org/article"), "url");
});

test("detects valid ISBN-10 and ISBN-13 values", () => {
  assert.equal(detectInputKind("0-306-40615-2"), "isbn");
  assert.equal(detectInputKind("9780306406157"), "isbn");
});

test("uses title search for ordinary text and invalid numeric input", () => {
  assert.equal(detectInputKind("A study of medical education"), "title");
  assert.equal(detectInputKind("1234567890"), "title");
});

test("normalizes ISBN and DOI URL values before lookup", () => {
  assert.equal(normalizeDetectedInput("978-0-306-40615-7", "isbn"), "9780306406157");
  assert.equal(normalizeDetectedInput("https://doi.org/10.1000/Example.1", "doi"), "10.1000/example.1");
});
