import { useState } from "react";
import { C, STATUS_MAP, TODAY, genDate } from "../lib/constants";
import { Badge, Btn, Card } from "../components/ui";

export const CalendarView = ({ appointments, groomers, onStatusChange, onNav }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const days = Array.from({ length: 7 }, (_, i) => genDate(i - 2));
  const dayAppts = appointments.filter(a => a.date.toDateString() === days[selectedDay].toDateString());
  const hours = Array.from({ length: 11 }, (_, i) => `${(i + 8).toString().padStart(2, "0")}:00`);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div><h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700 }}>Calendar</h1><p style={{ color: C.textMuted, marginTop: 4 }}>Manage your daily appointments</p></div>
        <Btn onClick={() => onNav("booking")}>➕ New Booking</Btn>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {days.map((d, i) => { const count = appointments.filter(a => a.date.toDateString() === d.toDateString()).length; const isT = d.toDateString() === TODAY.toDateString(); return (
          <button key={i} onClick={() => setSelectedDay(i)} style={{ flex: 1, padding: "14px 8px", borderRadius: 14, border: selectedDay === i ? `2px solid ${C.accent}` : `1px solid ${C.border}`, background: selectedDay === i ? C.accentLight : C.card, cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{d.toLocaleDateString("en", { weekday: "short" })}</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Fraunces', serif", margin: "4px 0", color: isT ? C.accent : C.text }}>{d.getDate()}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{count} appt{count !== 1 ? "s" : ""}</div>
          </button>); })}
      </div>
      <Card>
        <div style={{ display: "flex", gap: 16, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
          {groomers.map(g => (<div key={g.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: g.color }} /><span style={{ fontWeight: 600 }}>{g.avatar} {g.name}</span></div>))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {hours.map(h => { const slotAppts = dayAppts.filter(a => a.time.startsWith(h.slice(0, 2))); return (
            <div key={h} style={{ display: "flex", minHeight: 56, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 64, fontSize: 12, color: C.textMuted, fontWeight: 600, paddingTop: 8, flexShrink: 0 }}>{h}</div>
              <div style={{ flex: 1, display: "flex", gap: 8, padding: "4px 0", flexWrap: "wrap" }}>
                {slotAppts.map(a => { const st = STATUS_MAP[a.status]; return (
                  <div key={a.id} className="scale-in" style={{ padding: "8px 14px", borderRadius: 10, background: `${a.groomer.color}12`, borderLeft: `3px solid ${a.groomer.color}`, flex: "1 1 200px", maxWidth: 320 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontWeight: 600, fontSize: 14 }}>{a.pet.name}</span><Badge bg={st.bg} color={st.color} style={{ fontSize: 11 }}>{st.label}</Badge></div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{a.service.icon} {a.service.name} · {a.service.duration}min · {a.groomer.name}</div>
                    {a.status === "booked" && (<div style={{ display: "flex", gap: 6, marginTop: 8 }}><Btn variant="teal" style={{ padding: "4px 10px", fontSize: 12, borderRadius: 8 }} onClick={() => onStatusChange(a.id, "in-progress")}>Start</Btn><Btn variant="danger" style={{ padding: "4px 10px", fontSize: 12, borderRadius: 8 }} onClick={() => onStatusChange(a.id, "no-show")}>No Show</Btn></div>)}
                    {a.status === "in-progress" && (<div style={{ marginTop: 8 }}><Btn variant="teal" style={{ padding: "4px 10px", fontSize: 12, borderRadius: 8 }} onClick={() => onStatusChange(a.id, "completed")}>✓ Complete</Btn></div>)}
                  </div>); })}
              </div>
            </div>); })}
        </div>
      </Card>
    </div>
  );
};
