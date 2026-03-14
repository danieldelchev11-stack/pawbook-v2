import { useState } from "react";
import { C } from "../lib/constants";
import { Badge, Card } from "../components/ui";

export const ClientsView = ({ pets }) => {
  const [selected, setSelected] = useState(null);
  const pet = selected !== null ? pets[selected] : null;

  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700 }}>Clients & Pets</h1><p style={{ color: C.textMuted, marginTop: 4 }}>Your CRM — {pets.length} pets registered</p></div>
      <div style={{ display: "grid", gridTemplateColumns: selected !== null ? "1fr 1.2fr" : "1fr", gap: 16 }}>
        <Card><div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {pets.map((p, i) => (<button key={p.id} onClick={() => setSelected(i)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 12, textAlign: "left", border: selected === i ? `2px solid ${C.accent}` : "1px solid transparent", background: selected === i ? C.accentLight : "transparent", cursor: "pointer", fontFamily: "inherit" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{p.type === "Dog" ? "🐕" : "🐈"}</div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div><div style={{ fontSize: 12, color: C.textMuted }}>{p.breed} · {p.owner}</div></div>
            <Badge bg={p.vaccination === "Up to date" ? C.successBg : C.warningBg} color={p.vaccination === "Up to date" ? C.success : C.warning} style={{ fontSize: 10 }}>{p.vaccination === "Up to date" ? "✓ Vacc" : "⚠ Vacc"}</Badge></button>))}</div></Card>
        {pet && (<Card className="slide-in">
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{pet.type === "Dog" ? "🐕" : "🐈"}</div>
            <div><h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700 }}>{pet.name}</h2><div style={{ fontSize: 13, color: C.textMuted }}>{pet.breed} · {pet.type} · {pet.size} · {pet.weight} · {pet.age}</div></div></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[{ label: "Owner", value: pet.owner, icon: "👤" }, { label: "Phone", value: pet.ownerPhone, icon: "📞" }, { label: "Email", value: pet.ownerEmail, icon: "✉️" }, { label: "Vaccination", value: pet.vaccination, icon: "💉" }].map(f => (
              <div key={f.label} style={{ padding: "10px 14px", background: C.bg, borderRadius: 10 }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>{f.icon} {f.label}</div><div style={{ fontSize: 13, fontWeight: 500 }}>{f.value}</div></div>))}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[{ label: "Allergies", value: pet.allergies, bg: pet.allergies !== "None" ? C.dangerBg : C.bg, color: pet.allergies !== "None" ? C.danger : C.text }, { label: "Behavior", value: pet.behavior, bg: C.bg }, { label: "Grooming Notes", value: pet.notes, bg: C.warningBg }].map(n => (
              <div key={n.label} style={{ padding: "12px 16px", background: n.bg || C.bg, borderRadius: 10, color: n.color }}><div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2, opacity: 0.7 }}>{n.label}</div><div style={{ fontSize: 14 }}>{n.value}</div></div>))}</div></Card>)}
      </div>
    </div>
  );
};
