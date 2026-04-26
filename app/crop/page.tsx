'use client';

import { useState, useEffect } from 'react';
import { processCropAnalysis } from '@/lib/analysis-rules';
import { CROP_VALIDATION_RULES, validateField } from '@/lib/validation-rules';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SharedResultModal, { Metric, ProcessingOverlay } from '@/components/SharedResultModal';
import { Sprout, Loader as Loader2, CircleAlert as AlertCircle, CircleCheck as CheckCircle2, Thermometer, Droplets, FlaskConical, CloudRain, ChevronLeft, Info } from 'lucide-react';
import Chatbot from '@/components/ChatBot';

interface FormState {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  temperature: string;
  humidity: string;
  ph: string;
  rainfall: string;
}

const initialForm: FormState = {
  nitrogen: '',
  phosphorus: '',
  potassium: '',
  temperature: '',
  humidity: '',
  ph: '',
  rainfall: '',
};

const fields = [
  {
    key: 'nitrogen' as keyof FormState,
    label: 'Nitrogen (N)',
    placeholder: 'e.g. 90',
    unit: 'mg/kg',
    icon: FlaskConical,
    hint: 'Soil nitrogen content',
    color: '#16a34a',
  },
  {
    key: 'phosphorus' as keyof FormState,
    label: 'Phosphorus (P)',
    placeholder: 'e.g. 42',
    unit: 'mg/kg',
    icon: FlaskConical,
    hint: 'Soil phosphorus level',
    color: '#0d9488',
  },
  {
    key: 'potassium' as keyof FormState,
    label: 'Potassium (K)',
    placeholder: 'e.g. 43',
    unit: 'mg/kg',
    icon: FlaskConical,
    hint: 'Soil potassium level',
    color: '#15803d',
  },
  {
    key: 'temperature' as keyof FormState,
    label: 'Temperature',
    placeholder: 'e.g. 20.8',
    unit: '°C',
    icon: Thermometer,
    hint: 'Average temperature',
    color: '#ea580c',
  },
  {
    key: 'humidity' as keyof FormState,
    label: 'Humidity',
    placeholder: 'e.g. 82',
    unit: '%',
    icon: Droplets,
    hint: 'Relative humidity',
    color: '#0284c7',
  },
  {
    key: 'ph' as keyof FormState,
    label: 'pH Level',
    placeholder: 'e.g. 6.5',
    unit: 'pH',
    icon: FlaskConical,
    hint: '0–14 scale',
    color: '#7c3aed',
  },
  {
    key: 'rainfall' as keyof FormState,
    label: 'Rainfall',
    placeholder: 'e.g. 202',
    unit: 'mm',
    icon: CloudRain,
    hint: 'Annual rainfall',
    color: '#1d4ed8',
  },
];

const cropExamples: Record<string, { emoji: string; description: string; tip: string }> = {
  rice: { emoji: '🌾', description: 'Rice thrives in high moisture and warm conditions.', tip: 'Ensure consistent irrigation.' },
  wheat: { emoji: '🌿', description: 'Wheat grows well in cool, dry climates.', tip: 'Monitor for rust disease.' },
  maize: { emoji: '🌽', description: 'Maize requires warm temperatures and adequate rainfall.', tip: 'Space rows 75cm apart.' },
  apple: { emoji: '🍎', description: 'Apples need cold winters and moderate summers.', tip: 'Prune annually for best yield.' },
  banana: { emoji: '🍌', description: 'Bananas thrive in tropical, high-humidity climates.', tip: 'Protect from strong winds.' },
  mango: { emoji: '🥭', description: 'Mangoes prefer hot and dry conditions.', tip: 'Allow soil to dry between watering.' },
  grapes: { emoji: '🍇', description: 'Grapes excel in well-drained, sandy soil.', tip: 'Train vines for air circulation.' },
  coffee: { emoji: '☕', description: 'Coffee grows in tropical highland climates.', tip: 'Shade trees improve quality.' },
  cotton: { emoji: '🌱', description: 'Cotton requires a long frost-free growing season.', tip: 'Control bollworm early.' },
};

function getCropInfo(name: string) {
  const key = name.toLowerCase();
  return cropExamples[key] || { emoji: '🌱', description: `${name} is well-suited to your soil and climate conditions.`, tip: 'Follow local agricultural guidance.' };
}

