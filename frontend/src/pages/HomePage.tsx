import { useEffect, useMemo, useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

const fallbackProcedures = [
  { id: 1, nombre: "Lipopapada", descripcion: "Reduce el exceso de grasa bajo el mentón y define el perfil facial.", url_imagen: "https://doctormonroy.com/wp-content/uploads/2020/01/rinoplastia-Bogota.jpg" },
  { id: 2, nombre: "Aumento Mamario Simple", descripcion: "Mejora el volumen y la armonía del busto con un resultado natural.", url_imagen: "https://doctorfajardo.com/wp-content/uploads/2021/12/aumento-de-senos.jpg" },
  { id: 3, nombre: "Mastopexia Circunvertical", descripcion: "Eleva y remodela el busto con una técnica de cicatriz vertical.", url_imagen: "https://objects-mx.cdn-topdoctors.com/article/22127/image/large/mastopexia-cirugia-para-levantar-rejuvenecer-senos-1747698085-1747698134.jpg" },
  { id: 4, nombre: "Mastopexia T Invertida", descripcion: "Lifting mamario indicado para mayor caída o exceso de piel.", url_imagen: "https://cbcestetica.com/wp-content/uploads/2016/03/maxtopexia.jpg" },
  { id: 5, nombre: "Lipoescultura 360 con Transferencia Glútea", descripcion: "Moldea el contorno corporal y aporta volumen glúteo con grasa propia.", url_imagen: "https://opcionmedica.es/wp-content/uploads/2019/03/liposuccion-360.jpg" },
  { id: 6, nombre: "Lipoabdominoplastia con Transferencia Glútea", descripcion: "Define abdomen y cintura, combinando retracción abdominal y proyección glútea.", url_imagen: "https://jorgeafanador.com/wp-content/uploads/2018/11/Abdominoplastia-cirugia-estetica-plastica.jpg" },
];

const countries = [
  { code: "CL", label: "Chile", dial: "56", flag: "🇨🇱" },
  { code: "AR", label: "Argentina", dial: "54", flag: "🇦🇷" },
  { code: "BO", label: "Bolivia", dial: "591", flag: "🇧🇴" },
  { code: "BR", label: "Brasil", dial: "55", flag: "🇧🇷" },
  { code: "CA", label: "Canadá", dial: "1", flag: "🇨🇦" },
  { code: "CO", label: "Colombia", dial: "57", flag: "🇨🇴" },
  { code: "CR", label: "Costa Rica", dial: "506", flag: "🇨🇷" },
  { code: "CU", label: "Cuba", dial: "53", flag: "🇨🇺" },
  { code: "DO", label: "República Dominicana", dial: "1", flag: "🇩🇴" },
  { code: "EC", label: "Ecuador", dial: "593", flag: "🇪🇨" },
  { code: "SV", label: "El Salvador", dial: "503", flag: "🇸🇻" },
  { code: "GT", label: "Guatemala", dial: "502", flag: "🇬🇹" },
  { code: "HN", label: "Honduras", dial: "504", flag: "🇭🇳" },
  { code: "MX", label: "México", dial: "52", flag: "🇲🇽" },
  { code: "NI", label: "Nicaragua", dial: "505", flag: "🇳🇮" },
  { code: "PA", label: "Panamá", dial: "507", flag: "🇵🇦" },
  { code: "PY", label: "Paraguay", dial: "595", flag: "🇵🇾" },
  { code: "PE", label: "Perú", dial: "51", flag: "🇵🇪" },
  { code: "PR", label: "Puerto Rico", dial: "1", flag: "🇵🇷" },
  { code: "US", label: "Estados Unidos", dial: "1", flag: "🇺🇸" },
  { code: "UY", label: "Uruguay", dial: "598", flag: "🇺🇾" },
  { code: "VE", label: "Venezuela", dial: "58", flag: "🇻🇪" },
  { code: "ES", label: "España", dial: "34", flag: "🇪🇸" },
  { code: "DE", label: "Alemania", dial: "49", flag: "🇩🇪" },
  { code: "GB", label: "Inglaterra", dial: "44", flag: "🇬🇧" },
];

const documentTypes = [
  { value: "RUT", label: "RUT (Chile)" },
  { value: "RUN", label: "RUN" },
  { value: "DNI", label: "DNI" },
  { value: "PASSPORT", label: "Pasaporte" },
  { value: "CE", label: "Cédula de extranjería" },
  { value: "OTRO", label: "Otro" },
];

const galleryPairs = Array.from({ length: 9 }).map((_, index) => ({
  before: `Antes ${index + 1}`,
  after: `Después ${index + 1}`,
  beforeImage: `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80&sig=${index + 1}`,
  afterImage: `https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80&sig=${index + 20}`,
}));

type FormData = {
  nombre: string;
  tipoDocumento: string;
  documento: string;
  prefijo: string;
  celular: string;
  fecha: string;
  procedimiento1: string;
  procedimiento2: string;
  mensaje: string;
};

const initialForm: FormData = {
  nombre: "",
  tipoDocumento: "RUT",
  documento: "",
  prefijo: "56",
  celular: "",
  fecha: "",
  procedimiento1: "",
  procedimiento2: "",
  mensaje: "",
};

function getMinDate() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toISOString().slice(0, 10);
}

