import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { C, FONTS_CSS } from "./lib/constants";
import { Sidebar } from "./components/Sidebar";
import { LoadingScreen } from "./components/ui";
import { AuthView } from "./views/AuthView";
import { DashboardView } from "./views/DashboardView";
import { CalendarView } from "./views/CalendarView";
import { BookingView } from "./views/BookingView";
import { ClientsView } from "./views/ClientsView";
import { ServicesView } from "./views/ServicesView";
import { StaffView } from "./views/StaffView";
import { TeamView } from "./views/TeamView";

const transformService = (s) => ({
  id: s.id, name: s.name, price: Number(s.price), duration: s.duration, icon: s.icon,
  sizes: { small: Number(s.size_small_extra), medium: Number(s.size_medium_extra), large: Number(s.size_large_extra) }
});

const transformPet = (p) => ({
  id: p.id, name: p.name, breed: p.breed || "", type: p.type || "Dog", size: p.size || "medium",
  weight: p.weight || "", age: p.age || "",
  owner: p.owners?.name || "", ownerPhone: p.owners?.phone || "", ownerEmail: p.owners?.email || "",
  allergies: p.allergies || "None", behavior: p.behavior || "", vaccination: p.vaccination || "Up to date", notes: p.notes || ""
});

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [salon, setSalon] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [page, setPage] = useState("dashboard");
  const [services, setServices] = useState([]);
  const [groomers, setGroomers] = useState([]);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check auth on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setAuthChecked(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load profile + salon when user is set
  useEffect(() => {
    if (!user) { setProfile(null); setSalon(null); setLoading(false); return; }
    const loadProfile = async () => {
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (prof) {
        setProfile(prof);
        const { data: sal } = await supabase.from("salons").select("*").eq("id", prof.salon_id).single();
        setSalon(sal);
      }
      setLoading(false);
    };
    loadProfile();
  }, [user]);

  // Load salon data when salon is set
  useEffect(() => {
    if (!salon) return;
    fetchAll();
  }, [salon]);

  const fetchAll = async () => {
    const [svcRes, groomRes, petRes, apptRes] = await Promise.all([
      supabase.from("services").select("*"),
      supabase.from("groomers").select("*"),
      supabase.from("pets").select("*, owners(*)"),
      supabase.from("appointments").select("*"),
    ]);
    const svcList = (svcRes.data || []).map(transformService);
    const groomList = (groomRes.data || []).map(g => ({ id: g.id, name: g.name, avatar: g.avatar, color: g.color, specialties: g.specialties || [] }));
    const petList = (petRes.data || []).map(transformPet);
    setServices(svcList);
    setGroomers(groomList);
    setPets(petList);
    const apptList = (apptRes.data || []).map(a => {
      const pet = petList.find(p => p.id === a.pet_id) || { id: a.pet_id, name: "Unknown", breed: "", type: "Dog", owner: "" };
      const service = svcList.find(s => s.id === a.service_id) || { id: a.service_id, name: "Unknown", price: 0, duration: 0, icon: "❓" };
      const groomer = groomList.find(g => g.id === a.groomer_id) || { id: a.groomer_id, name: "Unknown", avatar: "👤", color: "#999" };
      const [y, m, d] = a.date.split("-").map(Number);
      return { id: a.id, pet, service, groomer, date: new Date(y, m - 1, d), time: a.time, status: a.status, paid: a.paid };
    });
    setAppointments(apptList);
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    await supabase.from("appointments").update({ status: newStatus }).eq("id", id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  // Not checked yet
  if (!authChecked) return <><style>{FONTS_CSS}</style><LoadingScreen /></>;

  // Not logged in
  if (!user) return <><style>{FONTS_CSS}</style><AuthView onAuth={() => window.location.reload()} /></>;

  // Logged in but still loading
  if (loading || !salon) return <><style>{FONTS_CSS}</style><LoadingScreen /></>;

  return (
    <>
      <style>{FONTS_CSS}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
        <Sidebar active={page} onNav={setPage} profile={profile} salon={salon} />
        <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto", maxHeight: "100vh" }}>
          {page === "dashboard" && <DashboardView appointments={appointments} services={services} pets={pets} />}
          {page === "calendar" && <CalendarView appointments={appointments} groomers={groomers} onStatusChange={handleStatusChange} onNav={setPage} />}
          {page === "booking" && <BookingView appointments={appointments} services={services} groomers={groomers} pets={pets} salonId={salon.id} onBook={fetchAll} onNav={setPage} />}
          {page === "clients" && <ClientsView pets={pets} />}
          {page === "services" && <ServicesView services={services} />}
          {page === "staff" && <StaffView appointments={appointments} groomers={groomers} />}
          {page === "team" && <TeamView profile={profile} salon={salon} />}
        </main>
      </div>
    </>
  );
}
