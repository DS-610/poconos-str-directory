import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const INBOUND_TOKEN = process.env.INBOUND_TOKEN;

interface InboundPayload {
  from: string;
  to: string;
  subject?: string;
  text?: string;
  messageId?: string;
  threadId?: string;
  date?: string;
}

export async function POST(request: Request) {
  // Optional shared-secret auth (set INBOUND_TOKEN in Vercel + Worker env)
  const token = request.headers.get("x-inbound-token");
  if (INBOUND_TOKEN && token !== INBOUND_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: InboundPayload;
  try {
    payload = (await request.json()) as InboundPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.from || !payload.to) {
    return NextResponse.json({ error: "Missing from/to" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("inbound_messages")
    .insert({
      from_email: payload.from.includes("<") ? payload.from.split("<")[1].split(">")[0] : payload.from,
      from_name: payload.from.includes("<") ? payload.from.split("<")[0].trim() : null,
      to_email: payload.to,
      subject: payload.subject || null,
      body_text: payload.text || null,
      message_id: payload.messageId || null,
      thread_id: payload.threadId || null,
      status: "new",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Inbound insert error:", error.message);
    return NextResponse.json({ error: "Storage failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
