"use client";

import {
  CircleCheck as CheckCircle2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

type Metric = {
  label: string;
  value: string | number;
  status: "low" | "optimal" | "high";
  recommendation: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  soilType?: string | null;
  metrics?: Metric[] | null;
  note: string;
  overallScore?: number | null; // ✅ ADD
};

const statusConfig = {
  low: {
    color: "#dc2626",
    bg: "rgba(220,38,38,0.08)",
    border: "rgba(220,38,38,0.2)",
    icon: TrendingDown,
    label: "Low",
  },
  optimal: {
    color: "#16a34a",
    bg: "rgba(22,163,74,0.08)",
    border: "rgba(22,163,74,0.2)",
    icon: CheckCircle2,
    label: "Optimal",
  },
  high: {
    color: "#d97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.2)",
    icon: TrendingUp,
    label: "High",
  },
};

export default function SoilResultModal({
  open,
  onClose,
  soilType,
  metrics,
  note,
}: Props) {
  if (!open) return null;

  const speak = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          backgroundColor: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          animation: "scaleIn 0.25s ease",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background: "linear-gradient(135deg, #0d9488 0%, #34d399 100%)",
            padding: "22px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <CheckCircle2 size={22} color="#fff" />
          <div>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "1px",
                margin: 0,
              }}
            >
              ANALYSIS RESULT
            </p>
            <h3
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: 800,
                margin: "4px 0 0",
                textTransform: "capitalize",
              }}
            >
              {soilType || "Soil Analysis"}
            </h3>
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding: "22px 24px" }}>
          {/* NOTE */}
          <div
            style={{
              backgroundColor: "rgba(13,148,136,0.06)",
              border: "1px solid rgba(13,148,136,0.15)",
              borderRadius: 12,
              padding: 14,
              marginBottom: 18,
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: "#0f3d38",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {note}
            </p>
          </div>

          {/* METRICS (OPTIONAL) */}
          {metrics && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 18,
              }}
            >
              {metrics.map((metric) => {
                const cfg = statusConfig[metric.status];
                const Icon = cfg.icon;

                return (
                  <div
                    key={metric.label}
                    style={{
                      border: `1px solid ${cfg.border}`,
                      borderRadius: 12,
                      padding: "12px 14px",
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        backgroundColor: cfg.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={14} color={cfg.color} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 700 }}>
                          {metric.label}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: cfg.color,
                          }}
                        >
                          {metric.value}
                        </span>
                      </div>

                      <p style={{ fontSize: 12, color: "#4b7a75", margin: 0 }}>
                        {metric.recommendation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ACTIONS */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => speak(note, "en-US")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 10,
                border: "none",
                background: "#0f172a",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🔊 English
            </button>

            <button
              onClick={() => speak(note, "ha-NG")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.1)",
                background: "#f1f5f9",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🔊 Hausa
            </button>
          </div>

          {/* CLOSE */}
          <button
            onClick={onClose}
            style={{
              marginTop: 14,
              width: "100%",
              padding: "10px",
              borderRadius: 10,
              border: "none",
              background: "#ef4444",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* animation */}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
