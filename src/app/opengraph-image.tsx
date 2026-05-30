import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NAVICO - Giải pháp Thủy sản & Công nghệ Sinh học";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a3d62 0%, #1e6fa8 50%, #0d5c8c 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative circles */}
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            top: "-100px",
            right: "-100px",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            bottom: "-80px",
            left: "-80px",
            display: "flex",
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "16px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "48px",
                fontWeight: "900",
                color: "#0a3d62",
                letterSpacing: "-2px",
              }}
            >
              NAVICO
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <p
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#ffffff",
              textAlign: "center",
              margin: "0",
              padding: "0 60px",
              lineHeight: "1.3",
            }}
          >
            Giải pháp Thủy sản & Công nghệ Sinh học
          </p>
          <p
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.8)",
              textAlign: "center",
              margin: "0",
              padding: "0 80px",
            }}
          >
            Men vi sinh · Dinh dưỡng · Khoáng chất · Xử lý nước ao nuôi
          </p>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "6px",
            background: "linear-gradient(90deg, #00b4d8, #90e0ef, #00b4d8)",
            display: "flex",
          }}
        />

        {/* Website URL */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            right: "40px",
            display: "flex",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px" }}>
            navico.vn
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
