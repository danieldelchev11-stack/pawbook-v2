import { C } from "../lib/constants";

export const Badge = ({ children, bg, color, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: bg, color, whiteSpace: "nowrap", ...style }}>{children}</span>
);

export const Btn = ({ children, variant = "primary", onClick, style, disabled }) => {
  const base = { display: "inline-flex", alignItems: "center", gap: 6, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s", fontFamily: "inherit", opacity: disabled ? 0.5 : 1 };
  const v = {
    primary: { background: C.accent, color: "#fff" },
    secondary: { background: C.accentLight, color: C.accent },
    ghost: { background: "transparent", color: C.textMuted, border: `1px solid ${C.border}` },
    danger: { background: C.dangerBg, color: C.danger },
    teal: { background: C.teal, color: "#fff" },
  };
  return <button style={{ ...base, ...v[variant], ...style }} onClick={onClick} disabled={disabled}>{children}</button>;
};

export const Card = ({ children, style, className = "" }) => (
  <div className={className} style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, ...style }}>{children}</div>
);

export const Input = ({ label, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>}
    <input {...props} style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", background: C.bg, ...props.style }} />
  </div>
);

export const Select = ({ label, options, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>}
    <select {...props} style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", background: C.bg, cursor: "pointer", ...props.style }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

export const MetricCard = ({ icon, label, value, sub, accent }) => (
  <Card className="fade-up" style={{ flex: 1, minWidth: 160 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
        <div style={{ fontSize: 30, fontWeight: 700, fontFamily: "'Fraunces', serif", marginTop: 4, color: accent || C.text }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 24, padding: 8, background: C.bg, borderRadius: 12 }}>{icon}</div>
    </div>
  </Card>
);

export const LoadingScreen = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: C.bg }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🐾</div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: C.navy }}>PawBook</div>
      <div style={{ fontSize: 14, color: C.textMuted, marginTop: 8 }}>Loading your salon data...</div>
    </div>
  </div>
);
