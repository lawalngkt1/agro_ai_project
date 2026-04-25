"use client";

import { CircleCheck as CheckCircle2, TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

export type MetricStatus = "low" | "optimal" | "high";

export type Metric = {
  label: string;
  value: string | number;
  status: MetricStatus;
  recommendation: string;
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

export function MetricCard({ 
  metric, 
  mutedColor 
}: { 
  metric: Metric; 
  mutedColor: string;
}) {
  const cfg = statusConfig[metric.status];
  const Icon = cfg.icon;

  return (
    <div
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

        <p style={{ fontSize: 12, color: mutedColor, margin: 0, lineHeight: 1.4 }}>
          {metric.recommendation}
        </p>
      </div>
    </div>
  );
}
