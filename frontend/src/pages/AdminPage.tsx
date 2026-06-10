import { useMemo, useState } from "react";
import AdminLogin from "../components/AdminLogin";

type TabKey = "Inicio" | "Pacientes" | "Citas" | "Autorizar Citas";

type Patient = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

type Appointment = {
  id: number;
  patient: string;
  date: string;
  time: string;
  service: string;
  status: "Pendiente" | "Confirmada" | "Cancelada";
};

type Authorization = {
  id: number;
  patient: string;
  date: string;
  time: string;
  service: string;
};

const tabs: TabKey[] = ["Inicio", "Pacientes", "Citas", "Autorizar Citas"];

const patients: Patient[] = [
  { id: 1, name: "María González", phone: "+569 1234 5678", email: "maria@gmail.com" },
  { id: 2, name: "Juan Pérez", phone: "+569 8765 4321", email: "juanperez@gmail.com" },
  { id: 3, name: "Carla Rodríguez", phone: "+569 2345 6789", email: "carla.rodriguez@gmail.com" },
  { id: 4, name: "Pedro Sánchez", phone: "+569 3456 7890", email: "pedro.sanchez@gmail.com" },
  { id: 5, name: "Laura Martínez", phone: "+569 4567 8901", email: "laura.martinez@gmail.com" },
];

const appointments: Appointment[] = [
  { id: 1, patient: "María González", date: "25/05/2024", time: "10:00", service: "Limpieza Facial", status: "Pendiente" },
  { id: 2, patient: "Juan Pérez", date: "25/05/2024", time: "11:30", service: "Botox", status: "Confirmada" },
  { id: 3, patient: "Carla Rodríguez", date: "26/05/2024", time: "09:00", service: "Relleno de Labios", status: "Pendiente" },
  { id: 4, patient: "Pedro Sánchez", date: "26/05/2024", time: "15:00", service: "Depilación Láser", status: "Cancelada" },
  { id: 5, patient: "Laura Martínez", date: "27/05/2024", time: "13:00", service: "Micropigmentación", status: "Confirmada" },
];

const authorizations: Authorization[] = [
  { id: 1, patient: "María González", date: "25/05/2024", time: "10:00", service: "Limpieza Facial" },
  { id: 2, patient: "Carla Rodríguez", date: "26/05/2024", time: "09:00", service: "Relleno de Labios" },
  { id: 3, patient: "Pedro Sánchez", date: "27/05/2024", time: "11:00", service: "Peeling Químico" },
  { id: 4, patient: "Ana Torres", date: "28/05/2024", time: "14:30", service: "Botox" },
];

const statusClasses = {
  Pendiente: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  Confirmada: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  Cancelada: "bg-red-500/10 text-red-300 border-red-500/20",
};

