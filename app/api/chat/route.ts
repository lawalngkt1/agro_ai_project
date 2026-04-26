import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 },
      );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AgroAI Advisor",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are AgroAI Advisor, an expert agricultural assistant for African farmers. Provide practical, simple, localized farming advice. You support crops, soil, pests, irrigation, and farming decisions. You can respond in English or Hausa when appropriate.",
            },
            ...messages,
          ],
          temperature: 0.7,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter Error:", data);
      return NextResponse.json(
        { error: "AI request failed", details: data },
        { status: 500 },
      );
    }

    const reply = data?.choices?.[0]?.message?.content;

    return NextResponse.json({
      reply: reply || "No response from AI",
    });
  } catch (err) {
    console.error("Chat API crash:", err);
    return NextResponse.json({ error: "Chat request failed" }, { status: 500 });
  }
}