function prefixLabel(dial: string, flag: string) {
  return `${flag} +${dial}`;
}

export default function HomePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [blockedProcedure, setBlockedProcedure] = useState<string | null>(null);
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const [proceduresData, setProceduresData] = useState<any[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const minDate = getMinDate();
  const selectedCountry = useMemo(() => countries.find((c) => c.dial === form.prefijo) ?? countries[0], [form.prefijo]);
  const selectedProcedures = selected.filter(Boolean);
  const numeroDoctor = "573175697927";
  const contactMsg = encodeURIComponent("Hola, me gustaría tener más información sobre las citas y procedimientos en la Clínica Renacer");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onEsc);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [isModalOpen]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${BACKEND}/procedimientos/activos`);
        const data = res.ok ? await res.json() : fallbackProcedures;
        const safe = Array.isArray(data) ? data : [];
        if (mounted) setProceduresData(safe.length ? safe : fallbackProcedures);
      } catch {
        if (mounted) setProceduresData(fallbackProcedures);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleProcedure = (name: string) => {
    if (selected.includes(name)) {
      setSelected((prev) => prev.filter((x) => x !== name));
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "nombre") {
      setForm((prev) => ({ ...prev, nombre: value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "") }));
      return;
    }
    if (name === "documento" || name === "celular") {
      setForm((prev) => ({
        ...prev,
        [name]: value.replace(/\D/g, "").slice(0, 20),
      } as FormData));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value } as FormData));
  };

  const validateForm = () => {
    const next: Partial<Record<keyof FormData, string>> = {};
    if (!form.nombre.trim()) next.nombre = "El nombre es obligatorio.";
    if (!form.tipoDocumento) next.tipoDocumento = "El tipo de documento es obligatorio.";
    if (!form.documento.trim()) next.documento = "El número de documento es obligatorio.";
    if (!form.prefijo.trim()) next.prefijo = "El prefijo es obligatorio.";
    if (!form.celular.trim()) next.celular = "El celular es obligatorio.";
    if (!form.fecha) next.fecha = "La fecha es obligatoria.";
    else if (new Date(`${form.fecha}T00:00:00`).getTime() < new Date(`${minDate}T00:00:00`).getTime()) next.fecha = "La fecha debe ser desde dos días después de hoy.";
    if (selected.length < 1) next.procedimiento1 = "Selecciona al menos un procedimiento.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const procs = selected.join(" + ");
    const msg = [
      `Hola, soy ${form.nombre} y estoy interesad@ en agendar una cita en Clínica Renacer.`,
      `Mis datos son: documento ${form.tipoDocumento} ${form.documento}, número celular +${form.prefijo} ${form.celular}, fecha ${form.fecha}.`,
      `Me gustaría hacerme estos procedimientos: ${procs}.`,
      `Mensaje adicional: ${form.mensaje.trim() || "N/A"}.`,
    ].join("\n\n");

    window.open(`https://wa.me/${numeroDoctor}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    setForm(initialForm);
    setErrors({});
    setSelected([]);
    setIsModalOpen(false);
  };

  const procedureList = proceduresData ?? fallbackProcedures;

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="w-[320px] shrink-0 leading-tight">
            <p className="text-sm md:text-base font-semibold uppercase tracking-[0.35em] text-cyan-300 whitespace-nowrap">CLÍNICA ESTÉTICA</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white whitespace-nowrap">Renacer</h1>
          </div>
          <nav className="hidden md:flex flex-1 justify-center items-center gap-10 text-base md:text-lg font-bold">
            <a className="nav-link-ghost text-base md:text-lg uppercase tracking-[0.16em]" href="#inicio">INICIO</a>
            <a className="nav-link-ghost text-base md:text-lg uppercase tracking-[0.16em]" href="#procedimientos">PROCEDIMIENTOS</a>
            <a className="nav-link-ghost text-base md:text-lg uppercase tracking-[0.16em]" href="#galeria">ANTES Y DESPUÉS</a>
            <a className="nav-link-ghost text-base md:text-lg uppercase tracking-[0.16em]" href="#contacto">CONTÁCTANOS</a>
          </nav>
          <div className="hidden md:flex items-center justify-end gap-3 w-[320px] shrink-0">
            <a href="/#admin" className="rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400">Panel admin</a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-28">
        <section id="inicio" className="py-20 md:py-28 scroll-mt-28">
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10 backdrop-blur-xl">
              <p className="section-kicker">Clínica estética</p>
              <h2 className="mt-3 text-5xl md:text-7xl font-black tracking-tight text-white">Clínica Renacer</h2>
              <p className="mt-4 text-2xl md:text-3xl font-semibold text-cyan-200">Doctor Miguel Mendoza</p>
              <p className="mt-4 text-lg md:text-xl font-medium text-violet-200 italic">“Belleza, confianza y acompañamiento en cada etapa del proceso.”</p>
              <p className="mt-6 text-lg md:text-xl leading-8 text-slate-300 max-w-2xl">Un espacio especializado en procedimientos corporales, atención personalizada y una experiencia moderna. El doctor Miguel Mendoza brinda valoración individual, enfoque estético y seguimiento cercano para cada paciente.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button type="button" onClick={openModal} className="btn-primary">Agendar consulta</button>
                <a href="#procedimientos" className="btn-secondary">Ver procedimientos</a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-violet-600/20 via-cyan-500/15 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
                <div className="aspect-[4/5] w-full rounded-[2rem] bg-black flex items-center justify-center text-lg text-white/45">
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
              <article key={title} className="glass-card text-center flex flex-col items-center justify-center">
                <p className="section-kicker">{title}</p>
                <h3 className="card-title text-center">{title}</h3>
                <p className="card-text text-center max-w-[22rem]">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <Separator />

        <section id="procedimientos" className="py-20 md:py-28 scroll-mt-28">
          <div className="mb-10 text-center max-w-4xl mx-auto">
            <p className="section-kicker">Procedimientos</p>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight">Servicios corporales disponibles</h3>
            <p className="mt-4 text-lg md:text-xl text-slate-300">Selecciona mínimo 1 y máximo 2 procedimientos.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(procedureList as any[]).map((p) => {
              const name = p.nombre ?? p.name ?? "";
              const info = p.descripcion ?? "";
              const rawImage = p.url_imagen ?? p.image ?? "";
              const image = rawImage && rawImage.startsWith("http") ? rawImage : rawImage ? `${BACKEND}/${String(rawImage).replace(/^\/+/, "")}` : "";
              const active = selected.includes(name);
              const blocked = blockedProcedure === name;

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleProcedure(name)}
                  className={`procedure-hover-card p-8 ${active ? "ring-2 ring-cyan-400" : ""} ${blocked ? "ring-2 ring-red-500 bg-red-500/20 border-red-400/50" : ""}`}
                >
                  <div className="procedure-hover-front h-full flex flex-col items-center justify-center text-center">
                    <p className="text-2xl font-black text-white uppercase tracking-[0.06em] leading-tight">{name}</p>
                    <p className="mt-6 text-lg md:text-xl text-slate-200 leading-8 max-w-[30rem] mx-auto">{info}</p>
                  </div>

                  <div className="procedure-hover-image">
                    <img src={image} alt={name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/35" />
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <p className="text-lg font-bold text-white">{name}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {showLimitMessage && (
            <div className="mt-8 rounded-3xl border border-red-500/40 bg-red-500/10 p-5 md:p-6 text-red-100 backdrop-blur-xl text-center">
              <p className="text-lg md:text-xl font-semibold">Máximo 2 procedimientos.</p>
            </div>
          )}

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="mx-auto md:mx-0 max-w-3xl">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300 font-semibold">Procedimientos seleccionados</p>
              <h4 className="mt-2 text-2xl md:text-3xl font-black leading-tight">
                {selectedProcedures.length > 0 ? selectedProcedures.join(" + ") : "Sin procedimientos seleccionados"}
              </h4>
              <p className="mt-3 text-base md:text-lg text-slate-300 max-w-2xl mx-auto md:mx-0">
                Los valores se confirman directamente con el doctor durante la consulta, ya que pueden variar según promociones, valoración médica y características del procedimiento.
              </p>
            </div>
            <button type="button" onClick={openModal} className="btn-primary text-lg md:text-xl">Agendar consulta</button>
          </div>
        </section>

        <Separator glow="violet" />

        <section id="galeria" className="py-20 md:py-28 scroll-mt-28">
          <div className="mb-10 text-center">
            <p className="section-kicker">Galería</p>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight">Antes y después</h3>
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

        <section id="contacto" className="py-20 md:py-28 scroll-mt-28">
          <div className="grid gap-6 lg:grid-cols-2 items-stretch">
            <div className="contact-card">
              <p className="section-kicker">Contacto</p>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight">Contáctanos</h3>
              <div className="mt-8 space-y-6 text-slate-300 leading-8 text-lg md:text-xl">
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
        href={`https://wa.me/${numeroDoctor}?text=${contactMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl shadow-black/40 transition hover:bg-green-400"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-current">
          <path d="M19.11 17.64c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.37.45-.55.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.48-.5-.67-.51-.17-.01-.37-.01-.57-.01s-.52.07-.8.37c-.27.3-1.03 1-1.03 2.44 0 1.44 1.05 2.83 1.2 3.03.15.2 2.06 3.15 4.99 4.42.7.3 1.25.48 1.68.61.7.22 1.34.19 1.84.12.56-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
          <path d="M26.62 5.38A13.46 13.46 0 0 0 16.01 0C8.57 0 2.5 6.07 2.5 13.5c0 2.38.62 4.7 1.8 6.75L2.4 32l11.95-1.87a13.45 13.45 0 0 0 6.44 1.64h.01c7.43 0 13.5-6.07 13.5-13.5 0-3.6-1.4-7-3.96-9.89ZM20.8 28.5h-.01a11.2 11.2 0 0 1-5.72-1.57l-.41-.24-7.09 1.11 1.13-6.9-.27-.44a11.16 11.16 0 0 1-1.72-5.96C6.71 8.33 11.47 3.57 16.98 3.57c2.98 0 5.78 1.16 7.88 3.27a11.05 11.05 0 0 1 3.26 7.87c0 6.16-5 11.16-11.16 11.16Zm6.48-8.47c-.36-.18-2.1-1.04-2.43-1.16-.33-.12-.58-.18-.82.18-.24.36-.93 1.16-1.14 1.39-.21.24-.43.27-.79.09-.36-.18-1.52-.56-2.89-1.8-1.06-.95-1.77-2.12-1.98-2.48-.21-.36-.02-.55.16-.73.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.82-1.98-1.12-2.72-.29-.72-.59-.62-.82-.63h-.7c-.24 0-.63.09-.96.45-.33.36-1.27 1.24-1.27 3.01 0 1.77 1.3 3.48 1.48 3.72.18.24 2.52 3.85 6.1 5.41.85.37 1.52.59 2.05.75.86.27 1.64.24 2.26.14.69-.1 2.1-.89 2.4-1.75.3-.86.3-1.6.21-1.75-.08-.14-.33-.24-.69-.42Z" />
        </svg>
      </a>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm" onClick={closeModal}>
          <div role="dialog" aria-modal="true" aria-labelledby="agendar-cita-title" className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1220] shadow-2xl shadow-black/40" onClick={(event) => event.stopPropagation()}>
            <div className="border-b border-white/10 bg-white/5 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">Formulario</p>
                  <h2 id="agendar-cita-title" className="mt-2 text-2xl font-black text-white">Agendar consulta</h2>
                  <p className="mt-2 text-sm text-slate-300">Completa tus datos y enviaremos tu solicitud por WhatsApp.</p>
                </div>
                <button type="button" onClick={closeModal} aria-label="Cerrar formulario" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xl text-white transition hover:bg-white/20">×</button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[85vh] overflow-y-auto px-6 py-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-slate-200">Nombre completo *</label>
                  <input id="nombre" name="nombre" value={form.nombre} onChange={handleInputChange} placeholder="Escribe tu nombre" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-cyan-400" />
                  {errors.nombre && <p className="mt-2 text-sm text-rose-300">{errors.nombre}</p>}
                </div>

                <div>
                  <label htmlFor="tipoDocumento" className="mb-2 block text-sm font-medium text-slate-200">Tipo de documento *</label>
                  <select id="tipoDocumento" name="tipoDocumento" value={form.tipoDocumento} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400">
                    {documentTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  {errors.tipoDocumento && <p className="mt-2 text-sm text-rose-300">{errors.tipoDocumento}</p>}
                </div>

                <div>
                  <label htmlFor="documento" className="mb-2 block text-sm font-medium text-slate-200">Número de documento *</label>
                  <input id="documento" name="documento" value={form.documento} onChange={handleInputChange} inputMode="numeric" placeholder="Documento" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-cyan-400" />
                  {errors.documento && <p className="mt-2 text-sm text-rose-300">{errors.documento}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="celular" className="mb-2 block text-sm font-medium text-slate-200">Celular *</label>
                  <div className="grid grid-cols-[120px_1fr] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <select id="prefijo" name="prefijo" value={form.prefijo} onChange={handleInputChange} className="border-r border-white/10 bg-[#111827] px-3 py-3 text-sm text-white outline-none">
                      {countries.map((c) => <option key={c.code} value={c.dial}>{prefixLabel(c.dial, c.flag)}</option>)}
                    </select>
                    <input id="celular" name="celular" value={form.celular} onChange={handleInputChange} inputMode="numeric" placeholder="Número" className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400" />
                  </div>
                  {errors.prefijo && <p className="mt-2 text-sm text-rose-300">{errors.prefijo}</p>}
                  {errors.celular && <p className="mt-2 text-sm text-rose-300">{errors.celular}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="fecha" className="mb-2 block text-sm font-medium text-slate-200">Fecha *</label>
                  <input id="fecha" name="fecha" type="date" min={minDate} value={form.fecha} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400" />
                  {errors.fecha && <p className="mt-2 text-sm text-rose-300">{errors.fecha}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-200">Procedimientos *</label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {procedureList.map((p) => {
                      const name = p.nombre ?? p.name ?? "";
                      const active = selected.includes(name);
                      const blocked = blockedProcedure === name;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => toggleProcedure(name)}
                          className={`rounded-2xl border px-4 py-3 text-left transition ${active ? "border-cyan-400 bg-cyan-400/15 text-white" : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"} ${blocked ? "opacity-50" : ""}`}
                        >
                          <div className="flex h-full min-h-[72px] items-center justify-center text-center text-[1rem] font-medium leading-snug tracking-normal normal-case">
                            {name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.procedimiento1 && <p className="mt-2 text-sm text-rose-300">{errors.procedimiento1}</p>}
                  <p className="mt-2 text-xs text-slate-400">Selecciona mínimo 1 y máximo 2 procedimientos.</p>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="mensaje" className="mb-2 block text-sm font-medium text-slate-200">Mensaje adicional</label>
                  <textarea id="mensaje" name="mensaje" rows={4} value={form.mensaje} onChange={handleInputChange} placeholder="Cuéntanos qué deseas mejorar o cualquier detalle importante" className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-cyan-400" />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="submit" className="btn-primary w-full">Enviar solicitud por WhatsApp</button>
                <button type="button" onClick={closeModal} className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Separator({ glow = "cyan" }: { glow?: "cyan" | "violet" }) {
  const glowClass = glow === "cyan" ? "from-cyan-400/35 via-cyan-300/15 to-transparent" : "from-violet-400/35 via-violet-300/15 to-transparent";
  return (
    <div className="relative my-8 h-28 w-full overflow-visible">
      <div className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r ${glowClass}`} />
      <div className={`absolute inset-x-[4%] top-1/2 h-20 -translate-y-1/2 bg-gradient-to-r ${glowClass} blur-3xl opacity-70`} />
      <div className="absolute inset-x-[14%] top-1/2 h-12 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute inset-x-[8%] top-1/2 h-px -translate-y-1/2 bg-white/10" />
    </div>
  );
}
