import { useState, useEffect, useRef } from "react";

const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&display=swap');

* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'DM Sans',sans-serif; background:#FAF7F2; color:#2D2A26; }

@keyframes fadeUp {
  from { opacity:0; transform:translateY(12px); }
  to { opacity:1; transform:translateY(0); }
}
@keyframes slideIn {
  from { opacity:0; transform:translateX(-16px); }
  to { opacity:1; transform:translateX(0); }
}
@keyframes scaleIn {
  from { opacity:0; transform:scale(0.95); }
  to { opacity:1; transform:scale(1); }
}
@keyframes pulse {
  0%,100% { transform:scale(1); }
  50% { transform:scale(1.05); }
}
.fade-up { animation: fadeUp 0.4s ease both; }
.slide-in { animation: slideIn 0.35s ease both; }
.scale-in { animation: scaleIn 0.3s ease both; }
`;

// ─── Color System ───
const C = {
  bg: "#FAF7F2",
  card: "#FFFFFF",
  accent: "#D4875C",
  accentLight: "#F2E0D4",
  accentDark: "#B5684A",
  teal: "#5B9E8F",
  tealLight: "#E0F0EC",
  navy: "#2D3A4A",
  text: "#2D2A26",
  textMuted: "#8A8580",
  border: "#EDE8E1",
  borderHover: "#D4CFC7",
  danger: "#C75A4A",
  dangerBg: "#FDF0EE",
  success: "#4A8B6F",
  successBg: "#EDF6F1",
  warning: "#C9943A",
  warningBg: "#FFF8ED",
};

// ─── Mock Data ───
const SERVICES = [
  { id: 1, name: "Bath & Brush", price: 25, duration: 30, icon: "🛁", sizes: { small: 0, medium: 10, large: 20 } },
  { id: 2, name: "Full Grooming", price: 65, duration: 90, icon: "✂️", sizes: { small: 0, medium: 15, large: 30 } },
  { id: 3, name: "Nail Trim", price: 15, duration: 10, icon: "💅", sizes: { small: 0, medium: 0, large: 5 } },
  { id: 4, name: "De-shedding", price: 40, duration: 45, icon: "🐾", sizes: { small: 0, medium: 10, large: 20 } },
  { id: 5, name: "Teeth Cleaning", price: 20, duration: 15, icon: "🦷", sizes: { small: 0, medium: 0, large: 5 } },
  { id: 6, name: "Flea Treatment", price: 35, duration: 30, icon: "🧴", sizes: { small: 0, medium: 5, large: 10 } },
];

const GROOMERS = [
  { id: 1, name: "Sofia M.", avatar: "👩‍🦰", specialties: ["Full Grooming", "De-shedding"], color: "#D4875C" },
  { id: 2, name: "James R.", avatar: "👨‍🦱", specialties: ["Bath & Brush", "Nail Trim"], color: "#5B9E8F" },
  { id: 3, name: "Ana L.", avatar: "👩‍🦳", specialties: ["Full Grooming", "Teeth Cleaning"], color: "#7B68AE" },
];

const PETS = [
  { id: 1, name: "Biscuit", breed: "Golden Retriever", type: "Dog", size: "large", weight: "32kg", age: "4 yrs", owner: "Maria Santos", ownerPhone: "+351 912 345 678", ownerEmail: "maria@email.com", allergies: "None", behavior: "Friendly, loves water", vaccination: "Up to date", notes: "Extra rinse needed — sensitive skin" },
  { id: 2, name: "Luna", breed: "Persian Cat", type: "Cat", size: "small", weight: "4kg", age: "2 yrs", owner: "João Silva", ownerPhone: "+351 923 456 789", ownerEmail: "joao@email.com", allergies: "Latex gloves", behavior: "Nervous with dryers", vaccination: "Up to date", notes: "Use quiet dryer only" },
  { id: 3, name: "Max", breed: "French Bulldog", type: "Dog", size: "medium", weight: "12kg", age: "5 yrs", owner: "Ana Costa", ownerPhone: "+351 934 567 890", ownerEmail: "ana@email.com", allergies: "Certain shampoos", behavior: "Calm", vaccination: "Due next month", notes: "Hypoallergenic shampoo only" },
  { id: 4, name: "Coco", breed: "Poodle", type: "Dog", size: "medium", weight: "8kg", age: "3 yrs", owner: "Pedro Nunes", ownerPhone: "+351 945 678 901", ownerEmail: "pedro@email.com", allergies: "None", behavior: "Playful, wiggly", vaccination: "Up to date", notes: "Teddy bear cut preferred" },
  { id: 5, name: "Milo", breed: "Beagle", type: "Dog", size: "medium", weight: "10kg", age: "6 yrs", owner: "Sara Lopes", ownerPhone: "+351 956 789 012", ownerEmail: "sara@email.com", allergies: "None", behavior: "Anxious", vaccination: "Up to date", notes: "Needs extra patience" },
];

const TODAY = new Date();
const genDate = (d) => { const dt = new Date(TODAY); dt.setDate(dt.getDate() + d); return dt; };
const fmt = (d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const fmtShort = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const INITIAL_APPOINTMENTS = [
  { id: 1, pet: PETS[0], service: SERVICES[1], groomer: GROOMERS[0], date: genDate(0), time: "09:00", status: "completed", paid: true },
  { id: 2, pet: PETS[1], service: SERVICES[0], groomer: GROOMERS[1], date: genDate(0), time: "10:00", status: "in-progress", paid: false },
  { id: 3, pet: PETS[2], service: SERVICES[2], groomer: GROOMERS[2], date: genDate(0), time: "11:30", status: "booked", paid: false },
  { id: 4, pet: PETS[3], service: SERVICES[1], groomer: GROOMERS[0], date: genDate(0), time: "14:00", status: "booked", paid: false },
  { id: 5, pet: PETS[4], service: SERVICES[3], groomer: GROOMERS[1], date: genDate(0), time: "15:00", status: "booked", paid: true },
  { id: 6, pet: PETS[0], service: SERVICES[4], groomer: GROOMERS[2], date: genDate(1), time: "09:30", status: "booked", paid: false },
  { id: 7, pet: PETS[2], service: SERVICES[5], groomer: GROOMERS[0], date: genDate(1), time: "11:00", status: "booked", paid: false },
  { id: 8, pet: PETS[1], service: SERVICES[1], groomer: GROOMERS[2], date: genDate(1), time: "14:00", status: "booked", paid: true },
  { id: 9, pet: PETS[3], service: SERVICES[0], groomer: GROOMERS[1], date: genDate(-1), time: "10:00", status: "completed", paid: true },
  { id: 10, pet: PETS[4], service: SERVICES[1], groomer: GROOMERS[0], date: genDate(-1), time: "13:00", status: "no-show", paid: false },
  { id: 11, pet: PETS[0], service: SERVICES[2], groomer: GROOMERS[1], date: genDate(-2), time: "09:00", status: "completed", paid: true },
  { id: 12, pet: PETS[1], service: SERVICES[0], groomer: GROOMERS[2], date: genDate(-2), time: "11:00", status: "completed", paid: true },
];

const STATUS_MAP = {
  booked: { label: "Booked", bg: C.warningBg, color: C.warning, icon: "◉" },
  "in-progress": { label: "In Progress", bg: "#EDE7F6", color: "#7B68AE", icon: "◈" },
  completed: { label: "Completed", bg: C.successBg, color: C.success, icon: "✓" },
  "no-show": { label: "No Show", bg: C.dangerBg, color: C.danger, icon: "✕" },
};

// ─── Shared Components ───
const Badge = ({ children, bg, color, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: bg, color, whiteSpace: "nowrap", ...style }}>{children}</span>
);

const Btn = ({ children, variant = "primary", onClick, style, disabled }) => {
  const base = { display: "inline-flex", alignItems: "center", gap: 6, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s", fontFamily: "inherit", opacity: disabled ? 0.5 : 1 };
  const variants = {
    primary: { background: C.accent, color: "#fff" },
    secondary: { background: C.accentLight, color: C.accent },
    ghost: { background: "transparent", color: C.textMuted, border: `1px solid ${C.border}` },
    danger: { background: C.dangerBg, color: C.danger },
    teal: { background: C.teal, color: "#fff" },
  };
  return <button style={{ ...base, ...variants[variant], ...style }} onClick={onClick} disabled={disabled}>{children}</button>;
};

const Card = ({ children, style, className = "" }) => (
  <div className={className} style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, ...style }}>{children}</div>
);

const Input = ({ label, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>}
    <input {...props} style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border 0.2s", background: C.bg, ...props.style }} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>}
    <select {...props} style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", background: C.bg, cursor: "pointer", ...props.style }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

// ─── Sidebar ───
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "booking", label: "New Booking", icon: "➕" },
  { id: "clients", label: "Clients & Pets", icon: "🐕" },
  { id: "services", label: "Services", icon: "✂️" },
  { id: "staff", label: "Staff", icon: "👥" },
];

const Sidebar = ({ active, onNav }) => (
  <div style={{ width: 240, background: C.navy, color: "#fff", display: "flex", flexDirection: "column", minHeight: "100vh", flexShrink: 0 }}>
    <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 28 }}>🐾</span> PawBook
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 4, letterSpacing: 0.5 }}>Pet Grooming Management</div>
    </div>
    <nav style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
      {NAV.map(n => (
        <button key={n.id} onClick={() => onNav(n.id)} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: "none",
          background: active === n.id ? "rgba(212,135,92,0.2)" : "transparent",
          color: active === n.id ? "#F2C9AE" : "rgba(255,255,255,0.6)",
          cursor: "pointer", fontSize: 14, fontWeight: active === n.id ? 600 : 400, fontFamily: "inherit", transition: "all 0.2s", textAlign: "left"
        }}>
          <span style={{ fontSize: 18 }}>{n.icon}</span>{n.label}
        </button>
      ))}
    </nav>
    <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>S</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Salon Patinhas</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Owner account</div>
      </div>
    </div>
  </div>
);

// ─── Dashboard ───
const MetricCard = ({ icon, label, value, sub, accent }) => (
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

const MiniChart = ({ data, color, height = 48 }) => {
  const max = Math.max(...data);
  const w = 100 / data.length;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, background: color, opacity: 0.2 + (v / max) * 0.8, borderRadius: 4, height: `${(v / max) * 100}%`, transition: "height 0.4s ease", minHeight: 4 }} />
      ))}
    </div>
  );
};

const DashboardView = ({ appointments }) => {
  // Build week days array (Mon–Sun of the current week)
  const dayOfWeek = TODAY.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekDays = Array.from({ length: 7 }, (_, i) => genDate(mondayOffset + i));

  // Find which index is "today"
  const todayIdx = weekDays.findIndex(d => d.toDateString() === TODAY.toDateString());
  const [selectedDay, setSelectedDay] = useState(todayIdx >= 0 ? todayIdx : 0);

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Per-day appointment counts & revenue
  const weekAppts = weekDays.map(d => appointments.filter(a => a.date.toDateString() === d.toDateString()));
  const weekCounts = weekAppts.map(a => a.length);
  const weekRevenue = weekAppts.map(arr => arr.filter(a => a.paid).reduce((s, a) => s + a.service.price, 0));
  const maxCount = Math.max(...weekCounts, 1);
  const maxRev = Math.max(...weekRevenue, 1);

  const selectedAppts = weekAppts[selectedDay] || [];
  const selectedDate = weekDays[selectedDay];
  const isToday = selectedDate.toDateString() === TODAY.toDateString();

  // Global stats
  const allCompleted = appointments.filter(a => a.status === "completed");
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
        <MetricCard icon="👥" label="Active Clients" value={uniqueOwners.length} sub={`${PETS.length} pets registered`} />
        <MetricCard icon="⚠️" label="No-shows" value={noShows.length} sub={`${((noShows.length / Math.max(appointments.length, 1)) * 100).toFixed(0)}% rate`} accent={C.danger} />
      </div>

      {/* ── Merged Weekly Chart + Schedule ── */}
      <Card className="fade-up" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Weekly Overview</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Click a day to see its bookings</div>
          </div>
          <Badge bg={isToday ? C.accentLight : C.bg} color={isToday ? C.accent : C.textMuted} style={{ fontSize: 13, padding: "6px 14px" }}>
            {isToday ? "📍 Today" : fmt(selectedDate)}
          </Badge>
        </div>

        {/* Bar chart row */}
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 100, marginBottom: 4 }}>
          {weekCounts.map((count, i) => {
            const isActive = i === selectedDay;
            const isT = i === todayIdx;
            const pct = Math.max((count / maxCount) * 100, 8);
            return (
              <button key={i} onClick={() => setSelectedDay(i)} style={{
                flex: 1, height: `${pct}%`, borderRadius: "8px 8px 0 0", border: "none", cursor: "pointer",
                background: isActive ? C.accent : isT ? C.accentLight : `${C.accent}20`,
                transition: "all 0.25s ease", position: "relative", fontFamily: "inherit",
                transform: isActive ? "scaleY(1.04)" : "scaleY(1)", transformOrigin: "bottom",
                outline: isActive ? `2px solid ${C.accent}` : "none", outlineOffset: 2,
              }}>
                {/* Count label on top of bar */}
                <span style={{
                  position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)",
                  fontSize: 12, fontWeight: 700, color: isActive ? C.accent : C.textMuted,
                  transition: "color 0.2s"
                }}>{count}</span>
              </button>
            );
          })}
        </div>
        {/* Day labels */}
        <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
          {dayLabels.map((d, i) => {
            const isActive = i === selectedDay;
            const isT = i === todayIdx;
            return (
              <button key={d} onClick={() => setSelectedDay(i)} style={{
                flex: 1, textAlign: "center", fontSize: 11, fontWeight: isActive ? 700 : 500, border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit",
                color: isActive ? C.accent : isT ? C.accentDark : C.textMuted, padding: "6px 0", transition: "color 0.2s"
              }}>
                {d}
                {isT && <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.accent, margin: "3px auto 0" }} />}
              </button>
            );
          })}
        </div>
        {/* Revenue sub-bars */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {weekRevenue.map((rev, i) => {
            const isActive = i === selectedDay;
            return (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ height: 3, borderRadius: 2, background: isActive ? C.teal : `${C.teal}25`, transition: "background 0.2s", margin: "0 4px" }} />
                <span style={{ fontSize: 10, color: isActive ? C.teal : "transparent", fontWeight: 600, transition: "color 0.2s" }}>€{rev}</span>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: C.border, margin: "0 -24px 20px", padding: "0" }} />

        {/* Selected day schedule */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>
            {isToday ? "Today's Schedule" : `${dayLabels[selectedDay]}, ${fmtShort(selectedDate)}`}
          </span>
          <Badge bg={C.bg} color={C.textMuted} style={{ fontSize: 11 }}>
            {selectedAppts.length} booking{selectedAppts.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        {selectedAppts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted }}>
            <div style={{ fontSize: 36, marginBottom: 8, opacity: 0.4 }}>📭</div>
            <div style={{ fontSize: 14 }}>No bookings for this day</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selectedAppts.sort((a, b) => a.time.localeCompare(b.time)).map(a => {
              const s = STATUS_MAP[a.status];
              return (
                <div key={a.id} className="fade-up" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: C.bg, borderRadius: 12, borderLeft: `4px solid ${s.color}`, transition: "all 0.2s" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, width: 50, flexShrink: 0 }}>{a.time}</div>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${a.groomer.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.groomer.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{a.pet.name} <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>({a.pet.breed})</span></div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{a.service.icon} {a.service.name} · {a.service.duration}min · {a.groomer.name}</div>
                  </div>
                  <Badge bg={s.bg} color={s.color}>{s.icon} {s.label}</Badge>
                  {a.paid && <Badge bg={C.successBg} color={C.success} style={{ fontSize: 10 }}>💶 Paid</Badge>}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Popular Services */}
      <Card className="fade-up">
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Popular Services</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topServices.slice(0, 5).map(([name, count], i) => {
              const svc = SERVICES.find(s => s.name === name);
              const pct = (count / appointments.length) * 100;
              return (
                <div key={name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span>{svc?.icon} {name}</span>
                    <span style={{ fontWeight: 600 }}>{count} bookings</span>
                  </div>
                  <div style={{ height: 6, background: C.bg, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: i === 0 ? C.accent : i === 1 ? C.teal : C.borderHover, borderRadius: 3, transition: "width 0.8s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ padding: "16px 20px", background: C.accentLight, borderRadius: 14, fontSize: 13 }}>
              <span style={{ fontWeight: 600 }}>💡 Tip:</span> Full Grooming is your top revenue driver. Consider promoting bundle deals.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ─── Calendar View ───
const CalendarView = ({ appointments, setAppointments, onNav }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const days = Array.from({ length: 7 }, (_, i) => genDate(i - 2));
  const dayAppts = appointments.filter(a => a.date.toDateString() === days[selectedDay].toDateString());
  const hours = Array.from({ length: 11 }, (_, i) => `${(i + 8).toString().padStart(2, "0")}:00`);

  const updateStatus = (id, status) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700 }}>Calendar</h1>
          <p style={{ color: C.textMuted, marginTop: 4 }}>Manage your daily appointments</p>
        </div>
        <Btn onClick={() => onNav("booking")}>➕ New Booking</Btn>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {days.map((d, i) => {
          const count = appointments.filter(a => a.date.toDateString() === d.toDateString()).length;
          const isToday = d.toDateString() === TODAY.toDateString();
          return (
            <button key={i} onClick={() => setSelectedDay(i)} style={{
              flex: 1, padding: "14px 8px", borderRadius: 14, border: selectedDay === i ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
              background: selectedDay === i ? C.accentLight : C.card, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", textAlign: "center"
            }}>
              <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{d.toLocaleDateString("en", { weekday: "short" })}</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Fraunces', serif", margin: "4px 0", color: isToday ? C.accent : C.text }}>{d.getDate()}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{count} appt{count !== 1 ? "s" : ""}</div>
            </button>
          );
        })}
      </div>

      <Card>
        <div style={{ display: "flex", gap: 16, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
          {GROOMERS.map(g => (
            <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: g.color }} />
              <span style={{ fontWeight: 600 }}>{g.avatar} {g.name}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {hours.map(h => {
            const slotAppts = dayAppts.filter(a => a.time.startsWith(h.slice(0, 2)));
            return (
              <div key={h} style={{ display: "flex", minHeight: 56, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 64, fontSize: 12, color: C.textMuted, fontWeight: 600, paddingTop: 8, flexShrink: 0 }}>{h}</div>
                <div style={{ flex: 1, display: "flex", gap: 8, padding: "4px 0", flexWrap: "wrap" }}>
                  {slotAppts.map(a => {
                    const st = STATUS_MAP[a.status];
                    return (
                      <div key={a.id} className="scale-in" style={{
                        padding: "8px 14px", borderRadius: 10, background: `${a.groomer.color}12`, borderLeft: `3px solid ${a.groomer.color}`,
                        flex: "1 1 200px", maxWidth: 320, cursor: "default", position: "relative"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{a.pet.name}</span>
                          <Badge bg={st.bg} color={st.color} style={{ fontSize: 11 }}>{st.label}</Badge>
                        </div>
                        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{a.service.icon} {a.service.name} · {a.service.duration}min · {a.groomer.name}</div>
                        {a.status === "booked" && (
                          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                            <Btn variant="teal" style={{ padding: "4px 10px", fontSize: 12, borderRadius: 8 }} onClick={() => updateStatus(a.id, "in-progress")}>Start</Btn>
                            <Btn variant="danger" style={{ padding: "4px 10px", fontSize: 12, borderRadius: 8 }} onClick={() => updateStatus(a.id, "no-show")}>No Show</Btn>
                          </div>
                        )}
                        {a.status === "in-progress" && (
                          <div style={{ marginTop: 8 }}>
                            <Btn variant="teal" style={{ padding: "4px 10px", fontSize: 12, borderRadius: 8 }} onClick={() => updateStatus(a.id, "completed")}>✓ Complete</Btn>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// ─── Booking Flow ───
const BookingView = ({ appointments, setAppointments, onNav }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ service: null, pet: null, groomer: null, date: null, time: null, ownerName: "", ownerPhone: "", ownerEmail: "", petName: "", petBreed: "", petType: "Dog", petSize: "medium", notes: "" });
  const [isNewClient, setIsNewClient] = useState(false);

  const TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
  const nextDays = Array.from({ length: 7 }, (_, i) => genDate(i));

  const confirmBooking = () => {
    const pet = isNewClient
      ? { id: PETS.length + 1, name: form.petName, breed: form.petBreed, type: form.petType, size: form.petSize, owner: form.ownerName, ownerPhone: form.ownerPhone, ownerEmail: form.ownerEmail, allergies: "N/A", behavior: "N/A", vaccination: "N/A", notes: form.notes }
      : form.pet;
    const newAppt = {
      id: appointments.length + 1, pet, service: form.service, groomer: form.groomer, date: form.date, time: form.time, status: "booked", paid: false,
    };
    setAppointments(prev => [...prev, newAppt]);
    setStep(5);
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700 }}>New Booking</h1>
        <div style={{ display: "flex", gap: 4, marginTop: 16 }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? C.accent : C.border, transition: "background 0.3s" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          {["Service", "Client", "Groomer", "Time"].map((l, i) => (
            <span key={l} style={{ fontSize: 11, color: step > i ? C.accent : C.textMuted, fontWeight: step === i + 1 ? 700 : 400 }}>{l}</span>
          ))}
        </div>
      </div>

      {step === 1 && (
        <Card className="fade-up">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Select a Service</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SERVICES.map(s => (
              <button key={s.id} onClick={() => { setForm(f => ({ ...f, service: s })); setStep(2); }} style={{
                display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 14,
                border: form.service?.id === s.id ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                background: C.card, cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.15s"
              }}>
                <span style={{ fontSize: 28 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{s.duration} min · Sizes: +€{s.sizes.medium} med / +€{s.sizes.large} large</div>
                </div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: C.accent }}>€{s.price}</div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="fade-up">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Select Client & Pet</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <Btn variant={!isNewClient ? "primary" : "ghost"} onClick={() => setIsNewClient(false)}>Existing Client</Btn>
            <Btn variant={isNewClient ? "primary" : "ghost"} onClick={() => setIsNewClient(true)}>New Client</Btn>
          </div>
          {!isNewClient ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PETS.map(p => (
                <button key={p.id} onClick={() => { setForm(f => ({ ...f, pet: p })); setStep(3); }} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 12,
                  border: `1px solid ${C.border}`, background: C.card, cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.15s"
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{p.type === "Dog" ? "🐕" : "🐈"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{p.breed} · {p.owner}</div>
                  </div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{p.size}</div>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Input label="Owner Name" value={form.ownerName} onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))} placeholder="Full name" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input label="Phone" value={form.ownerPhone} onChange={e => setForm(f => ({ ...f, ownerPhone: e.target.value }))} placeholder="+351 ..." />
                <Input label="Email" value={form.ownerEmail} onChange={e => setForm(f => ({ ...f, ownerEmail: e.target.value }))} placeholder="email@..." />
              </div>
              <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "8px 0" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input label="Pet Name" value={form.petName} onChange={e => setForm(f => ({ ...f, petName: e.target.value }))} placeholder="Buddy" />
                <Input label="Breed" value={form.petBreed} onChange={e => setForm(f => ({ ...f, petBreed: e.target.value }))} placeholder="Labrador" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Select label="Pet Type" value={form.petType} onChange={e => setForm(f => ({ ...f, petType: e.target.value }))} options={[{ value: "Dog", label: "🐕 Dog" }, { value: "Cat", label: "🐈 Cat" }]} />
                <Select label="Size" value={form.petSize} onChange={e => setForm(f => ({ ...f, petSize: e.target.value }))} options={[{ value: "small", label: "Small" }, { value: "medium", label: "Medium" }, { value: "large", label: "Large" }]} />
              </div>
              <Input label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Allergies, behavior notes..." />
              <Btn onClick={() => setStep(3)} disabled={!form.petName || !form.ownerName} style={{ alignSelf: "flex-end", marginTop: 8 }}>Continue →</Btn>
            </div>
          )}
          <button onClick={() => setStep(1)} style={{ marginTop: 12, background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← Back</button>
        </Card>
      )}

      {step === 3 && (
        <Card className="fade-up">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Choose a Groomer</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {GROOMERS.map(g => (
              <button key={g.id} onClick={() => { setForm(f => ({ ...f, groomer: g })); setStep(4); }} style={{
                display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderRadius: 14,
                border: `1px solid ${C.border}`, background: C.card, cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.15s"
              }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${g.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{g.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Specializes in: {g.specialties.join(", ")}</div>
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} style={{ marginTop: 12, background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← Back</button>
        </Card>
      )}

      {step === 4 && (
        <Card className="fade-up">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Pick a Date & Time</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {nextDays.map((d, i) => (
              <button key={i} onClick={() => setForm(f => ({ ...f, date: d }))} style={{
                padding: "12px 16px", borderRadius: 12, border: form.date?.toDateString() === d.toDateString() ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                background: form.date?.toDateString() === d.toDateString() ? C.accentLight : C.card, cursor: "pointer", fontFamily: "inherit", textAlign: "center", minWidth: 72
              }}>
                <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>{d.toLocaleDateString("en", { weekday: "short" })}</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>{d.getDate()}</div>
              </button>
            ))}
          </div>
          {form.date && (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 10 }}>Available times on {fmtShort(form.date)}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TIMES.map(t => {
                  const taken = appointments.some(a => a.date?.toDateString() === form.date?.toDateString() && a.time === t && a.groomer?.id === form.groomer?.id);
                  return (
                    <button key={t} disabled={taken} onClick={() => setForm(f => ({ ...f, time: t }))} style={{
                      padding: "8px 16px", borderRadius: 10, border: form.time === t ? `2px solid ${C.accent}` : `1px solid ${taken ? "transparent" : C.border}`,
                      background: taken ? C.border : form.time === t ? C.accentLight : C.card,
                      color: taken ? C.textMuted : C.text, cursor: taken ? "not-allowed" : "pointer", fontFamily: "inherit", fontWeight: form.time === t ? 700 : 400, fontSize: 14, opacity: taken ? 0.5 : 1
                    }}>{t}</button>
                  );
                })}
              </div>
            </>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <button onClick={() => setStep(3)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← Back</button>
            <Btn onClick={confirmBooking} disabled={!form.date || !form.time}>Confirm Booking ✓</Btn>
          </div>
        </Card>
      )}

      {step === 5 && (
        <Card className="scale-in" style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700 }}>Booking Confirmed!</h2>
          <p style={{ color: C.textMuted, marginTop: 8, marginBottom: 24 }}>
            {form.service?.name} for {form.pet?.name || form.petName} with {form.groomer?.name}<br />
            {form.date && fmt(form.date)} at {form.time}
          </p>
          <div style={{ background: C.tealLight, padding: 16, borderRadius: 12, fontSize: 13, marginBottom: 24 }}>
            📲 Automated reminder will be sent 24h before the appointment
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Btn onClick={() => onNav("calendar")}>View Calendar</Btn>
            <Btn variant="secondary" onClick={() => { setStep(1); setForm({ service: null, pet: null, groomer: null, date: null, time: null, ownerName: "", ownerPhone: "", ownerEmail: "", petName: "", petBreed: "", petType: "Dog", petSize: "medium", notes: "" }); }}>New Booking</Btn>
          </div>
        </Card>
      )}
    </div>
  );
};

// ─── Clients & Pets CRM ───
const ClientsView = () => {
  const [selected, setSelected] = useState(null);
  const pet = selected !== null ? PETS[selected] : null;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700 }}>Clients & Pets</h1>
        <p style={{ color: C.textMuted, marginTop: 4 }}>Your CRM — {PETS.length} pets registered</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: selected !== null ? "1fr 1.2fr" : "1fr", gap: 16 }}>
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {PETS.map((p, i) => (
              <button key={p.id} onClick={() => setSelected(i)} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 12, textAlign: "left",
                border: selected === i ? `2px solid ${C.accent}` : "1px solid transparent", background: selected === i ? C.accentLight : "transparent",
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s"
              }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{p.type === "Dog" ? "🐕" : "🐈"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{p.breed} · {p.owner}</div>
                </div>
                <Badge bg={p.vaccination === "Up to date" ? C.successBg : C.warningBg} color={p.vaccination === "Up to date" ? C.success : C.warning} style={{ fontSize: 10 }}>
                  {p.vaccination === "Up to date" ? "✓ Vacc" : "⚠ Vacc"}
                </Badge>
              </button>
            ))}
          </div>
        </Card>

        {pet && (
          <Card className="slide-in">
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{pet.type === "Dog" ? "🐕" : "🐈"}</div>
              <div>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700 }}>{pet.name}</h2>
                <div style={{ fontSize: 13, color: C.textMuted }}>{pet.breed} · {pet.type} · {pet.size} · {pet.weight} · {pet.age}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Owner", value: pet.owner, icon: "👤" },
                { label: "Phone", value: pet.ownerPhone, icon: "📞" },
                { label: "Email", value: pet.ownerEmail, icon: "✉️" },
                { label: "Vaccination", value: pet.vaccination, icon: "💉" },
              ].map(f => (
                <div key={f.label} style={{ padding: "10px 14px", background: C.bg, borderRadius: 10 }}>
                  <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>{f.icon} {f.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{f.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Allergies", value: pet.allergies, bg: pet.allergies !== "None" ? C.dangerBg : C.bg, color: pet.allergies !== "None" ? C.danger : C.text },
                { label: "Behavior", value: pet.behavior, bg: C.bg },
                { label: "Grooming Notes", value: pet.notes, bg: C.warningBg },
              ].map(n => (
                <div key={n.label} style={{ padding: "12px 16px", background: n.bg || C.bg, borderRadius: 10, color: n.color }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2, opacity: 0.7 }}>{n.label}</div>
                  <div style={{ fontSize: 14 }}>{n.value}</div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// ─── Services View ───
const ServicesView = () => {
  const [editing, setEditing] = useState(null);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700 }}>Services & Pricing</h1>
          <p style={{ color: C.textMuted, marginTop: 4 }}>Manage your service catalog</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {SERVICES.map(s => (
          <Card key={s.id} className="fade-up" style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.06 }}>{s.icon}</div>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>{s.name}</h3>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.accent, fontFamily: "'Fraunces', serif", margin: "8px 0" }}>€{s.price}</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 12 }}>⏱ {s.duration} min</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Size modifiers:</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Badge bg={C.bg} color={C.text}>S: +€{s.sizes.small}</Badge>
                <Badge bg={C.bg} color={C.text}>M: +€{s.sizes.medium}</Badge>
                <Badge bg={C.bg} color={C.text}>L: +€{s.sizes.large}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── Staff View ───
const StaffView = ({ appointments }) => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700 }}>Staff</h1>
      <p style={{ color: C.textMuted, marginTop: 4 }}>Your grooming team</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
      {GROOMERS.map(g => {
        const gAppts = appointments.filter(a => a.groomer.id === g.id);
        const todayG = gAppts.filter(a => a.date.toDateString() === TODAY.toDateString());
        const completedG = gAppts.filter(a => a.status === "completed");
        const revenueG = completedG.reduce((s, a) => s + a.service.price, 0);
        return (
          <Card key={g.id} className="fade-up">
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: `${g.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{g.avatar}</div>
              <div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700 }}>{g.name}</h3>
                <div style={{ fontSize: 12, color: C.textMuted }}>Specialties: {g.specialties.join(", ")}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
              <div style={{ textAlign: "center", padding: 10, background: C.bg, borderRadius: 10 }}>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Fraunces', serif", color: g.color }}>{todayG.length}</div>
                <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>TODAY</div>
              </div>
              <div style={{ textAlign: "center", padding: 10, background: C.bg, borderRadius: 10 }}>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>{gAppts.length}</div>
                <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>TOTAL</div>
              </div>
              <div style={{ textAlign: "center", padding: 10, background: C.bg, borderRadius: 10 }}>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Fraunces', serif", color: C.teal }}>€{revenueG}</div>
                <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>REVENUE</div>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>Working Hours</div>
            <div style={{ display: "flex", gap: 4 }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} style={{ flex: 1, textAlign: "center", padding: "6px 0", background: C.tealLight, borderRadius: 6, fontSize: 10, fontWeight: 600, color: C.teal }}>{d}</div>
              ))}
              <div style={{ flex: 1, textAlign: "center", padding: "6px 0", background: C.border, borderRadius: 6, fontSize: 10, fontWeight: 600, color: C.textMuted }}>Sun</div>
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

// ─── Main App ───
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  return (
    <>
      <style>{FONTS_CSS}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
        <Sidebar active={page} onNav={setPage} />
        <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto", maxHeight: "100vh" }}>
          {page === "dashboard" && <DashboardView appointments={appointments} />}
          {page === "calendar" && <CalendarView appointments={appointments} setAppointments={setAppointments} onNav={setPage} />}
          {page === "booking" && <BookingView appointments={appointments} setAppointments={setAppointments} onNav={setPage} />}
          {page === "clients" && <ClientsView />}
          {page === "services" && <ServicesView />}
          {page === "staff" && <StaffView appointments={appointments} />}
        </main>
      </div>
    </>
  );
}