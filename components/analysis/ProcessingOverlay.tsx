"use client";

import { Zap, BrainCircuit, Sparkles, ShieldCheck, Loader2 } from "lucide-react";

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
