import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, business, reason, message } = await request.json();

    if (!name || !email || !reason || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const subject = `Contact Form: ${reason} — ${name}`;
      const htmlBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1c1917; border-bottom: 2px solid #46845d; padding-bottom: 8px;">
            New Contact Form Submission
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #57534e; width: 120px;">Name</td>
              <td style="padding: 8px 12px; color: #1c1917;">${name}</td>
            </tr>
            <tr style="background: #f5f5f4;">
              <td style="padding: 8px 12px; font-weight: bold; color: #57534e;">Email</td>
              <td style="padding: 8px 12px; color: #1c1917;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #57534e;">Business</td>
              <td style="padding: 8px 12px; color: #1c1917;">${business || "Not provided"}</td>
            </tr>
            <tr style="background: #f5f5f4;">
              <td style="padding: 8px 12px; font-weight: bold; color: #57534e;">Reason</td>
              <td style="padding: 8px 12px; color: #1c1917;">${reason}</td>
            </tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f5f5f4; border-radius: 8px; border-left: 4px solid #46845d;">
            <p style="margin: 0; font-weight: bold; color: #57534e; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
            <p style="margin-top: 8px; color: #1c1917; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #a8a29e;">
            Submitted from poconossrt.com/contact at ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}
          </p>
        </div>
      `;

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Poconos STR Directory <contact@poconossrt.com>",
          to: ["contact@poconossrt.com"],
          reply_to: email,
          subject,
          html: htmlBody,
        }),
      });

      if (!emailResponse.ok) {
        const err = await emailResponse.text();
        console.error("Resend error:", err);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
      }
    } else {
      console.log("Contact form submission (no RESEND_API_KEY configured):", {
        name, email, business, reason, message: message.substring(0, 100),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
