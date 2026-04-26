"use client";

import { useState, useRef, useCallback } from "react";
import { API_BASE_URL } from "@/lib/api-config";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SharedResultModal, {
  Metric,
  ProcessingOverlay,
} from "@/components/SharedResultModal";
import {
  ScanLine,
  Loader as Loader2,
  CircleAlert as AlertCircle,
  CircleCheck as CheckCircle2,
  ChevronLeft,
  Info,
  Upload,
  X,
  Image as ImageIcon,
  TriangleAlert as AlertTriangle,
  Leaf,
  Shield,
} from "lucide-react";
import Chatbot from "@/components/ChatBot";

interface DetectionResult {
  name: string;
  scientificName?: string;
  family?: string;
  confidence?: number;
  type: "healthy" | "disease" | "unknown";
  description?: string;
  treatment?: string;
  commonNames?: string[];
}

export default function PlantPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMetrics, setModalMetrics] = useState<Metric[] | null>(null);
  const [note, setNote] = useState("");
  const [hausaNote, setHausaNote] = useState("");
  const [predictionTitle, setPredictionTitle] = useState("");

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be under 10MB.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select an image before uploading.");
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("images", selectedFile);
      formData.append("organs", "leaf");

      const response = await fetch("/api/plant/identify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      const bestMatch = data.results?.[0];

      if (!bestMatch) {
        throw new Error("No plant matches found. Please try another image.");
      }

      const species = bestMatch.species;
      const scientificName = species?.scientificNameWithoutAuthor || "Unknown";
      const commonNames = species?.commonNames || [];
      const family = species?.family?.scientificNameWithoutAuthor || "Unknown";
      const confidence = Math.round(bestMatch.score * 100);
      const mainCommonName =
        commonNames.length > 0 ? commonNames[0] : scientificName;

      // Extract more details if available (PlantNet might not provide description/treatment directly)
      const genus = species?.genus?.scientificNameWithoutAuthor || "";

      const detectionResult: DetectionResult = {
        name: mainCommonName,
        scientificName,
        family,
        confidence: bestMatch.score, // keeping raw for the inline display if needed
        type: "healthy",
        commonNames,
        description: `Identified as ${mainCommonName} (${scientificName}) from the ${family} family. Genus: ${genus}.`,
        treatment:
          "This identification is based on visual similarity from the PlantNet database. For accurate disease diagnosis, please consult a specialist if the plant shows signs of distress.",
      };

      const metrics: Metric[] = [
        {
          label: "Scientific Name",
          value: scientificName,
          status: "optimal",
          recommendation: `Family: ${family}`,
        },
        {
          label: "Confidence",
          value: `${confidence}%`,
          status: confidence > 70 ? "optimal" : confidence > 40 ? "low" : "low",
          recommendation:
            confidence > 70
              ? "High identification certainty."
              : "Low certainty, consider a better photo.",
        },
      ];

      setResult(detectionResult);
      setPredictionTitle(mainCommonName);
      setModalMetrics(metrics);

      const summary = `Species: ${mainCommonName} (${scientificName}). Family: ${family}. Confidence: ${confidence}%. Common names: ${commonNames.join(", ")}.`;
      setNote(summary);

      const hausaSummary = `Wannan shuka ita ce ${mainCommonName}. Sunan kimiyya: ${scientificName}. Tana cikin iyalin ${family}. Tabbacinmu kashi ${confidence}% ne.`;
      setHausaNote(hausaSummary);

      // Stop loading before opening modal for cleaner transition
      setLoading(false);
      setModalOpen(true);
    } catch (err: unknown) {
      setLoading(false);
      const message = err instanceof Error ? err.message : "Unknown error";
      if (
        message.includes("fetch") ||
        message.includes("network") ||
        message.includes("Failed") ||
        message.includes("reach")
      ) {
        setError(
          "Unable to reach the server. Please check your connection or ensure the backend is running.",
        );
      } else {
        setError(message);
      }
    } finally {
      // Already handled in try/catch for cleaner modal transition
    }
  };

  const resultTypeConfig = {
    healthy: {
      gradient: "linear-gradient(135deg, #15803d 0%, #22c55e 100%)",
      icon: CheckCircle2,
      badge: "Healthy",
      badgeBg: "rgba(22,163,74,0.1)",
      badgeColor: "#15803d",
      treatmentBg: "rgba(22,163,74,0.07)",
      treatmentBorder: "rgba(22,163,74,0.15)",
      treatmentColor: "#15803d",
      treatmentText: "#2d6a3f",
    },
    disease: {
      gradient: "linear-gradient(135deg, #dc2626 0%, #f87171 100%)",
      icon: AlertTriangle,
      badge: "Disease Detected",
      badgeBg: "rgba(220,38,38,0.08)",
      badgeColor: "#dc2626",
      treatmentBg: "rgba(220,38,38,0.05)",
      treatmentBorder: "rgba(220,38,38,0.15)",
      treatmentColor: "#dc2626",
      treatmentText: "#7f1d1d",
    },
    unknown: {
      gradient: "linear-gradient(135deg, #64748b 0%, #94a3b8 100%)",
      icon: Info,
      badge: "Unknown",
      badgeBg: "rgba(100,116,139,0.08)",
      badgeColor: "#475569",
      treatmentBg: "rgba(100,116,139,0.07)",
      treatmentBorder: "rgba(100,116,139,0.2)",
      treatmentColor: "#475569",
      treatmentText: "#334155",
    },
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fdf9" }}>
      <Navbar />

      <div style={{ paddingTop: 88, paddingBottom: 60 }}>
        {/* Page header */}
        <div
          style={{
            background:
              "linear-gradient(160deg, #f0fdf4 0%, #d1fae5 60%, #f8fdf9 100%)",
            padding: "40px 24px 48px",
            borderBottom: "1px solid rgba(21,128,61,0.1)",
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
                color: "#4b7a59",
                textDecoration: "none",
                marginBottom: 20,
                fontWeight: 500,
              }}
            >
              <ChevronLeft size={15} />
              Back to Home
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, #15803d 0%, #86efac 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(21,128,61,0.28)",
                }}
              >
                <ScanLine size={24} color="#fff" />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#14532d",
                    letterSpacing: "-0.6px",
                    margin: 0,
                  }}
                >
                  Plant Disease Detection
                </h1>
                <p
                  style={{
                    color: "#4b7a59",
                    fontSize: 14,
                    margin: 0,
                    marginTop: 4,
                  }}
                >
                  Upload a photo of your plant to detect diseases with Vision
                  AI.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ maxWidth: 800, margin: "0 auto", padding: "36px 24px 0" }}
        >
          {/* Info */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "14px 18px",
              borderRadius: 10,
              backgroundColor: "rgba(21,128,61,0.07)",
              border: "1px solid rgba(21,128,61,0.15)",
              marginBottom: 28,
            }}
          >
            <Info
              size={16}
              color="#15803d"
              style={{ marginTop: 1, flexShrink: 0 }}
            />
            <p
              style={{
                fontSize: 13,
                color: "#1a4d2a",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              For best results, upload a clear, well-lit photo of the affected
              plant part (leaf, stem, or fruit). Supported formats: JPG, PNG,
              WEBP. Max size: 10MB.
            </p>
          </div>

          {/* Upload area */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              border: "1px solid rgba(21,128,61,0.1)",
              boxShadow: "0 4px 24px rgba(21,128,61,0.07)",
              padding: "28px",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#14532d",
                marginBottom: 20,
                marginTop: 0,
              }}
            >
              Upload Plant Image
            </h2>

            {/* Drop zone */}
            {!previewUrl ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? "#16a34a" : "rgba(21,128,61,0.25)"}`,
                  borderRadius: 14,
                  padding: "48px 24px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: dragOver
                    ? "rgba(22,163,74,0.05)"
                    : "rgba(240,253,244,0.6)",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: "rgba(22,163,74,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <ImageIcon size={26} color="#16a34a" />
                </div>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#14532d",
                    margin: "0 0 8px",
                  }}
                >
                  {dragOver
                    ? "Drop your image here"
                    : "Click to upload or drag & drop"}
                </p>
                <p style={{ fontSize: 13, color: "#6b8f74", margin: 0 }}>
                  JPG, PNG, WEBP — up to 10MB
                </p>
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    borderRadius: 14,
                    overflow: "hidden",
                    border: "2px solid rgba(22,163,74,0.2)",
                    maxHeight: 360,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f0f4f1",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Plant preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 360,
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
                <button
                  onClick={clearImage}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.55)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <X size={16} color="#fff" />
                </button>
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 8,
                    backgroundColor: "rgba(22,163,74,0.07)",
                    border: "1px solid rgba(22,163,74,0.15)",
                  }}
                >
                  <CheckCircle2 size={14} color="#16a34a" />
                  <span
                    style={{ fontSize: 13, color: "#2d6a3f", fontWeight: 500 }}
                  >
                    {selectedFile?.name} (
                    {((selectedFile?.size ?? 0) / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              style={{ display: "none" }}
            />

            {!previewUrl && (
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  marginTop: 16,
                  width: "100%",
                  padding: "11px",
                  borderRadius: 9,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#15803d",
                  backgroundColor: "rgba(22,163,74,0.08)",
                  border: "1.5px solid rgba(22,163,74,0.2)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.15s ease",
                }}
              >
                <Upload size={16} />
                Choose Image
              </button>
            )}
          </div>

          {/* Error */}
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

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedFile}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              background:
                loading || !selectedFile
                  ? "rgba(21,128,61,0.3)"
                  : "linear-gradient(135deg, #15803d 0%, #22c55e 100%)",
              border: "none",
              cursor: loading || !selectedFile ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              boxShadow:
                loading || !selectedFile
                  ? "none"
                  : "0 4px 20px rgba(21,128,61,0.3)",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Analyzing Image...
              </>
            ) : (
              <>
                <ScanLine size={18} />
                Detect Disease
              </>
            )}
          </button>

          {/* Result */}
          {result && (
            <div
              style={{
                marginTop: 28,
                backgroundColor: "#fff",
                borderRadius: 20,
                border: "1.5px solid rgba(21,128,61,0.15)",
                boxShadow: "0 8px 32px rgba(21,128,61,0.1)",
                overflow: "hidden",
                animation: "scaleIn 0.35s ease-out",
              }}
            >
              {(() => {
                const cfg = resultTypeConfig[result.type];
                const ResultIcon = cfg.icon;
                return (
                  <>
                    <div
                      style={{
                        background: cfg.gradient,
                        padding: "24px 28px",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          backgroundColor: "rgba(255,255,255,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <ResultIcon size={22} color="#fff" />
                      </div>
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
                          Detection Result
                        </p>
                        <h3
                          style={{
                            color: "#fff",
                            fontSize: 20,
                            fontWeight: 800,
                            margin: "4px 0 0",
                            letterSpacing: "-0.2px",
                          }}
                        >
                          {result.name}
                        </h3>
                        {result.confidence !== undefined && (
                          <p
                            style={{
                              color: "rgba(255,255,255,0.7)",
                              fontSize: 13,
                              margin: "4px 0 0",
                            }}
                          >
                            Confidence: {(result.confidence * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>
                    </div>

                    <div style={{ padding: "20px 28px 24px" }}>
                      {/* Status badge */}
                      <div style={{ marginBottom: 16 }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 12px",
                            borderRadius: 100,
                            fontSize: 12,
                            fontWeight: 700,
                            color: cfg.badgeColor,
                            backgroundColor: cfg.badgeBg,
                            letterSpacing: "0.3px",
                          }}
                        >
                          <ResultIcon size={11} />
                          {cfg.badge}
                        </span>
                      </div>

                      {result.description && (
                        <p
                          style={{
                            fontSize: 14,
                            color: "#2d4a35",
                            lineHeight: 1.65,
                            marginBottom: 16,
                          }}
                        >
                          {result.description}
                        </p>
                      )}

                      {result.treatment && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            padding: "14px 16px",
                            borderRadius: 10,
                            backgroundColor: cfg.treatmentBg,
                            border: `1px solid ${cfg.treatmentBorder}`,
                          }}
                        >
                          {result.type === "healthy" ? (
                            <Leaf
                              size={15}
                              color={cfg.treatmentColor}
                              style={{ marginTop: 1, flexShrink: 0 }}
                            />
                          ) : (
                            <Shield
                              size={15}
                              color={cfg.treatmentColor}
                              style={{ marginTop: 1, flexShrink: 0 }}
                            />
                          )}
                          <div>
                            <p
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: cfg.treatmentColor,
                                margin: "0 0 4px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {result.type === "healthy"
                                ? "Care Tip"
                                : "Treatment"}
                            </p>
                            <p
                              style={{
                                fontSize: 13,
                                color: cfg.treatmentText,
                                margin: 0,
                                lineHeight: 1.55,
                              }}
                            >
                              {result.treatment}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
      <SharedResultModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Plant Analysis"
        resultTitle={predictionTitle || "Analysis Result"}
        metrics={modalMetrics}
        note={note}
        hausaNote={hausaNote}
        type="plant"
        cropDetails={null}
      />
      <ProcessingOverlay open={loading} type="plant" />
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
