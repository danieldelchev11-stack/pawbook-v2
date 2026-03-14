import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { C } from "../lib/constants";
import { Badge, Btn, Card } from "../components/ui";

export const TeamView = ({ profile, salon }) => {
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(null);
  const isOwner = profile?.role === "owner";

  const fetchTeam = async () => {
    const { data: memberData } = await supabase.from("profiles").select("*").eq("salon_id", salon.id);
    setMembers(memberData || []);
    const { data: inviteData } = await supabase.from("invites").select("*").eq("salon_id", salon.id).order("created_at", { ascending: false });
    setInvites(inviteData || []);
  };

  useEffect(() => { fetchTeam(); }, []);

  const sendInvite = async () => {
    if (!inviteEmail) return;
    const { data } = await supabase.from("invites").insert({
      salon_id: salon.id, email: inviteEmail, invited_by: profile.id
    }).select().single();
    if (data) {
      setInviteEmail("");
      fetchTeam();
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700 }}>Team</h1>
        <p style={{ color: C.textMuted, marginTop: 4 }}>Manage your salon team — {salon.name}</p>
      </div>

      {/* Team Members */}
      <Card className="fade-up" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Members</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {members.map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: C.bg, borderRadius: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: m.role === "owner" ? C.accentLight : C.tealLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: m.role === "owner" ? C.accent : C.teal }}>
                {m.full_name?.charAt(0)?.toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{m.full_name} {m.id === profile.id && <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>(you)</span>}</div>
              </div>
              <Badge bg={m.role === "owner" ? C.accentLight : C.tealLight} color={m.role === "owner" ? C.accent : C.teal}>
                {m.role === "owner" ? "👑 Owner" : "👤 Staff"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Invite Section (Owner only) */}
      {isOwner && (
        <Card className="fade-up" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Invite Staff</div>
          <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>Send an invite to add team members. They'll get a code to join your salon.</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="staff@email.com"
              style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", background: C.bg }} />
            <Btn onClick={sendInvite} disabled={!inviteEmail}>Send Invite</Btn>
          </div>
        </Card>
      )}

      {/* Pending Invites */}
      {isOwner && invites.length > 0 && (
        <Card className="fade-up">
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Invites</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {invites.map(inv => (
              <div key={inv.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: C.bg, borderRadius: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{inv.email}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Code: <code style={{ background: C.card, padding: "2px 8px", borderRadius: 6, fontSize: 11, border: `1px solid ${C.border}` }}>{inv.id}</code></div>
                </div>
                <button onClick={() => copyCode(inv.id)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: copied === inv.id ? C.successBg : C.card, color: copied === inv.id ? C.success : C.textMuted, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                  {copied === inv.id ? "✓ Copied" : "Copy Code"}
                </button>
                <Badge bg={inv.accepted ? C.successBg : C.warningBg} color={inv.accepted ? C.success : C.warning}>
                  {inv.accepted ? "✓ Joined" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
