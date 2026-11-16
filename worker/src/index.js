// Drawing mailbox: the site's drawing pad POSTs a picture + a couple of
// words here (multipart form: `image`, `message`, and an empty `website`
// honeypot). The Worker checks it and emails it to TO_EMAIL via Resend.

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_MESSAGE_LENGTH = 80;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
    const originOk = allowed.includes(origin);
    const cors = {
      "Access-Control-Allow-Origin": originOk ? origin : allowed[0] || "",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      Vary: "Origin",
    };
    const reply = (status, body) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { ...cors, "Content-Type": "application/json" },
      });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return reply(405, { error: "Use POST" });
    if (!originOk) return reply(403, { error: "Origin not allowed" });
    if (!env.RESEND_API_KEY || !env.TO_EMAIL) return reply(500, { error: "Mailbox not configured" });

    let form;
    try {
      form = await request.formData();
    } catch {
      return reply(400, { error: "Expected form data" });
    }

    // Bots fill every field; people never see this one.
    if (form.get("website")) return reply(200, { ok: true });

    const image = form.get("image");
    if (!(image instanceof File) || image.type !== "image/png") {
      return reply(400, { error: "Missing PNG drawing" });
    }
    if (image.size > MAX_IMAGE_BYTES) return reply(413, { error: "Drawing too large" });

    const message = String(form.get("message") || "")
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .trim()
      .slice(0, MAX_MESSAGE_LENGTH);

    const png = toBase64(await image.arrayBuffer());
    const when = new Date().toUTCString();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL || "Drawing pad <onboarding@resend.dev>",
        to: [env.TO_EMAIL],
        subject: message ? `New drawing: ${message}` : "New drawing from your site",
        html: `<p style="font:16px/1.5 sans-serif">${escapeHtml(message) || "<em>(no words)</em>"}</p>
<img src="cid:drawing" alt="drawing" style="max-width:100%;border-radius:12px">
<p style="font:12px sans-serif;color:#888">Sent from the drawing pad on niia.design · ${when}</p>`,
        attachments: [{ filename: "drawing.png", content: png, content_id: "drawing" }],
      }),
    });

    if (!res.ok) {
      console.error("Resend error", res.status, await res.text());
      return reply(502, { error: "Could not send" });
    }
    return reply(200, { ok: true });
  },
};

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
