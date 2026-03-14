import { useState } from "react";
import { supabase } from "../lib/supabase";
import { C } from "../lib/constants";

export const AuthView = ({ onAuth }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [salonName, setSalonName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else onAuth();
    setLoading(false);
  };

  const handleSignup = async () => {
    setError(""); setLoading(true);

    // 1. Create user in Supabase Auth
    const { data: authData, error: authErr } = await supabase.auth.signUp({ email, password });
    if (authErr) { setError(authErr.message); setLoading(false); return; }

    const userId = authData.user?.id;
    if (!userId) { setError("Signup failed. Please try again."); setLoading(false); return; }

    // 2. Call the database function to create salon + profile + default services
    const { error: rpcErr } = await supabase.rpc("create_salon_and_profile", {
      user_id: userId,
      salon_name: salonName,
      user_name: fullName,
    });
    if (rpcErr) { setError(rpcErr.message); setLoading(false); return; }

    onAuth();
    setLoading(false);
  };

  const handleInviteSignup = async () => {
    setError(""); setLoading(true);

    // 1. Find the invite (using service role or anon — invite is public readable by email)
    const { data: invite, error: invErr } = await supabase.from("invites")
      .select("*").eq("id", inviteCode).eq("accepted", false).single();
    if (invErr || !invite) { setError("Invalid or expired invite code."); setLoading(false); return; }

    // 2. Create user
    const { data: authData, error: authErr } = await supabase.auth.signUp({ email: invite.email, password });
    if (authErr) { setError(authErr.message); setLoading(false); return; }

    const userId = authData.user?.id;
    if (!userId) { setError("Signup failed."); setLoading(false); return; }

    // 3. Create profile linked to the salon
    const { error: profileErr } = await supabase.from("profiles").insert({
      id: userId, salon_id: invite.salon_id, full_name: fullName, role: "staff"
    });
    if (profileErr) { setError(profileErr.message); setLoading(false); return; }

    // 4. Mark invite as accepted
    await supabase.from("invites").update({ accepted: true }).eq("id", inviteCode);

    onAuth();
    setLoading(false);
  };

  const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", background: C.bg };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: 24 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🐾</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 700, color: C.navy }}>PawBook</div>
          <div style={{ fontSize: 14, color: C.textMuted, marginTop: 4 }}>Pet Grooming Management</div>
        </div>

        {/* Card */}
        <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 28, background: C.bg, borderRadius: 12, padding: 4 }}>
            {[{ id: "login", label: "Log In" }, { id: "signup", label: "Sign Up" }, { id: "invite", label: "Join Team" }].map(tab => (
              <button key={tab.id} onClick={() => { setMode(tab.id); setError(""); }} style={{
                flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit",
                fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                background: mode === tab.id ? C.card : "transparent",
                color: mode === tab.id ? C.accent : C.textMuted,
                boxShadow: mode === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none"
              }}>{tab.label}</button>
            ))}
          </div>

          {/* Login */}
          {mode === "login" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={labelStyle}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@salon.com" style={inputStyle} /></div>
              <div><label style={labelStyle}>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} /></div>
              <button onClick={handleLogin} disabled={loading || !email || !password} style={{
                padding: "14px 0", borderRadius: 12, border: "none", background: C.accent, color: "#fff",
                fontSize: 15, fontWeight: 600, cursor: loading ? "wait" : "pointer", fontFamily: "inherit",
                opacity: loading || !email || !password ? 0.6 : 1
              }}>{loading ? "Logging in..." : "Log In"}</button>
            </div>
          )}

          {/* Signup */}
          {mode === "signup" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={labelStyle}>Salon Name</label><input type="text" value={salonName} onChange={e => setSalonName(e.target.value)} placeholder="Master of Puppies" style={inputStyle} /></div>
              <div><label style={labelStyle}>Your Name</label><input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full name" style={inputStyle} /></div>
              <div><label style={labelStyle}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@salon.com" style={inputStyle} /></div>
              <div><label style={labelStyle}>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" style={inputStyle} /></div>
              <button onClick={handleSignup} disabled={loading || !email || !password || !fullName || !salonName} style={{
                padding: "14px 0", borderRadius: 12, border: "none", background: C.teal, color: "#fff",
                fontSize: 15, fontWeight: 600, cursor: loading ? "wait" : "pointer", fontFamily: "inherit",
                opacity: loading || !email || !password || !fullName || !salonName ? 0.6 : 1
              }}>{loading ? "Creating salon..." : "Create Salon Account"}</button>
            </div>
          )}

          {/* Join Team */}
          {mode === "invite" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 13, color: C.textMuted, padding: "12px 16px", background: C.tealLight, borderRadius: 12 }}>
                Your salon owner should have given you an invite code. Enter it below to join their team.
              </div>
              <div><label style={labelStyle}>Invite Code</label><input type="text" value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="Paste invite code" style={inputStyle} /></div>
              <div><label style={labelStyle}>Your Name</label><input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full name" style={inputStyle} /></div>
              <div><label style={labelStyle}>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" style={inputStyle} /></div>
              <button onClick={handleInviteSignup} disabled={loading || !inviteCode || !password || !fullName} style={{
                padding: "14px 0", borderRadius: 12, border: "none", background: C.accent, color: "#fff",
                fontSize: 15, fontWeight: 600, cursor: loading ? "wait" : "pointer", fontFamily: "inherit",
                opacity: loading || !inviteCode || !password || !fullName ? 0.6 : 1
              }}>{loading ? "Joining..." : "Join Team"}</button>
            </div>
          )}

          {error && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: C.dangerBg, borderRadius: 12, fontSize: 13, color: C.danger, fontWeight: 500 }}>{error}</div>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: C.textMuted }}>© PawBook — Pet Grooming Management</div>
      </div>
    </div>
  );
};
