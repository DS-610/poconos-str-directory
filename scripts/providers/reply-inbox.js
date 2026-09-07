// Reply tool for inbound provider emails.
// Reads new messages from Supabase `inbound_messages` and sends replies
// from partner@poconosstr.com via Resend, with threading headers.
//
// Usage:
//   node scripts/providers/reply-inbox.js --list              # show new messages
//   node scripts/providers/reply-inbox.js --reply=<id> --text="..."  # reply to one
//   node scripts/providers/reply-inbox.js --dry-run           # preview
const https = require("https");
const fs = require("fs");
const path = require("path");

let RESEND_API_KEY = "";

function loadEnv() {
  const envPath = path.join(__dirname, "../../.env.local");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i <= 0) continue;
      process.env[t.slice(0, i)] = t.slice(i + 1).trim();
    }
  }
  RESEND_API_KEY = process.env.RESEND_API_KEY;
}

function supabaseFetch(pathname) {
  const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL + pathname);
  return new Promise((resolve) => {
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "GET",
      family: 4,
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: "Bearer " + process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    }, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on("error", (e) => resolve({ status: 0, data: e.message }));
    req.end();
  });
}

function supabasePatch(id, fields) {
  const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL + "/rest/v1/inbound_messages?id=eq." + id);
  return new Promise((resolve) => {
    const data = JSON.stringify(fields);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "PATCH",
      family: 4,
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: "Bearer " + process.env.SUPABASE_SERVICE_ROLE_KEY,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
        Prefer: "return=minimal",
      },
    }, (res) => {
      res.resume();
      res.on("end", () => resolve(res.statusCode));
    });
    req.on("error", (e) => resolve(0));
    req.write(data);
    req.end();
  });
}

function sendEmail(to, subject, textBody, inReplyTo, references) {
  return new Promise((resolve) => {
    const headers = {};
    if (inReplyTo) headers["In-Reply-To"] = inReplyTo;
    if (references) headers["References"] = references;
    const data = JSON.stringify({
      from: "Ryan Flanagan <partner@poconosstr.com>",
      to: [to],
      reply_to: "partner@poconosstr.com",
      subject: subject,
      text: textBody,
      headers,
    });
    const req = https.request({
      hostname: "api.resend.com",
      path: "/emails",
      method: "POST",
      family: 4,
      headers: {
        Authorization: "Bearer " + RESEND_API_KEY,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    }, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve({ ok: true, id: JSON.parse(body).id });
        else resolve({ ok: false, error: res.statusCode + " " + body.substring(0, 200) });
      });
    });
    req.on("error", (e) => resolve({ ok: false, error: e.message }));
    req.write(data);
    req.end();
  });
}

async function main() {
  loadEnv();
  const isDryRun = process.argv.includes("--dry-run");
  const list = process.argv.includes("--list");
  const replyArg = process.argv.find((a) => a.startsWith("--reply="));
  const idArg = replyArg?.split("=")[1];
  const textArg = process.argv.find((a) => a.startsWith("--text="));
  let text = textArg ? textArg.split("=").slice(1).join("=") : "";
  const textFileArg = process.argv.find((a) => a.startsWith("--text-file="));
  if (textFileArg) {
    text = fs.readFileSync(path.join(__dirname, "..", "..", textFileArg.split("=").slice(1).join("=")), "utf-8").trim();
  }

  if (list || (!idArg && !text)) {
    const res = await supabaseFetch("/rest/v1/inbound_messages?status=eq.new&order=created_at.asc");
    const rows = Array.isArray(res.data) ? res.data : [];
    console.log("\n=== NEW INBOUND MESSAGES (" + rows.length + ") ===");
    for (const r of rows) {
      console.log("\n[" + r.id + "] " + (r.from_name ? r.from_name + " " : "") + "<" + r.from_email + ">");
      console.log("  Subject: " + r.subject);
      console.log("  Received: " + r.created_at);
      console.log("  Body: " + (r.body_text || "").substring(0, 300));
    }
    if (rows.length === 0) console.log("  (none)");
    return;
  }

  if (!idArg || !text) {
    console.error("Usage: --list | --reply=<id> --text=\"reply text\" [--dry-run]");
    return;
  }

  // Fetch the message
  const res = await supabaseFetch("/rest/v1/inbound_messages?id=eq." + idArg + "&select=*");
  const row = Array.isArray(res.data) ? res.data[0] : null;
  if (!row) { console.error("Message not found:", idArg); return; }

  const subject = (row.subject || "").startsWith("Re:") ? row.subject : "Re: " + (row.subject || "Your message");
  const inReplyTo = row.message_id || undefined;
  const references = [row.thread_id, row.message_id].filter(Boolean).join(" ");
  const to = row.from_email;

  console.log("\nReply to: " + to);
  console.log("Subject: " + subject);
  console.log("----\n" + text + "\n----\n");

  if (isDryRun) { console.log("[dry-run] not sent"); return; }

  const result = await sendEmail(to, subject, text, inReplyTo, references);
  if (result.ok) {
    await supabasePatch(idArg, { status: "responded", reply_body: text, replied_at: new Date().toISOString() });
    console.log("SENT OK  id=" + result.id);
  } else {
    console.error("SEND FAILED: " + result.error);
  }
}

main();