export default function CropPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metric[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [note, setNote] = useState("");
  const [hausaNote, setHausaNote] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    
    // Real-time validation
    const errorMsg = validateField(value, CROP_VALIDATION_RULES[key]);
    setFieldErrors(prev => ({ ...prev, [key]: errorMsg }));

    if (error) setError(null);
    if (result) setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const values = Object.values(form);
    if (values.some((v) => v.trim() === '')) {
      setError('Please fill in all fields before submitting.');
      return;
    }

    // Check for validation errors
    const currentErrors: Record<string, string | null> = {};
    let hasErrors = false;
    (Object.keys(form) as Array<keyof FormState>).forEach(key => {
      const err = validateField(form[key], CROP_VALIDATION_RULES[key]);
      if (err) {
        currentErrors[key] = err;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setFieldErrors(currentErrors);
      setError('Please fix the errors in the form.');
      return;
    }

    setLoading(true);
    
    // Simulate backend processing delay
    setTimeout(() => {
      try {
        const data = processCropAnalysis({
          nitrogen: parseFloat(form.nitrogen),
          phosphorus: parseFloat(form.phosphorus),
          potassium: parseFloat(form.potassium),
          temperature: parseFloat(form.temperature),
          humidity: parseFloat(form.humidity),
          ph: parseFloat(form.ph),
          rainfall: parseFloat(form.rainfall),
        });

        setResult(data.title);
        setNote(data.note);
        setHausaNote(data.hausaNote);
        setMetrics(data.metrics);
        
        setLoading(false);
        setModalOpen(true);
      } catch (err: unknown) {
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Analysis failed. Please check your inputs.');
      }
    }, 1500);
  };

  const cropInfo = result ? getCropInfo(result) : null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fdf9' }}>
      <Navbar />

      <div style={{ paddingTop: 88, paddingBottom: 60 }}>
        {/* Page header */}
        <div
          style={{
            background: 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 60%, #f8fdf9 100%)',
            padding: '40px 24px 48px',
            borderBottom: '1px solid rgba(22,163,74,0.1)',
          }}
        >
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: '#4b7a59',
                textDecoration: 'none',
                marginBottom: 20,
                fontWeight: 500,
              }}
            >
              <ChevronLeft size={15} />
              Back to Home
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(22,163,74,0.28)',
                }}
              >
                <Sprout size={24} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#14532d', letterSpacing: '-0.6px', margin: 0 }}>
                  Crop Recommendation
                </h1>
                <p style={{ color: '#4b7a59', fontSize: 14, margin: 0, marginTop: 4 }}>
                  Enter soil and climate parameters to get your optimal crop recommendation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '36px 24px 0' }}>
          {/* Info banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '14px 18px',
              borderRadius: 10,
              backgroundColor: 'rgba(22,163,74,0.07)',
              border: '1px solid rgba(22,163,74,0.15)',
              marginBottom: 28,
            }}
          >
            <Info size={16} color="#16a34a" style={{ marginTop: 1, flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#2d6a3f', margin: 0, lineHeight: 1.5 }}>
              Our ML model analyzes 7 agronomic parameters to recommend the most suitable crop for your conditions. All fields are required.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                border: '1px solid rgba(22,163,74,0.1)',
                boxShadow: '0 4px 24px rgba(21,128,61,0.07)',
                padding: '32px',
                marginBottom: 20,
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#14532d', marginBottom: 24, marginTop: 0 }}>
                Soil &amp; Climate Parameters
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 20,
                }}
              >
                {fields.map((field) => (
                  <div key={field.key}>
                    <label
                      htmlFor={field.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#2d4a35',
                        marginBottom: 6,
                      }}
                    >
                      <field.icon size={13} color={field.color} />
                      {field.label}
                      <span style={{ fontSize: 11, color: '#7aab84', fontWeight: 400, marginLeft: 2 }}>({field.unit})</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id={field.key}
                        type="number"
                        step="any"
                        placeholder={field.placeholder}
                        value={form[field.key]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: 9,
                          border: `1.5px solid ${fieldErrors[field.key] ? '#ef4444' : (form[field.key] ? 'rgba(22,163,74,0.35)' : 'rgba(22,163,74,0.15)')}`,
                          backgroundColor: fieldErrors[field.key] ? 'rgba(239,68,68,0.02)' : (form[field.key] ? 'rgba(22,163,74,0.03)' : '#fff'),
                          fontSize: 14,
                          color: '#1a2e20',
                          outline: 'none',
                          transition: 'all 0.15s ease',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    {fieldErrors[field.key] ? (
                      <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertCircle size={10} />
                        {fieldErrors[field.key]}
                      </p>
                    ) : (
                      <p style={{ fontSize: 11, color: '#7aab84', marginTop: 4, margin: '4px 0 0' }}>{field.hint}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '14px 18px',
                  borderRadius: 10,
                  backgroundColor: 'rgba(239,68,68,0.07)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  marginBottom: 16,
                }}
              >
                <AlertCircle size={16} color="#dc2626" style={{ marginTop: 1, flexShrink: 0 }} />
                <p style={{ fontSize: 14, color: '#dc2626', margin: 0, lineHeight: 1.5 }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
                background: loading ? '#86efac' : 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: loading ? 'none' : '0 4px 20px rgba(21,128,61,0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Analyzing Parameters...
                </>
              ) : (
                <>
                  <Sprout size={18} />
                  Get Crop Recommendation
                </>
              )}
            </button>
          </form>

          {/* Result */}
          {result && cropInfo && (
            <div
              style={{
                marginTop: 28,
                backgroundColor: '#fff',
                borderRadius: 20,
                border: '1.5px solid rgba(22,163,74,0.25)',
                boxShadow: '0 8px 32px rgba(21,128,61,0.12)',
                overflow: 'hidden',
                animation: 'scaleIn 0.35s ease-out',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <CheckCircle2 size={22} color="#fff" />
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                    Recommended Crop
                  </p>
                  <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '4px 0 0', textTransform: 'capitalize', letterSpacing: '-0.3px' }}>
                    {cropInfo.emoji} {result}
                  </h3>
                </div>
              </div>
              <div style={{ padding: '20px 28px 24px' }}>
                <p style={{ fontSize: 15, color: '#2d4a35', lineHeight: 1.6, marginBottom: 12 }}>{cropInfo.description}</p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    padding: '12px 14px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(22,163,74,0.07)',
                    border: '1px solid rgba(22,163,74,0.15)',
                  }}
                >
                  <Info size={14} color="#16a34a" style={{ marginTop: 1, flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: '#2d6a3f', margin: 0, lineHeight: 1.5 }}>
                    <strong>Tip:</strong> {cropInfo.tip}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        input:focus { border-color: rgba(22,163,74,0.55) !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
      `}</style>
      <SharedResultModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Crop Recommendation"
        resultTitle={result || "Recommended Crop"}
        metrics={metrics}
        note={note}
        hausaNote={hausaNote}
        type="crop"
        cropDetails={cropInfo}
      />
      <ProcessingOverlay open={loading} type="crop" />
            {/* Chatbot */}
            <Chatbot />
    </div>
  );
}
