"use client";

export function HealthScore({
  score,
  style
}: {
  score: number;
  style: {
    secondary: string;
    border: string;
    muted: string;
  };
}) {
  const getGradient = (s: number) => {
    if (s >= 70) return "linear-gradient(135deg, #16a34a, #4ade80)";
    if (s >= 40) return "linear-gradient(135deg, #d97706, #fbbf24)";
    return "linear-gradient(135deg, #dc2626, #f87171)";
  };

  const getMessage = (s: number) => {
    if (s >= 80) return "Your soil is in excellent condition.";
    if (s >= 60) return "Your soil is in good condition.";
    if (s >= 40) return "Moderate issues detected in soil.";
    return "Your soil requires urgent attention.";
  };

  return (
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
          background: getGradient(score),
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
        {score}%
      </div>

      <div>
        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
          Soil Health Index
        </h4>
        <p
          style={{ margin: "4px 0 0", fontSize: 14, color: style.muted, lineHeight: 1.4 }}
        >
          {getMessage(score)}
        </p>
      </div>
    </div>
  );
}
