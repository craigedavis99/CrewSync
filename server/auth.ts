import { createHmac } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-dev-secret-for-local-only";

type JwtPayload = Record<string, unknown> & { exp: number };

const base64Url = (input: string | Buffer): string =>
  Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

export function signJwt(
  payload: Record<string, unknown>,
  expiresInSeconds = 60 * 60 * 24,
): string {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const body: JwtPayload = { ...payload, exp };

  const headerEncoded = base64Url(JSON.stringify(header));
  const bodyEncoded = base64Url(JSON.stringify(body));
  const signature = createHmac("sha256", JWT_SECRET)
    .update(`${headerEncoded}.${bodyEncoded}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${headerEncoded}.${bodyEncoded}.${signature}`;
}

export function verifyJwt(token: string): JwtPayload | null {
  const [headerEncoded, bodyEncoded, signature] = token.split(".");
  if (!headerEncoded || !bodyEncoded || !signature) return null;

  const expectedSignature = createHmac("sha256", JWT_SECRET)
    .update(`${headerEncoded}.${bodyEncoded}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  if (expectedSignature !== signature) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(bodyEncoded, "base64").toString("utf8"),
    ) as JwtPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
