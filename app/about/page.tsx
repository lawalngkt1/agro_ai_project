import Navbar from "@/components/Navbar";
import {
  Leaf,
  Sprout,
  Bug,
  FlaskConical,
  Brain,
  Zap,
  Globe,
  CheckCircle2,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fdf9" }}>
      <Navbar />

      {/* HERO */}
      <section
        style={{
          paddingTop: 120,
          paddingBottom: 80,
          background:
            "linear-gradient(160deg, #f0fdf4 0%, #dcfce7 40%, #f8fdf9 100%)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h1
            style={{
              fontSize: "2.6rem",
              fontWeight: 800,
              color: "#14532d",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            AgroAI Advisor
          </h1>

          <p
            style={{
              textAlign: "center",
              marginTop: 16,
              fontSize: 16,
              color: "#3d6b4a",
              lineHeight: 1.7,
              maxWidth: 720,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            An AI-powered smart farming system that helps farmers make better
            decisions using data, machine learning, and real-time agricultural
            intelligence.
          </p>
        </div>
      </section>

      {/* WHAT IT IS */}
      <section style={{ padding: "70px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#14532d",
              marginBottom: 20,
            }}
          >
            🌱 What AgroAI Advisor is
          </h2>

          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 22,
              border: "1px solid rgba(22,163,74,0.12)",
              boxShadow: "0 4px 18px rgba(21,128,61,0.05)",
              color: "#4b7a59",
              lineHeight: 1.7,
              fontSize: 14,
            }}
          >
            AgroAI Advisor is a digital agricultural intelligence platform that
            helps farmers:
            <ul>
              <li>Recommend the best crops to grow</li>
              <li>Detect and manage pests and diseases</li>
              <li>Analyze soil health and nutrients</li>
            </ul>
            It combines artificial intelligence, sensors, and real-time data
            sources to deliver accurate farming insights.
          </div>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section style={{ padding: "60px 24px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              icon: Sprout,
              title: "Crop Advisory",
              desc: "Recommends best crops based on soil type, weather, and historical data.",
              points: [
                "Best crops for land",
                "Expected yield prediction",
                "Fertilizer recommendations",
              ],
              color: "#16a34a",
            },
            {
              icon: Bug,
              title: "Pest & Disease Detection",
              desc: "Detects plant diseases and pests using AI vision models.",
              points: [
                "Leaf image diagnosis",
                "Early pest detection",
                "Instant treatment advice",
              ],
              color: "#15803d",
            },
            {
              icon: FlaskConical,
              title: "Soil Analysis",
              desc: "Analyzes soil health using NPK, moisture, and pH data.",
              points: [
                "Soil fertility status",
                "Fertilizer dosage",
                "Irrigation guidance",
              ],
              color: "#0d9488",
            },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 20,
                border: "1px solid rgba(22,163,74,0.12)",
                boxShadow: "0 4px 18px rgba(21,128,61,0.05)",
              }}
            >
              <f.icon size={20} color={f.color} />
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#14532d",
                  marginTop: 10,
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: "#4b7a59" }}>{f.desc}</p>

              <ul style={{ marginTop: 10, paddingLeft: 16 }}>
                {f.points.map((p) => (
                  <li
                    key={p}
                    style={{
                      fontSize: 13,
                      color: "#3d6b4a",
                      marginBottom: 4,
                    }}
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "70px 24px", background: "#f0fdf4" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#14532d",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            🤖 How It Works
          </h2>

          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              border: "1px solid rgba(22,163,74,0.12)",
              lineHeight: 1.7,
              color: "#4b7a59",
            }}
          >
            <ol>
              <li>Farmer inputs data (image, soil test, or location)</li>
              <li>AI analyzes thousands of agricultural data points</li>
              <li>System generates crop, pest, and soil recommendations</li>
              <li>Optional chatbot provides instant agronomy advice</li>
            </ol>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section style={{ padding: "70px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: 22,
              fontWeight: 800,
              color: "#14532d",
              marginBottom: 30,
            }}
          >
            🎯 Key Benefits
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {[
              "Increases crop yield",
              "Reduces fertilizer waste",
              "Early pest detection",
              "Data-driven decisions",
              "Lower farming costs",
              "Improved food security",
            ].map((b) => (
              <div
                key={b}
                style={{
                  background: "#fff",
                  padding: 16,
                  borderRadius: 12,
                  border: "1px solid rgba(22,163,74,0.12)",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <CheckCircle2 size={16} color="#16a34a" />
                <span style={{ fontSize: 13, color: "#3d6b4a" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ color: "#14532d", fontWeight: 800 }}>
            🧠 Simple Summary
          </h2>
          <p
            style={{
              marginTop: 12,
              color: "#4b7a59",
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            AgroAI Advisor is a digital farming assistant that tells you what to
            plant, detects what is wrong with your crops, and guides you on how
            to improve soil and increase yield.
          </p>
        </div>
      </section>
    </div>
  );
}
