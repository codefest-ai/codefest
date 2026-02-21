import Link from "next/link"

export default function NotFound() {
  return (
    <div className="sp-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", maxWidth: "400px", padding: "2rem" }}>
        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px" }}>
          404
        </div>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "8px" }}>
          Nothing here.
        </h1>
        <p style={{ fontSize: "13px", color: "var(--sp-muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          This page doesn&apos;t exist — or it moved. Check the URL or head back to the library.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <Link
            href="/library"
            style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "8px 18px", background: "var(--sp-brand)", color: "#000", borderRadius: "7px", fontWeight: 700, textDecoration: "none" }}
          >
            browse library
          </Link>
          <Link
            href="/"
            style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "8px 18px", background: "var(--sp-surface2)", border: "1px solid var(--sp-border)", borderRadius: "7px", color: "var(--sp-dim)", textDecoration: "none" }}
          >
            ← home
          </Link>
        </div>
      </div>
    </div>
  )
}
