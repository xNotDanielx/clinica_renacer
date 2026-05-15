import { useEffect, useMemo, useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

const galleryPairs = Array.from({ length: 9 }).map((_, index) => ({
  before: `Antes ${index + 1}`,
  after: `Después ${index + 1}`,
  beforeImage: `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80&sig=${index + 1}`,
  afterImage: `https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80&sig=${index + 20}`,
}));

type AppointmentForm = {
  identificationType: string;
  identificationNumber: string;
  fullName: string;
  countryCode: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  sex: string;
  date: string;
  notes: string;
  procedures: string[];
};

type FormErrors = {
  identificationType?: string;
  identificationNumber?: string;
  fullName?: string;
  phone?: string;
  sex?: string;
  date?: string;
  procedures?: string;
};

type Procedure = {
  id: string;
  name: string;
  info: string;
  image: string;
};

const initialForm: AppointmentForm = {
  identificationType: "",
  identificationNumber: "",
  fullName: "",
  countryCode: "+56",
  phone: "",
  email: "",
  city: "",
  address: "",
  sex: "",
  date: "",
  notes: "",
  procedures: [],
};

const identificationOptions = [
  "Cédula / RUT",
  "Pasaporte",
  "RUT temporal",
  "Otro",
];

const countryOptions = [
  { code: "+56", flag: "🇨🇱" },
  { code: "+57", flag: "🇨🇴" },
  { code: "+54", flag: "🇦🇷" },
  { code: "+591", flag: "🇧🇴" },
  { code: "+55", flag: "🇧🇷" },
  { code: "+1", flag: "🇨🇦" },
  { code: "+506", flag: "🇨🇷" },
  { code: "+53", flag: "🇨🇺" },
  { code: "+593", flag: "🇪🇨" },
  { code: "+503", flag: "🇸🇻" },
  { code: "+34", flag: "🇪🇸" },
  { code: "+502", flag: "🇬🇹" },
  { code: "+504", flag: "🇭🇳" },
  { code: "+52", flag: "🇲🇽" },
  { code: "+505", flag: "🇳🇮" },
  { code: "+507", flag: "🇵🇦" },
  { code: "+595", flag: "🇵🇾" },
  { code: "+51", flag: "🇵🇪" },
  { code: "+351", flag: "🇵🇹" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+1", flag: "🇺🇸" },
  { code: "+598", flag: "🇺🇾" },
  { code: "+58", flag: "🇻🇪" },
];

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseLocalDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export default function App() {
  const [selected, setSelected] = useState<string[]>([]);
  const [blockedProcedure, setBlockedProcedure] = useState<string | null>(null);
  const [showLimitMessage, setShowLimitMessage] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState<AppointmentForm>(initialForm);
  const [formProcedureError, setFormProcedureError] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [isLoadingProcedures, setIsLoadingProcedures] = useState(true);

  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatLocalDate(tomorrow);
  }, []);

  const whatsappFloatingMessage = encodeURIComponent(
    "Hola, estoy interesad@, necesito más información sobre los procedimientos y la consulta."
  );
  const whatsappFloatingLink = `https://wa.me/573175697927?text=${whatsappFloatingMessage}`;

  const selectedSummary = useMemo(() => {
    return selected.length > 0 ? selected.join(" + ") : "Sin procedimientos seleccionados";
  }, [selected]);

  useEffect(() => {
    let mounted = true;

    const loadProcedures = async () => {
      try {
        const response = await fetch(`${BACKEND}/procedimientos/activos`);
        if (!response.ok) {
          if (mounted) {
            setProcedures([]);
          }
          return;
        }

        const data: unknown = await response.json();
        const normalized = (Array.isArray(data) ? data : [])
          .map((item, index) => {
            if (!item || typeof item !== "object") return null;
            const procedure = item as Record<string, unknown>;
            const name =
              typeof procedure.nombre === "string"
                ? procedure.nombre
                : typeof procedure.name === "string"
                  ? procedure.name
                  : "";

            if (!name) return null;

            const info =
              typeof procedure.descripcion === "string"
                ? procedure.descripcion
                : typeof procedure.info === "string"
                  ? procedure.info
                  : "";

            const rawImage =
              typeof procedure.url_imagen === "string"
                ? procedure.url_imagen
                : typeof procedure.image === "string"
                  ? procedure.image
                  : "";

            const image = rawImage
              ? rawImage.startsWith("http")
                ? rawImage
                : `${BACKEND}/${rawImage.replace(/^\/+/, "")}`
              : "";

            const idValue = procedure.id;
            const id =
              typeof idValue === "string" || typeof idValue === "number"
                ? String(idValue)
                : `${name}-${index}`;

            return { id, name, info, image };
          })
          .filter((item): item is Procedure => item !== null);

        if (mounted) {
          setProcedures(normalized);
        }
      } catch {
        if (mounted) {
          setProcedures([]);
        }
      } finally {
        if (mounted) {
          setIsLoadingProcedures(false);
        }
      }
    };

    loadProcedures();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const toggleProcedure = (name: string) => {
    if (selected.includes(name)) {
      setSelected((prev) => prev.filter((item) => item !== name));
      return;
    }

    if (selected.length >= 2) {
      setBlockedProcedure(name);
      setShowLimitMessage(true);

      window.clearTimeout((window as Window & { __limitTimer?: number }).__limitTimer);
      (window as Window & { __limitTimer?: number }).__limitTimer = window.setTimeout(() => {
        setBlockedProcedure(null);
        setShowLimitMessage(false);
      }, 1400);

      return;
    }

    setSelected((prev) => [...prev, name]);
  };

  const openAppointmentModal = (withSelectedProcedures = false) => {
    setFormProcedureError("");
    setFormErrors({});
    setAppointmentForm((prev) => ({
      ...prev,
      procedures: withSelectedProcedures ? selected.slice(0, 2) : prev.procedures,
    }));
    setIsModalOpen(true);
  };

  const closeAppointmentModal = () => {
    setIsModalOpen(false);
    setFormProcedureError("");
    setFormErrors({});
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    let sanitizedValue = value;

    if (name === "fullName") {
      sanitizedValue = value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
      sanitizedValue = sanitizedValue.replace(/\s{2,}/g, " ");
    }

    if (name === "phone") {
      sanitizedValue = value.replace(/[^0-9]/g, "");
    }

    if (name === "identificationNumber") {
      sanitizedValue = value.replace(/[^A-Za-z0-9-]/g, "");
    }

    setAppointmentForm((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleProcedureCheckbox = (procedureName: string) => {
    setFormProcedureError("");
    setFormErrors((prev) => ({
      ...prev,
      procedures: "",
    }));

    setAppointmentForm((prev) => {
      const exists = prev.procedures.includes(procedureName);

      if (exists) {
        return {
          ...prev,
          procedures: prev.procedures.filter((item) => item !== procedureName),
        };
      }

      if (prev.procedures.length >= 2) {
        setFormProcedureError("Solo puedes seleccionar máximo 2 procedimientos.");
        return prev;
      }

      return {
        ...prev,
        procedures: [...prev.procedures, procedureName],
      };
    });
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    const cleanName = appointmentForm.fullName.trim();
    const cleanPhone = appointmentForm.phone.trim();

    const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    const phoneRegex = /^[0-9]+$/;

    if (!appointmentForm.identificationType.trim()) {
      errors.identificationType = "Selecciona el tipo de documento.";
    }

    if (!appointmentForm.identificationNumber.trim()) {
      errors.identificationNumber = "Ingresa el número de documento.";
    }

    if (!cleanName) {
      errors.fullName = "Ingresa tu nombre.";
    } else if (!nameRegex.test(cleanName)) {
      errors.fullName = "El nombre solo puede contener letras y espacios.";
    } else if (cleanName.length < 3) {
      errors.fullName = "Ingresa un nombre válido.";
    }

    if (!appointmentForm.countryCode.trim()) {
      errors.phone = "Selecciona un indicativo de país.";
    } else if (!cleanPhone) {
      errors.phone = "Ingresa tu número celular.";
    } else if (!phoneRegex.test(cleanPhone)) {
      errors.phone = "El celular solo puede contener números.";
    } else if (cleanPhone.length < 7) {
      errors.phone = "Ingresa un número celular válido.";
    }

    if (!appointmentForm.sex.trim()) {
      errors.sex = "Selecciona tu sexo.";
    }

    if (!appointmentForm.date.trim()) {
      errors.date = "Selecciona una fecha.";
    } else {
      const selectedDate = parseLocalDate(appointmentForm.date);
      const tomorrowDate = parseLocalDate(minDate);

      if (selectedDate.getTime() < tomorrowDate.getTime()) {
        errors.date = "La fecha debe ser posterior al día de hoy.";
      }
    }

    if (appointmentForm.procedures.length === 0) {
      errors.procedures = "Selecciona al menos 1 procedimiento.";
    }

    setFormErrors(errors);
    setFormProcedureError(errors.procedures || "");

    return Object.keys(errors).length === 0;
  };

  const handleAppointmentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const whatsappText = [
      "Hola, deseo agendar una consulta.",
      "",
      `Tipo de identificación: ${appointmentForm.identificationType}`,
      `Número de identificación: ${appointmentForm.identificationNumber}`,
      `Nombre completo: ${appointmentForm.fullName}`,
      `Número celular: ${appointmentForm.countryCode} ${appointmentForm.phone}`,
      `Correo: ${appointmentForm.email || "No registrado"}`,
      `Ciudad: ${appointmentForm.city || "No registrada"}`,
      `Dirección: ${appointmentForm.address || "No registrada"}`,
      `Sexo: ${appointmentForm.sex}`,
      `Fecha deseada: ${appointmentForm.date}`,
      `Procedimientos seleccionados: ${appointmentForm.procedures.join(", ")}`,
      `Mensaje adicional: ${appointmentForm.notes || "Sin mensaje adicional"}`,
    ].join("\n");

    const whatsappLink = `https://wa.me/573175697927?text=${encodeURIComponent(whatsappText)}`;
    window.open(whatsappLink, "_blank", "noopener,noreferrer");

    setIsModalOpen(false);
    setAppointmentForm(initialForm);
    setFormProcedureError("");
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.22),transparent_30%),radial-gradient(circle_at_right,rgba(56,189,248,0.16),transparent_28%),linear-gradient(180deg,#050816_0%,#090b1a_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="w-[300px] shrink-0 leading-tight">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300 whitespace-nowrap">
              CLÍNICA ESTÉTICA
            </p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white whitespace-nowrap">
              Renacer
            </h1>
          </div>

          <nav className="hidden md:flex flex-1 justify-center items-center gap-8 text-sm md:text-base font-bold">
            <a className="nav-link-ghost text-sm md:text-base uppercase tracking-[0.14em]" href="#inicio">INICIO</a>
            <a className="nav-link-ghost text-sm md:text-base uppercase tracking-[0.14em]" href="#procedimientos">PROCEDIMIENTOS</a>
            <a className="nav-link-ghost text-sm md:text-base uppercase tracking-[0.14em]" href="#galeria">ANTES Y DESPUÉS</a>
            <a className="nav-link-ghost text-sm md:text-base uppercase tracking-[0.14em]" href="#contacto">CONTÁCTANOS</a>
          </nav>

          <div className="hidden md:block w-[300px] shrink-0" />
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-24">
        <section id="inicio" className="py-16 md:py-24 scroll-mt-24">
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 md:p-9 backdrop-blur-xl">
              <p className="section-kicker">Clínica estética</p>
              <h2 className="mt-3 text-4xl md:text-6xl font-black tracking-tight text-white">
                Clínica Renacer
              </h2>
              <p className="mt-4 text-xl md:text-2xl font-semibold text-cyan-200">
                Doctor Miguel Mendoza
              </p>

              <p className="mt-4 text-base md:text-lg font-medium text-violet-200 italic">
                “Belleza, confianza y acompañamiento en cada etapa del proceso.”
              </p>

              <p className="mt-5 text-base md:text-lg leading-8 text-slate-300 max-w-2xl">
                Un espacio especializado en procedimientos corporales, atención personalizada y una experiencia moderna. El doctor Miguel Mendoza brinda valoración individual, enfoque estético y seguimiento cercano para cada paciente.
              </p>

              <div className="mt-7 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => openAppointmentModal(false)}
                  className="btn-primary"
                >
                  Agendar consulta
                </button>
                <a href="#procedimientos" className="btn-secondary">
                  Ver procedimientos
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-violet-600/20 via-cyan-500/15 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
                <div className="aspect-[4/5] w-full rounded-[2rem] bg-black flex items-center justify-center text-base text-white/45">
                  Foto del doctor
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Experiencia", "Atención profesional con enfoque en resultados naturales."],
              ["Seguridad", "Valoración previa y acompañamiento médico en cada proceso."],
              ["Acompañamiento", "Seguimiento cercano antes y después de la cirugía."],
              ["Confianza", "Información clara para ayudarte a tomar la mejor decisión."],
            ].map(([title, text]) => (
              <article key={title} className="glass-card hover:scale-[1.02] hover:-translate-y-1 hover:bg-white/10">
                <p className="section-kicker">{title}</p>
                <h3 className="card-title">{title}</h3>
                <p className="card-text">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <Separator />

        <section id="procedimientos" className="py-16 md:py-24 scroll-mt-24">
          <div className="mb-10">
            <p className="section-kicker">Procedimientos</p>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight">
              Servicios corporales disponibles
            </h3>
            <p className="mt-4 text-base md:text-lg text-slate-300 max-w-4xl">
              Selecciona máximo 2 cirugías por día o consulta. Luego se confirma la combinación más adecuada con el doctor.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {isLoadingProcedures ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`loading-${index}`}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-8 h-56 animate-pulse"
                />
              ))
            ) : procedures.length === 0 ? (
              <p className="text-slate-300">No hay procedimientos disponibles.</p>
            ) : (
              procedures.map((item) => {
                const active = selected.includes(item.name);
                const blocked = blockedProcedure === item.name;

                return (
                  <button
                    key={item.id}
                    onClick={() => toggleProcedure(item.name)}
                    className={`procedure-hover-card p-8 ${active ? "ring-2 ring-cyan-400" : ""} ${blocked ? "ring-2 ring-red-500 bg-red-500/20 border-red-400/50" : ""}`}
                  >
                    <div className="procedure-hover-front h-full flex flex-col items-center text-center">
                      <p className="text-xl md:text-2xl font-black text-white uppercase tracking-[0.05em] leading-tight text-center">
                        {item.name}
                      </p>

                      <p className="mt-5 text-base md:text-lg text-slate-200 leading-7 text-center md:text-justify max-w-[28rem]">
                        {item.info}
                      </p>
                    </div>

                    <div className="procedure-hover-image">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/35" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-base font-bold text-white">{item.name}</p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {showLimitMessage && (
            <div className="mt-8 rounded-3xl border border-red-500/40 bg-red-500/10 p-5 md:p-6 text-red-100 backdrop-blur-xl">
              <p className="text-base md:text-lg font-semibold">
                Máximo 2 cirugías por consulta.
              </p>
              <p className="mt-2 text-sm md:text-base text-red-100/80">
                Para más información sobre combinaciones o procedimientos adicionales, consulta con el doctor.
              </p>
            </div>
          )}

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-semibold">
                Procedimientos seleccionados
              </p>
              <h4 className="mt-2 text-xl md:text-2xl font-black leading-tight">
                {selectedSummary}
              </h4>
              <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl">
                Los valores se confirman directamente con el doctor durante la consulta, ya que pueden variar según promociones, valoración médica y características del procedimiento.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openAppointmentModal(true)}
              className="btn-primary text-base md:text-lg"
            >
              Agendar consulta
            </button>
          </div>
        </section>

        <Separator glow="violet" />

        <section id="galeria" className="py-16 md:py-24 scroll-mt-24">
          <div className="mb-10">
            <p className="section-kicker">Galería</p>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight">
              Antes y después
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {galleryPairs.map((pair, idx) => (
              <div key={idx} className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="gallery-card">
                    <img src={pair.beforeImage} alt={pair.before} className="h-full w-full object-cover" />
                    <div className="gallery-label">ANTES</div>
                  </div>
                  <div className="gallery-card">
                    <img src={pair.afterImage} alt={pair.after} className="h-full w-full object-cover" />
                    <div className="gallery-label">DESPUÉS</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        <section id="contacto" className="py-16 md:py-24 scroll-mt-24">
          <div className="grid gap-6 lg:grid-cols-2 items-stretch">
            <div className="contact-card">
              <p className="section-kicker">Contacto</p>
              <h3 className="text-3xl md:text-4xl font-black tracking-tight">Contáctanos</h3>

              <div className="mt-8 space-y-5 text-slate-300 leading-7 text-base md:text-lg">
                <p><span className="font-semibold text-white">Ubicación:</span> Santiago de Chile</p>
                <p><span className="font-semibold text-white">Dirección:</span> Hernando De Aguirre 128, Consultorio 805, Edificio Copiapó, Providencia. Metro Tobalaba</p>
                <p><span className="font-semibold text-white">Correo:</span> contacto@clinicarenacer.com</p>
                <p><span className="font-semibold text-white">Teléfono:</span> +56 9 0000 0000</p>
              </div>
            </div>

            <div className="map-card">
              <iframe
                title="Ubicación Clínica Renacer"
                src="https://www.google.com/maps?q=Hernando%20De%20Aguirre%20128%20Consultorio%20805%20Edificio%20Copiap%C3%B3%20Providencia%20Metro%20Tobalaba%20Santiago%20de%20Chile&output=embed"
                className="h-[560px] w-full rounded-[1.3rem] border-0 grayscale-[0.1]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>

      <a
        href={whatsappFloatingLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir chat de WhatsApp"
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_rgba(37,211,102,0.35)] transition-transform duration-300 hover:scale-110"
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden="true">
          <path d="M19.11 17.28c-.29-.15-1.72-.85-1.98-.94-.27-.1-.46-.15-.66.15s-.75.94-.92 1.13c-.17.2-.34.22-.63.08-.29-.15-1.2-.44-2.28-1.4-.84-.75-1.41-1.68-1.57-1.97-.17-.29-.02-.45.12-.6.12-.12.29-.32.44-.49.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.52-.07-.15-.66-1.59-.9-2.18-.24-.58-.49-.5-.66-.51h-.56c-.2 0-.52.07-.79.37-.27.29-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.72-.7 1.96-1.37.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.34Z" />
          <path d="M16.03 3.2c-6.98 0-12.65 5.67-12.65 12.65 0 2.22.58 4.38 1.68 6.28L3.2 28.8l6.84-1.8a12.6 12.6 0 0 0 5.99 1.52h.01c6.98 0 12.76-5.67 12.76-12.65 0-3.38-1.32-6.56-3.72-8.95A12.56 12.56 0 0 0 16.03 3.2Zm0 23.18h-.01a10.47 10.47 0 0 1-5.34-1.46l-.38-.22-4.06 1.07 1.08-3.96-.25-.41a10.43 10.43 0 0 1-1.61-5.54c0-5.76 4.69-10.45 10.47-10.45 2.79 0 5.4 1.08 7.37 3.05a10.34 10.34 0 0 1 3.06 7.39c0 5.77-4.7 10.45-10.33 10.45Z" />
        </svg>
      </a>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="appointment-modal-title"
          onClick={closeAppointmentModal}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/10 bg-[#0b1020] p-5 md:p-7 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="-mx-5 -mt-5 mb-6 flex items-start justify-between gap-4 rounded-t-[2rem] border-b border-white/10 bg-[#0b1020] px-5 py-4 md:-mx-7 md:-mt-7 md:px-7">
              <div>
                <p className="section-kicker">Consulta</p>
                <h3 id="appointment-modal-title" className="mt-2 text-xl md:text-2xl font-black text-white">
                  Agenda tu valoración
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Completa tus datos y selecciona máximo 2 procedimientos.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAppointmentModal}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Cerrar formulario"
              >
                ✕
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleAppointmentSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="form-field">
                  <span className="form-label">Tipo de identificación *</span>
                  <select
                    name="identificationType"
                    value={appointmentForm.identificationType}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {identificationOptions.map((option) => (
                      <option key={option} value={option} className="bg-slate-900">
                        {option}
                      </option>
                    ))}
                  </select>
                  {formErrors.identificationType && (
                    <p className="form-error">{formErrors.identificationType}</p>
                  )}
                </label>

                <label className="form-field">
                  <span className="form-label">Número de identificación *</span>
                  <input
                    name="identificationNumber"
                    value={appointmentForm.identificationNumber}
                    onChange={handleInputChange}
                    placeholder="Escribe tu identificación"
                    className="form-input"
                    required
                  />
                  {formErrors.identificationNumber && (
                    <p className="form-error">{formErrors.identificationNumber}</p>
                  )}
                </label>

                <label className="form-field">
                  <span className="form-label">Nombre completo *</span>
                  <input
                    name="fullName"
                    value={appointmentForm.fullName}
                    onChange={handleInputChange}
                    placeholder="Escribe tu nombre"
                    className="form-input"
                    inputMode="text"
                    pattern="[A-Za-zÀ-ÿ\s]+"
                    title="Solo se permiten letras y espacios"
                    required
                  />
                  {formErrors.fullName && (
                    <p className="form-error">{formErrors.fullName}</p>
                  )}
                </label>

                <div className="form-field">
                  <span className="form-label">Número celular *</span>

                  <div className="phone-group">
                    <select
                      name="countryCode"
                      value={appointmentForm.countryCode}
                      onChange={handleInputChange}
                      className="phone-code-select"
                      required
                    >
                      {countryOptions.map((item, index) => (
                        <option
                          key={`${item.code}-${index}`}
                          value={item.code}
                          className="bg-slate-900"
                        >
                          {item.flag} {item.code}
                        </option>
                      ))}
                    </select>

                    <input
                      name="phone"
                      value={appointmentForm.phone}
                      onChange={handleInputChange}
                      className="phone-number-input"
                      inputMode="numeric"
                      pattern="[0-9]+"
                      title="Solo se permiten números"
                      required
                    />
                  </div>

                  {formErrors.phone && (
                    <p className="form-error">{formErrors.phone}</p>
                  )}
                </div>

                <label className="form-field">
                  <span className="form-label">Correo electrónico</span>
                  <input
                    type="email"
                    name="email"
                    value={appointmentForm.email}
                    onChange={handleInputChange}
                    placeholder="correo@ejemplo.com"
                    className="form-input"
                  />
                </label>

                <label className="form-field">
                  <span className="form-label">Ciudad</span>
                  <input
                    name="city"
                    value={appointmentForm.city}
                    onChange={handleInputChange}
                    placeholder="Escribe tu ciudad"
                    className="form-input"
                  />
                </label>

                <label className="form-field md:col-span-2">
                  <span className="form-label">Dirección</span>
                  <input
                    name="address"
                    value={appointmentForm.address}
                    onChange={handleInputChange}
                    placeholder="Escribe tu dirección"
                    className="form-input"
                  />
                </label>

                <div className="form-field md:col-span-2">
                  <span className="form-label">Sexo *</span>
                  <div className="flex flex-wrap gap-2">
                    {["Masculino", "Femenino"].map((option) => (
                      <label
                        key={option}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 transition cursor-pointer ${
                          appointmentForm.sex === option
                            ? "border-cyan-400 bg-cyan-400/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="radio"
                          name="sex"
                          value={option}
                          checked={appointmentForm.sex === option}
                          onChange={handleInputChange}
                          className="h-3.5 w-3.5 accent-cyan-400"
                          required
                        />
                        <span className="text-sm text-white">{option}</span>
                      </label>
                    ))}
                  </div>
                  {formErrors.sex && (
                    <p className="form-error">{formErrors.sex}</p>
                  )}
                </div>

                <label className="form-field md:col-span-2">
                  <span className="form-label">Fecha deseada *</span>
                  <input
                    type="date"
                    name="date"
                    value={appointmentForm.date}
                    onChange={handleInputChange}
                    className="form-input"
                    min={minDate}
                    required
                  />
                  {formErrors.date && (
                    <p className="form-error">{formErrors.date}</p>
                  )}
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <p className="form-label">Procedimientos de interés *</p>
                  <span className="text-xs md:text-sm text-slate-400">
                    Máximo 2 selecciones
                  </span>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {procedures.map((procedure) => {
                    const checked = appointmentForm.procedures.includes(procedure.name);
                    const disabled = !checked && appointmentForm.procedures.length >= 2;

                    return (
                      <label
                        key={procedure.name}
                        className={`rounded-2xl border px-4 py-3 transition ${
                          checked
                            ? "border-cyan-400 bg-cyan-400/10"
                            : disabled
                            ? "border-white/5 bg-white/[0.03] opacity-50 cursor-not-allowed"
                            : "border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleProcedureCheckbox(procedure.name)}
                          disabled={disabled}
                          className="sr-only"
                        />
                        <span className="text-sm md:text-base font-semibold text-white">
                          {procedure.name}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {formProcedureError && (
                  <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {formProcedureError}
                  </p>
                )}
              </div>

              <label className="form-field">
                <span className="form-label">Mensaje adicional</span>
                <textarea
                  name="notes"
                  value={appointmentForm.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Cuéntanos qué información necesitas o qué procedimiento te interesa."
                  className="form-input min-h-[110px] resize-none"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeAppointmentModal}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Enviar a WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Separator({ glow = "cyan" }: { glow?: "cyan" | "violet" }) {
  const glowClass =
    glow === "cyan"
      ? "from-cyan-400/35 via-cyan-300/15 to-transparent"
      : "from-violet-400/35 via-violet-300/15 to-transparent";

  return (
    <div className="relative my-8 h-24 w-full overflow-visible">
      <div className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r ${glowClass}`} />
      <div className={`absolute inset-x-[4%] top-1/2 h-20 -translate-y-1/2 bg-gradient-to-r ${glowClass} blur-3xl opacity-70`} />
      <div className="absolute inset-x-[14%] top-1/2 h-12 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute inset-x-[8%] top-1/2 h-px -translate-y-1/2 bg-white/10" />
    </div>
  );
}
