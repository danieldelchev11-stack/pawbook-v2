// ─── Color System ───
export const C = {
  bg: "#FAF7F2", card: "#FFFFFF", accent: "#D4875C", accentLight: "#F2E0D4", accentDark: "#B5684A",
  teal: "#5B9E8F", tealLight: "#E0F0EC", navy: "#2D3A4A", text: "#2D2A26", textMuted: "#8A8580",
  border: "#EDE8E1", borderHover: "#D4CFC7", danger: "#C75A4A", dangerBg: "#FDF0EE",
  success: "#4A8B6F", successBg: "#EDF6F1", warning: "#C9943A", warningBg: "#FFF8ED",
};

// ─── Status Map ───
export const STATUS_MAP = {
  booked: { label: "Booked", bg: C.warningBg, color: C.warning, icon: "◉" },
  "in-progress": { label: "In Progress", bg: "#EDE7F6", color: "#7B68AE", icon: "◈" },
  completed: { label: "Completed", bg: C.successBg, color: C.success, icon: "✓" },
  "no-show": { label: "No Show", bg: C.dangerBg, color: C.danger, icon: "✕" },
};

// ─── Date Helpers ───
export const TODAY = new Date();

export const genDate = (d) => {
  const dt = new Date(TODAY);
  dt.setDate(dt.getDate() + d);
  return dt;
};

export const fmt = (d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

export const fmtShort = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

export const toDateStr = (d) => d.toISOString().split("T")[0];

// ─── Fonts & Global CSS ───
export const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'DM Sans',sans-serif; background:#FAF7F2; color:#2D2A26; }
input, select, textarea { color:#2D2A26; }
@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideIn { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
@keyframes scaleIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
.fade-up { animation: fadeUp 0.4s ease both; }
.slide-in { animation: slideIn 0.35s ease both; }
.scale-in { animation: scaleIn 0.3s ease both; }
`;

// ─── Navigation Items ───
export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "booking", label: "New Booking", icon: "➕" },
  { id: "clients", label: "Clients & Pets", icon: "🐕" },
  { id: "services", label: "Services", icon: "✂️" },
  { id: "staff", label: "Staff", icon: "👥" },
];
