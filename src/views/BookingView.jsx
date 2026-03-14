import { useState } from "react";
import { supabase } from "../lib/supabase";
import { C, genDate, fmt, fmtShort, toDateStr } from "../lib/constants";
import { Btn, Card, Input, Select } from "../components/ui";

export const BookingView = ({ appointments, services, groomers, pets, salonId, onBook, onNav }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ service: null, pet: null, groomer: null, date: null, time: null, ownerName: "", ownerPhone: "", ownerEmail: "", petName: "", petBreed: "", petType: "Dog", petSize: "medium", notes: "" });
  const [isNewClient, setIsNewClient] = useState(false);
  const TIMES = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];
  const nextDays = Array.from({ length: 7 }, (_, i) => genDate(i));

  const confirmBooking = async () => {
    let petId = form.pet?.id;
    if (isNewClient) {
      const { data: ownerData } = await supabase.from("owners").insert({ name: form.ownerName, phone: form.ownerPhone, email: form.ownerEmail, salon_id: salonId }).select().single();
      if (ownerData) {
        const { data: petData } = await supabase.from("pets").insert({ owner_id: ownerData.id, name: form.petName, breed: form.petBreed, type: form.petType, size: form.petSize, notes: form.notes, salon_id: salonId }).select().single();
        if (petData) petId = petData.id;
      }
    }
    const { data } = await supabase.from("appointments").insert({ pet_id: petId, service_id: form.service.id, groomer_id: form.groomer.id, date: toDateStr(form.date), time: form.time, status: "booked", paid: false, salon_id: salonId }).select().single();
    if (data) { onBook(); setStep(5); }
  };

  const resetForm = () => { setStep(1); setForm({ service: null, pet: null, groomer: null, date: null, time: null, ownerName: "", ownerPhone: "", ownerEmail: "", petName: "", petBreed: "", petType: "Dog", petSize: "medium", notes: "" }); };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700 }}>New Booking</h1>
        <div style={{ display: "flex", gap: 4, marginTop: 16 }}>{[1,2,3,4].map(s => (<div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? C.accent : C.border }} />))}</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>{["Service","Client","Groomer","Time"].map((l, i) => (<span key={l} style={{ fontSize: 11, color: step > i ? C.accent : C.textMuted, fontWeight: step === i + 1 ? 700 : 400 }}>{l}</span>))}</div>
      </div>

      {step === 1 && (<Card className="fade-up"><h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Select a Service</h3><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {services.map(s => (<button key={s.id} onClick={() => { setForm(f => ({ ...f, service: s })); setStep(2); }} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 14, border: form.service?.id === s.id ? `2px solid ${C.accent}` : `1px solid ${C.border}`, background: C.card, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
          <span style={{ fontSize: 28 }}>{s.icon}</span><div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</div><div style={{ fontSize: 12, color: C.textMuted }}>{s.duration} min · Sizes: +€{s.sizes.medium} med / +€{s.sizes.large} large</div></div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: C.accent }}>€{s.price}</div></button>))}</div></Card>)}

      {step === 2 && (<Card className="fade-up"><h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Select Client & Pet</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}><Btn variant={!isNewClient ? "primary" : "ghost"} onClick={() => setIsNewClient(false)}>Existing Client</Btn><Btn variant={isNewClient ? "primary" : "ghost"} onClick={() => setIsNewClient(true)}>New Client</Btn></div>
        {!isNewClient ? (<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pets.map(p => (<button key={p.id} onClick={() => { setForm(f => ({ ...f, pet: p })); setStep(3); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{p.type === "Dog" ? "🐕" : "🐈"}</div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: 12, color: C.textMuted }}>{p.breed} · {p.owner}</div></div>
            <div style={{ fontSize: 12, color: C.textMuted }}>{p.size}</div></button>))}</div>
        ) : (<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input label="Owner Name" value={form.ownerName} onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))} placeholder="Full name" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><Input label="Phone" value={form.ownerPhone} onChange={e => setForm(f => ({ ...f, ownerPhone: e.target.value }))} placeholder="+351 ..." /><Input label="Email" value={form.ownerEmail} onChange={e => setForm(f => ({ ...f, ownerEmail: e.target.value }))} placeholder="email@..." /></div>
          <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "8px 0" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><Input label="Pet Name" value={form.petName} onChange={e => setForm(f => ({ ...f, petName: e.target.value }))} placeholder="Buddy" /><Input label="Breed" value={form.petBreed} onChange={e => setForm(f => ({ ...f, petBreed: e.target.value }))} placeholder="Labrador" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><Select label="Pet Type" value={form.petType} onChange={e => setForm(f => ({ ...f, petType: e.target.value }))} options={[{ value: "Dog", label: "🐕 Dog" }, { value: "Cat", label: "🐈 Cat" }]} /><Select label="Size" value={form.petSize} onChange={e => setForm(f => ({ ...f, petSize: e.target.value }))} options={[{ value: "small", label: "Small" }, { value: "medium", label: "Medium" }, { value: "large", label: "Large" }]} /></div>
          <Input label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Allergies, behavior notes..." />
          <Btn onClick={() => setStep(3)} disabled={!form.petName || !form.ownerName} style={{ alignSelf: "flex-end", marginTop: 8 }}>Continue →</Btn></div>)}
        <button onClick={() => setStep(1)} style={{ marginTop: 12, background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← Back</button></Card>)}

      {step === 3 && (<Card className="fade-up"><h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Choose a Groomer</h3><div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {groomers.map(g => (<button key={g.id} onClick={() => { setForm(f => ({ ...f, groomer: g })); setStep(4); }} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderRadius: 14, border: `1px solid ${C.border}`, background: C.card, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${g.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{g.avatar}</div>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 15 }}>{g.name}</div><div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Specializes in: {g.specialties.join(", ")}</div></div></button>))}</div>
        <button onClick={() => setStep(2)} style={{ marginTop: 12, background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← Back</button></Card>)}

      {step === 4 && (<Card className="fade-up"><h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Pick a Date & Time</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>{nextDays.map((d, i) => (
          <button key={i} onClick={() => setForm(f => ({ ...f, date: d }))} style={{ padding: "12px 16px", borderRadius: 12, border: form.date?.toDateString() === d.toDateString() ? `2px solid ${C.accent}` : `1px solid ${C.border}`, background: form.date?.toDateString() === d.toDateString() ? C.accentLight : C.card, cursor: "pointer", fontFamily: "inherit", textAlign: "center", minWidth: 72 }}>
            <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>{d.toLocaleDateString("en", { weekday: "short" })}</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>{d.getDate()}</div></button>))}</div>
        {form.date && (<><div style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 10 }}>Available times on {fmtShort(form.date)}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{TIMES.map(t => { const taken = appointments.some(a => a.date?.toDateString() === form.date?.toDateString() && a.time === t && a.groomer?.id === form.groomer?.id); return (
            <button key={t} disabled={taken} onClick={() => setForm(f => ({ ...f, time: t }))} style={{ padding: "8px 16px", borderRadius: 10, border: form.time === t ? `2px solid ${C.accent}` : `1px solid ${taken ? "transparent" : C.border}`, background: taken ? C.border : form.time === t ? C.accentLight : C.card, color: taken ? C.textMuted : C.text, cursor: taken ? "not-allowed" : "pointer", fontFamily: "inherit", fontWeight: form.time === t ? 700 : 400, fontSize: 14, opacity: taken ? 0.5 : 1 }}>{t}</button>); })}</div></>)}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}><button onClick={() => setStep(3)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← Back</button><Btn onClick={confirmBooking} disabled={!form.date || !form.time}>Confirm Booking ✓</Btn></div></Card>)}

      {step === 5 && (<Card className="scale-in" style={{ textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div><h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700 }}>Booking Confirmed!</h2>
        <p style={{ color: C.textMuted, marginTop: 8, marginBottom: 24 }}>{form.service?.name} for {form.pet?.name || form.petName} with {form.groomer?.name}<br />{form.date && fmt(form.date)} at {form.time}</p>
        <div style={{ background: C.tealLight, padding: 16, borderRadius: 12, fontSize: 13, marginBottom: 24 }}>📲 Automated reminder will be sent 24h before the appointment</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}><Btn onClick={() => onNav("calendar")}>View Calendar</Btn><Btn variant="secondary" onClick={resetForm}>New Booking</Btn></div></Card>)}
    </div>
  );
};
