"use client";

import { useState } from "react";
import { processSoilAnalysis } from "@/lib/analysis-rules";
import { SOIL_VALIDATION_RULES, validateField } from "@/lib/validation-rules";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SharedResultModal, {
  Metric,
  ProcessingOverlay,
} from "@/components/SharedResultModal";
import {
  FlaskConical,
  Loader as Loader2,
  CircleAlert as AlertCircle,
  CircleCheck as CheckCircle2,
  Droplets,
  ChevronLeft,
  Info,
  ChartBar as BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import Chatbot from "@/components/ChatBot";

interface SoilForm {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  ph: string;
  moisture: string;
}

const initialForm: SoilForm = {
  nitrogen: "",
  phosphorus: "",
  potassium: "",
  ph: "",
  moisture: "",
};

const fields = [
  {
    key: "nitrogen" as keyof SoilForm,
    label: "Nitrogen (N)",
    placeholder: "e.g. 90",
    unit: "mg/kg",
    icon: FlaskConical,
    hint: "Available nitrogen in soil",
    color: "#16a34a",
  },
  {
    key: "phosphorus" as keyof SoilForm,
    label: "Phosphorus (P)",
    placeholder: "e.g. 42",
    unit: "mg/kg",
    icon: FlaskConical,
    hint: "Available phosphorus",
    color: "#0d9488",
  },
  {
    key: "potassium" as keyof SoilForm,
    label: "Potassium (K)",
    placeholder: "e.g. 43",
    unit: "mg/kg",
    icon: FlaskConical,
    hint: "Available potassium",
    color: "#15803d",
  },
  {
    key: "ph" as keyof SoilForm,
    label: "pH Level",
    placeholder: "e.g. 6.5",
    unit: "pH",
    icon: BarChart3,
    hint: "Ideal range: 5.5 – 7.5",
    color: "#7c3aed",
  },
  {
    key: "moisture" as keyof SoilForm,
    label: "Moisture",
    placeholder: "e.g. 40",
    unit: "%",
    icon: Droplets,
    hint: "Volumetric water content",
    color: "#0284c7",
  },
];

interface SoilMetric {
  label: string;
  value: string | number;
  status: "low" | "optimal" | "high";
  recommendation: string;
}

function analyzeSoil(form: SoilForm): SoilMetric[] {
  const n = parseFloat(form.nitrogen);
  const p = parseFloat(form.phosphorus);
  const k = parseFloat(form.potassium);
  const ph = parseFloat(form.ph);
  const moisture = parseFloat(form.moisture);

  return [
    {
      label: "Nitrogen (N)",
      value: `${n} mg/kg`,
      status: n < 30 ? "low" : n > 120 ? "high" : "optimal",
      recommendation:
        n < 30
          ? "Apply nitrogen fertilizer or legume cover crops."
          : n > 120
            ? "Reduce nitrogen inputs to prevent leaching."
            : "Nitrogen levels are well-balanced.",
    },
    {
      label: "Phosphorus (P)",
      value: `${p} mg/kg`,
      status: p < 15 ? "low" : p > 80 ? "high" : "optimal",
      recommendation:
        p < 15
          ? "Apply phosphate fertilizer or bone meal."
          : p > 80
            ? "Avoid additional P applications this season."
            : "Phosphorus is at a healthy level.",
    },
    {
      label: "Potassium (K)",
      value: `${k} mg/kg`,
      status: k < 20 ? "low" : k > 150 ? "high" : "optimal",
      recommendation:
        k < 20
          ? "Add potash fertilizer or wood ash."
          : k > 150
            ? "Monitor potassium to avoid toxicity."
            : "Potassium is at an adequate level.",
    },
    {
      label: "pH Level",
      value: ph.toFixed(1),
      status: ph < 5.5 ? "low" : ph > 7.5 ? "high" : "optimal",
      recommendation:
        ph < 5.5
          ? "Apply agricultural lime to raise pH."
          : ph > 7.5
            ? "Add sulfur or acidifying fertilizers."
            : "pH is in the ideal range for most crops.",
    },
    {
      label: "Moisture",
      value: `${moisture}%`,
      status: moisture < 25 ? "low" : moisture > 70 ? "high" : "optimal",
      recommendation:
        moisture < 25
          ? "Irrigate and consider mulching to retain moisture."
          : moisture > 70
            ? "Improve drainage to prevent waterlogging."
            : "Moisture levels are well-suited for plant growth.",
    },
  ];
}

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

export default function SoilPage() {
  const [form, setForm] = useState<SoilForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metric[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [note, setNote] = useState("");
  const [hausaNote, setHausaNote] = useState("");
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>(
    {},
  );

  const handleChange = (key: keyof SoilForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    // Real-time validation
    const errorMsg = validateField(value, SOIL_VALIDATION_RULES[key]);
    setFieldErrors((prev) => ({ ...prev, [key]: errorMsg }));

    if (error) setError(null);
    if (apiResult || metrics) {
      setApiResult(null);
      setMetrics(null);
    }
  };

  const generateSoilNote = (result: string, metrics?: any) => {
    if (metrics) {
      const issues = metrics.filter((m: any) => m.status !== "optimal");
      if (issues.length === 0) return "Your soil is in good condition.";
      return `Improve: ${issues.map((i: any) => i.label).join(", ")}.`;
    }
    return `Detected soil type is ${result}. Manage nutrients and irrigation properly.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setApiResult(null);
    setMetrics(null);

    const values = Object.values(form);
    if (values.some((v) => v.trim() === "")) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    // Check for validation errors
    const currentErrors: Record<string, string | null> = {};
    let hasErrors = false;
    (Object.keys(form) as Array<keyof SoilForm>).forEach((key) => {
      const err = validateField(form[key], SOIL_VALIDATION_RULES[key]);
      if (err) {
        currentErrors[key] = err;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setFieldErrors(currentErrors);
      setError("Please fix the errors in the form.");
      return;
    }

    setLoading(true);

    // Simulate backend processing delay
    setTimeout(() => {
      try {
        const data = processSoilAnalysis({
          nitrogen: parseFloat(form.nitrogen),
          phosphorus: parseFloat(form.phosphorus),
          potassium: parseFloat(form.potassium),
          ph: parseFloat(form.ph),
          moisture: parseFloat(form.moisture),
        });

        setApiResult(data.title);
        setNote(data.note);
        setHausaNote(data.hausaNote);
        setMetrics(data.metrics);
        setOverallScore(data.overallScore || 0);

        setLoading(false);
        setModalOpen(true);
      } catch (err: unknown) {
        setLoading(false);
        setError(
          err instanceof Error
            ? err.message
            : "Analysis failed. Please check your inputs.",
        );
      }
    }, 1500);
  };

  const overallScoreValue = metrics
    ? Math.round(
        (metrics.filter((m) => m.status === "optimal").length /
          metrics.length) *
          100,
      )
    : null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fdf9" }}>
      <Navbar />

      <div style={{ paddingTop: 88, paddingBottom: 60 }}>
        {/* Page header */}
        <div
          style={{
            background:
              "linear-gradient(160deg, #f0fdf4 0%, #ccfbf1 60%, #f8fdf9 100%)",
            padding: "40px 24px 48px",
            borderBottom: "1px solid rgba(13,148,136,0.1)",
          }}
        >
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "#4b7a79",
                textDecoration: "none",
                marginBottom: 20,
                fontWeight: 500,
              }}
            >
              <ChevronLeft size={15} />
              Back to Home
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, #0d9488 0%, #34d399 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(13,148,136,0.28)",
                }}
              >
                <FlaskConical size={24} color="#fff" />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#0f3d38",
                    letterSpacing: "-0.6px",
                    margin: 0,
                  }}
                >
                  Soil Analysis
                </h1>
                <p
                  style={{
                    color: "#2d6b64",
                    fontSize: 14,
                    margin: 0,
                    marginTop: 4,
                  }}
                >
                  Evaluate your soil health and receive actionable improvement
                  recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ maxWidth: 800, margin: "0 auto", padding: "36px 24px 0" }}
        >
          {/* Info banner */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "14px 18px",
              borderRadius: 10,
              backgroundColor: "rgba(13,148,136,0.07)",
              border: "1px solid rgba(13,148,136,0.15)",
              marginBottom: 28,
            }}
          >
            <Info
              size={16}
              color="#0d9488"
              style={{ marginTop: 1, flexShrink: 0 }}
            />
            <p
              style={{
                fontSize: 13,
                color: "#0f6b62",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Submit your soil parameters to receive a comprehensive health
              assessment with nutrient status and targeted improvement
              recommendations.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                border: "1px solid rgba(13,148,136,0.12)",
                boxShadow: "0 4px 24px rgba(13,148,136,0.07)",
                padding: "32px",
                marginBottom: 20,
              }}
            >
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0f3d38",
                  marginBottom: 24,
                  marginTop: 0,
                }}
              >
                Soil Parameters
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 20,
                }}
              >
                {fields.map((field) => (
                  <div key={field.key}>
                    <label
                      htmlFor={field.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1a3a35",
                        marginBottom: 6,
                      }}
                    >
                      <field.icon size={13} color={field.color} />
                      {field.label}
                      <span
                        style={{
                          fontSize: 11,
                          color: "#5a9c93",
                          fontWeight: 400,
                          marginLeft: 2,
                        }}
                      >
                        ({field.unit})
                      </span>
                    </label>
                    <input
                      id={field.key}
                      type="number"
                      step="any"
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 9,
                        border: `1.5px solid ${fieldErrors[field.key] ? "#ef4444" : form[field.key] ? "rgba(13,148,136,0.35)" : "rgba(13,148,136,0.15)"}`,
                        backgroundColor: fieldErrors[field.key]
                          ? "rgba(239,68,68,0.02)"
                          : form[field.key]
                            ? "rgba(13,148,136,0.03)"
                            : "#fff",
                        fontSize: 14,
                        color: "#1a2e2c",
                        outline: "none",
                        transition: "all 0.15s ease",
                        boxSizing: "border-box",
                      }}
                    />
                    {fieldErrors[field.key] ? (
                      <p
                        style={{
                          fontSize: 11,
                          color: "#ef4444",
                          marginTop: 4,
                          margin: "4px 0 0",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <AlertCircle size={10} />
                        {fieldErrors[field.key]}
                      </p>
                    ) : (
                      <p
                        style={{
                          fontSize: 11,
                          color: "#5a9c93",
                          margin: "4px 0 0",
                        }}
                      >
                        {field.hint}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "14px 18px",
                  borderRadius: 10,
                  backgroundColor: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  marginBottom: 16,
                }}
              >
                <AlertCircle
                  size={16}
                  color="#dc2626"
                  style={{ marginTop: 1, flexShrink: 0 }}
                />
                <p
                  style={{
                    fontSize: 14,
                    color: "#dc2626",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                background: loading
                  ? "#5eead4"
                  : "linear-gradient(135deg, #0d9488 0%, #34d399 100%)",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: loading ? "none" : "0 4px 20px rgba(13,148,136,0.3)",
                transition: "all 0.2s ease",
              }}
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Analyzing Soil...
                </>
              ) : (
                <>
                  <FlaskConical size={18} />
                  Analyze Soil
                </>
              )}
            </button>
          </form>

          {/* API Result */}
          {apiResult && (
            <div
              style={{
                marginTop: 28,
                backgroundColor: "#fff",
                borderRadius: 20,
                border: "1.5px solid rgba(13,148,136,0.25)",
                boxShadow: "0 8px 32px rgba(13,148,136,0.12)",
                overflow: "hidden",
                animation: "scaleIn 0.35s ease-out",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #0d9488 0%, #34d399 100%)",
                  padding: "24px 28px",
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
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      margin: 0,
                    }}
                  >
                    Soil Classification
                  </p>
                  <h3
                    style={{
                      color: "#fff",
                      fontSize: 22,
                      fontWeight: 800,
                      margin: "4px 0 0",
                      textTransform: "capitalize",
                    }}
                  >
                    {apiResult}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Local metrics */}
          {metrics && (
            <div style={{ marginTop: 28, animation: "scaleIn 0.35s ease-out" }}>
              {/* Score card */}
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  border: "1px solid rgba(13,148,136,0.15)",
                  boxShadow: "0 4px 24px rgba(13,148,136,0.08)",
                  padding: "24px 28px",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background:
                      overallScore! >= 70
                        ? "linear-gradient(135deg, #16a34a 0%, #4ade80 100%)"
                        : overallScore! >= 40
                          ? "linear-gradient(135deg, #d97706 0%, #fbbf24 100%)"
                          : "linear-gradient(135deg, #dc2626 0%, #f87171 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 16px rgba(13,148,136,0.2)",
                  }}
                >
                  <span
                    style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}
                  >
                    {overallScore}%
                  </span>
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#0f3d38",
                      margin: 0,
                    }}
                  >
                    Soil Health Score
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#2d6b64",
                      margin: "4px 0 0",
                      lineHeight: 1.5,
                    }}
                  >
                    {overallScore! >= 80
                      ? "Excellent soil health. Maintain current practices."
                      : overallScore! >= 60
                        ? "Good soil health with minor improvements needed."
                        : overallScore! >= 40
                          ? "Moderate issues detected. Address the flagged parameters."
                          : "Multiple deficiencies detected. Immediate action recommended."}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {metrics.map((metric) => {
                  const cfg =
                    statusConfig[metric.status as keyof typeof statusConfig];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={metric.label}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: 14,
                        border: `1px solid ${cfg.border}`,
                        padding: "16px 20px",
                        display: "flex",
                        gap: 16,
                        alignItems: "flex-start",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          backgroundColor: cfg.bg,
                          border: `1px solid ${cfg.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={16} color={cfg.color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 4,
                            flexWrap: "wrap",
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#1a2e2c",
                            }}
                          >
                            {metric.label}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: cfg.color,
                              }}
                            >
                              {metric.value}
                            </span>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: cfg.color,
                                backgroundColor: cfg.bg,
                                padding: "2px 8px",
                                borderRadius: 100,
                                border: `1px solid ${cfg.border}`,
                                letterSpacing: "0.4px",
                              }}
                            >
                              {cfg.label}
                            </span>
                          </div>
                        </div>
                        <p
                          style={{
                            fontSize: 13,
                            color: "#4b7a75",
                            margin: 0,
                            lineHeight: 1.5,
                          }}
                        >
                          {metric.recommendation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        input:focus { border-color: rgba(13,148,136,0.55) !important; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }
      `}</style>

      <SharedResultModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Soil Analysis"
        resultTitle={apiResult || "Analysis Results"}
        metrics={metrics}
        note={note}
        hausaNote={hausaNote}
        overallScore={overallScore}
        type="soil"
        cropDetails={null}
      />
      <ProcessingOverlay open={loading} type="soil" />
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
