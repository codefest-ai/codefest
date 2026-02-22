export const metadata = {
  title: "Coming Soon — Codefest.ai",
  description: "Codefest.ai is under construction. Check back soon.",
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "var(--sp-bg, #0a0a0a)",
        color: "var(--sp-text, #f9fafb)",
        fontFamily: "var(--sp-mono, monospace)",
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "var(--sp-brand, #a3e635)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2.5rem",
        }}
      >
        <span style={{ fontSize: "20px", color: "#000", fontWeight: 800 }}>C</span>
      </div>

      <h1
        style={{
          fontSize: "13px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--sp-brand, #a3e635)",
          marginBottom: "1.25rem",
          fontWeight: 600,
        }}
      >
        codefest.ai
      </h1>

      <p
        style={{
          fontSize: "26px",
          fontWeight: 700,
          fontFamily: "var(--font-geist-sans, sans-serif)",
          letterSpacing: "-0.03em",
          marginBottom: "1rem",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        We&apos;re putting the finishing touches on.
      </p>

      <p
        style={{
          fontSize: "14px",
          color: "var(--sp-muted, #9ca3af)",
          marginBottom: "2.5rem",
          textAlign: "center",
          maxWidth: "380px",
          lineHeight: 1.7,
          fontFamily: "var(--font-geist-sans, sans-serif)",
        }}
      >
        The hackathon resource layer is almost ready.
        Check back soon — or follow along at{" "}
        <a
          href="https://x.com/codefestai"
          style={{ color: "var(--sp-brand, #a3e635)", textDecoration: "none" }}
        >
          @codefestai
        </a>
        .
      </p>

      <div
        style={{
          display: "flex",
          gap: "6px",
          alignItems: "center",
          fontSize: "10px",
          color: "var(--sp-dim, #6b7280)",
          letterSpacing: "0.1em",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#a3e635",
            boxShadow: "0 0 8px #a3e635",
            display: "inline-block",
            animation: "pulse 2s infinite",
          }}
        />
        BUILDING
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
