import Chatbot from "@/components/ChatBot";
import Navbar from "@/components/Navbar";
import {
  HelpCircle,
  ChevronDown,
  MessageSquare,
  Shield,
  Zap,
  Leaf,
} from "lucide-react";

const faqs = [
  {
    q: "How does AgroAI generate crop recommendations?",
    a: "We use machine learning models trained on soil nutrients (NPK), climate conditions, and historical crop yield data to recommend the most suitable crops for your environment.",
  },
  {
    q: "Is the plant disease detection accurate?",
    a: "Yes. Our vision model is trained on over 50 plant disease classes and optimized for real-world agricultural conditions, with confidence scoring for each prediction.",
  },
  {
    q: "Does AgroAI work offline?",
    a: "Some features like cached insights may work offline, but full AI processing requires an internet connection.",
  },
  {
    q: "Can I use AgroAI in local languages?",
    a: "Yes. The platform supports Hausa and English voice output for better accessibility.",
  },
  {
    q: "Is my data stored?",
    a: "We only store analysis results if you choose to save them. User privacy and data security are prioritized.",
  },
];

export default function FAQPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fdf9" }}>
      <Navbar />

      {/* HERO */}
      <section
        style={{
          paddingTop: 120,
          paddingBottom: 60,
          background:
            "linear-gradient(160deg, #f0fdf4 0%, #dcfce7 40%, #f8fdf9 100%)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <HelpCircle size={32} color="#16a34a" />
          <h1
            style={{
              fontSize: "2.4rem",
              fontWeight: 800,
              color: "#14532d",
              marginTop: 12,
            }}
          >
            Frequently Asked Questions
          </h1>
          <p style={{ color: "#4b7a59", marginTop: 10 }}>
            Everything you need to know about AgroAI Advisor
          </p>
        </div>
      </section>

      {/* FAQ LIST */}
      <section style={{ padding: "60px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {faqs.map((f) => (
              <div
                key={f.q}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(22,163,74,0.12)",
                  borderRadius: 14,
                  padding: 18,
                  boxShadow: "0 4px 16px rgba(21,128,61,0.05)",
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <ChevronDown size={16} color="#16a34a" />
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#14532d",
                      margin: 0,
                    }}
                  >
                    {f.q}
                  </h3>
                </div>
                <p style={{ marginTop: 10, fontSize: 14, color: "#4b7a59" }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <section style={{ padding: "40px 24px", textAlign: "center" }}>
        <p style={{ color: "#6b8f74", fontSize: 13 }}>
          Still need help? Visit the Help page or contact support.
        </p>
      </section>
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
