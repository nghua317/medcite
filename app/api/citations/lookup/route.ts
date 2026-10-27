import { CitationLookupError } from "@/features/citation/server/types";
import { lookupCitation } from "@/features/citation/server/lookup";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    const rawBody = await request.text();
    if (rawBody.length > 2_000) {
      return Response.json(
        { ok: false, error: { code: "INVALID_REQUEST", message: "Request is too large." } },
        { status: 413 },
      );
    }
    body = JSON.parse(rawBody);
  } catch {
    return Response.json(
      { ok: false, error: { code: "INVALID_REQUEST", message: "Send a JSON body containing a DOI." } },
      { status: 400 },
    );
  }

  const doi =
    typeof body === "object" && body !== null && "doi" in body
      ? (body as { doi?: unknown }).doi
      : undefined;

  try {
    const result = await lookupCitation(doi);
    return Response.json(result);
  } catch (error) {
    if (error instanceof CitationLookupError) {
      return Response.json(
        { ok: false, error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    }

    return Response.json(
      {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Something went wrong while preparing this reference. Please try again.",
        },
      },
      { status: 500 },
    );
  }
}
