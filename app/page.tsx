import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Sprout, FlaskConical, ScanLine, ArrowRight, CircleCheck as CheckCircle2, TrendingUp, Leaf, ChartBar as BarChart3, Zap, Shield, Globe, ChevronRight } from 'lucide-react';

const features = [
  {
    href: '/crop',
    icon: Sprout,
    iconBg: 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)',
    badge: 'ML Powered',
    title: 'Crop Recommendation',
    description:
      'Enter your soil and climate parameters — N, P, K, temperature, humidity, pH, and rainfall — to receive a precision crop recommendation tailored to your field.',
    highlights: ['7-parameter analysis', 'Real-time ML inference', 'Season-aware results'],
    cta: 'Recommend a Crop',
    accentColor: '#16a34a',
  },
  {
    href: '/soil',
    icon: FlaskConical,
    iconBg: 'linear-gradient(135deg, #0d9488 0%, #34d399 100%)',
    badge: 'Deep Analysis',
    title: 'Soil Analysis',
    description:
      'Analyze your soil profile with nutrient levels, pH, and moisture data. Get actionable insights to improve soil health and maximize yield potential.',
    highlights: ['Nutrient profiling', 'pH optimization', 'Moisture assessment'],
    cta: 'Analyze Soil',
    accentColor: '#0d9488',
  },
  {
    href: '/plant',
    icon: ScanLine,
    iconBg: 'linear-gradient(135deg, #15803d 0%, #86efac 100%)',
    badge: 'Vision AI',
    title: 'Plant Disease Detection',
    description:
      'Upload a photo of your plant and our vision AI will instantly identify diseases, pests, or deficiencies — with confidence scores and treatment guidance.',
    highlights: ['Image-based diagnosis', '50+ disease classes', 'Instant results'],
    cta: 'Scan a Plant',
    accentColor: '#15803d',
  },
];

const stats = [
  { label: 'Crops Analyzed', value: '2.4M+', icon: TrendingUp },
  { label: 'Disease Classes', value: '50+', icon: ScanLine },
  { label: 'Accuracy Rate', value: '94.7%', icon: CheckCircle2 },
  { label: 'Countries Supported', value: '40+', icon: Globe },
];

