import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MOONSHOT_API_KEY}`,
      },
      body: JSON.stringify({
        model: "moonshot-v1-8k",
        messages: [
          {
            role: "system",
            content:
              "You are AgroAI Advisor, an expert agricultural assistant. You help farmers with crops, soil analysis, pest detection, and farming advice. Keep responses practical, simple, and relevant to agriculture in Africa. You can respond in English or Hausa when appropriate.",
          },
          ...messages,
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || "No response",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Chat request failed" },
      { status: 500 }
    );
  }
}