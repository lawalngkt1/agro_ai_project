"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Message = {
  role: "user" | "bot";
  text: string;
};

const botReplies = [
  "Based on your soil data, maize would perform well in this condition 🌽",
  "Your soil pH looks optimal for legumes 🌱",
  "I recommend checking rainfall patterns before planting 🌧️",
  "This leaf image suggests early fungal infection 🐛",
  "For best yield, apply nitrogen fertilizer in split doses 🌿",
];


function getBotReply(input: string) {
  const lower = input.toLowerCase();

  if (lower.includes("crop")) return botReplies[0];
  if (lower.includes("soil")) return botReplies[1];
  if (lower.includes("rain")) return botReplies[2];
  if (lower.includes("leaf") || lower.includes("disease")) return botReplies[3];

  return botReplies[Math.floor(Math.random() * botReplies.length)];
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hello 👋 I am AgroAI Assistant. Ask me about crops, soil, or plant health.",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;

    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({
              role: m.role,
              content: m.text,
            })),
            { role: "user", content: userText },
          ],
        }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Unable to process request right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }

    {
      loading && (
        <div
          style={{
            alignSelf: "flex-start",
            background: "#fff",
            padding: "10px 12px",
            borderRadius: 12,
            fontSize: 13,
            color: "#4b7a59",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            display: "flex",
            gap: 6,
            alignItems: "center",
          }}
        >
          <span style={{ animation: "pulse 1s infinite" }}>
            AgroAI is thinking
          </span>
          <span>...</span>
        </div>
      );
    }
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
          border: "none",
          boxShadow: "0 10px 30px rgba(22,163,74,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        <MessageCircle color="#fff" size={22} />
      </button>

      {/* CHAT PANEL */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 24,
            width: 340,
            height: 480,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
            border: "1px solid rgba(22,163,74,0.15)",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
              padding: 14,
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 700 }}>AgroAI Assistant</span>

            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* MESSAGES */}
          <div
            style={{
              flex: 1,
              padding: 12,
              overflowY: "auto",
              background: "#f8fdf9",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  background: msg.role === "user" ? "#16a34a" : "#ffffff",
                  color: msg.role === "user" ? "#fff" : "#14532d",
                  padding: "10px 12px",
                  borderRadius: 12,
                  fontSize: 13,
                  maxWidth: "80%",
                  boxShadow:
                    msg.role === "user"
                      ? "0 4px 12px rgba(22,163,74,0.3)"
                      : "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div
            style={{
              display: "flex",
              padding: 10,
              borderTop: "1px solid rgba(0,0,0,0.06)",
              background: "#fff",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder={
                loading ? "Waiting for response..." : "Ask about crops, soil..."
              }
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(22,163,74,0.2)",
                outline: "none",
                fontSize: 13,
                opacity: loading ? 0.6 : 1,
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                marginLeft: 8,
                background: loading ? "#86efac" : "#16a34a",
                border: "none",
                borderRadius: 10,
                padding: "10px 12px",
                cursor: loading ? "not-allowed" : "pointer",
                color: "#fff",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
