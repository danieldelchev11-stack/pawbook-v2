import { C } from "../lib/constants";
import { Badge, Card } from "../components/ui";

export const ServicesView = ({ services }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}><div><h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700 }}>Services & Pricing</h1><p style={{ color: C.textMuted, marginTop: 4 }}>Manage your service catalog</p></div></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {services.map(s => (<Card key={s.id} className="fade-up" style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.06 }}>{s.icon}</div><div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
        <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>{s.name}</h3>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.accent, fontFamily: "'Fraunces', serif", margin: "8px 0" }}>€{s.price}</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 12 }}>⏱ {s.duration} min</div>
        <div style={{ fontSize: 12, color: C.textMuted }}><div style={{ fontWeight: 600, marginBottom: 4 }}>Size modifiers:</div><div style={{ display: "flex", gap: 8 }}><Badge bg={C.bg} color={C.text}>S: +€{s.sizes.small}</Badge><Badge bg={C.bg} color={C.text}>M: +€{s.sizes.medium}</Badge><Badge bg={C.bg} color={C.text}>L: +€{s.sizes.large}</Badge></div></div></Card>))}</div>
  </div>
);
