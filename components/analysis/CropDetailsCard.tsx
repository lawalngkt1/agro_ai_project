"use client";

export function CropDetailsCard({
  resultTitle,
  cropDetails
}: {
  resultTitle: string;
  cropDetails: {
    emoji: string;
    description: string;
    tip: string;
  };
}) {
  return (
    <div style={{
        padding: 24,
        borderRadius: 16,
        backgroundColor: "#f0fdf4",
        border: "1px solid rgba(22,163,74,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: 16
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>{cropDetails.emoji}</span>
            <div>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#166534" }}>About {resultTitle}</h4>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#15803d", opacity: 0.8 }}>RECOMMENDED CROP</p>
            </div>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: "#166534", lineHeight: 1.5 }}>
            {cropDetails.description}
        </p>
        <div style={{ 
            padding: "12px 16px", 
            backgroundColor: "rgba(22,163,74,0.1)", 
            borderRadius: 12,
            borderLeft: "4px solid #22c55e"
        }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#166534", marginBottom: 4 }}>Expert Tip:</p>
            <p style={{ margin: 0, fontSize: 13, color: "#166534" }}>{cropDetails.tip}</p>
        </div>
    </div>
  );
}
