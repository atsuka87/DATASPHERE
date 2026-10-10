import { ImageResponse } from "next/og";

// Gambar pratinjau saat link website dibagikan (WhatsApp, Instagram, X, dll.)
export const alt = "DATASPHERE 2026 — Lomba & Seminar Sains Data untuk Siswa SMA/SMK se-Provinsi Lampung";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORIES = ["DataViz Challenge", "Data Quiz Battle", "Young Data Researcher"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#ffffff",
          background: "radial-gradient(circle at 82% 38%, #0077b6 0%, #03045e 45%, #01012f 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, letterSpacing: 4, color: "#90e0ef" }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#00b4d8" }} />
          IDEAS, INNOVATION, AND IMPACT
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 500, letterSpacing: -4, lineHeight: 1 }}>
            <span>DATA</span>
            {/* Satori memberi jarak antar-span; margin negatif menyatukan wordmark */}
            <span style={{ color: "#48cae4", marginLeft: -26 }}>SPHERE</span>
          </div>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 500, letterSpacing: -4, lineHeight: 1 }}>2026</div>
          <div style={{ fontSize: 32, color: "#caf0f8", marginTop: 24 }}>
            Lomba & Seminar Sains Data · SMA/SMK se-Provinsi Lampung
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: 14 }}>
            {CATEGORIES.map((c) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  fontSize: 24,
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "1px solid rgba(0,180,216,0.6)",
                  background: "rgba(5,33,102,0.8)",
                  color: "#ade8f4",
                }}
              >
                {c}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 24, color: "#ade8f4" }}>IIB Darmajaya</div>
        </div>
      </div>
    ),
    size,
  );
}
