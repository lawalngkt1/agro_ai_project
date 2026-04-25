"use client";

import { useState, useEffect } from "react";
import {
  CircleCheck as CheckCircle2,
  X
} from "lucide-react";
import { Metric, MetricCard } from "./analysis/MetricCard";
import { AnalysisSummary } from "./analysis/AnalysisSummary";
import { HealthScore } from "./analysis/HealthScore";
import { CropDetailsCard } from "./analysis/CropDetailsCard";

export { ProcessingOverlay } from "./analysis/ProcessingOverlay";
export type { Metric };

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
          maxWidth: 720,
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
                <AnalysisSummary 
                  note={note} 
                  hausaNote={hausaNote} 
                  style={style} 
                  onSpeak={speak} 
                />

                {type === 'crop' && cropDetails && (
                  <CropDetailsCard 
                    resultTitle={resultTitle} 
                    cropDetails={cropDetails} 
                  />
                )}
            </div>

            {/* RIGHT COLUMN: SCORE & METRICS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {typeof overallScore === "number" && (
                    <HealthScore score={overallScore} style={style} />
                )}

                {metrics && metrics.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <h4 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: style.muted, textTransform: 'uppercase', letterSpacing: '1px' }}>
                          Detailed Analysis
                      </h4>
                      {metrics.map((metric) => (
                        <MetricCard 
                          key={metric.label} 
                          metric={metric} 
                          mutedColor={style.muted} 
                        />
                      ))}
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
