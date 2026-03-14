import { C, TODAY } from "../lib/constants";
import { Card } from "../components/ui";

export const StaffView = ({ appointments, groomers }) => (
  <div>
    <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700 }}>Staff</h1><p style={{ color: C.textMuted, marginTop: 4 }}>Your grooming team</p></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
      {groomers.map(g => { const gA = appointments.filter(a => a.groomer.id === g.id); const todayG = gA.filter(a => a.date.toDateString() === TODAY.toDateString()); const revG = gA.filter(a => a.status === "completed").reduce((s, a) => s + a.service.price, 0); return (
        <Card key={g.id} className="fade-up">
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}><div style={{ width: 60, height: 60, borderRadius: "50%", background: `${g.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{g.avatar}</div><div><h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700 }}>{g.name}</h3><div style={{ fontSize: 12, color: C.textMuted }}>Specialties: {g.specialties.join(", ")}</div></div></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            <div style={{ textAlign: "center", padding: 10, background: C.bg, borderRadius: 10 }}><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Fraunces', serif", color: g.color }}>{todayG.length}</div><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>TODAY</div></div>
            <div style={{ textAlign: "center", padding: 10, background: C.bg, borderRadius: 10 }}><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>{gA.length}</div><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>TOTAL</div></div>
            <div style={{ textAlign: "center", padding: 10, background: C.bg, borderRadius: 10 }}><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Fraunces', serif", color: C.teal }}>€{revG}</div><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>REVENUE</div></div></div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>Working Hours</div>
          <div style={{ display: "flex", gap: 4 }}>{["Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (<div key={d} style={{ flex: 1, textAlign: "center", padding: "6px 0", background: C.tealLight, borderRadius: 6, fontSize: 10, fontWeight: 600, color: C.teal }}>{d}</div>))}<div style={{ flex: 1, textAlign: "center", padding: "6px 0", background: C.border, borderRadius: 6, fontSize: 10, fontWeight: 600, color: C.textMuted }}>Sun</div></div>
        </Card>); })}</div>
  </div>
);
