const SUPABASE_URL = "https://ezfcqeavtbbigakszruk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_oIbZPQzDmTm2yRe7DRWXqg_ofoijtu3";
const MAX_FILE_BYTES = 2.5 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function jsonResponse(body, status) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function matchesImageSignature(buffer, contentType) {
  if (contentType === "image/avif") {
    const brand = String.fromCharCode(...buffer.slice(8, 12));
    return (
      String.fromCharCode(...buffer.slice(4, 8)) === "ftyp" &&
      (brand === "avif" || brand === "avis")
    );
  }
  if (contentType === "image/gif") {
    const signature = String.fromCharCode(...buffer.slice(0, 6));
    return signature === "GIF87a" || signature === "GIF89a";
  }
  if (contentType === "image/jpeg") {
    return (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }
  if (contentType === "image/png") {
    return [137, 80, 78, 71, 13, 10, 26, 10].every(
      (value, index) => buffer[index] === value,
    );
  }
  if (contentType === "image/webp") {
    return (
      String.fromCharCode(...buffer.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...buffer.slice(8, 12)) === "WEBP"
    );
  }
  return false;
}

export async function onRequestPost({ request, env }) {
  const workerUrl = env.CF_WORKER_URL;
  const workerSecret = env.CF_AUTH_SECRET;
  const allowedEmails = (env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!workerUrl || !workerSecret || allowedEmails.length === 0) {
    return jsonResponse({ error: "Image uploads are not configured." }, 503);
  }

  const authorization = request.headers.get("authorization") || "";
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) {
    return jsonResponse({ error: "Sign in is required." }, 401);
  }

  let user;
  try {
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${tokenMatch[1]}`,
      },
    });
    if (!authResponse.ok) {
      return jsonResponse(
        { error: "Your session is invalid or expired." },
        401,
      );
    }
    user = await authResponse.json();
  } catch (_) {
    return jsonResponse({ error: "Could not verify your session." }, 502);
  }

  if (!user.email || !allowedEmails.includes(user.email.toLowerCase())) {
    return jsonResponse(
      { error: "You are not allowed to upload images." },
      403,
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return jsonResponse({ error: "Invalid upload request." }, 400);
  }

  const { contentType, fileBase64 } = body || {};
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return jsonResponse({ error: "Unsupported image type." }, 415);
  }
  if (typeof fileBase64 !== "string" || fileBase64.length === 0) {
    return jsonResponse({ error: "Image data is missing." }, 400);
  }

  let binary;
  try {
    binary = atob(fileBase64);
  } catch (_) {
    return jsonResponse({ error: "Image data is invalid." }, 400);
  }
  if (binary.length === 0 || binary.length > MAX_FILE_BYTES) {
    return jsonResponse({ error: "Image exceeds the 2.5 MB limit." }, 400);
  }

  const fileBuffer = Uint8Array.from(binary, (character) =>
    character.charCodeAt(0),
  );
  if (!matchesImageSignature(fileBuffer, contentType)) {
    return jsonResponse(
      { error: "Image content does not match its file type." },
      400,
    );
  }

  let parsedWorkerUrl;
  try {
    parsedWorkerUrl = new URL(workerUrl);
  } catch (_) {
    return jsonResponse(
      { error: "Image upload service is misconfigured." },
      503,
    );
  }
  if (parsedWorkerUrl.protocol !== "https:") {
    return jsonResponse({ error: "Image upload service must use HTTPS." }, 503);
  }

  const originalName = String(body.filename || "image")
    .split(/[\\/]/)
    .pop();
  const safeName =
    originalName.replace(/[^A-Za-z0-9._-]/g, "_").slice(-100) || "image";
  const filename = `${Date.now()}_${crypto.randomUUID()}_${safeName}`;
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([fileBuffer], { type: contentType }),
    filename,
  );
  formData.append("filename", filename);

  try {
    const workerResponse = await fetch(parsedWorkerUrl, {
      method: "POST",
      headers: { "X-Auth-Token": workerSecret },
      body: formData,
      signal: AbortSignal.timeout(20000),
    });
    const result = await workerResponse.json().catch(() => null);

    if (!workerResponse.ok) {
      return jsonResponse({ error: "Image storage rejected the upload." }, 502);
    }
    if (typeof result?.url !== "string" || !result.url.startsWith("https://")) {
      return jsonResponse(
        { error: "Image storage returned an invalid URL." },
        502,
      );
    }

    return jsonResponse({ url: result.url }, 200);
  } catch (_) {
    return jsonResponse({ error: "Could not reach image storage." }, 502);
  }
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });
  return jsonResponse({ error: "Method not allowed." }, 405);
}
