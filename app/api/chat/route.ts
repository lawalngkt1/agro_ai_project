import { NextResponse } from "next/server";
import { moonshot } from "@/lib/moonshot";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const completion = await moonshot.chat.completions.create({
      model: "kimi-k2.6",
      messages: [
        {
          role: "system",
          content:
            "You are AgroAI Advisor, an expert agricultural assistant for African farming. Provide simple, practical farming advice. You can respond in English or Hausa.",
        },
        ...(messages || []),
      ],
      temperature: 0.7,
    });

    const reply =
      completion.choices?.[0]?.message?.content || "No response from AI";

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Moonshot error:", err);

    return NextResponse.json(
      {
        error: "Chat failed",
        message: err.message,
      },
      { status: 500 },
    );
  }
}
