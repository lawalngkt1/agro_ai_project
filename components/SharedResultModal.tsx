"use client";

import { useState, useEffect } from "react";
import {
  CircleCheck as CheckCircle2,
  TrendingUp,
  TrendingDown,
  Info,
  X,
  Languages,
  Volume2,
  Loader2,
  Sparkles,
  Zap,
  ShieldCheck,
  BrainCircuit
} from "lucide-react";

export type Metric = {
  label: string;
  value: string | number;
  status: "low" | "optimal" | "high";
  recommendation: string;
};

export function ProcessingOverlay({ 
  open, 
  type = 'plant' 
}: { 
  open: boolean; 
  type?: 'crop' | 'soil' | 'plant' 
}) {
  if (!open) return null;

  const style = typeStyles[type];
  
  const steps = [
    { icon: Zap, text: "Optimizing connection..." },
    { icon: BrainCircuit, text: "Running AI analysis..." },
    { icon: Sparkles, text: "Finalizing results..." },
    { icon: ShieldCheck, text: "Securing data..." }
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(255,255,255,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 300 }}>
        <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 32px' }}>
          {/* Animated gradient ring */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            padding: 4,
            background: style.gradient,
            animation: 'spin 2s linear infinite',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: '#fff',
            }} />
          </div>
          
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: typeStyles[type].text
          }}>
             <Loader2 size={40} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite' }} />
          </div>
        </div>

        <h3 style={{ 
          fontSize: 22, 
          fontWeight: 800, 
          color: style.text, 
          marginBottom: 12,
          letterSpacing: '-0.5px' 
        }}>
          Analyzing your {type}...
        </h3>
        
        <p style={{ 
          fontSize: 15, 
          color: style.muted, 
          marginBottom: 32,
          lineHeight: 1.5 
        }}>
          Our AI is processing your request. This usually takes a few seconds.
        </p>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 12,
          textAlign: 'left',
          backgroundColor: 'rgba(255,255,255,0.5)',
          padding: 20,
          borderRadius: 20,
          border: `1px solid ${style.border}`
        }}>
          {steps.map((step, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12,
              animation: `pulse 2s infinite ${i * 0.5}s`,
              opacity: 0.7
            }}>
              <div style={{ 
                width: 24, 
                height: 24, 
                borderRadius: 6, 
                backgroundColor: style.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <step.icon size={14} color={style.text} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: style.text }}>{step.text}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  resultTitle: string;
  metrics?: Metric[] | null;
  note: string;
  hausaNote?: string;
  overallScore?: number | null;
  type: 'crop' | 'soil' | 'plant';
  cropDetails?: {
    emoji: string;
    description: string;
    tip: string;
  } | null;
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

const typeStyles = {
  crop: {
    gradient: "linear-gradient(135deg, #16a34a 0%, #4ade80 100%)",
    secondary: "rgba(22,163,74,0.06)",
    border: "rgba(22,163,74,0.15)",
    text: "#0f3d38",
    muted: "#4b7a75"
  },
  soil: {
    gradient: "linear-gradient(135deg, #0d9488 0%, #34d399 100%)",
    secondary: "rgba(13,148,136,0.06)",
    border: "rgba(13,148,136,0.15)",
    text: "#0f3d38",
    muted: "#4b7a75"
  },
  plant: {
    gradient: "linear-gradient(135deg, #15803d 0%, #86efac 100%)",
    secondary: "rgba(21,128,61,0.06)",
    border: "rgba(21,128,61,0.15)",
    text: "#0f3d38",
    muted: "#4b7a75"
  }
};

export default function SharedResultModal({
  open,
  onClose,
  title,
  resultTitle,
  metrics,
  note,
  hausaNote,
  overallScore,
  type,
  cropDetails
}: Props) {
  useEffect(() => {
    if (!open) {
      speechSynthesis.cancel();
    }
    return () => {
      speechSynthesis.cancel();
    };
  }, [open]);

  if (!open) return null;

  const style = typeStyles[type];

  const speak = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const downloadReport = () => {
    let content = `AGRO AI ANALYSIS REPORT\n`;
    content += `========================\n\n`;
    content += `Type: ${title.toUpperCase()}\n`;
    content += `Result: ${resultTitle}\n\n`;
    
    if (overallScore) {
        content += `Health Index: ${overallScore}%\n\n`;
    }

    content += `AI SUMMARY:\n`;
    content += `${note}\n\n`;

    if (cropDetails) {
        content += `CROP DETAILS:\n`;
        content += `Description: ${cropDetails.description}\n`;
        content += `Expert Tip: ${cropDetails.tip}\n\n`;
    }

    if (metrics && metrics.length > 0) {
        content += `DETAILED METRICS:\n`;
        metrics.forEach(m => {
            content += `- ${m.label}: ${m.value} (${m.status.toUpperCase()})\n`;
            content += `  Recommendation: ${m.recommendation}\n`;
        });
    }

    content += `\nGenerated on: ${new Date().toLocaleString()}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AgroAI_${type}_Report_${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720, // Wider for desktops
          backgroundColor: "#fff",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 25px 70px rgba(0,0,0,0.3)",
          animation: "modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.2)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div
          style={{
            background: style.gradient,
            padding: "32px 36px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <CheckCircle2 size={24} color="#fff" />
          </div>
          <div>
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "1.5px",
                margin: 0,
              }}
            >
              {title.toUpperCase()}
            </p>
            <h3
              style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: 800,
                margin: "4px 0 0",
                textTransform: "capitalize",
              }}
            >
              {resultTitle}
            </h3>
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding: "32px 36px", maxHeight: "85vh", overflowY: "auto" }}>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 28,
            marginBottom: 28
          }}>
            {/* LEFT COLUMN: AI SUMMARY & CROP DETAILS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {/* AI NOTE SECTION */}
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
                        <Languages size={18} color={typeStyles[type].text} />
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
                        onClick={() => speak(note, "en-US")}
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
                        onClick={() => speak(hausaNote || note, "ha-NG")}
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

                {/* RECOMMENDED CROP DETAILS IF CROP TYPE */}
                {type === 'crop' && cropDetails && (
                    <div style={{
                        padding: 24,
                        borderRadius: 16,
                        backgroundColor: "#f0fdf4",
                        border: "1px solid rgba(22,163,74,0.15)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 16
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 32 }}>{cropDetails.emoji}</span>
                            <div>
                                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#166534" }}>About {resultTitle}</h4>
                                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#15803d", opacity: 0.8 }}>RECOMMENDED CROP</p>
                            </div>
                        </div>
                        <p style={{ margin: 0, fontSize: 14, color: "#166534", lineHeight: 1.5 }}>
                            {cropDetails.description}
                        </p>
                        <div style={{ 
                            padding: "12px 16px", 
                            backgroundColor: "rgba(22,163,74,0.1)", 
                            borderRadius: 12,
                            borderLeft: "4px solid #22c55e"
                        }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#166534", marginBottom: 4 }}>Expert Tip:</p>
                            <p style={{ margin: 0, fontSize: 13, color: "#166534" }}>{cropDetails.tip}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN: SCORE & METRICS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {/* SCORE BOX IF SOIL */}
                {typeof overallScore === "number" && (
                    <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        padding: "20px",
                        borderRadius: 16,
                        backgroundColor: style.secondary,
                        border: `1px solid ${style.border}`,
                    }}
                    >
                    <div
                        style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background:
                            overallScore >= 70
                            ? "linear-gradient(135deg, #16a34a, #4ade80)"
                            : overallScore >= 40
                                ? "linear-gradient(135deg, #d97706, #fbbf24)"
                                : "linear-gradient(135deg, #dc2626, #f87171)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 20,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        flexShrink: 0
                        }}
                    >
                        {overallScore}%
                    </div>

                    <div>
                        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
                        Soil Health Index
                        </h4>
                        <p
                        style={{ margin: "4px 0 0", fontSize: 14, color: style.muted, lineHeight: 1.4 }}
                        >
                        {overallScore >= 80
                            ? "Your soil is in excellent condition."
                            : overallScore >= 60
                            ? "Your soil is in good condition."
                            : overallScore >= 40
                                ? "Moderate issues detected in soil."
                                : "Your soil requires urgent attention."}
                        </p>
                    </div>
                    </div>
                )}

                {/* METRICS GRID */}
                {metrics && metrics.length > 0 && (
                    <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                    >
                    <h4 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: style.muted, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Detailed Analysis
                    </h4>
                    {metrics.map((metric) => {
                        const cfg = statusConfig[metric.status];
                        const Icon = cfg.icon;

                        return (
                        <div
                            key={metric.label}
                            style={{
                            border: `1px solid ${cfg.border}`,
                            borderRadius: 16,
                            padding: "14px 16px",
                            display: "flex",
                            gap: 14,
                            alignItems: "flex-start",
                            backgroundColor: "#fff"
                            }}
                        >
                            <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                backgroundColor: cfg.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                            >
                            <Icon size={16} color={cfg.color} />
                            </div>

                            <div style={{ flex: 1 }}>
                            <div
                                style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 2,
                                }}
                            >
                                <span style={{ fontSize: 13, fontWeight: 700 }}>
                                {metric.label}
                                </span>
                                <span
                                style={{
                                    fontSize: 13,
                                    fontWeight: 800,
                                    color: cfg.color,
                                }}
                                >
                                {metric.value}
                                </span>
                            </div>

                            <p style={{ fontSize: 12, color: style.muted, margin: 0, lineHeight: 1.4 }}>
                                {metric.recommendation}
                            </p>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                )}
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: 12,
                border: "none",
                background: "#f1f5f9",
                color: "#475569",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 15,
                transition: 'all 0.2s'
              }}
            >
              Dismiss
            </button>
            <button
              onClick={downloadReport}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: 12,
                border: "none",
                background: style.gradient,
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 15,
                boxShadow: `0 4px 12px ${style.border}`,
                transition: 'all 0.2s'
              }}
            >
              Download Report (.txt)
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
