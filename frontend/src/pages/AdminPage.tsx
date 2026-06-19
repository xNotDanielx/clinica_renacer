import { useEffect, useMemo, useState } from "react";
import AdminLogin from "../components/AdminLogin";
import { apiFetch } from "../components/api";

type TabKey = "Inicio" | "Pacientes" | "Citas" | "Autorizar Citas";

const tabs: TabKey[] = ["Inicio", "Pacientes", "Citas", "Autorizar Citas"];

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
  const [appointments, setAppointments] = useState<any[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);

  const authorizations = useMemo(
    () =>
      pendingAppointments.filter((appointment) =>
        [appointment.id_paciente,
          appointment.fecha_programada,
          appointment.hora_inicio,
          appointment.estado]
          .join(" ")
          .toLowerCase()
          .includes(appointmentQuery.toLowerCase())
      ),
    [pendingAppointments, appointmentQuery]
  );

  const cargarCitas = async () => {
  try {
    const data = await apiFetch("/citas/todas");
    setAppointments(data);
    } catch (e) {
      console.error(e);
    }
  };

  const buscarCitas = async (query: string) => {
    try {
      const data = await apiFetch(`/citas/filtrar?buscar=${encodeURIComponent(query)}`);
      setAppointments(data);
    } catch (e) {
      console.error(e);
    }
  };

  const eliminarCita = async (cita_id: number) => {
    try {
      await apiFetch(`/citas/${cita_id}`, {
        method: "DELETE",
      });
      cargarCitas();
    } catch (e) {
      console.error(e);
    }
  };

  const cargarPendientes = async () => {
  try {
    const data = await apiFetch("/citas/pendientes-aprobacion");
    setPendingAppointments(data);
    } catch (e) {
      console.error(e);
    }
  };

  const cargarPacientes = async () => {
    try {
      const data = await apiFetch("/pacientes");
      setPatients(data);
    } catch (e) {
      console.error(e);
    }
  };

  const buscarPacientes = async (query: string) => {
    try {
      const data = await apiFetch(`/pacientes/filtrar?buscar=${encodeURIComponent(query)}`);
      setPatients(data);
    } catch (e) {
      console.error(e);
    }
  };

  const eliminarPaciente = async (identificacion: string) => {
    try {
      await apiFetch(`/pacientes/${identificacion}`, {
        method: "DELETE",
      });
      cargarPacientes();
    } catch (e) {
      console.error(e);
    }
  };

  const autorizarCita = async (cita_id: number) => {
    try {
      await apiFetch(`/citas/${cita_id}/aprobar`, {
        method: "PATCH",
      });
      cargarPendientes();
      cargarCitas();
    } catch (error) {
      console.error(error);
    }
  };

  const rechazarCita = async (cita_id: number) => {
    try {
      await apiFetch(`/citas/${cita_id}/rechazar`, {
        method: "PATCH",
      });
      cargarPendientes();
      cargarCitas();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      cargarCitas();
      cargarPendientes();
      cargarPacientes();
    }
  }, [loggedIn]);

  useEffect(() => {
  if (activeTab !== "Citas") return;

  const timeout = setTimeout(() => {
    if (appointmentQuery.trim() === "") {
      cargarCitas();
    } else {
      buscarCitas(appointmentQuery);
    }
  }, 300);

  return () => clearTimeout(timeout);
  }, [appointmentQuery, activeTab]);

  useEffect(() => {
    if (activeTab !== "Autorizar Citas") return;

    const timeout = setTimeout(() => {
      if (appointmentQuery.trim() === "") {
        cargarPendientes();
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [appointmentQuery, activeTab]);

  useEffect(() => {
    if (activeTab !== "Pacientes") return;

    const timeout = setTimeout(() => {
      if (patientQuery.trim() === "") {
        cargarPacientes();
      } else {
        buscarPacientes(patientQuery);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [patientQuery, activeTab]);

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
                      {patients.map((patient) => (
                        <tr key={patient.identificacion}>
                          <td className="px-6 py-4 font-semibold text-cyan-300">{patient.identificacion}</td>
                          <td className="px-6 py-4">{patient.nombre_completo}</td>
                          <td className="px-6 py-4">{patient.telefono}</td>
                          <td className="px-6 py-4">{patient.email}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button className="rounded-2xl bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-400/20">Editar</button>
                              <button 
                              onClick={() => eliminarPaciente(patient.identificacion)}
                              className="rounded-2xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20">Eliminar</button>
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
                        <th className="px-6 py-4">Identificación</th>
                        <th className="px-6 py-4">Paciente</th>
                        <th className="px-6 py-4">Fecha</th>
                        <th className="px-6 py-4">Hora</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-slate-950/70 text-sm text-slate-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 font-semibold text-cyan-300">{appointment.id_paciente}</td>
                          <td className="px-6 py-4">{appointment.nombre_paciente}</td>
                          <td className="px-6 py-4">{appointment.fecha_programada}</td>
                          <td className="px-6 py-4">{appointment.hora_inicio}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                              statusClasses[appointment.estado as keyof typeof statusClasses] || "bg-gray-500/10 text-gray-300 border-gray-500/20"}`}>
                              {appointment.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button className="rounded-2xl bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-200 hover:bg-violet-500/20">Editar</button>
                              <button 
                                className="rounded-2xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20"
                                onClick={() => eliminarCita(appointment.id)}
                              >
                                Eliminar
                              </button>
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
                        <th className="px-6 py-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-slate-950/70 text-sm text-slate-200">
                      {authorizations.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 font-semibold text-cyan-300">{item.id_paciente}</td>
                          <td className="px-6 py-4">{item.nombre_paciente}</td>
                          <td className="px-6 py-4">{item.fecha_programada}</td>
                          <td className="px-6 py-4">{item.hora_inicio}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button 
                              onClick={() => autorizarCita(item.id)}
                              className="rounded-2xl bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/20"
                              >
                                Autorizar
                              </button>
                              <button 
                              onClick={() => rechazarCita(item.id)}
                              className="rounded-2xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20">Rechazar</button>
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

