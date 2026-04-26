"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello 👋 I am AgroAI Assistant. Ask me about crops, soil, or plant health.",
    },
  ]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "No response",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ AI service is currently unavailable. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
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
          boxShadow: "0 12px 30px rgba(22,163,74,0.35)",
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
            width: 360,
            height: 520,
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
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
              padding: 16,
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
              padding: 14,
              overflowY: "auto",
              background: "#f8fdf9",
              display: "flex",
              flexDirection: "column",
              gap: 12,
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
                      ? "0 6px 16px rgba(22,163,74,0.25)"
                      : "0 3px 12px rgba(0,0,0,0.06)",
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "#e2e8f0",
                  padding: "10px 12px",
                  borderRadius: 12,
                  fontSize: 13,
                  color: "#475569",
                }}
              >
                AgroAI is typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div
            style={{
              display: "flex",
              padding: 12,
              borderTop: "1px solid rgba(0,0,0,0.06)",
              background: "#fff",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
