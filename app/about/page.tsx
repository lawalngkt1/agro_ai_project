import Navbar from "@/components/Navbar";
import {
  Leaf,
  Zap,
  Globe,
  Shield,
  BarChart3,
  Brain,
  Users,
  Target,
  Sparkles,
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
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                color: "#15803d",
                backgroundColor: "rgba(22,163,74,0.1)",
                border: "1px solid rgba(22,163,74,0.2)",
              }}
            >
              <Sparkles size={12} />
              About AgroAI Advisor
            </span>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                fontWeight: 800,
                color: "#14532d",
                marginTop: 20,
                lineHeight: 1.1,
                letterSpacing: "-1px",
              }}
            >
              Building the Future of{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #16a34a 0%, #4ade80 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Intelligent Agriculture
              </span>
            </h1>

            <p
              style={{
                maxWidth: 680,
                margin: "20px auto 0",
                fontSize: 17,
                color: "#3d6b4a",
                lineHeight: 1.7,
              }}
            >
              AgroAI Advisor is an AI-powered agricultural intelligence system
              that helps farmers make smarter decisions using crop prediction,
              soil analysis, plant disease detection, and multilingual voice AI.
            </p>
          </div>
        </div>
      </section>

      {/* CORE MISSION */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                icon: Target,
                title: "Our Mission",
                desc: "To empower farmers with AI tools that increase yield, reduce uncertainty, and improve food security across Africa and beyond.",
              },
              {
                icon: Brain,
                title: "Our Vision",
                desc: "A world where every farmer has access to intelligent, real-time agricultural decision support powered by AI.",
              },
              {
                icon: Users,
                title: "Our Focus",
                desc: "Designed for real farmers — simple, accessible, multilingual, and usable even in low-resource environments.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(22,163,74,0.12)",
                  borderRadius: 18,
                  padding: 24,
                  boxShadow: "0 4px 20px rgba(21,128,61,0.06)",
                }}
              >
                <item.icon size={22} color="#16a34a" />
                <h3
                  style={{
                    marginTop: 12,
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#14532d",
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: "#4b7a59", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section
        style={{
          padding: "80px 24px",
          background: "linear-gradient(180deg, #f0fdf4 0%, #f8fdf9 100%)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: 26,
              fontWeight: 800,
              color: "#14532d",
              marginBottom: 40,
            }}
          >
            What We Do
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                icon: Leaf,
                title: "Crop Recommendation",
                desc: "AI-driven crop suggestions based on soil and climate data.",
              },
              {
                icon: BarChart3,
                title: "Soil Intelligence",
                desc: "Analyze soil nutrients and improve farming decisions.",
              },
              {
                icon: Shield,
                title: "Plant Disease Detection",
                desc: "Detect crop diseases instantly using computer vision.",
              },
              {
                icon: Globe,
                title: "Multilingual Voice AI",
                desc: "Get AI insights in Hausa and English for accessibility.",
              },
              {
                icon: Zap,
                title: "Real-Time AI",
                desc: "Fast inference models for instant agricultural decisions.",
              },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 20,
                  border: "1px solid rgba(22,163,74,0.1)",
                }}
              >
                <f.icon size={20} color="#16a34a" />
                <h3
                  style={{
                    marginTop: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#14532d",
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: "#4b7a59" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#14532d",
              marginBottom: 16,
            }}
          >
            Why AgroAI Exists
          </h2>

          <p
            style={{
              fontSize: 15,
              color: "#4b7a59",
              lineHeight: 1.7,
            }}
          >
            Agriculture still relies heavily on guesswork in many regions.
            AgroAI bridges this gap by turning agricultural data into actionable
            intelligence — helping farmers grow more with less risk.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: 40,
          borderTop: "1px solid rgba(22,163,74,0.1)",
          background: "#fff",
          textAlign: "center",
        }}
      >
        <div style={{ fontWeight: 700, color: "#14532d" }}>AgroAI Advisor</div>
        <p style={{ fontSize: 13, color: "#6b8f74", marginTop: 6 }}>
          AI-powered precision agriculture system
        </p>
      </footer>
    </div>
  );
}
