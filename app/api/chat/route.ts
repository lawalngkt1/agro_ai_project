import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.MOONSHOT_API_KEY) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const response = await fetch(
      "https://api.moonshot.cn/v1/chat/completions",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MOONSHOT_API_KEY}`,
        },
        body: JSON.stringify({
          model: "kimi-k2.6",
          messages: [
            {
              role: "system",
              content:
                "You are AgroAI Advisor, an expert agricultural assistant for African farming systems. Provide practical, simple, and actionable advice. You can respond in English or Hausa when appropriate.",
            },
            ...(messages || []),
          ],
          temperature: 0.7,
        }),
      },
    );

    clearTimeout(timeout);

    // 🔥 Read RAW response safely ONCE
    const rawText = await response.text();

    console.log("Moonshot Status:", response.status);
    console.log("Moonshot Raw Response:", rawText);

    // ❌ Handle HTTP errors
    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Moonshot API error",
          status: response.status,
          details: rawText,
        },
        { status: 500 },
      );
    }

    // 🧠 Safe JSON parse
    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      return NextResponse.json({
        reply: rawText || "Invalid AI response format",
      });
    }

    // 🧠 Flexible response extraction (Moonshot varies)
    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.output ||
      data?.text ||
      data?.reply ||
      "Sorry, I could not generate a response.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Chat API Error:", err);

    return NextResponse.json(
      {
        error: "Chat request failed",
        message: err?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
