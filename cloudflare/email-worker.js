/**
 * Cloudflare Email Worker — Poconos STR Directory inbound pipeline.
 *
 * HOW TO INSTALL (2 min, in Cloudflare dashboard):
 * 1. Go to Cloudflare Dashboard → Workers & Pages → Create Worker → name it `poconos-inbound`
 * 2. Paste this entire file as the Worker code
 * 3. Go to Settings → Variables → add:
 *      INBOUND_TOKEN = (a random string you also add to Vercel env vars)
 * 4. Go to Email → Email Routing → Routing rules → Edit → set catch-all (or the
 *    4 addresses) to: Send to a Worker → `poconos-inbound`
 * 5. Save. Incoming mail to *@poconosstr.com now hits
 *    https://www.poconosstr.com/api/inbound AND still forwards to Ryan's Gmail.
 */

import { Message } from "cloudflare:email";

export default {
  async email(message, env, ctx) {
    const FORWARD_TO = "ryanflanagan610@gmail.com"; // keep a copy for Ryan
    const API_URL = "https://www.poconosstr.com/api/inbound";
    const TOKEN = env.INBOUND_TOKEN || "";

    let text = "";
    try {
      const msg = new Message(message.raw);
      text = (await msg.text()) || "";
    } catch (e) {
      text = "";
    }

    const payload = {
      from: message.from,
      to: message.to,
      subject: message.headers.get("subject") || "",
      text: text.substring(0, 40000),
      messageId: message.headers.get("message-id") || "",
      threadId: message.headers.get("in-reply-to") || message.headers.get("references") || "",
      date: new Date().toISOString(),
    };

    // Deliver to the app for the agent to handle
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-inbound-token": TOKEN,
        },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      // Swallow — don't bounce mail if the webhook is briefly down
    }

    // Keep a copy in Ryan's Gmail (also acts as a backup)
    await message.forward(FORWARD_TO);
  },
};
