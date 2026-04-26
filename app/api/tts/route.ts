import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch("http://localhost:8000/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "TTS service failed" },
        { status: 500 },
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal bridge error" },
      { status: 500 },
    );
  }
}