const whyItems = [
  {
    icon: Zap,
    title: 'Real-Time Inference',
    desc: 'Sub-second predictions powered by optimized ML models deployed on cloud infrastructure.',
  },
  {
    icon: Shield,
    title: 'Research-Backed',
    desc: 'Models trained on peer-reviewed agricultural datasets with regular retraining cycles.',
  },
  {
    icon: BarChart3,
    title: 'Data-Driven Insights',
    desc: 'Every recommendation is traceable to input parameters so you understand the reasoning.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Farming',
    desc: 'Reduce chemical overuse by applying nutrients only where and when they are needed.',
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fdf9' }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          paddingTop: 128,
          paddingBottom: 80,
          background: 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 40%, #f8fdf9 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            left: -60,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 16px',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                color: '#15803d',
                backgroundColor: 'rgba(22,163,74,0.1)',
                border: '1px solid rgba(22,163,74,0.2)',
                letterSpacing: '0.3px',
              }}
            >
              <Zap size={12} />
              AI-Powered Agricultural Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              textAlign: 'center',
              fontSize: 'clamp(2.4rem, 6vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              color: '#14532d',
              marginBottom: 20,
              maxWidth: 760,
              margin: '0 auto 20px',
            }}
          >
            Smarter Farming Starts with{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AgroAI Advisor
            </span>
          </h1>

          <p
            style={{
              textAlign: 'center',
              fontSize: 18,
              color: '#3d6b4a',
              lineHeight: 1.7,
              maxWidth: 560,
              margin: '0 auto 40px',
            }}
          >
            AI-powered crop recommendation, soil analysis, and plant disease detection — all in one precision agriculture platform.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/crop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
                background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(21,128,61,0.32)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <Sprout size={18} />
              Start Analysis
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/plant"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                color: '#15803d',
                backgroundColor: '#fff',
                textDecoration: 'none',
                border: '1.5px solid rgba(22,163,74,0.3)',
                boxShadow: '0 2px 12px rgba(21,128,61,0.08)',
                transition: 'all 0.15s ease',
              }}
            >
              <ScanLine size={18} />
              Disease Detection
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section
        style={{
          background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
          padding: '32px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 24,
          }}
        >
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <s.icon size={22} color="rgba(255,255,255,0.7)" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#16a34a',
            }}
          >
            Core Features
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 800,
              color: '#14532d',
              marginTop: 10,
              letterSpacing: '-0.8px',
            }}
          >
            Three AI Modules, One Platform
          </h2>
          <p style={{ color: '#4b7a59', marginTop: 12, fontSize: 16, maxWidth: 480, margin: '12px auto 0' }}>
            Each module is independently powered by domain-specific ML models trained on agricultural datasets.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 28,
          }}
        >
          {features.map((f) => (
            <div
              key={f.href}
              style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                padding: 32,
                border: '1px solid rgba(22,163,74,0.1)',
                boxShadow: '0 4px 24px rgba(21,128,61,0.07)',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {/* Icon + badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: f.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 16px ${f.accentColor}30`,
                  }}
                >
                  <f.icon size={24} color="#fff" />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    color: f.accentColor,
                    backgroundColor: `${f.accentColor}14`,
                    padding: '4px 10px',
                    borderRadius: 100,
                    border: `1px solid ${f.accentColor}22`,
                  }}
                >
                  {f.badge}
                </span>
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#14532d', marginBottom: 10, letterSpacing: '-0.3px' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: '#5a7a63', lineHeight: 1.65, marginBottom: 20 }}>{f.description}</p>

              {/* Highlights */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {f.highlights.map((h) => (
                  <li key={h} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#3d6b4a' }}>
                    <CheckCircle2 size={14} color={f.accentColor} />
                    {h}
                  </li>
                ))}
              </ul>

              <Link
                href={f.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 18px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: f.accentColor,
                  backgroundColor: `${f.accentColor}10`,
                  border: `1.5px solid ${f.accentColor}22`,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  marginTop: 'auto',
                  width: 'fit-content',
                }}
              >
                {f.cta}
                <ChevronRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why AgroAI */}
      <section style={{ padding: '64px 24px', backgroundColor: '#f0fdf4' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#16a34a',
              }}
            >
              Why AgroAI
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                fontWeight: 800,
                color: '#14532d',
                marginTop: 10,
                letterSpacing: '-0.8px',
              }}
            >
              Built for Modern Agriculture
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 24,
            }}
          >
            {whyItems.map((item) => (
              <div
                key={item.title}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: 28,
                  border: '1px solid rgba(22,163,74,0.1)',
                  boxShadow: '0 2px 12px rgba(21,128,61,0.05)',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: 'rgba(22,163,74,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <item.icon size={20} color="#16a34a" />
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#14532d', marginBottom: 8 }}>{item.title}</h4>
                <p style={{ fontSize: 14, color: '#5a7a63', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '64px 24px' }}>
        <div
          style={{
            maxWidth: 800,
            margin: '0 auto',
            borderRadius: 24,
            background: 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)',
            padding: '56px 40px',
            textAlign: 'center',
            boxShadow: '0 8px 48px rgba(21,128,61,0.28)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.06)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -40,
              left: -40,
              width: 180,
              height: 180,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.04)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Leaf size={36} color="rgba(255,255,255,0.8)" style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: '#fff', marginBottom: 14, letterSpacing: '-0.6px' }}>
              Ready to optimize your harvest?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 32, lineHeight: 1.6 }}>
              Join thousands of farmers leveraging AI-driven insights to grow smarter, reduce waste, and increase yield.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/crop"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 28px',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#15803d',
                  backgroundColor: '#fff',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }}
              >
                <Sprout size={17} />
                Crop Recommendation
              </Link>
              <Link
                href="/plant"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 28px',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  textDecoration: 'none',
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <ScanLine size={17} />
                Disease Detection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(22,163,74,0.1)',
          padding: '32px 24px',
          backgroundColor: '#fff',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Leaf size={14} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, color: '#14532d', fontSize: 15 }}>AgroAI Advisor</span>
          </div>
          <p style={{ fontSize: 13, color: '#6b8f74' }}>
            &copy; {new Date().getFullYear()} AgroAI Advisor. AI-powered precision agriculture.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { href: '/crop', label: 'Crop Rec.' },
              { href: '/soil', label: 'Soil Analysis' },
              { href: '/plant', label: 'Plant Detection' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ fontSize: 13, color: '#4b7a59', textDecoration: 'none', fontWeight: 500 }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
