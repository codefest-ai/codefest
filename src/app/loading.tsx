export default function Loading() {
  return (
    <div className="sp-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "var(--sp-mono)",
          fontSize: "11px",
          color: "var(--sp-dim)",
          letterSpacing: "0.08em",
          animation: "pulse 1.5s ease-in-out infinite",
        }}>
          loading...
        </div>
      </div>
    </div>
  )
}
