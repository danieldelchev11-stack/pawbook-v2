import { supabase } from "../lib/supabase";
import { C } from "../lib/constants";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "booking", label: "New Booking", icon: "➕" },
  { id: "clients", label: "Clients & Pets", icon: "🐕" },
  { id: "services", label: "Services", icon: "✂️" },
  { id: "staff", label: "Staff", icon: "👥" },
  { id: "team", label: "Team", icon: "🔑" },
];

export const Sidebar = ({ active, onNav, profile, salon }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
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
      <div style={{ padding: "12px 12px 8px" }}>
        <button onClick={handleLogout} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 10,
          border: "none", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)",
          cursor: "pointer", fontSize: 13, fontFamily: "inherit", transition: "all 0.2s"
        }}>
          <span style={{ fontSize: 16 }}>🚪</span> Log Out
        </button>
      </div>
      <div style={{ padding: "12px 20px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>
          {profile?.full_name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{salon?.name || "Salon"}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{profile?.full_name} · {profile?.role}</div>
        </div>
      </div>
    </div>
  );
};
