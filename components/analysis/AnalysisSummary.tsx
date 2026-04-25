"use client";

import { Languages, Volume2 } from "lucide-react";

export function AnalysisSummary({
  note,
  hausaNote,
  style,
  onSpeak
}: {
  note: string;
  hausaNote?: string;
  style: {
    secondary: string;
    border: string;
    text: string;
  };
  onSpeak: (text: string, lang: string) => void;
}) {
  return (
    <div
      style={{
        backgroundColor: style.secondary,
        border: `1px solid ${style.border}`,
        borderRadius: 16,
        padding: 24,
        height: "100%"
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Languages size={18} color={style.text} />
        <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: style.text }}>AI Analysis Summary</h4>
      </div>
      
      <p
        style={{
          fontSize: 15,
          color: style.text,
          margin: 0,
          lineHeight: 1.6,
          fontWeight: 500
        }}
      >
        {note}
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button
          onClick={() => onSpeak(note, "en-US")}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: "12px",
            borderRadius: 12,
            border: "none",
            background: "#0f172a",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0f172a')}
        >
          <Volume2 size={16} /> Listen English
        </button>

        <button
          onClick={() => onSpeak(hausaNote || note, "ha-NG")}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: "12px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.1)",
            background: "#f1f5f9",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
        >
          <Languages size={16} /> Saurara (Hausa)
        </button>
      </div>
    </div>
  );
}