const sidebarItems: TabKey[] = ["Inicio", "Pacientes", "Citas", "Autorizar Citas"];

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("Inicio");
  const [patientQuery, setPatientQuery] = useState("");
  const [appointmentQuery, setAppointmentQuery] = useState("");

  const filteredPatients = useMemo(
    () =>
      patients.filter((patient) =>
        [patient.name, patient.phone, patient.email]
          .join(" ")
          .toLowerCase()
          .includes(patientQuery.toLowerCase())
      ),
    [patientQuery]
  );

  const filteredAppointments = useMemo(
    () =>
      appointments.filter((appointment) =>
        [appointment.patient, appointment.date, appointment.time, appointment.service]
          .join(" ")
          .toLowerCase()
          .includes(appointmentQuery.toLowerCase())
      ),
    [appointmentQuery]
  );

  const handleLogin = async (
  event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/administradores/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario: username,
            contrasena: password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      setLoggedIn(true);
    } catch (error) {
      console.error(error);
      alert("Usuario o contraseña incorrectos");
    }
  };

  if (!loggedIn) {
    return (
      <AdminLogin
        username={username}
        password={password}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        onForgotPassword={() => {}}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.22),transparent_30%),radial-gradient(circle_at_right,rgba(56,189,248,0.16),transparent_28%),linear-gradient(180deg,#050816_0%,#090b1a_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-3 rounded-3xl bg-violet-600/10 px-4 py-2 text-sm text-violet-200 ring-1 ring-violet-500/20">
                <span className="h-10 w-10 rounded-2xl bg-violet-500/15 flex items-center justify-center text-lg">R</span>
                <span className="font-semibold">Clínica Renacer</span>
              </div>
              <p className="text-2xl font-black tracking-tight">Panel de administración</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                      activeTab === tab
                        ? "bg-violet-500 text-slate-950"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/10 px-4 py-3">
                <span className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-lg font-semibold text-white">A</span>
                <div>
                  <p className="text-sm text-slate-300">Administrador</p>
                  <p className="text-sm font-semibold text-white">Usuario</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Navegación</p>
                <div className="space-y-2">
                  {sidebarItems.map((item) => (
                    <button
                      key={item}
                      onClick={() => setActiveTab(item)}
                      className={`flex w-full items-center justify-between rounded-3xl border px-4 py-4 text-left text-sm font-semibold transition ${
                        activeTab === item
                          ? "border-cyan-400/30 bg-cyan-500/10 text-white"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/20 hover:bg-white/10"
                      }`}
                    >
                      <span>{item}</span>
                      {activeTab === item ? <span>·</span> : null}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Estado</p>
                <p className="mt-3 text-lg font-semibold text-white">Panel activo</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Usa esta página para gestionar pacientes, citas y autorizaciones desde la administración.
                </p>
              </div>

              <button
                className="w-full rounded-3xl bg-red-500 px-4 py-4 text-sm font-semibold text-white transition hover:bg-red-400"
                type="button"
                onClick={() => {
                  setLoggedIn(false);
                  setPassword("");
                  setActiveTab("Inicio");
                }}
              >
                Cerrar sesión
              </button>
            </div>
          </aside>

          <main className="space-y-6">
            {activeTab === "Inicio" && (
              <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Bienvenido</p>
                    <h1 className="mt-3 text-4xl font-black text-white">Hola, Administrador</h1>
                    <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                      ¡Bienvenido al panel de administración! Selecciona una pestaña en el lado izquierdo o en la parte superior para comenzar.
                    </p>
                  </div>
                  <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-violet-500/10 text-3xl text-violet-300">👋</div>
                    <p className="mt-5 text-sm uppercase tracking-[0.28em] text-cyan-300">Administración</p>
                    <p className="mt-2 text-xl font-bold text-white">Dashboard</p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "Pacientes" && (
              <section className="space-y-6">
                <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Pacientes</p>
                    <h2 className="mt-2 text-3xl font-black text-white">Lista de pacientes</h2>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      placeholder="Buscar paciente..."
                      value={patientQuery}
                      onChange={(event) => setPatientQuery(event.target.value)}
                      className="w-full min-w-[220px] rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                    <button className="btn-primary whitespace-nowrap">Agregar paciente</button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-slate-950/70 text-left text-sm uppercase tracking-[0.2em] text-slate-400">
                      <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Nombre</th>
                        <th className="px-6 py-4">Teléfono</th>
                        <th className="px-6 py-4">Correo electrónico</th>
                        <th className="px-6 py-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-slate-950/70 text-sm text-slate-200">
                      {filteredPatients.map((patient) => (
                        <tr key={patient.id}>
                          <td className="px-6 py-4 font-semibold text-cyan-300">{patient.id}</td>
                          <td className="px-6 py-4">{patient.name}</td>
                          <td className="px-6 py-4">{patient.phone}</td>
                          <td className="px-6 py-4">{patient.email}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button className="rounded-2xl bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-400/20">Editar</button>
                              <button className="rounded-2xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20">Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeTab === "Citas" && (
              <section className="space-y-6">
                <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Citas</p>
                    <h2 className="mt-2 text-3xl font-black text-white">Agenda de citas</h2>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      placeholder="Buscar cita..."
                      value={appointmentQuery}
                      onChange={(event) => setAppointmentQuery(event.target.value)}
                      className="w-full min-w-[220px] rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                    <button className="btn-primary whitespace-nowrap">Agregar cita</button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-slate-950/70 text-left text-sm uppercase tracking-[0.2em] text-slate-400">
                      <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Paciente</th>
                        <th className="px-6 py-4">Fecha</th>
                        <th className="px-6 py-4">Hora</th>
                        <th className="px-6 py-4">Servicio</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-slate-950/70 text-sm text-slate-200">
                      {filteredAppointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 font-semibold text-cyan-300">{appointment.id}</td>
                          <td className="px-6 py-4">{appointment.patient}</td>
                          <td className="px-6 py-4">{appointment.date}</td>
                          <td className="px-6 py-4">{appointment.time}</td>
                          <td className="px-6 py-4">{appointment.service}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses[appointment.status]}`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button className="rounded-2xl bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-200 hover:bg-violet-500/20">Editar</button>
                              <button className="rounded-2xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20">Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeTab === "Autorizar Citas" && (
              <section className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-cyan-500/5 p-6 shadow-2xl backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Autorizar citas</p>
                  <h2 className="mt-2 text-3xl font-black text-white">Revisa las citas pendientes</h2>
                  <p className="mt-3 text-slate-300">
                    Revisa las citas pendientes y autorízalas para que sean confirmadas.
                  </p>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-slate-950/70 text-left text-sm uppercase tracking-[0.2em] text-slate-400">
                      <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Paciente</th>
                        <th className="px-6 py-4">Fecha</th>
                        <th className="px-6 py-4">Hora</th>
                        <th className="px-6 py-4">Servicio</th>
                        <th className="px-6 py-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-slate-950/70 text-sm text-slate-200">
                      {authorizations.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 font-semibold text-cyan-300">{item.id}</td>
                          <td className="px-6 py-4">{item.patient}</td>
                          <td className="px-6 py-4">{item.date}</td>
                          <td className="px-6 py-4">{item.time}</td>
                          <td className="px-6 py-4">{item.service}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button className="rounded-2xl bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/20">Autorizar</button>
                              <button className="rounded-2xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20">Rechazar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

