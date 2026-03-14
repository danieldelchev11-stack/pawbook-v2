import { useState } from "react";
import { C, STATUS_MAP, TODAY, genDate, fmt, fmtShort } from "../lib/constants";
import { Badge, Card, MetricCard } from "../components/ui";

export const DashboardView = ({ appointments, services, pets }) => {
  const dayOfWeek = TODAY.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekDays = Array.from({ length: 7 }, (_, i) => genDate(mondayOffset + i));
  const todayIdx = weekDays.findIndex(d => d.toDateString() === TODAY.toDateString());
  const [selectedDay, setSelectedDay] = useState(todayIdx >= 0 ? todayIdx : 0);
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekAppts = weekDays.map(d => appointments.filter(a => a.date.toDateString() === d.toDateString()));
  const weekCounts = weekAppts.map(a => a.length);
  const maxCount = Math.max(...weekCounts, 1);
  const selectedAppts = weekAppts[selectedDay] || [];
  const selectedDate = weekDays[selectedDay];
  const isToday = selectedDate.toDateString() === TODAY.toDateString();
  const noShows = appointments.filter(a => a.status === "no-show");
  const totalRevenue = appointments.filter(a => a.paid).reduce((s, a) => s + a.service.price, 0);
  const uniqueOwners = [...new Set(appointments.map(a => a.pet.owner))];
  const serviceCounts = {};
  appointments.forEach(a => { serviceCounts[a.service.name] = (serviceCounts[a.service.name] || 0) + 1; });
  const topServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700 }}>Good morning ☀️</h1>
        <p style={{ color: C.textMuted, marginTop: 4 }}>Here's your salon overview for {fmt(TODAY)}</p>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <MetricCard icon="📋" label="Today's Bookings" value={weekAppts[todayIdx >= 0 ? todayIdx : 0].length} sub={`${weekAppts[todayIdx >= 0 ? todayIdx : 0].filter(a => a.status === "completed").length} completed`} accent={C.accent} />
        <MetricCard icon="💶" label="Revenue" value={`€${totalRevenue}`} sub="from paid appointments" accent={C.teal} />
        <MetricCard icon="👥" label="Active Clients" value={uniqueOwners.length} sub={`${pets.length} pets registered`} />
        <MetricCard icon="⚠️" label="No-shows" value={noShows.length} sub={`${((noShows.length / Math.max(appointments.length, 1)) * 100).toFixed(0)}% rate`} accent={C.danger} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 24 }}>
        <Card className="fade-up">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div><div style={{ fontSize: 16, fontWeight: 700 }}>Weekly Progress</div><div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Click a day to see its bookings</div></div>
            <Badge bg={isToday ? C.accentLight : C.bg} color={isToday ? C.accent : C.textMuted} style={{ fontSize: 13, padding: "6px 14px" }}>{isToday ? "📍 Today" : fmt(selectedDate)}</Badge>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 72, marginBottom: 4 }}>
            {weekCounts.map((count, i) => {
              const isActive = i === selectedDay; const isT = i === todayIdx; const pct = Math.max((count / maxCount) * 100, 8);
              return (<button key={i} onClick={() => setSelectedDay(i)} style={{ flex: 1, height: `${pct}%`, borderRadius: "8px 8px 0 0", border: "none", cursor: "pointer", background: isActive ? C.accent : isT ? C.accentLight : `${C.accent}20`, transition: "all 0.25s ease", position: "relative", fontFamily: "inherit", transform: isActive ? "scaleY(1.04)" : "scaleY(1)", transformOrigin: "bottom", outline: isActive ? `2px solid ${C.accent}` : "none", outlineOffset: 2 }}>
                <span style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", fontSize: 12, fontWeight: 700, color: isActive ? C.accent : C.textMuted }}>{count}</span>
              </button>);
            })}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {dayLabels.map((d, i) => (<button key={d} onClick={() => setSelectedDay(i)} style={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: i === selectedDay ? 700 : 500, border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", color: i === selectedDay ? C.accent : i === todayIdx ? C.accentDark : C.textMuted, padding: "4px 0" }}>{d}{i === todayIdx && <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.accent, margin: "3px auto 0" }} />}</button>))}
          </div>
        </Card>
        <Card className="fade-up" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ marginBottom: 24 }}><div style={{ fontSize: 16, fontWeight: 700 }}>Daily Progress</div><div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{isToday ? "Today" : `${dayLabels[selectedDay]}, ${fmtShort(selectedDate)}`}</div></div>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, fontWeight: 700, fontFamily: "'Fraunces', serif", color: selectedAppts.filter(a => a.status === "completed").length === selectedAppts.length && selectedAppts.length > 0 ? C.success : C.accent }}>{selectedAppts.filter(a => a.status === "completed").length}<span style={{ fontSize: 20, color: C.textMuted, fontWeight: 400 }}> / {selectedAppts.length}</span></div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>bookings completed</div>
          </div>
          <div style={{ height: 10, background: C.bg, borderRadius: 5, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${selectedAppts.length > 0 ? (selectedAppts.filter(a => a.status === "completed").length / selectedAppts.length) * 100 : 0}%`, background: `linear-gradient(90deg, ${C.teal}, ${C.success})`, borderRadius: 5, transition: "width 0.5s ease" }} />
          </div>
        </Card>
      </div>
      <Card className="fade-up" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{isToday ? "Today's Schedule" : `${dayLabels[selectedDay]}, ${fmtShort(selectedDate)}`}</span>
          <Badge bg={C.bg} color={C.textMuted} style={{ fontSize: 11 }}>{selectedAppts.length} booking{selectedAppts.length !== 1 ? "s" : ""}</Badge>
        </div>
        {selectedAppts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted }}><div style={{ fontSize: 36, marginBottom: 8, opacity: 0.4 }}>📭</div><div style={{ fontSize: 14 }}>No bookings for this day</div></div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selectedAppts.sort((a, b) => a.time.localeCompare(b.time)).map(a => { const s = STATUS_MAP[a.status]; return (
              <div key={a.id} className="fade-up" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: C.bg, borderRadius: 12, borderLeft: `4px solid ${s.color}` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, width: 50, flexShrink: 0 }}>{a.time}</div>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${a.groomer.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.groomer.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{a.pet.name} <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>({a.pet.breed})</span></div><div style={{ fontSize: 12, color: C.textMuted }}>{a.service.icon} {a.service.name} · {a.service.duration}min · {a.groomer.name}</div></div>
                <Badge bg={s.bg} color={s.color}>{s.icon} {s.label}</Badge>
                {a.paid && <Badge bg={C.successBg} color={C.success} style={{ fontSize: 10 }}>💶 Paid</Badge>}
              </div>); })}
          </div>
        )}
      </Card>
      <Card className="fade-up">
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Popular Services</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topServices.slice(0, 5).map(([name, count], i) => { const svc = services.find(s => s.name === name); const pct = (count / appointments.length) * 100; return (
              <div key={name}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span>{svc?.icon} {name}</span><span style={{ fontWeight: 600 }}>{count} bookings</span></div>
              <div style={{ height: 6, background: C.bg, borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: i === 0 ? C.accent : i === 1 ? C.teal : C.borderHover, borderRadius: 3, transition: "width 0.8s ease" }} /></div></div>); })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ padding: "16px 20px", background: C.accentLight, borderRadius: 14, fontSize: 13 }}><span style={{ fontWeight: 600 }}>💡 Tip:</span> Full Grooming is your top revenue driver. Consider promoting bundle deals.</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
