const { randomUUID } = require("node:crypto");

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

function matchesImageSignature(buffer, contentType) {
  if (contentType === "image/avif") {
    const brand = buffer.toString("ascii", 8, 12);
    return (
      buffer.toString("ascii", 4, 8) === "ftyp" &&
      (brand === "avif" || brand === "avis")
    );
  }
  if (contentType === "image/gif") {
    const signature = buffer.toString("ascii", 0, 6);
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
    return buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"));
  }
  if (contentType === "image/webp") {
    return (
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }
  return false;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const workerUrl = process.env.CF_WORKER_URL;
  const workerSecret = process.env.CF_AUTH_SECRET;
  const allowedEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!workerUrl || !workerSecret || allowedEmails.length === 0) {
    return res.status(503).json({ error: "Image uploads are not configured." });
  }

  const authorization = req.headers.authorization || "";
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) {
    return res.status(401).json({ error: "Sign in is required." });
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
      return res
        .status(401)
        .json({ error: "Your session is invalid or expired." });
    }
    user = await authResponse.json();
  } catch (_) {
    return res.status(502).json({ error: "Could not verify your session." });
  }

  if (!user.email || !allowedEmails.includes(user.email.toLowerCase())) {
    return res
      .status(403)
      .json({ error: "You are not allowed to upload images." });
  }

  const body = req.body;
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid upload request." });
  }

  const { contentType, fileBase64 } = body;
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return res.status(415).json({ error: "Unsupported image type." });
  }
  if (typeof fileBase64 !== "string" || fileBase64.length === 0) {
    return res.status(400).json({ error: "Image data is missing." });
  }

  const fileBuffer = Buffer.from(fileBase64, "base64");
  if (
    fileBuffer.length === 0 ||
    fileBuffer.length > MAX_FILE_BYTES ||
    fileBuffer.toString("base64") !== fileBase64 ||
    !matchesImageSignature(fileBuffer, contentType)
  ) {
    return res
      .status(400)
      .json({ error: "Image is invalid or exceeds the 2.5 MB limit." });
  }

  let parsedWorkerUrl;
  try {
    parsedWorkerUrl = new URL(workerUrl);
  } catch (_) {
    return res
      .status(503)
      .json({ error: "Image upload service is misconfigured." });
  }
  if (parsedWorkerUrl.protocol !== "https:") {
    return res
      .status(503)
      .json({ error: "Image upload service must use HTTPS." });
  }

  const originalName = String(body.filename || "image")
    .split(/[\\/]/)
    .pop();
  const safeName =
    originalName.replace(/[^A-Za-z0-9._-]/g, "_").slice(-100) || "image";
  const filename = `${Date.now()}_${randomUUID()}_${safeName}`;
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
      return res
        .status(502)
        .json({ error: "Image storage rejected the upload." });
    }
    if (typeof result?.url !== "string" || !result.url.startsWith("https://")) {
      return res
        .status(502)
        .json({ error: "Image storage returned an invalid URL." });
    }

    return res.status(200).json({ url: result.url });
  } catch (_) {
    return res.status(502).json({ error: "Could not reach image storage." });
  }
};
