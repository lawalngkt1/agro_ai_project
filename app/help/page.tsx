import Navbar from "@/components/Navbar";
import {
  MessageSquare,
  Mail,
  Phone,
  BookOpen,
  Settings,
  Zap,
} from "lucide-react";

const helpItems = [
  {
    icon: BookOpen,
    title: "Getting Started",
    desc: "Learn how to use crop recommendation, soil analysis, and plant detection tools.",
  },
  {
    icon: Settings,
    title: "How It Works",
    desc: "Understand how AI models process your agricultural data.",
  },
  {
    icon: Zap,
    title: "Troubleshooting",
    desc: "Fix common issues like failed uploads or slow predictions.",
  },
  {
    icon: MessageSquare,
    title: "Voice Features",
    desc: "How to use Hausa and English voice responses effectively.",
  },
];

export default function HelpPage() {
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
          <MessageSquare size={32} color="#16a34a" />
          <h1
            style={{
              fontSize: "2.4rem",
              fontWeight: 800,
              color: "#14532d",
              marginTop: 12,
            }}
          >
            Help & Support
          </h1>
          <p style={{ color: "#4b7a59", marginTop: 10 }}>
            Learn how to use AgroAI effectively
          </p>
        </div>
      </section>

      {/* HELP GRID */}
      <section style={{ padding: "60px 24px" }}>
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {helpItems.map((h) => (
            <div
              key={h.title}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 20,
                border: "1px solid rgba(22,163,74,0.12)",
                boxShadow: "0 4px 18px rgba(21,128,61,0.05)",
              }}
            >
              <h.icon size={20} color="#16a34a" />
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#14532d",
                  marginTop: 10,
                }}
              >
                {h.title}
              </h3>
              <p style={{ fontSize: 13, color: "#4b7a59" }}>{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section style={{ padding: "60px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ color: "#14532d", fontWeight: 800 }}>
            Need direct support?
          </h2>

          <p style={{ color: "#4b7a59", marginTop: 8 }}>
            Reach out for technical issues, feature requests, or feedback.
          </p>

          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="mailto:support@agroai.com"
              style={{
                padding: "12px 18px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Mail size={16} />
              Email Support
            </a>

            <a
              href="#"
              style={{
                padding: "12px 18px",
                borderRadius: 10,
                background: "#fff",
                border: "1px solid rgba(22,163,74,0.3)",
                color: "#14532d",
                textDecoration: "none",
                fontWeight: 600,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Phone size={16} />
              Contact Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
